import { formatRupiah } from "@/Utils/currency";
import React, { useState, useMemo, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import StaffLayout from "@/Layouts/StaffLayout";
import {
    Search, Plus, Minus, Trash2, ShoppingCart, X, CreditCard, Printer,
} from "lucide-react";

export default function POS({ products }) {
    const { auth, flash, translations } = usePage().props;
    const t = translations?.staff ?? {};
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showConfirm, setShowConfirm] = useState(false);

    const [lastOrderUrl, setLastOrderUrl] = useState(flash?.receipt_url || null);

    useEffect(() => {
        if (flash?.receipt_url) {
            setLastOrderUrl(flash.receipt_url);
        }
    }, [flash]);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: "",
        customer_phone: "",
        items: [],
        total: 0,
    });

    const categories = useMemo(() => {
        const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
        return ["All", ...cats];
    }, [products]);

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchCat = selectedCategory === "All" || p.category === selectedCategory;
            return matchSearch && matchCat;
        });
    }, [products, search, selectedCategory]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.product_id === product.id);
            if (existing) {
                return prev.map((c) =>
                    c.product_id === product.id
                        ? { ...c, quantity: c.quantity + 1, line_total: (c.quantity + 1) * c.unit_price }
                        : c,
                );
            }
            return [
                ...prev,
                {
                    product_id: product.id,
                    product_name: product.name,
                    quantity: 1,
                    unit_price: product.price,
                    line_total: product.price,
                    selected_variation: null,
                    selected_options: [],
                },
            ];
        });
    };

    const updateQty = (productId, delta) => {
        setCart((prev) =>
            prev
                .map((c) =>
                    c.product_id === productId
                        ? { ...c, quantity: Math.max(1, c.quantity + delta), line_total: Math.max(1, c.quantity + delta) * c.unit_price }
                        : c,
                )
                .filter((c) => c.quantity > 0),
        );
    };

    const removeItem = (productId) => {
        setCart((prev) => prev.filter((c) => c.product_id !== productId));
    };

    const cartTotal = useMemo(() => cart.reduce((sum, c) => sum + c.line_total, 0), [cart]);

    const handleCheckout = () => {
        setData({
            customer_name: data.customer_name,
            customer_phone: data.customer_phone,
            items: cart,
            total: cartTotal,
        });
        setShowConfirm(true);
    };

    const confirmOrder = () => {
        post(route("staff.pos.store"), {
            onSuccess: () => {
                setCart([]);
                reset();
                setShowConfirm(false);
            },
            onError: () => setShowConfirm(false),
        });
    };

    return (
        <StaffLayout>
            <Head title={t.point_of_sale ?? "Point of Sale"} />

            <div className="h-[calc(100vh-73px)] flex flex-col lg:flex-row">
                {/* Left: Products */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-white space-y-3">
                        <h1 className="text-xl font-bold text-gray-900">{t.point_of_sale ?? "Point of Sale"}</h1>

                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t.search_products ?? "Search products..."}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:border-primary-500 focus:ring-primary-500 text-sm"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                                        selectedCategory === cat
                                            ? "bg-primary-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                            {filtered.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-white rounded-xl border border-gray-200 p-3 text-left hover:border-primary-400 hover:shadow-md transition-all active:scale-[0.98]"
                                >
                                    <div className="h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-gray-300 overflow-hidden">
                                        {product.image ? (
                                            <img src={`/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Plus size={24} />
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
                                    <p className="text-primary-600 font-bold text-sm mt-1">{formatRupiah(product.price)}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Cart */}
                <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingCart size={18} className="text-primary-600" />
                            {t.cart ?? "Cart"} ({cart.length})
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {cart.map((item) => (
                            <div key={item.product_id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product_name}</p>
                                    <p className="text-xs text-gray-500">{formatRupiah(item.unit_price)} {t.each ?? "each"}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => updateQty(item.product_id, -1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQty(item.product_id, 1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <p className="text-sm font-bold text-gray-900 w-16 text-right">{formatRupiah(item.line_total)}</p>
                                <button onClick={() => removeItem(item.product_id)} className="p-1 text-red-400 hover:text-red-600 transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        {cart.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <ShoppingCart size={40} className="mx-auto mb-2" />
                                <p className="text-sm">{t.cart_empty ?? "Cart is empty"}</p>
                                <p className="text-xs">{t.click_products ?? "Click products to add"}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-100 space-y-3">
                        <input
                            type="text"
                            value={data.customer_name}
                            onChange={(e) => setData("customer_name", e.target.value)}
                            placeholder={t.customer_name_placeholder ?? "Customer name *"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {errors.customer_name && <p className="text-xs text-red-500">{errors.customer_name}</p>}

                        <input
                            type="text"
                            value={data.customer_phone}
                            onChange={(e) => setData("customer_phone", e.target.value)}
                            placeholder={t.customer_phone_placeholder ?? "Customer phone *"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {errors.customer_phone && <p className="text-xs text-red-500">{errors.customer_phone}</p>}

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{t.total ?? "Total"}</span>
                            <span className="text-2xl font-bold text-primary-600">{formatRupiah(cartTotal)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || !data.customer_name || !data.customer_phone}
                            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-bold text-base hover:bg-primary-700 transition disabled:opacity-50 shadow-sm"
                        >
                            <CreditCard size={18} />
                            {t.complete_order_cash ?? "Complete Order (Cash)"}
                        </button>

                        {lastOrderUrl && (
                            <a
                                href={lastOrderUrl}
                                target="_blank"
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
                            >
                                <Printer size={16} />
                                {t.print_receipt ?? "Print Receipt"}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">{t.confirm_pos_order ?? "Confirm POS Order"}</h3>
                            <button onClick={() => setShowConfirm(false)} className="p-1 hover:bg-gray-100 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm mb-4">
                            <p><span className="text-gray-500">{t.customer ?? "Customer"}:</span> <span className="font-semibold">{data.customer_name}</span></p>
                            <p><span className="text-gray-500">{t.phone ?? "Phone"}:</span> <span className="font-semibold">{data.customer_phone}</span></p>
                            <p><span className="text-gray-500">{t.items ?? "Items"}:</span> <span className="font-semibold">{cart.length}</span></p>
                            <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                <span>{t.total ?? "Total"}</span>
                                <span className="text-primary-600">{formatRupiah(cartTotal)}</span>
                            </div>
                        </div>

                        <p
                            className="text-xs text-gray-500 mb-4"
                            dangerouslySetInnerHTML={{
                                __html: t.order_paid_note ?? "This order will be marked as <strong>paid (cash)</strong> and <strong>completed</strong>."
                            }}
                        />

                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition">
                                {t.cancel ?? "Cancel"}
                            </button>
                            <button onClick={confirmOrder} disabled={processing} className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 shadow-sm">
                                {processing ? (t.processing ?? "Processing...") : (t.confirm_order ?? "Confirm Order")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
