import { formatRupiah } from "@/Utils/currency";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router, usePage, Link } from "@inertiajs/react";
import {
    ShoppingBag,
    Edit,
    X,
    ExternalLink,
    Eye,
    MapPin,
    Phone,
    User,
    Mail,
    CreditCard,
    Banknote,
    Calendar,
    Package,
    Store,
    Truck,
} from "lucide-react";
import Pagination from "@/Components/Pagination";
import { useState } from "react";
import { statusOrderLabel } from "@/Utils/order";

const TABS = [
    { key: 'semua', label: 'Semua Pesanan', icon: ShoppingBag },
    { key: 'baru', label: 'Pesanan Baru', icon: Package },
    { key: 'diantar', label: 'Dalam Pengiriman', icon: Truck },
    { key: 'selesai', label: 'Selesai', icon: ShoppingBag },
    { key: 'dibatalkan', label: 'Dibatalkan', icon: X },
];

export default function Orders({ orders, activeTab = 'semua' }) {
    const { translations } = usePage().props;
    const a = translations?.admin ?? {};
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { data, setData, put, processing } = useForm({
        status: "",
        payment_status: "",
        delivery_tracking_url: "",
    });

    const openEditModal = (order) => {
        setSelectedOrder(order);
        setData({
            status: order.status,
            payment_status: order.payment_status,
            delivery_tracking_url: order.delivery_tracking_url || "",
        });
        setShowEditModal(true);
    };

    const openViewModal = (order) => {
        setSelectedOrder(order);
        setShowViewModal(true);
    };

    const closeModals = () => {
        setShowEditModal(false);
        setShowViewModal(false);
        setSelectedOrder(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route("admin.orders.update", selectedOrder.id), data, {
            onSuccess: () => closeModals(),
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700",
            preparing: "bg-blue-100 text-blue-700",
            out_for_delivery: "bg-purple-100 text-purple-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700",
            paid: "bg-green-100 text-green-700",
            failed: "bg-red-100 text-red-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    return (
        <AdminLayout>
            <Head title={a.orders_management ?? "Orders Management"} />

            <div className="p-4 md:p-8">
                <div className="mb-4 md:mb-8">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                        {a.orders_management ?? "Orders Management"}
                    </h1>
                    <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">
                        {(a.total_orders_count ?? "total orders").replace(":count", orders.total)}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto flex-nowrap">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        const href = route('admin.orders.index', { tab: tab.key });
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

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.order_id ?? "Order ID"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.customer ?? "Customer"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.items ?? "Items"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.total ?? "Total"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.status ?? "Status"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.payment ?? "Payment"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.date ?? "Date"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.actions ?? "Actions"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.data.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-semibold text-gray-900">
                                                #{order.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {order.client_name ||
                                                        order.user?.name ||
                                                        (a.guest ?? "Guest")}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.client_phone ||
                                                        order.user?.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">
                                                {(a.items ?? "items").replace(":count", order.items?.length || 0)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-gray-900">
                                                {formatRupiah(order.total)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] uppercase font-bold text-gray-400">
                                                    {order.fulfillment_type === 'pickup' ? <Store size={10} className="inline" /> : <Truck size={10} className="inline" />}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                                                        order.status,
                                                    )}`}
                                                >
                                                    {statusOrderLabel(order.status, order.fulfillment_type)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPaymentStatusColor(
                                                    order.payment_status,
                                                )}`}
                                            >
                                                {order.payment_status}
                                            </span>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase">
                                                {order.payment?.method || (a.n_a ?? "N/A")}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        openViewModal(order)
                                                    }
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                    title={a.order_details ?? "View Details"}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(order)
                                                    }
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title={a.edit_order ?? "Edit Order"}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.data.length === 0 && (
                        <div className="p-12 text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">
                                {a.no_orders ?? "No orders yet"}
                            </p>
                        </div>
                    )}
                </div>

                <Pagination links={orders.links} />
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {(a.update_order ?? "Update Order") + " #" + selectedOrder.id}
                            </h2>
                            <button
                                onClick={closeModals}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {a.order_status ?? "Order Status"}
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                >
                                    {(selectedOrder?.fulfillment_type === 'pickup'
                                        ? ['pending', 'preparing', 'completed', 'cancelled']
                                        : ['pending', 'preparing', 'out_for_delivery', 'delivered', 'completed', 'cancelled']
                                    ).map(s => (
                                        <option key={s} value={s}>
                                            {statusOrderLabel(s, selectedOrder?.fulfillment_type)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {a.payment_status ?? "Payment Status"}
                                </label>
                                <select
                                    value={data.payment_status}
                                    onChange={(e) =>
                                        setData(
                                            "payment_status",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                >
                                    <option value="pending">{a.pending ?? "Pending"}</option>
                                    <option value="paid">{a.paid ?? "Paid"}</option>
                                    <option value="failed">{a.failed ?? "Failed"}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {a.delivery_tracking_url ?? "Delivery Tracking URL (Pathao)"}
                                </label>
                                <input
                                    type="url"
                                    value={data.delivery_tracking_url}
                                    onChange={(e) =>
                                        setData(
                                            "delivery_tracking_url",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                    placeholder={a.tracking_placeholder ?? "https://pathao.com/track/..."}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition disabled:opacity-50"
                                >
                                    {processing
                                        ? (a.updating ?? "Updating...")
                                        : (a.update_order ?? "Update Order")}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition text-gray-600"
                                >
                                    {a.cancel ?? "Cancel"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-3xl my-8">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {a.order_details ?? "Order Details"}
                                    </h2>
                                    <p className="text-sm text-gray-500 font-mono">
                                        #{selectedOrder.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeModals}
                                className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-200 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Grid - Customer and Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <User size={14} /> {a.customer_information ?? "Customer Information"}
                                    </h3>
                                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                        <p className="font-bold text-gray-900 text-lg">
                                            {selectedOrder.client_name ||
                                                selectedOrder.user?.name ||
                                                (a.guest ?? "Guest")}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Mail
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            {selectedOrder.client_email ||
                                                selectedOrder.user?.email ||
                                                (a.n_a ?? "N/A")}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Phone
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            {selectedOrder.client_phone ||
                                                selectedOrder.user?.phone ||
                                                (a.n_a ?? "N/A")}
                                        </div>
                                        {selectedOrder.fulfillment_type !== 'pickup' && (
                                        <div className="flex gap-2 text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-3 mt-1">
                                            <MapPin
                                                size={16}
                                                className="text-gray-400 shrink-0 mt-0.5"
                                            />
                                            {selectedOrder.address}
                                        </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Package size={14} /> {a.order_status ?? "Order Status"}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">
                                                {a.service_type ?? "Service Type"}
                                            </span>
                                            <span className="font-bold text-gray-900 capitalize">
                                                {selectedOrder.fulfillment_type === 'pickup' ? 'Pick Up' : 'Delivery'}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">
                                                {a.order_status ?? "Order Status"}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(
                                                    selectedOrder.status,
                                                )}`}
                                            >
                                                {statusOrderLabel(selectedOrder.status, selectedOrder.fulfillment_type)}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">
                                                {a.payment_status ?? "Payment Status"}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getPaymentStatusColor(
                                                    selectedOrder.payment_status,
                                                )}`}
                                            >
                                                {selectedOrder.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Table */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {a.items ?? "Order Items"}
                                </h3>
                                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-bold text-gray-600">
                                                    {a.product ?? "Product"}
                                                </th>
                                                <th className="px-4 py-3 text-center font-bold text-gray-600">
                                                    {a.price ?? "Price"}
                                                </th>
                                                <th className="px-4 py-3 text-center font-bold text-gray-600">
                                                    {a.qty ?? "Qty"}
                                                </th>
                                                <th className="px-4 py-3 text-right font-bold text-gray-600">
                                                    {a.total_price ?? "Total"}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {selectedOrder.items?.map(
                                                (item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3">
                                                            <p className="font-bold text-gray-900">
                                                                {
                                                                    item.product
                                                                        ?.name
                                                                }
                                                            </p>
                                                            {/* Detailed Variation and Extras */}
                                                            {item.selected_options && (
                                                                <div className="mt-1 flex flex-wrap gap-1.5">
                                                                    {item
                                                                        .selected_options
                                                                        .variation && (
                                                                        <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md border border-orange-100 font-bold">
                                                                            {(a.size ?? "Size: ") + item.selected_options.variation.name}
                                                                        </span>
                                                                    )}
                                                                    {item
                                                                        .selected_options
                                                                        .options
                                                                        ?.length >
                                                                        0 &&
                                                                        item.selected_options.options.map(
                                                                            (
                                                                                opt,
                                                                                oIdx,
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        oIdx
                                                                                    }
                                                                                    className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 font-bold"
                                                                                >
                                                                                    {
                                                                                        opt.name
                                                                                    }
                                                                                    {opt.quantity >
                                                                                        1 &&
                                                                                        ` x${opt.quantity}`}
                                                                                </span>
                                                                            ),
                                                                        )}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-600 font-medium">
                                                            {formatRupiah(item.unit_price)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-900 font-bold">
                                                            x{item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-gray-900 font-bold">
                                                            {formatRupiah(item.line_total)}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Payment and Billing Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <CreditCard size={14} /> {a.payment ?? "Payment Info"}
                                    </h3>
                                    <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">
                                                {a.method ?? "Method"}
                                            </span>
                                            <span className="font-bold text-gray-900 flex items-center gap-1 uppercase">
                                                {selectedOrder.payment
                                                    ?.method ===
                                                "sslcommerz" ? (
                                                    <CreditCard size={14} />
                                                ) : (
                                                    <Banknote size={14} />
                                                )}
                                                {selectedOrder.payment?.method}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">
                                                {a.transaction_id ?? "Transaction ID"}
                                            </span>
                                            <span className="font-mono font-medium text-gray-700">
                                                {selectedOrder.payment
                                                    ?.transaction_id || (a.n_a ?? "N/A")}
                                            </span>
                                        </div>
                                        {selectedOrder.coupon && (
                                            <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                                                <span className="text-gray-500">
                                                    {a.coupon_code ?? "Coupon Code"}
                                                </span>
                                                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                    {selectedOrder.coupon.code}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Banknote size={14} /> {a.order_summary ?? "Order Summary"}
                                    </h3>
                                    <div className="bg-gray-900 text-white rounded-2xl p-5 space-y-3 shadow-lg">
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>{a.subtotal ?? "Subtotal"}</span>
                                            <span className="font-medium">
                                                {formatRupiah(selectedOrder.subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>{a.delivery_fee ?? "Delivery Fee"}</span>
                                            <span className="font-medium">
                                                {formatRupiah(selectedOrder.delivery_fee)}
                                            </span>
                                        </div>
                                        {selectedOrder.discount_amount > 0 && (
                                            <div className="flex justify-between text-sm text-green-400 font-bold">
                                                <span>{a.discount ?? "Discount"}</span>
                                                <span>
                                                    -{formatRupiah(selectedOrder.discount_amount)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center">
                                            <span className="font-bold">
                                                {a.grand_total ?? "Grand Total"}
                                            </span>
                                            <span className="text-2xl font-black text-primary-500">
                                                {formatRupiah(selectedOrder.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder.order_note && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {a.order_notes ?? "Order Notes"}
                                    </h3>
                                    <div className="bg-primary-50 text-primary-900 p-4 rounded-2xl text-sm italic border border-primary-100">
                                        "{selectedOrder.order_note}"
                                    </div>
                                </div>
                            )}

                            {selectedOrder.delivery_tracking_url && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {a.tracking_info ?? "Tracking Info"}
                                    </h3>
                                    <a
                                        href={
                                            selectedOrder.delivery_tracking_url
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-primary-600 font-bold hover:underline"
                                    >
                                        {a.track_delivery ?? "Track Delivery (Pathao)"}{" "}
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    closeModals();
                                    openEditModal(selectedOrder);
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                            >
                                <Edit size={18} /> {a.edit_order ?? "Edit Order"}
                            </button>
                            <button
                                onClick={closeModals}
                                className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                            >
                                {a.close ?? "Close"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
