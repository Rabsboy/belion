import { formatRupiah } from "@/Utils/currency";
import React from "react";
import StaffLayout from "@/Layouts/StaffLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ShoppingCart, DollarSign, ClipboardList, TrendingUp,
    Clock, ArrowRight, CreditCard, Search,
} from "lucide-react";

export default function Dashboard({ stats, recentOrders, chartLabels, chartData }) {
    const { auth, translations } = usePage().props;
    const t = translations?.staff ?? {};
    const maxRevenue = Math.max(...chartData, 1);

    return (
        <StaffLayout>
            <Head title={t.staff_dashboard ?? "Staff Dashboard"} />

            <div className="p-6 md:p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t.welcome_back ?? "Welcome back"}, {auth.user?.name}
                    </h1>
                    <p className="text-gray-500 mt-1">{t.todays_summary ?? "Here's what's happening today."}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                        <ShoppingCart className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-sm font-medium opacity-90">{t.todays_pos_orders ?? "Today's POS Orders"}</p>
                        <p className="text-3xl font-bold mt-1">{stats.todayPosOrders}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                        <DollarSign className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-sm font-medium opacity-90">{t.todays_revenue ?? "Today's Revenue"}</p>
                        <p className="text-3xl font-bold mt-1">{formatRupiah(stats.todayRevenue)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                        <ClipboardList className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-sm font-medium opacity-90">{t.total_pos_orders ?? "Total POS Orders"}</p>
                        <p className="text-3xl font-bold mt-1">{stats.totalPosOrders}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary-600" />
                        {t.revenue_7_days ?? "Revenue (Last 7 Days)"}
                    </h2>
                    <div className="flex items-end gap-2 h-40">
                        {chartLabels.map((label, i) => {
                            const value = chartData[i];
                            const height = maxRevenue > 0 ? (value / maxRevenue) * 100 : 0;
                            return (
                                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs font-semibold text-gray-700">
                                        {formatRupiah(value)}
                                    </span>
                                    <div
                                        className="w-full bg-primary-500 rounded-t-md transition-all"
                                        style={{ height: `${Math.max(height, 2)}%` }}
                                    />
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(label).toLocaleDateString("en", { weekday: "short" })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Link
                        href={route("staff.pos.create")}
                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all group"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <CreditCard className="text-primary-600" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{t.new_pos_order ?? "New POS Order"}</h3>
                        <p className="text-sm text-gray-500">{t.new_pos_order_desc ?? "Create a quick order for walk-in customers"}</p>
                        <div className="flex items-center gap-1 text-primary-600 font-semibold text-sm mt-3">
                            {t.open_pos ?? "Open POS"} <ArrowRight size={16} />
                        </div>
                    </Link>

                    <Link
                        href={route("staff.orders.index")}
                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ClipboardList className="text-blue-600" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{t.manage_orders ?? "Manage Orders"}</h3>
                        <p className="text-sm text-gray-500">{t.manage_orders_desc ?? "Update order statuses and manage deliveries"}</p>
                        <div className="flex items-center gap-1 text-primary-600 font-semibold text-sm mt-3">
                            {t.view_orders ?? "View Orders"} <ArrowRight size={16} />
                        </div>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={20} className="text-primary-600" />
                            {t.recent_pos_orders ?? "Recent POS Orders"}
                        </h2>
                        <Link
                            href={route("staff.orders.index")}
                            className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                        >
                            {t.view_all ?? "View All"} →
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Order #{order.id}
                                            <span className="text-sm font-normal text-gray-500 ml-2">
                                                — {order.client_name}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {order.client_phone} · {order.item_count} items · {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{formatRupiah(order.total)}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                            order.payment_status === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-orange-100 text-orange-700"
                                        }`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <Search className="w-12 h-12 mx-auto mb-3" />
                            <p className="font-medium text-gray-500">{t.no_pos_orders ?? "No POS orders yet"}</p>
                            <p className="text-sm mt-1">{t.no_pos_orders_desc ?? "Start by creating a new POS order."}</p>
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}
