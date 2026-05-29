import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import {
    Menu,
    ShoppingBag,
    LogIn,
    X,
    Clock,
} from "lucide-react";
import CartSummary from "@/Components/CartSummary"; 

export default function Navbar() {
    const { auth, translations } = usePage().props;
    const { auth: t, messages: m } = translations;
    const isLoggedIn = !!auth?.user;
    const userRole = auth?.user?.role;

    const dashboardHref = userRole === 'admin'
        ? route('admin.dashboard')
        : userRole === 'staff'
            ? route('staff.dashboard')
            : userRole === 'customer'
                ? route('customer.dashboard')
                : route('home');

    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [showCart, setShowCart] = useState(false);

    const currentPath = window.location.pathname;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const isGuest = !isLoggedIn;

        if (isGuest) {
            const initialized = sessionStorage.getItem("cart_cleared");
            if (!initialized) {
                localStorage.removeItem("cart_items");
                sessionStorage.setItem("cart_cleared", "1");
            }
        }

        const updateCartCount = () => {
            const items = JSON.parse(localStorage.getItem("cart_items") || "[]");
            setCartCount(items.length);
        };

        updateCartCount();

        window.addEventListener("storage", updateCartCount);
        window.addEventListener("cartUpdated", updateCartCount);

        return () => {
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, [isLoggedIn]);

    const navLinks = [
        { href: "/", label: m['nav.home'] },
        { href: "/menu", label: m['nav.menu'] },
        { href: "/about", label: m['nav.about'] },
        { href: "/contact", label: m['nav.contact'] },
    ];

    const isActive = (href) => {
        if (href === "/") return currentPath === "/";
        return currentPath.startsWith(href);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-lg"
                    : "bg-gradient-to-r from-primary-50 to-white"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="h-16 md:h-20 flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                            <span className="text-white text-base md:text-2xl font-bold">
                                Q
                            </span>
                        </div>
                        <div>
                            <h1 className="text-base md:text-2xl font-bold text-gray-900">
                                Bellion
                            </h1>
                            <p className="hidden md:block text-xs text-gray-500">Eatery & Brew</p>
                        </div>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 rounded-xl font-semibold transition-all ${
                                    isActive(link.href)
                                        ? "text-primary-600"
                                        : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                                }`}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />
                                )}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                                    {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                                </span>
                                <a
                                    href={dashboardHref}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-semibold rounded-xl hover:bg-primary-50"
                                >
                                    <Menu className="w-4 h-4" />
                                    {m['nav.dashboard']}
                                </a>
                                {userRole === 'customer' && (
                                    <a
                                        href={route('customer.orders.index')}
                                        className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-xl transition-all ${
                                            currentPath.startsWith('/customer/orders')
                                                ? 'text-primary-600 bg-primary-50'
                                                : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                                        }`}
                                    >
                                        <Clock className="w-4 h-4" />
                                        {m['nav.orders']}
                                    </a>
                                )}
                            </>
                        ) : (
                            <a
                                href={route('login')}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-semibold rounded-xl hover:bg-primary-50"
                            >
                                <LogIn className="w-4 h-4" />
                                {t.login}
                            </a>
                        )}

                        <button
                            onClick={() => setShowCart(true)}
                            className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {m['nav.cart']}
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden flex items-center gap-1.5">
                        <button
                            onClick={() => setShowCart(true)}
                            className="relative flex items-center gap-1 px-2.5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl"
                        >
                            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-xl hover:bg-primary-50"
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden transition-all ${
                    open ? "max-h-screen" : "max-h-0 overflow-hidden"
                }`}
            >
                <div className="bg-white border-t px-4 md:px-6 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                                isActive(link.href)
                                    ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    {isLoggedIn ? (
                        <>
                            {userRole === 'customer' && (
                                <a
                                    href={route('customer.orders.index')}
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                                >
                                    {m['nav.orders']}
                                </a>
                            )}
                            <a
                                href={dashboardHref}
                                onClick={() => setOpen(false)}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                                    currentPath === new URL(dashboardHref, window.location.origin).pathname
                                        ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                                        : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                                }`}
                            >
                                {m['nav.dashboard']}
                            </a>
                        </>
                    ) : (
                        <a
                            href={route('login')}
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                        >
                            {t.login}
                        </a>
                    )}
                </div>
            </div>
            {/* Cart Modal */}
            {showCart && (
                <CartSummary onClose={() => {
                    setShowCart(false);
                    // Update cart count after closing
                    const items = JSON.parse(localStorage.getItem("cart_items") || "[]");
                    setCartCount(items.length);
                }} />
            )}
        </header>
    );
}
