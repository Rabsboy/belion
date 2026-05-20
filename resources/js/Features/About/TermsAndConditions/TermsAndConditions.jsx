import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head } from "@inertiajs/react";
import { FileText, Scale, ShieldCheck, AlertCircle } from "lucide-react";

export default function TermsAndConditions() {
    return (
        <PublicLayout>
            <Head title="Terms & Conditions - Bellion Bake & Brew" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-2xl mb-6 shadow-lg shadow-indigo-100">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-600 italic">
                            Last updated: January 24, 2026
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Scale className="w-6 h-6 text-indigo-600" />
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                By accessing and using the Bellion Bake & Brew platform,
                                you agree to comply with and be bound by these
                                Terms and Conditions. If you do not agree with
                                any part of these terms, please refrain from
                                using our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                2. Service Description
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Bellion Bake & Brew provides an online ordering platform
                                for food delivery and pickup services. We act as
                                an intermediary between our culinary partners
                                and customers to facilitate seamless dining
                                experiences.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                                3. User Accounts
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    To place orders, you may need to create an
                                    account. You are responsible for:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>
                                        Maintaining the confidentiality of your
                                        account credentials.
                                    </li>
                                    <li>
                                        Providing accurate and complete
                                        information.
                                    </li>
                                    <li>
                                        All activities that occur under your
                                        account.
                                    </li>
                                    <li>
                                        Notifying us immediately of any
                                        unauthorized use.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                4. Ordering and Payment
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    All orders are subject to availability.
                                    Prices are listed on our platform and are
                                    subject to change without notice.
                                </p>
                                <p>
                                    Payments are processed securely via{" "}
                                    <strong>SSLCommerz</strong>. By placing an
                                    order, you authorize us to charge the
                                    specified amount to your chosen payment
                                    method.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-indigo-600" />
                                5. Cancellation and Refunds
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Orders once prepared cannot be cancelled.
                                Refunds may be processed in cases of
                                non-delivery or incorrect orders, subject to our
                                investigation and discretion. Please contact our
                                support team within 1 hour of the delivery time
                                for any issues.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                6. Delivery Policy
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Delivery times are estimates only and not
                                guaranteed. Factors such as traffic, weather,
                                and kitchen load may affect delivery. Customers
                                are responsible for being present at the
                                specified address during the delivery window.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                7. Intellectual Property
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                All content on the Bellion Bake & Brew platform,
                                including text, graphics, logos, and software,
                                is the property of Bellion Bake & Brew and is protected
                                by intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                8. Limitation of Liability
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Bellion Bake & Brew shall not be liable for any indirect,
                                incidental, or consequential damages resulting
                                from the use or inability to use our services.
                            </p>
                        </section>

                        <footer className="border-t border-gray-100 pt-10 mt-10">
                            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                                <p className="text-gray-900 font-semibold mb-2 text-lg">
                                    Questions about our Terms?
                                </p>
                                <p className="text-gray-600">
                                    Our support team is here to help 24/7.
                                </p>
                                <p className="text-indigo-600 font-bold mt-2">
                                    contact@rifatxtra.com
                                </p>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
