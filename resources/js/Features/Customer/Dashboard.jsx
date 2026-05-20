import { formatRupiah } from "@/Utils/currency";
import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, usePage } from "@inertiajs/react";
import { ShoppingBag, Clock, CheckCircle, Package } from "lucide-react";

export default function CustomerDashboard({ orders }) {
    const { translations } = usePage().props;
    const { messages: m } = translations;
    const recentOrders = orders || [];

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "preparing":
                return "bg-blue-100 text-blue-700";
            case "on_the_way":
                return "bg-purple-100 text-purple-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
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
            <Head title={m['customer.my_dashboard']} />

            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {m['customer.my_dashboard']}
                    </h1>
                    <p className="text-gray-600">
                        {m['customer.dashboard_subtitle']}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-2xl shadow-lg">
                        <ShoppingBag className="w-8 h-8 mb-3 opacity-80" />
                        <h3 className="text-sm font-medium opacity-90 mb-1">
                            {m['customer.total_orders']}
                        </h3>
                        <p className="text-3xl font-bold">
                            {recentOrders.length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                        <CheckCircle className="w-8 h-8 mb-3 opacity-80" />
                        <h3 className="text-sm font-medium opacity-90 mb-1">
                            {m['customer.delivered']}
                        </h3>
                        <p className="text-3xl font-bold">
                            {
                                recentOrders.filter(
                                    (o) => o.status === "delivered",
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                        <Clock className="w-8 h-8 mb-3 opacity-80" />
                        <h3 className="text-sm font-medium opacity-90 mb-1">
                            {m['customer.pending']}
                        </h3>
                        <p className="text-3xl font-bold">
                            {
                                recentOrders.filter(
                                    (o) => o.status === "pending",
                                ).length
                            }
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {m['customer.my_orders']}
                        </h2>
                        <a
                            href={route("customer.orders.index")}
                            className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                        >
                            {m['customer.view_all']} →
                        </a>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-6 hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg ${getStatusColor(order.status)}`}
                                            >
                                                {getStatusIcon(order.status)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    Order #{order.id}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {order.created_at}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-gray-900">
                                                {formatRupiah(order.total)}
                                            </p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {order.items && order.items.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-sm text-gray-600 mb-2">
                                                {m['customer.items']}:
                                            </p>
                                            <div className="space-y-2">
                                                {order.items.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex flex-col"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-semibold text-gray-800">
                                                                    {item.product_name ||
                                                                        item
                                                                            .product
                                                                            ?.name ||
                                                                        "Product"}{" "}
                                                                    x
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                            </div>
                                                            {item.selected_options && (
                                                                <div className="mt-1 flex flex-wrap gap-2">
                                                                    {item
                                                                        .selected_options
                                                                        .variation && (
                                                                        <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md border border-orange-100 font-medium">
                                                                            Size:{" "}
                                                                            {
                                                                                item
                                                                                    .selected_options
                                                                                    .variation
                                                                                    .name
                                                                            }
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
                                                                                    className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 font-medium"
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
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {order.delivery_tracking_url && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <a
                                                href={
                                                    order.delivery_tracking_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                                            >
                                                {m['customer.track_delivery']} →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
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
            </div>
        </CustomerLayout>
    );
}
