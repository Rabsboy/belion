import { formatRupiah } from "@/Utils/currency";
import React, { useState } from "react";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import StaffLayout from "@/Layouts/StaffLayout";
import {
    ShoppingBag, Search, ChevronDown, X, AlertTriangle, Printer, Eye, Store, Truck,
} from "lucide-react";
import Pagination from "@/Components/Pagination";
import { statusOrderLabel } from "@/Utils/order";

const STAFF_STATUSES = ["pending", "preparing", "out_for_delivery", "delivered", "completed", "cancelled"];
const STAFF_STATUSES_PICKUP = ["pending", "preparing", "completed", "cancelled"];

const TABS = [
    { key: 'semua', label: 'Semua Pesanan', icon: ShoppingBag },
    { key: 'baru', label: 'Pesanan Baru', icon: ShoppingBag },
    { key: 'diantar', label: 'Dalam Pengiriman', icon: Truck },
    { key: 'selesai', label: 'Selesai', icon: ShoppingBag },
    { key: 'dibatalkan', label: 'Dibatalkan', icon: X },
];

export default function Orders({ orders, activeTab = 'semua' }) {
    const { translations } = usePage().props;
    const t = translations?.staff ?? {};
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        status: "",
        cancel_reason: "",
    });

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setData({ status: order.status, cancel_reason: "" });
        setShowCancelModal(false);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        reset();
        setShowCancelModal(false);
    };

    const handleUpdate = () => {
        if (data.status === "cancelled") {
            setShowCancelModal(true);
            return;
        }
        submitUpdate();
    };

    const submitUpdate = () => {
        put(route("staff.orders.update", selectedOrder.id), {
            onSuccess: () => closeModal(),
            onError: () => {},
        });
    };

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

    return (
        <StaffLayout>
            <Head title={t.manage_orders_title ?? "Manage Orders"} />

            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t.manage_orders_title ?? "Manage Orders"}</h1>
                    <p className="text-gray-600 mt-1">{t.total_orders_count?.replace(':count', orders.total) ?? orders.total + ' total orders'}</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto flex-nowrap">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        const href = route('staff.orders.index', { tab: tab.key });
                        return (
                            <Link
                                key={tab.key}
                                href={href}
                                preserveState
                                scroll={false}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                                    isActive
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Icon size={14} />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    {orders.data.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                                            <ShoppingBag size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Order #{order.id}
                                                {order.user && (
                                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                                        — {order.user.name}
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg text-gray-900">
                                            {formatRupiah(order.total)}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {statusOrderLabel(order.status, order.fulfillment_type)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                                    <span className="font-medium">{order.client_name}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{order.client_phone}</span>
                                    {order.client_email && (
                                        <>
                                            <span className="text-gray-300">|</span>
                                            <span>{order.client_email}</span>
                                        </>
                                    )}
                                    <span className="text-gray-300">|</span>
                                    <span className={order.fulfillment_type === 'pickup' ? 'text-purple-600 text-xs font-semibold' : 'text-blue-600 text-xs font-semibold'}>
                                        {order.fulfillment_type === 'pickup' ? <Store size={12} className="inline" /> : <Truck size={12} className="inline" />}
                                        {' '}{order.fulfillment_type || 'delivery'}
                                    </span>
                                    <span className="text-gray-300">|</span>
                                    <span className="uppercase text-xs font-semibold">{order.payment_method || "N/A"}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${
                                        order.payment_status === "paid"
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : order.payment_status === "failed"
                                                ? "bg-red-100 text-red-700 border-red-200"
                                                : "bg-orange-100 text-orange-700 border-orange-200"
                                    }`}>
                                        {order.payment_status}
                                    </span>
                                </div>

                                {order.cancel_reason && (
                                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 mb-4">
                                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                        <div>
                                            <span className="font-semibold">{(t.cancel_order ?? "Cancelled") + ":"}</span> {order.cancel_reason}
                                            {order.cancelled_by && (
                                                <span className="text-red-500"> ({t.cancelled_by ?? "by"} {order.cancelled_by})</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 pt-4 flex items-center justify-end gap-2">
                                    <Link
                                        href={route("staff.orders.show", order.id)}
                                        className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
                                    >
                                        <Eye size={16} />
                                        {t.view_details ?? "View Details"}
                                    </Link>
                                    {order.order_source === "pos" && (
                                        <a
                                            href={route("staff.pos.receipt", order.id)}
                                            target="_blank"
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                                        >
                                            <Printer size={16} />
                                            {t.receipt ?? "Receipt"}
                                        </a>
                                    )}
                                    <button
                                        onClick={() => openStatusModal(order)}
                                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition shadow-sm"
                                    >
                                        {t.update_status ?? "Update Status"}
                                        <ChevronDown size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination links={orders.links} />

                {orders.data.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">{t.no_orders_found ?? "No orders found."}</p>
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                                Update Order #{selectedOrder.id}
                            </h3>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t.status_label ?? "Status"}
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    className="w-full border-gray-300 rounded-xl focus:border-primary-500 focus:ring-primary-500"
                                >
                                    <option value="">{t.select_status ?? "Select status"}</option>
                                    {(selectedOrder?.fulfillment_type === 'pickup' ? STAFF_STATUSES_PICKUP : STAFF_STATUSES).map((s) => (
                                        <option key={s} value={s}>
                                            {statusOrderLabel(s, selectedOrder?.fulfillment_type)}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && (
                                    <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                                )}
                            </div>

                            {data.status === "cancelled" && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t.cancel_reason ?? "Cancel Reason"} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.cancel_reason}
                                        onChange={(e) => setData("cancel_reason", e.target.value)}
                                        rows={3}
                                        className="w-full border-gray-300 rounded-xl focus:border-red-500 focus:ring-red-500"
                                        placeholder={t.cancel_reason_placeholder ?? "Required: explain why this order is being cancelled"}
                                    />
                                    {errors.cancel_reason && (
                                        <p className="text-sm text-red-500 mt-1">{errors.cancel_reason}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                                >
                                    {t.cancel ?? "Cancel"}
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={processing || !data.status}
                                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? (t.updating ?? "Updating...") : (t.update_status ?? "Update Status")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-600" size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t.cancel_order ?? "Cancel Order?"}</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            {t.cancel_order_confirm?.replace(':id', selectedOrder.id) ?? `This will cancel Order #${selectedOrder.id}. This action cannot be undone.`}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                            >
                                {t.go_back ?? "Go Back"}
                            </button>
                            <button
                                onClick={submitUpdate}
                                disabled={processing}
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
