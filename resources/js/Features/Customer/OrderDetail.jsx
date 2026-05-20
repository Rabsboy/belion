import { formatRupiah } from "@/Utils/currency";
import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ShoppingBag, Clock, CheckCircle, Package, CreditCard,
    MapPin, FileText, ExternalLink, ArrowLeft, Store, Truck,
} from "lucide-react";
import { statusOrderLabel, fulfillmentSteps, isStepActive, isStepCompleted } from "@/Utils/order";

export default function OrderDetail({ order }) {
    const { translations } = usePage().props;
    const { messages: m } = translations;
    const fulfillmentType = order.fulfillment_type || 'delivery';
    const steps = fulfillmentSteps(fulfillmentType);

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700",
            preparing: "bg-blue-100 text-blue-700",
            out_for_delivery: "bg-purple-100 text-purple-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: "bg-orange-100 text-orange-700 border-orange-200",
            paid: "bg-green-100 text-green-700 border-green-200",
            failed: "bg-red-100 text-red-700 border-red-200",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    return (
        <CustomerLayout>
            <Head title={`Order #${order.id}`} />

            <div className="p-6 md:p-8 max-w-3xl mx-auto">
                <Link
                    href={route("customer.orders.index")}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-semibold mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    {m['customer.back_to_orders']}
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${getStatusColor(order.status)}`}>
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Order #{order.id}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase text-gray-400">{m['fulfillment.type.' + fulfillmentType] ?? fulfillmentType}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    fulfillmentType === 'pickup' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {fulfillmentType === 'pickup' ? <Store size={14} className="inline" /> : <Truck size={14} className="inline" />}
                                    {' '}{m['fulfillment.type.' + fulfillmentType] ?? fulfillmentType}
                                </span>
                            </div>
                        </div>

                        {/* Status Progress Stepper */}
                        {order.status !== 'cancelled' && (
                            <div className="flex items-center gap-0">
                                {steps.map((step, idx) => {
                                    const active = isStepActive(step, order.status);
                                    const completed = isStepCompleted(idx, steps, order.status);
                                    const isLast = idx === steps.length - 1;
                                    return (
                                        <React.Fragment key={step.key}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                                    completed || active
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                    {completed ? <CheckCircle size={16} /> : idx + 1}
                                                </div>
                                                <span className={`text-xs font-semibold ${
                                                    active ? 'text-primary-700' : completed ? 'text-gray-600' : 'text-gray-400'
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            {!isLast && (
                                                <div className={`flex-1 h-0.5 mx-2 ${
                                                    completed ? 'bg-primary-600' : 'bg-gray-200'
                                                }`} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}

                        {order.status === 'cancelled' && (
                            <div className="flex items-center gap-2 text-red-600 font-bold">
                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                                    <Clock size={16} />
                                </div>
                                <span className="text-sm">{statusOrderLabel(order.status, fulfillmentType)}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">{m['general.total']}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatRupiah(order.total)}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">{m['order.payment']}</p>
                                <p className="font-bold text-gray-900 uppercase">
                                    {order.payment?.method || order.payment_method || "N/A"}
                                </p>
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase border ${getPaymentStatusColor(order.payment_status)}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <ShoppingBag size={18} className="text-primary-600" />
                                {m['customer.items']}
                            </h3>
                            <div className="space-y-3">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {item.product_name || item.product?.name || "Product"} x {item.quantity}
                                            </p>
                                            {item.selected_options?.variation && (
                                                <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-100 font-medium">
                                                    Size: {item.selected_options.variation.name}
                                                </span>
                                            )}
                                            {item.selected_options?.options?.map((opt, oIdx) => (
                                                <span key={oIdx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 font-medium ml-1">
                                                    {opt.name}{opt.quantity > 1 && ` x${opt.quantity}`}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="font-bold text-gray-900">
                                            {formatRupiah(item.line_total)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 space-y-1 text-sm border-t border-gray-100 pt-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>{m['general.subtotal']}</span>
                                    <span>{formatRupiah(order.subtotal)}</span>
                                </div>
                                {parseFloat(order.discount_amount) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>{m['general.discount']}</span>
                                        <span>-{formatRupiah(order.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>{m['general.delivery_fee']}</span>
                                    <span>{formatRupiah(order.delivery_fee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                                    <span>{m['general.total']}</span>
                                    <span className="text-primary-600">{formatRupiah(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {order.address && order.fulfillment_type !== 'pickup' && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <MapPin size={18} className="text-primary-600" />
                                    {m['checkout.delivery_address']}
                                </h3>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{order.address}</p>
                            </div>
                        )}

                        {order.order_note && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <FileText size={18} className="text-primary-600" />
                                    {m['general.note']}
                                </h3>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{order.order_note}</p>
                            </div>
                        )}

                        {order.delivery_tracking_url && (
                            <a
                                href={order.delivery_tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold"
                            >
                                <ExternalLink size={18} />
                                {m['customer.track_delivery']}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
