import { Link, usePage } from "@inertiajs/react";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import React from "react";

export default function Footer() {
    const { translations } = usePage().props;
    const { messages: m } = translations;

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-rose-400 bg-clip-text text-transparent">
                            Bellion Bake & Brew
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {m['footer.brand_desc']}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4">{m['footer.quick_links']}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-400 hover:text-primary-400 transition-colors"
                                >
                                    {m['footer.home']}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/menu"
                                    className="text-gray-400 hover:text-primary-400 transition-colors"
                                >
                                    {m['footer.menu']}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-400 hover:text-primary-400 transition-colors"
                                >
                                    {m['footer.about_us']}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-400 hover:text-primary-400 transition-colors"
                                >
                                    {m['footer.contact']}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4">{m['footer.customer_service']}</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/customer/dashboard"
                                    className="text-gray-400 hover:text-primary-400 transition-colors"
                                >
                                    {m['footer.my_account']}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/customer/orders"
                                    className="text-gray-400 hover:text-primary-400 transition-colors"
                                >
                                    {m['footer.order_history']}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms-and-conditions"
                                    className="text-gray-400 hover:text-primary-400 transition-colors"
                                >
                                    {m['footer.terms']}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4">{m['footer.contact_us']}</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href="https://maps.app.goo.gl/CiqfWSUbT6rG7JMa7"
                                    target="_blank"
                                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    Bamnartek Rd, Dhaka-1230
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a
                                    href="tel:+8801845878722"
                                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    +880 1845-878722
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a
                                    href="mailto:contact@rifatxtra.com"
                                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    contact@rifatxtra.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm flex flex-col md:flex-row items-center gap-1">
                        {m['footer.made_with']}{" "}
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
                        {m['footer.by']}{" "}
                        <a
                            href="https://rifatxtra.com/"
                            target="_blank"
                            className="text-primary-400"
                        >
                            Md. Rashedul Islam
                        </a>
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="/privacy-policy"
                            className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                        >
                            {m['footer.privacy_policy']}
                        </Link>
                        <Link
                            href="/cookie-policy"
                            className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                        >
                            {m['footer.cookie_policy']}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
