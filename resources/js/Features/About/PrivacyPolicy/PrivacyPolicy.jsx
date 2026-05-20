import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head } from "@inertiajs/react";
import { Shield, Lock, Eye, Mail } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <PublicLayout>
            <Head title="Privacy Policy - Bellion Bake & Brew" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl mb-6">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600">
                            Last updated: January 24, 2024
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Eye className="w-6 h-6 text-primary-600" />
                                Introduction
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                At Bellion Bake & Brew, we are committed to protecting
                                your privacy and ensuring the security of your
                                personal information. This Privacy Policy
                                explains how we collect, use, disclose, and
                                safeguard your information when you use our food
                                delivery service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Information We Collect
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Personal Information
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                                        <li>
                                            Name, email address, and phone
                                            number
                                        </li>
                                        <li>
                                            Delivery address and location data
                                        </li>
                                        <li>
                                            Payment information (processed
                                            securely through SSLCommerz)
                                        </li>
                                        <li>Order history and preferences</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Usage Information
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                                        <li>
                                            Browser type and operating system
                                        </li>
                                        <li>
                                            IP address and device information
                                        </li>
                                        <li>
                                            Pages visited and actions taken on
                                            our website
                                        </li>
                                        <li>Date and time of visits</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                How We Use Your Information
                            </h2>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>Process and fulfill your food orders</li>
                                <li>
                                    Communicate with you about your orders and
                                    our services
                                </li>
                                <li>
                                    Send you order confirmations, invoices, and
                                    delivery updates
                                </li>
                                <li>
                                    Improve our services and user experience
                                </li>
                                <li>Prevent fraud and enhance security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Lock className="w-6 h-6 text-primary-600" />
                                Data Security
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                We implement appropriate technical and
                                organizational security measures to protect your
                                personal information against unauthorized
                                access, alteration, disclosure, or destruction.
                                Payment information is encrypted and processed
                                through secure payment gateways (SSLCommerz).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Information Sharing
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We do not sell, trade, or rent your personal
                                information to third parties. We may share your
                                information with:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>
                                    Delivery partners to fulfill your orders
                                </li>
                                <li>
                                    Payment processors to complete transactions
                                </li>
                                <li>
                                    Service providers who assist in operating
                                    our website
                                </li>
                                <li>Law enforcement when required by law</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Your Rights
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>Access your personal information</li>
                                <li>Request correction of inaccurate data</li>
                                <li>
                                    Request deletion of your account and data
                                </li>
                                <li>Opt-out of marketing communications</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Mail className="w-6 h-6 text-primary-600" />
                                Contact Us
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                If you have any questions about this Privacy
                                Policy or wish to exercise your rights, please
                                contact us at:
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
                                We reserve the right to update this Privacy
                                Policy at any time. We will notify you of any
                                changes by posting the new Privacy Policy on
                                this page and updating the "Last updated" date.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
