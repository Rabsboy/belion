import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Settings,
    LogOut,
    Menu as MenuIcon,
    X,
    ChevronDown,
    Layers,
    User,
    BarChart3,
    Ticket,
    Mail,
} from "lucide-react";
import Toast from "@/Components/Toast";

export default function AdminLayout({ children }) {
    const { auth, flash, errors, translations } = usePage().props;
    const t = translations?.admin ?? {};
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
            href: route("admin.dashboard"),
            icon: LayoutDashboard,
            route: "admin.dashboard",
        },
        {
            name: t.orders ?? "Orders",
            href: route("admin.orders.index"),
            icon: ShoppingBag,
            route: "admin.orders.index",
        },
        {
            name: t.categories ?? "Categories",
            href: route("admin.categories.index"),
            icon: Layers,
            route: "admin.categories.index",
        },
        {
            name: t.products ?? "Products",
            href: route("admin.products.index"),
            icon: Package,
            route: "admin.products.index",
        },
        {
            name: t.customers ?? "Customers",
            href: route("admin.customers.index"),
            icon: Users,
            route: "admin.customers.index",
        },
        {
            name: t.reports ?? "Reports",
            href: route("admin.reports.index"),
            icon: BarChart3,
            route: "admin.reports.index",
        },
        {
            name: t.coupons ?? "Coupons",
            href: route("admin.coupons.index"),
            icon: Ticket,
            route: "admin.coupons.index",
        },
        {
            name: t.settings ?? "Settings",
            href: route("admin.settings.index"),
            icon: Settings,
            route: "admin.settings.index",
        },
        {
            name: t.profile ?? "Profile",
            href: route("admin.profile"),
            icon: User,
            route: "admin.profile",
        },
        {
            name: t.contact_requests ?? "Contact Requests",
            href: route("admin.contact-requests.index"),
            icon: Mail,
            route: "admin.contact-requests.index",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:rotate-6 transition-transform">
                                B
                            </div>
                            <div>
                                    <p className="font-bold text-gray-900">
                                        {t.quick_feast ?? "Bellion Bake & Brew"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t.admin_panel ?? "Admin Panel"}
                                    </p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {navigation.map((item) => {
                            // Use wildcard to match child routes (e.g., admin.orders.* matches admin.orders.show, admin.orders.edit)
                            const routeBase = item.route.replace(
                                ".index",
                                ".*",
                            );
                            const isActive =
                                route().current(item.route) ||
                                route().current(routeBase);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-orange-50 text-orange-600 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100"
                                    }`}
                                >
                                    <item.icon
                                        size={20}
                                        className={
                                            isActive
                                                ? "text-orange-600"
                                                : "text-gray-400"
                                        }
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                        <Link
                            href={route("admin.profile")}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center text-white font-semibold shadow-md group-hover:scale-105 transition-transform">
                                {auth.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate text-sm">
                                    {auth.user?.name}
                                </p>
                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">
                                    {t.view_profile ?? "View Profile"}
                                </p>
                            </div>
                        </Link>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-bold text-sm transition-all border border-transparent hover:border-red-100"
                        >
                            <LogOut size={16} />
                            {t.logout ?? "Logout"}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <MenuIcon size={24} />
                        </button>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                            >
                                {t.view_website ?? "View Website"}
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="min-h-[calc(100vh-73px)]">{children}</main>
            </div>
        </div>
    );
}
