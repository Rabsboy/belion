import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head } from "@inertiajs/react";
import { Cookie, Shield, Settings, Eye } from "lucide-react";

export default function CookiePolicy() {
    return (
        <PublicLayout>
            <Head title="Cookie Policy - Bellion Bake & Brew" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl mb-6">
                            <Cookie className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Cookie Policy
                        </h1>
                        <p className="text-gray-600">
                            Last updated: January 24, 2024
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Eye className="w-6 h-6 text-orange-600" />
                                What Are Cookies?
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Cookies are small text files that are placed on
                                your device when you visit our website. They
                                help us provide you with a better experience by
                                remembering your preferences and understanding
                                how you use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Types of Cookies We Use
                            </h2>
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-xl">
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        Essential Cookies
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        Required for the website to function
                                        properly. These cookies enable core
                                        functionality such as security,
                                        authentication, and order processing.
                                    </p>
                                    <p className="text-sm text-gray-500 italic">
                                        Examples: Session cookies,
                                        authentication tokens, shopping cart
                                        data
                                    </p>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-xl">
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-blue-600" />
                                        Functional Cookies
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        Remember your preferences and choices to
                                        provide enhanced, personalized features.
                                    </p>
                                    <p className="text-sm text-gray-500 italic">
                                        Examples: Language preferences, delivery
                                        address, previous orders
                                    </p>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-xl">
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-purple-600" />
                                        Analytics Cookies
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        Help us understand how visitors interact
                                        with our website by collecting and
                                        reporting information anonymously.
                                    </p>
                                    <p className="text-sm text-gray-500 italic">
                                        Examples: Page views, session duration,
                                        user flow
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                How We Use Cookies
                            </h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>
                                    Maintain your shopping cart and order
                                    preferences
                                </li>
                                <li>Keep you logged in during your session</li>
                                <li>
                                    Remember your delivery address and payment
                                    preferences
                                </li>
                                <li>Understand which pages are most popular</li>
                                <li>
                                    Improve website performance and user
                                    experience
                                </li>
                                <li>Ensure security and prevent fraud</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Third-Party Cookies
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We may use third-party services that set cookies
                                on our website:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>
                                    <strong>SSLCommerz:</strong> For secure
                                    payment processing
                                </li>
                                <li>
                                    <strong>Google Maps:</strong> For location
                                    services and delivery tracking
                                </li>
                                <li>
                                    <strong>Analytics Services:</strong> To
                                    understand user behavior and improve our
                                    service
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Managing Cookies
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                You can control and manage cookies in various
                                ways:
                            </p>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Browser Settings
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Most browsers allow you to refuse or
                                        accept cookies. Check your browser's
                                        help section for instructions on
                                        managing cookie settings.
                                    </p>
                                </div>
                                <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded">
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Note
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Blocking essential cookies may prevent
                                        you from using certain features of our
                                        website, such as placing orders or
                                        accessing your account.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Cookie Duration
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Session Cookies
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Temporary cookies that are deleted when
                                        you close your browser.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Persistent Cookies
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Remain on your device until they expire
                                        or you delete them. Duration varies from
                                        days to months depending on the cookie's
                                        purpose.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Contact Us
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                If you have questions about our use of cookies,
                                please contact us:
                            </p>
                            <div className="mt-4 p-6 bg-gray-50 rounded-xl">
                                <p className="text-gray-900 font-semibold">
                                    Bellion Bake & Brew Customer Support
                                </p>
                                <p>
                                    <a
                                        href="mailto:contact@rifatxtra.com"
                                        className="text-gray-600"
                                    >
                                        Email: contact@rifatxtra.com
                                    </a>
                                </p>
                                <p>
                                    <a
                                        href="tel:+8801845878722"
                                        className="text-gray-600"
                                    >
                                        Phone: +880 1845-878722
                                    </a>
                                </p>
                            </div>
                        </section>

                        <section className="border-t pt-8">
                            <p className="text-sm text-gray-500 italic">
                                We may update this Cookie Policy from time to
                                time. Any changes will be posted on this page
                                with an updated revision date.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
