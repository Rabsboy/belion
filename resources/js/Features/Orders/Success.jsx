import { formatRupiah } from "@/Utils/currency";
import React, { useEffect, useState } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
    CheckCircle2,
    Package,
    MapPin,
    Calendar,
    ArrowRight,
    Printer,
    Clock,
} from "lucide-react";
import axios from "axios";

export default function Success({ order }) {
    const { translations } = usePage().props;
    const { messages: m } = translations;
    const [paymentStatus, setPaymentStatus] = useState(order?.payment_status);

    useEffect(() => {
        localStorage.removeItem("cart_items");
        window.dispatchEvent(new Event("cartUpdated"));
    }, []);

    useEffect(() => {
        if (paymentStatus === "paid") return;

        const interval = setInterval(async () => {
            try {
                const res = await axios.get(route("checkout.status", order.id));
                if (res.data.payment_status === "paid") {
                    setPaymentStatus("paid");
                    clearInterval(interval);
                }
            } catch (e) {
                // ignore polling errors
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [paymentStatus, order.id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <PublicLayout>
            <Head title={m['order.success_title']} />

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .invoice-container, .invoice-container * {
                        visibility: visible;
                    }
                    .invoice-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        border: none;
                    }
                    .no-print {
                        display: none !important;
                    }
                    nav, footer, .header {
                        display: none !important;
                    }
                }
            `}</style>
            <div className="max-w-3xl mx-auto px-6 py-12 print:p-0">
                <div className="text-center mb-12 no-print">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {m['order.success_title']}
                    </h1>
                    <p className="text-gray-600">
                        {m['order.success_message']}
                    </p>
                </div>

                <div className="invoice-container bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-primary-600 px-8 py-6 text-white flex justify-between items-center">
                        <div>
                            <p className="text-primary-100 text-sm uppercase tracking-wider font-bold">
                                {m['order.id']}
                            </p>
                            <h2 className="text-2xl font-bold">
                                #{order.id.toString().padStart(6, "0")}
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-primary-100 text-sm uppercase tracking-wider font-bold">
                                {m['general.status']}
                            </p>
                            <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-bold capitalize print:text-black print:bg-transparent">
                                {order.status.replace("_", " ")}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    {m['order.delivery_details']}
                                </h3>
                                <div className="flex gap-3">
                                    <MapPin
                                        className="text-primary-500 shrink-0"
                                        size={20}
                                    />
                                    <div>
                                        <p className="text-gray-900 font-bold">
                                            {order.client_name ||
                                                order.user?.name}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {order.client_phone ||
                                                order.user?.phone}
                                        </p>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {order.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Package
                                        className="text-primary-500 shrink-0"
                                        size={20}
                                    />
                                    <p className="text-gray-700 font-medium">
                                        {m['order.home_delivery']}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    {m['order.order_info']}
                                </h3>
                                <div className="flex gap-3">
                                    <Calendar
                                        className="text-primary-500 shrink-0"
                                        size={20}
                                    />
                                    <p className="text-gray-700">
                                        {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <p className="text-gray-500">{m['order.payment']}: </p>
                                    <p className="text-gray-700 font-bold uppercase flex items-center gap-1">
                                        {order.payment?.method} (
                                        {paymentStatus === "paid" ? (
                                            <span className="text-green-600 flex items-center gap-1">
                                                <CheckCircle2 size={14} /> {paymentStatus}
                                            </span>
                                        ) : (
                                            <span className="text-yellow-600 flex items-center gap-1">
                                                <Clock size={14} /> {paymentStatus}
                                            </span>
                                        )})
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 mb-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                {m['order.items_ordered']}
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-start"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-400 print:border print:border-gray-200">
                                                {item.quantity}x
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {item.product.name}
                                                </p>
                                                {item.selected_options
                                                    ?.variation && (
                                                    <p className="text-xs text-gray-500">
                                                        {m['order.size']}:{" "}
                                                        {
                                                            item
                                                                .selected_options
                                                                .variation.name
                                                        }
                                                    </p>
                                                )}
                                                {item.selected_options?.options
                                                    ?.length > 0 && (
                                                    <p className="text-xs text-gray-500">
                                                        {m['order.extras']}:{" "}
                                                        {item.selected_options.options
                                                            .map((o) => o.name)
                                                            .join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            {formatRupiah(item.line_total)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 space-y-3 print:bg-transparent print:border print:border-gray-200">
                            <div className="flex justify-between text-gray-600">
                                <span>{m['general.subtotal']}</span>
                                <span>{formatRupiah(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>{m['general.delivery_fee']}</span>
                                <span>
                                    {formatRupiah(order.delivery_fee)}
                                </span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between text-green-600 font-bold">
                                    <span>{m['general.discount']} ({order.coupon?.code})</span>
                                    <span>-{formatRupiah(order.discount_amount)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-xl font-black text-gray-900">
                                <span>{m['general.total_paid']}</span>
                                <span className="text-primary-600">
                                    {formatRupiah(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 px-8 py-6 border-t border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center no-print">
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary-600 transition"
                            >
                                <Printer size={18} /> {m['order.print_invoice']}
                            </button>
                        </div>
                        <Link
                            href={route("home")}
                            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition shadow-lg shadow-primary-200"
                        >
                            {m['order.back_to_home']} <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <p className="text-center text-gray-400 text-sm mt-8 no-print">
                    {m['order.invoice_sent']}
                </p>
            </div>
        </PublicLayout>
    );
}
