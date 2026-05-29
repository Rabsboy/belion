import { formatRupiah } from "@/Utils/currency";
import React, { useState, useEffect, useCallback } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, usePage, router } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import MapPicker from "@/Components/MapPicker";
import {
    MapPin,
    Phone,
    User as UserIcon,
    Mail,
    FileText,
    CreditCard,
    ShoppingBag,
    Ticket,
    CheckCircle2,
    XCircle,
    Loader2,
    Truck,
    Navigation,
} from "lucide-react";
import axios from "axios";
import Toast from "@/Components/Toast";
import { isValidPhone, isValidEmail } from "@/Utils/validation";

export default function Checkout() {
    const { auth, translations, store_lat, store_lng, osm_tile_url } = usePage().props;
    const { messages: m } = translations;
    const [cartItems, setCartItems] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponProcessing, setCouponProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    // Form State
    const [form, setForm] = useState({
        name: auth.user ? auth.user.name : "",
        email: auth.user ? auth.user.email : "",
        phone: auth.user ? auth.user.phone : "",
        note: "",
        fulfillment_type: "delivery",
        payment_method: "midtrans",
    });

    const [errors, setErrors] = useState({});

    // Map / delivery fee state
    const [deliveryLat, setDeliveryLat] = useState(null);
    const [deliveryLng, setDeliveryLng] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryDistance, setDeliveryDistance] = useState(null);
    const [deliveryFeeCalculating, setDeliveryFeeCalculating] = useState(false);
    const [deliveryFeeError, setDeliveryFeeError] = useState(null);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem("cart_items") || "[]");
        if (items.length === 0) {
            router.visit(route("home"));
        }
        setCartItems(items);
    }, []);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0,
    );
    const discount = appliedCoupon ? parseFloat(appliedCoupon.discount) : 0;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    const handleLocationSelect = useCallback(async (lat, lng) => {
        setDeliveryLat(lat);
        setDeliveryLng(lng);
        setDeliveryFeeCalculating(true);
        setDeliveryFeeError(null);

        try {
            const response = await axios.post(route('checkout.calculate-fee-coordinates'), { lat, lng });
            const data = response.data;

            if (data.within_range) {
                setDeliveryFee(data.delivery_fee);
                setDeliveryDistance(data.distance_km);
                setDeliveryAddress(data.display_name || '');
                setDeliveryFeeError(null);
            } else {
                setDeliveryFee(0);
                setDeliveryDistance(null);
                setDeliveryAddress('');
                setDeliveryFeeError(data.error);
            }
        } catch (error) {
            setDeliveryFee(0);
            setDeliveryDistance(null);
            setDeliveryAddress('');
            setDeliveryFeeError(error.response?.data?.message || 'Gagal menghitung ongkos kirim');
        } finally {
            setDeliveryFeeCalculating(false);
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponProcessing(true);
        try {
            const response = await axios.post(
                route("checkout.validate-coupon"),
                {
                    code: couponCode,
                    subtotal: subtotal,
                    phone: form.phone,
                },
            );
            setAppliedCoupon(response.data);
            setToast({ message: response.data.message, type: "success" });
        } catch (error) {
            setAppliedCoupon(null);
            setToast({
                message: error.response?.data?.message || m['validation.invalid_coupon'],
                type: "error",
            });
        } finally {
            setCouponProcessing(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const validationErrors = {};

        if (!form.name || form.name.trim().length < 2) {
            validationErrors.name = m['validation.name_required'];
        }

        if (!form.phone) {
            validationErrors.phone = m['validation.phone_required'];
        } else if (form.phone.length < 10 || form.phone.length > 13) {
            validationErrors.phone = m['validation.phone_digits'].replace(':digits', '10-13');
        } else if (!isValidPhone(form.phone)) {
            validationErrors.phone = m['validation.phone_invalid'];
        }

        if (!form.email) {
            validationErrors.email = m['validation.email_required'];
        } else if (!isValidEmail(form.email)) {
            validationErrors.email = m['validation.email_invalid'];
        }

        if (form.fulfillment_type === 'delivery') {
            if (deliveryLat === null || deliveryLng === null) {
                validationErrors.delivery_lat = m['validation.address_required'];
            } else if (deliveryFeeError) {
                validationErrors.delivery_lat = m['validation.address_out_of_range'] || 'Alamat di luar jangkauan pengiriman';
            } else if (deliveryDistance === null && !deliveryFeeCalculating) {
                validationErrors.delivery_lat = m['validation.address_required'];
            }

            if (!form.note || form.note.trim().length < 3) {
                validationErrors.note = m['validation.detail_address_required'] || 'Alamat lengkap harus diisi';
            }
        }

        if (!form.payment_method) {
            validationErrors.payment_method = m['validation.payment_required'];
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setToast({
                message: m['validation.please_fix'],
                type: "error",
            });
            setProcessing(false);
            return;
        }

        const payload = {
            ...form,
            email: form.email || null,
            note: form.note || null,
            fulfillment_type: form.fulfillment_type,
            address: form.fulfillment_type === 'pickup' ? null : (deliveryAddress || null),
            delivery_lat: form.fulfillment_type === 'delivery' ? deliveryLat : null,
            delivery_lng: form.fulfillment_type === 'delivery' ? deliveryLng : null,
            items: cartItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                selected_variation: item.selectedVariation || null,
                selected_options: item.selectedOptions || [],
            })),
            total: total,
            coupon_id: appliedCoupon?.coupon?.id || null,
            discount: discount,
        };

        axios
            .post(route("checkout.store"), payload)
            .then((response) => {
                if (response.data.token) {
                    const script = document.createElement("script");
                    script.src = response.data.snap_js_url || "https://app.midtrans.com/snap/snap.js";
                    script.onload = () => {
                        window.snap.pay(response.data.token, {
                            onSuccess: function (result) {
                                axios.post(route("payment.midtrans.success"), result).finally(() => {
                                    window.location.href = route("checkout.success", response.data.order_id);
                                });
                            },
                            onPending: function () {
                                setProcessing(false);
                            },
                            onError: function () {
                                setProcessing(false);
                                window.location.href = route("checkout.cancel", { order: response.data.order_id });
                            },
                            onClose: function () {
                                setProcessing(false);
                            },
                        });
                    };
                    document.body.appendChild(script);
                } else {
                    setProcessing(false);
                    setToast({
                        message:
                            response.data.message ||
                            m['validation.unexpected_response'],
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                console.error(
                    "Checkout validation errors:",
                    error.response?.data,
                );
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                    // Show first error in toast
                    const firstError = Object.values(
                        error.response.data.errors,
                    )[0];
                    setToast({
                        message: Array.isArray(firstError)
                            ? firstError[0]
                            : firstError,
                        type: "error",
                    });
                } else {
                    setToast({
                        message:
                            error.response?.data?.message ||
                            m['validation.server_error'],
                        type: "error",
                    });
                }
                setProcessing(false);
            });
    };

    return (
        <PublicLayout>
            <Head title={m['checkout.title']} />

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8 border-l-4 border-primary-600 pl-3 md:pl-4">
                    {m['checkout.title']}
                </h1>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-100 text-primary-600 text-[11px] md:text-sm">
                                    1
                                </span>
                                {m['checkout.contact_details']}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value={m['checkout.full_name']}
                                    />
                                    <div className="relative mt-1">
                                        <UserIcon
                                            className="absolute left-3 top-3 text-gray-400"
                                            size={18}
                                        />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="pl-10 w-full"
                                            placeholder={m['checkout.name_placeholder']}
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="phone"
                                        value={m['checkout.phone_number']}
                                    />
                                    <div className="relative mt-1">
                                        <Phone
                                            className="absolute left-3 top-3 text-gray-400"
                                            size={18}
                                        />
                                        <TextInput
                                            id="phone"
                                            name="phone"
                                            value={form.phone}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    );
                                                if (value.length <= 13)
                                                    setForm({
                                                        ...form,
                                                        phone: value,
                                                    });
                                            }}
                                            className="pl-10 w-full"
                                            placeholder={m['checkout.phone_placeholder']}
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.phone}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="email"
                                        value={m['checkout.email']}
                                    />
                                    <div className="relative mt-1">
                                        <Mail
                                            className="absolute left-3 top-3 text-gray-400"
                                            size={18}
                                        />
                                        <TextInput
                                            id="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="pl-10 w-full"
                                            placeholder={m['checkout.email_placeholder']}
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-100 text-primary-600 text-[11px] md:text-sm">
                                    2
                                </span>
                                {m['checkout.fulfillment_method'] ?? 'Metode Penerimaan'}
                            </h2>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <label
                                    className={`border rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all ${
                                        form.fulfillment_type === 'delivery'
                                            ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="fulfillment_type"
                                        value="delivery"
                                        checked={form.fulfillment_type === 'delivery'}
                                        onChange={(e) => {
                                            setForm({ ...form, fulfillment_type: e.target.value });
                                            setDeliveryLat(null);
                                            setDeliveryLng(null);
                                            setDeliveryAddress('');
                                            setDeliveryFee(0);
                                            setDeliveryDistance(null);
                                            setDeliveryFeeError(null);
                                        }}
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <MapPin className="text-primary-600" />
                                        <span className="font-semibold text-gray-900">{m['fulfillment.type.delivery'] ?? 'Delivery'}</span>
                                    </div>
                                </label>
                                <label
                                    className={`border rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all ${
                                        form.fulfillment_type === 'pickup'
                                            ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="fulfillment_type"
                                        value="pickup"
                                        checked={form.fulfillment_type === 'pickup'}
                                        onChange={(e) => {
                                            setForm({ ...form, fulfillment_type: e.target.value });
                                            setDeliveryLat(null);
                                            setDeliveryLng(null);
                                            setDeliveryAddress('');
                                            setDeliveryFee(0);
                                            setDeliveryDistance(null);
                                            setDeliveryFeeError(null);
                                        }}
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="text-primary-600" />
                                        <span className="font-semibold text-gray-900">{m['fulfillment.type.pickup'] ?? 'Pick Up'}</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {form.fulfillment_type === 'delivery' && (
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-100 text-primary-600 text-[11px] md:text-sm">
                                    3
                                </span>
                                {m['checkout.delivery_address']}
                            </h2>

                            <div className="mb-4">
                                <MapPicker
                                    lat={deliveryLat}
                                    lng={deliveryLng}
                                    storeLat={store_lat}
                                    storeLng={store_lng}
                                    tileUrl={osm_tile_url}
                                    onLocationSelect={handleLocationSelect}
                                    onSearchAddress={async (query) => {
                                        const res = await axios.post(route('checkout.search-address'), { query });
                                        return res.data;
                                    }}
                                    height="350px"
                                />
                            </div>

                            <InputError message={errors.delivery_lat} className="mb-3" />

                            {deliveryFeeCalculating && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <Loader2 className="animate-spin" size={16} />
                                    {m['checkout.calculating_fee'] ?? 'Menghitung ongkos kirim...'}
                                </div>
                            )}

                            {!deliveryFeeCalculating && deliveryDistance !== null && deliveryAddress && (
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                                    <div className="flex items-start gap-2 text-sm text-blue-800 mb-2">
                                        <Navigation size={16} className="mt-0.5 shrink-0" />
                                        <span>{deliveryAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-blue-800">
                                        <Truck size={16} />
                                        <span>
                                            {m['checkout.delivery_distance'] ?? 'Jarak'}:
                                            <strong> {deliveryDistance} KM</strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-blue-800 mt-1">
                                        <MapPin size={16} />
                                        <span>
                                            {m['general.delivery_fee']}:
                                            <strong> {formatRupiah(deliveryFee)}</strong>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {!deliveryFeeCalculating && deliveryFeeError && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                                    <p className="text-sm text-red-700 flex items-center gap-2">
                                        <MapPin size={16} />
                                        {deliveryFeeError}
                                    </p>
                                </div>
                            )}

                            {!deliveryFeeCalculating && deliveryLat === null && (
                                <p className="text-sm text-gray-500 mb-4">
                                    {m['checkout.click_map'] ?? 'Klik peta untuk memilih lokasi pengiriman'}
                                </p>
                            )}

                            <div>
                                <InputLabel
                                    htmlFor="note"
                                    value={m['checkout.detail_address'] ?? 'Alamat Lengkap'}
                                    required={true}
                                />
                                <div className="relative mt-1">
                                    <MapPin
                                        className="absolute left-3 top-3 text-gray-400"
                                        size={18}
                                    />
                                    <textarea
                                        id="note"
                                        name="note"
                                        value={form.note}
                                        onChange={handleChange}
                                        className="pl-10 w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                        rows="2"
                                        placeholder={m['checkout.detail_address_placeholder'] ?? 'Blok/No. Rumah, RT/RW, Patokan'}
                                        required
                                    ></textarea>
                                </div>
                                <InputError
                                    message={errors.note}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        )}

                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-100 text-primary-600 text-[11px] md:text-sm">
                                    4
                                </span>
                                {m['checkout.payment_method']}
                            </h2>
                    <div className="grid grid-cols-1 gap-4">
                                <label
                                    className={`border rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all ${
                                        form.payment_method === "midtrans"
                                            ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="midtrans"
                                        checked={
                                            form.payment_method === "midtrans"
                                        }
                                        onChange={handleChange}
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="text-indigo-600" />
                                        <span className="font-semibold text-gray-900">
                                            {m['checkout.pay_online']}
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-200 lg:sticky lg:top-24">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                                {m['checkout.order_summary']}
                            </h2>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between text-sm"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">
                                                {item.name}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                x {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {formatRupiah(
                                                parseFloat(item.price) *
                                                item.quantity
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 my-4 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>{m['general.subtotal']}</span>
                                    <span>{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        {form.fulfillment_type === 'pickup'
                                            ? (m['fulfillment.type.pickup'] ?? 'Pick Up')
                                            : m['general.delivery_fee']}
                                    </span>
                                    <span>
                                        {deliveryFeeCalculating
                                            ? <Loader2 className="animate-spin inline" size={16} />
                                            : form.fulfillment_type === 'delivery' && deliveryDistance !== null
                                                ? formatRupiah(deliveryFee)
                                                : form.fulfillment_type === 'delivery'
                                                    ? '-'
                                                    : formatRupiah(0)}
                                    </span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>
                                            {m['general.discount']} (
                                            {appliedCoupon.coupon.code})
                                        </span>
                                        <span>-{formatRupiah(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                                    <span>{m['general.total']}</span>
                                    <span className="text-primary-600">
                                        {formatRupiah(total)}
                                    </span>
                                </div>
                            </div>

                            {!appliedCoupon ? (
                                <div className="mt-4 flex gap-2">
                                    <div className="relative flex-1">
                                        <Ticket
                                            className="absolute left-3 top-3 text-gray-400"
                                            size={18}
                                        />
                                        <TextInput
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            placeholder={m['checkout.coupon_code']}
                                            className="pl-10 w-full text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={
                                            couponProcessing || !couponCode
                                        }
                                        className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50"
                                    >
                                        {couponProcessing ? "..." : m['general.apply']}
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <CheckCircle2 size={18} />
                                        <span className="text-sm font-bold">
                                            {m['checkout.coupon_applied']}
                                        </span>
                                    </div>
                                    <button
                                        onClick={removeCoupon}
                                        className="text-gray-400 hover:text-red-500 transition"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            )}

                            <PrimaryButton
                                className="w-full mt-3 py-3 text-lg font-bold shadow-lg bg-gradient-to-r from-primary-600 to-primary-500"
                                onClick={handleSubmit}
                                disabled={processing || cartItems.length === 0}
                            >
                                {processing ? m['checkout.processing'] : m['checkout.place_order']}
                            </PrimaryButton>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                {m['checkout.agree_terms']}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
