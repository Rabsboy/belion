import { formatRupiah } from "@/Utils/currency";
import React, { useState } from "react";
import StaffLayout from "@/Layouts/StaffLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    ShoppingBag, Clock, CheckCircle, Package, Store, Truck,
    MapPin, FileText, ArrowLeft, User, Phone, Mail,
    ChevronDown, AlertTriangle,
} from "lucide-react";
import { statusOrderLabel } from "@/Utils/order";

const STAFF_STATUSES = ["pending", "preparing", "out_for_delivery", "delivered", "completed", "cancelled"];
const STAFF_STATUSES_PICKUP = ["pending", "preparing", "completed", "cancelled"];

export default function OrderDetail({ order }) {
    const { translations } = usePage().props;
    const t = translations?.staff ?? {};
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        status: order.status,
        cancel_reason: "",
    });

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700",
            processing: "bg-blue-100 text-blue-700",
            preparing: "bg-purple-100 text-purple-700",
            out_for_delivery: "bg-indigo-100 text-indigo-700",
            delivered: "bg-green-100 text-green-700",
            completed: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: "bg-orange-100 text-orange-700 border-orange-200",
            paid: "bg-green-100 text-green-700 border-green-200",
            failed: "bg-red-100 text-red-700 border-red-200",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "delivered":
            case "completed":
                return <CheckCircle className="w-5 h-5" />;
            case "pending":
                return <Clock className="w-5 h-5" />;
            case "preparing":
            case "processing":
                return <Package className="w-5 h-5" />;
            default:
                return <ShoppingBag className="w-5 h-5" />;
        }
    };

    const handleUpdate = () => {
        if (data.status === "cancelled") {
            setShowCancelModal(true);
            return;
        }
        submitUpdate();
    };

    const submitUpdate = () => {
        put(route("staff.orders.update", order.id), {
            onSuccess: () => {
                reset();
                setData("status", data.status);
                setShowCancelModal(false);
            },
            onError: () => {},
        });
    };

    return (
        <StaffLayout>
            <Head title={`Order #${order.id}`} />

            <div className="p-6 md:p-8 max-w-3xl mx-auto">
                <Link
                    href={route("staff.orders.index")}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-semibold mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    {t.back_to_orders ?? "Back to Orders"}
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Order #{order.id}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    order.fulfillment_type === 'pickup' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {order.fulfillment_type === 'pickup' ? <Store size={12} className="inline" /> : <Truck size={12} className="inline" />}
                                    {' '}{statusOrderLabel(order.status, order.fulfillment_type)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <User size={18} className="text-primary-600" />
                                {t.customer_information ?? "Customer Information"}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-gray-400" />
                                    <span className="text-gray-600">{order.client_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-gray-600">{order.client_email || "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-gray-600">{order.client_phone || "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">{t.total ?? "Total"}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatRupiah(order.total)}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">{t.payment ?? "Payment"}</p>
                                <p className="font-bold text-gray-900 uppercase">
                                    {order.payment?.method || order.payment_method || (t.n_a ?? "N/A")}
                                </p>
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase border ${getPaymentStatusColor(order.payment_status)}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <ShoppingBag size={18} className="text-primary-600" />
                                {t.order_items ?? "Order Items"}
                            </h3>
                            <div className="space-y-3">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {item.product_name || item.product?.name || "Product"} x {item.quantity}
                                            </p>
                                            {item.selected_options?.variation && (
                                                <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-100 font-medium">
                                                    {t.size ?? "Size"}: {item.selected_options.variation.name}
                                                </span>
                                            )}
                                            {item.selected_options?.options?.map((opt, oIdx) => (
                                                <span key={oIdx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 font-medium ml-1">
                                                    {opt.name}{opt.quantity > 1 && ` x${opt.quantity}`}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="font-bold text-gray-900">
                                            {formatRupiah(item.line_total)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 space-y-1 text-sm border-t border-gray-100 pt-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t.subtotal ?? "Subtotal"}</span>
                                    <span>{formatRupiah(order.subtotal)}</span>
                                </div>
                                {parseFloat(order.discount_amount) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>{t.discount ?? "Discount"}</span>
                                        <span>-{formatRupiah(order.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>{t.delivery_fee ?? "Delivery Fee"}</span>
                                    <span>{formatRupiah(order.delivery_fee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                                    <span>{t.total ?? "Total"}</span>
                                    <span className="text-primary-600">{formatRupiah(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {order.address && order.address !== "POS" && order.fulfillment_type !== 'pickup' && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <MapPin size={18} className="text-primary-600" />
                                    {t.delivery_address ?? "Delivery Address"}
                                </h3>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{order.address}</p>
                            </div>
                        )}

                        {/* Order Note */}
                        {order.order_note && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <FileText size={18} className="text-primary-600" />
                                    {t.note ?? "Note"}
                                </h3>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{order.order_note}</p>
                            </div>
                        )}

                        {/* Status Update */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ChevronDown size={18} className="text-primary-600" />
                                {t.update_status_title ?? "Update Status"}
                            </h3>
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t.status_label ?? "Status"}
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData("status", e.target.value)}
                                        className="w-full border-gray-300 rounded-xl focus:border-primary-500 focus:ring-primary-500"
                                    >
                                        {(order.fulfillment_type === 'pickup' ? STAFF_STATUSES_PICKUP : STAFF_STATUSES).map((s) => (
                                            <option key={s} value={s}>
                                                {statusOrderLabel(s, order.fulfillment_type)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                                    )}
                                </div>
                                <button
                                    onClick={handleUpdate}
                                    disabled={processing || data.status === order.status}
                                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? (t.updating ?? "Updating...") : (t.update ?? "Update")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-600" size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t.cancel_order ?? "Cancel Order?"}</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {t.cancel_order_confirm_detail?.replace(':id', order.id) ?? `Please provide a reason for cancelling Order #${order.id}.`}
                        </p>
                        <textarea
                            value={data.cancel_reason}
                            onChange={(e) => setData("cancel_reason", e.target.value)}
                            rows={3}
                            className="w-full border-gray-300 rounded-xl focus:border-red-500 focus:ring-red-500 mb-4"
                            placeholder={t.cancel_reason_placeholder ?? "Required: explain why this order is being cancelled"}
                        />
                        {errors.cancel_reason && (
                            <p className="text-sm text-red-500 mb-4">{errors.cancel_reason}</p>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                            >
                                {t.go_back ?? "Go Back"}
                            </button>
                            <button
                                onClick={submitUpdate}
                                disabled={processing || !data.cancel_reason}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 shadow-sm"
                            >
                                {processing ? (t.cancelling ?? "Cancelling...") : (t.yes_cancel ?? "Yes, Cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
