import { formatRupiah } from "@/Utils/currency";
import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    ShoppingBag,
    Clock,
    CheckCircle,
    Package,
    X,
    ExternalLink,
    CreditCard,
    Store,
    Truck,
} from "lucide-react";
import Pagination from "@/Components/Pagination";
import { useForm } from "@inertiajs/react";
import { statusOrderLabel } from "@/Utils/order";

const TABS = [
    { key: 'semua', label: 'Semua Pesanan', icon: ShoppingBag },
    { key: 'baru', label: 'Pesanan Baru', icon: Clock },
    { key: 'diantar', label: 'Dalam Pengiriman', icon: Truck },
    { key: 'selesai', label: 'Selesai', icon: CheckCircle },
    { key: 'dibatalkan', label: 'Dibatalkan', icon: X },
];

export default function MyOrders({ orders, activeTab = 'semua' }) {
    const { translations } = usePage().props;
    const { messages: m } = translations;
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
            pending: "bg-orange-100 text-orange-700 border-orange-200",
            paid: "bg-green-100 text-green-700 border-green-200",
            failed: "bg-red-100 text-red-700 border-red-200",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const repayForm = useForm();

    const handleRepay = (orderId) => {
        repayForm.post(route("order.repay", orderId));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="w-5 h-5" />;
            case "pending":
                return <Clock className="w-5 h-5" />;
            case "preparing":
                return <Package className="w-5 h-5" />;
            default:
                return <ShoppingBag className="w-5 h-5" />;
        }
    };

    return (
        <CustomerLayout>
            <Head title={m['customer.my_orders']} />

            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {m['customer.my_orders']}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {m['customer.total_orders_count'].replace(':count', orders.total)}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        const href = route('customer.orders.index', { tab: tab.key });
                        return (
                            <Link
                                key={tab.key}
                                href={href}
                                preserveState
                                scroll={false}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                                    isActive
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    {orders.data.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-lg ${getStatusColor(
                                                order.status,
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Order #{order.id}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-gray-900">
                                            {formatRupiah(order.total)}
                                        </p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">
                                                {order.fulfillment_type === 'pickup' ? <Store size={12} className="inline" /> : <Truck size={12} className="inline" />}
                                                {' '}{order.fulfillment_type || 'delivery'}
                                            </span>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    order.status,
                                                )}`}
                                            >
                                                {statusOrderLabel(order.status, order.fulfillment_type)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 items-center justify-between mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">
                                                {m['customer.payment_method']}
                                            </p>
                                            <p className="font-semibold text-gray-900 uppercase">
                                                {order.payment?.method ||
                                                    order.payment_method ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                        <div className="h-8 w-[1px] bg-gray-200"></div>
                                        <div>
                                            <p className="text-gray-500">
                                                {m['customer.payment_status']}
                                            </p>
                                            <span
                                                className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${getPaymentStatusColor(
                                                    order.payment_status,
                                                )}`}
                                            >
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>

                                    {order.payment_status !== "paid" &&
                                        order.status !== "cancelled" &&
                                        (order.payment?.method ===
                                            "sslcommerz" ||
                                            order.payment_method ===
                                                "sslcommerz") && (
                                            <button
                                                onClick={() =>
                                                    handleRepay(order.id)
                                                }
                                                disabled={repayForm.processing}
                                                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50"
                                            >
                                                <CreditCard size={16} />
                                                {repayForm.processing
                                                    ? m['customer.processing']
                                                    : m['customer.pay_now']}
                                            </button>
                                        )}
                                </div>

                                {/* Order Items */}
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">
                                        {m['customer.order_items']}:
                                    </p>
                                    <div className="space-y-2">
                                        {order.items?.map((item, idx) => (
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 font-medium">
                                                        {item.product_name ||
                                                            item.product
                                                                ?.name ||
                                                            "Product"}{" "}
                                                        x {item.quantity}
                                                    </span>
                                                    <span className="font-semibold text-gray-900">
                                                        {formatRupiah(item.line_total)}
                                                    </span>
                                                </div>

                                                {/* Variation and Extras Display */}
                                                {item.selected_options && (
                                                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                                        {item.selected_options
                                                            .variation && (
                                                            <span className="text-[11px] px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md border border-orange-100 font-medium">
                                                                Size:{" "}
                                                                {
                                                                    item
                                                                        .selected_options
                                                                        .variation
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                        {item.selected_options
                                                            .options?.length >
                                                            0 &&
                                                            item.selected_options.options.map(
                                                                (opt, oIdx) => (
                                                                    <span
                                                                        key={
                                                                            oIdx
                                                                        }
                                                                        className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 font-medium"
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
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                {order.address && order.fulfillment_type !== 'pickup' && (
                                    <div className="border-t border-gray-100 pt-4 mt-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-1">
                                            {m['order.delivery_details']}:
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.address}
                                        </p>
                                    </div>
                                )}

                                {/* Order Note */}
                                {order.order_note && (
                                    <div className="border-t border-gray-100 pt-4 mt-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-1">
                                            {m['general.note']}:
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.order_note}
                                        </p>
                                    </div>
                                )}

                                {/* Tracking URL */}
                                <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
                                    <Link
                                        href={route("customer.orders.show", order.id)}
                                        className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                                    >
                                        <ExternalLink size={16} />
                                        {m['customer.view_details']}
                                    </Link>
                                    {order.delivery_tracking_url && (
                                        <a
                                            href={order.delivery_tracking_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                                        >
                                            <ExternalLink size={16} />
                                            {m['customer.track_delivery']}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination links={orders.links} />

                {orders.data.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                {m['customer.no_orders']}
                            </p>
                            <p className="text-gray-400 mb-6">
                                {m['customer.start_ordering']}
                            </p>
                            <a
                                href={route("menu")}
                                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition"
                            >
                                {m['customer.browse_menu']}
                            </a>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
