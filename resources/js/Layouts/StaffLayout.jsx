import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard, ShoppingBag, LogOut, Menu as MenuIcon, X, CreditCard,
} from "lucide-react";
import Toast from "@/Components/Toast";

export default function StaffLayout({ children }) {
    const { auth, flash, errors, translations } = usePage().props;
    const t = translations?.staff ?? {};
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setToast({ type: "error", message: flash.error });
        } else if (errors?.error) {
            setToast({ type: "error", message: errors.error });
        }
    }, [flash, errors]);

    const navigation = [
        {
            name: t.dashboard ?? "Dashboard",
            href: route("staff.dashboard"),
            icon: LayoutDashboard,
            route: "staff.dashboard",
        },
        {
            name: t.pos ?? "POS",
            href: route("staff.pos.create"),
            icon: CreditCard,
            route: "staff.pos.create",
        },
        {
            name: t.orders ?? "Orders",
            href: route("staff.orders.index"),
            icon: ShoppingBag,
            route: "staff.orders.index",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:rotate-6 transition-transform">
                                B
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{t.quick_feast ?? "Bellion Bake & Brew"}</p>
                                <p className="text-xs text-gray-500">{t.staff_panel ?? "Staff Panel"}</p>
                            </div>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const routeBase = item.route.replace(".index", ".*");
                            const isActive = route().current(item.route) || route().current(routeBase);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                        isActive
                                            ? "bg-blue-50 text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100"
                                    }`}
                                >
                                    <item.icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                        <div className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-semibold shadow-md">
                                {auth.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate text-sm">{auth.user?.name}</p>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{t.staff ?? "Staff"}</p>
                            </div>
                        </div>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-bold text-sm transition-all border border-transparent hover:border-red-100"
                        >
                            <LogOut size={16} />
                            {t.logout ?? "Logout"}
                        </Link>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                            <MenuIcon size={24} />
                        </button>
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                                {t.view_website ?? "View Website"}
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="min-h-[calc(100vh-73px)]">{children}</main>
            </div>
        </div>
    );
}
