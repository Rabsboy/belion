import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { XCircle, ArrowLeft, MessageCircle, RotateCcw } from "lucide-react";

export default function Cancel({ order }) {
    const { translations } = usePage().props;
    const { messages: m } = translations;

    return (
        <PublicLayout>
            <Head title={m['order.cancelled_title']} />

            <div className="max-w-xl mx-auto px-6 py-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center p-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-600 mb-8">
                        <XCircle size={64} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                        {m['order.cancelled_title']}
                    </h1>

                    <p className="text-gray-600 mb-8 text-lg">
                        {m['order.cancelled_message']}
                    </p>

                    <div className="space-y-4">
                        <Link
                            href={route("checkout.index")}
                            className="flex items-center justify-center gap-3 w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200"
                        >
                            <RotateCcw size={20} /> {m['order.try_again']}
                        </Link>

                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                href={route("home")}
                                className="flex items-center justify-center gap-2 py-4 border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition"
                            >
                                <ArrowLeft size={18} /> {m['order.home_page']}
                            </Link>
                            <Link
                                href={route("contact")}
                                className="flex items-center justify-center gap-2 py-4 border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition"
                            >
                                <MessageCircle size={18} /> {m['order.get_help']}
                            </Link>
                        </div>
                    </div>
                </div>

                {order && (
                    <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl">
                        <p className="text-red-700 text-sm italic text-center">
                            {m['order.failed_reference'].replace(':id', order.id.toString().padStart(6, "0"))}
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
