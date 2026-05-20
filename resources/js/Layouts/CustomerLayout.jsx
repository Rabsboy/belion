import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    User,
    LogOut,
    Menu as MenuIcon,
    X,
    Home,
} from "lucide-react";
import Toast from "@/Components/Toast";

export default function CustomerLayout({ children }) {
    const { auth, flash, errors, translations } = usePage().props;
    const m = translations?.messages ?? {};
    const t = translations?.auth ?? {};
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
            name: m["customer.my_dashboard"] ?? "Dashboard",
            href: route("customer.dashboard"),
            icon: LayoutDashboard,
            route: "customer.dashboard",
        },
        {
            name: m["customer.my_orders"] ?? "My Orders",
            href: route("customer.orders.index"),
            icon: ShoppingBag,
            route: "customer.orders.*",
        },
        {
            name: m["customer.my_profile"] ?? "Profile",
            href: route("customer.profile"),
            icon: User,
            route: "customer.profile",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
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
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                B
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">
                                    Bellion Bake & Brew
                                </p>
                                <p className="text-xs text-gray-500">
                                    {m["footer.my_account"] ?? "My Account"}
                                </p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = route().current(item.route);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                        isActive
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center text-white font-semibold">
                                {auth.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                    {auth.user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {auth.user?.email}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all"
                        >
                            <LogOut size={18} />
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
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                            >
                                <Home size={16} />
                                {m["nav.back_to_home"] ?? "Back to Website"}
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
