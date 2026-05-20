import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { formatRupiah } from "@/Utils/currency";
import { 
    Package, 
    ShoppingBag, 
    Users, 
    DollarSign, 
    ArrowRight,
    TrendingUp 
} from "lucide-react";

export default function AdminDashboard({ stats }) {
    const { translations } = usePage().props;
    const a = translations?.admin ?? {};
    // Statis data dengan ukuran ikon yang adaptif
    const dashboardStats = [
        {
            title: a.orders ?? "Orders",
            value: stats?.total_orders || "0",
            icon: <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />,
            gradient: "from-blue-500 to-blue-600",
        },
        {
            title: a.revenue ?? "Revenue",
            value: formatRupiah(stats?.total_revenue || 0),
            icon: <DollarSign className="w-5 h-5 md:w-6 md:h-6" />,
            gradient: "from-emerald-500 to-teal-600",
        },
        {
            title: a.products ?? "Products",
            value: stats?.total_products || "0",
            icon: <Package className="w-5 h-5 md:w-6 md:h-6" />,
            gradient: "from-violet-500 to-purple-600",
        },
        {
            title: a.customers ?? "Customers",
            value: stats?.total_customers || "0",
            icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
            gradient: "from-orange-500 to-red-600",
        },
    ];

    const recentOrders = stats?.recent_orders || [];

    return (
        <AdminLayout>
            <Head title={a.admin_dashboard ?? "Admin Dashboard"} />

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                
                {/* Header: Lebih ringkas di mobile */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
                            {a.dashboard ?? "Dashboard"}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                            Ringkasan performa toko Anda hari ini.
                        </p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 md:hidden">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                    </div>
                </div>

                {/* Stats Grid: 2 kolom di mobile agar hemat ruang */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {dashboardStats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className={`inline-flex p-2 md:p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white mb-3 md:mb-4`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-gray-500 text-[11px] md:text-sm font-semibold uppercase tracking-wider mb-1">
                                {stat.title}
                            </h3>
                            <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions: Horizontal Scroll di Mobile (Mirip Aplikasi) */}
                <div className="space-y-3">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Akses Cepat</h2>
                    <div className="flex overflow-x-auto pb-2 gap-3 snap-x scrollbar-hide">
                        <Link
                            href={route("admin.products.index")}
                            className="flex-none w-32 md:w-auto md:flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-primary-500 transition-all snap-start"
                        >
                            <Package className="w-6 h-6 text-primary-500 mb-2" />
                            <p className="text-xs font-bold text-gray-800">Produk</p>
                            <p className="text-[10px] text-gray-400">Kelola Menu</p>
                        </Link>
                        <Link
                            href={route("admin.orders.index")}
                            className="flex-none w-32 md:w-auto md:flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 transition-all snap-start"
                        >
                            <ShoppingBag className="w-6 h-6 text-blue-500 mb-2" />
                            <p className="text-xs font-bold text-gray-800">Pesanan</p>
                            <p className="text-[10px] text-gray-400">Cek Orderan</p>
                        </Link>
                        <Link
                            href={route("admin.customers.index")}
                            className="flex-none w-32 md:w-auto md:flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-500 transition-all snap-start"
                        >
                            <Users className="w-6 h-6 text-purple-500 mb-2" />
                            <p className="text-xs font-bold text-gray-800">Pelanggan</p>
                            <p className="text-[10px] text-gray-400">Data User</p>
                        </Link>
                    </div>
                </div>

                {/* Recent Orders: Tabel yang ringkas & Scrollable */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0">
                        <h2 className="text-sm md:text-lg font-bold text-gray-900">
                            Pesanan Terbaru
                        </h2>
                        <Link 
                            href={route("admin.orders.index")} 
                            className="text-xs font-bold text-primary-600 flex items-center gap-1 hover:underline"
                        >
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto px-2 pb-2">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead className="hidden md:table-header-group">
                                <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                                    <th className="px-4 py-2 font-semibold">{a.id ?? "ID"}</th>
                                    <th className="px-4 py-2 font-semibold">{a.customer ?? "Customer"}</th>
                                    <th className="px-4 py-2 font-semibold">{a.total ?? "Total"}</th>
                                    <th className="px-4 py-2 font-semibold text-right">{a.status ?? "Status"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.slice(0, 6).map((order) => (
                                        <tr
                                            key={order.id}
                                            className="bg-white md:hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-gray-900 md:border-b border-gray-50">
                                                #{order.id}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap md:border-b border-gray-50">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                                                        {order.user?.name || (a.guest ?? "Guest")}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 md:hidden">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-gray-900 md:border-b border-gray-50">
                                                {formatRupiah(order.total)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right md:border-b border-gray-50">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter ${
                                                        order.status === "delivered"
                                                            ? "bg-green-50 text-green-600"
                                                            : order.status === "pending"
                                                            ? "bg-amber-50 text-amber-600"
                                                            : "bg-blue-50 text-blue-600"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-xs text-gray-400 italic">
                                            Belum ada pesanan masuk.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CSS Helper untuk menyembunyikan scrollbar tapi tetap bisa di-scroll */}
            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </AdminLayout>
    );
}
