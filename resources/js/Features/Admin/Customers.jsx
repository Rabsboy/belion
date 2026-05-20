import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Users,
    Mail,
    Phone,
    ShoppingBag,
    Ban,
    CheckCircle,
} from "lucide-react";
import Pagination from "@/Components/Pagination";

export default function Customers({ customers }) {
    const { translations } = usePage().props;
    const a = translations?.admin ?? {};

    return (
        <AdminLayout>
            <Head title={a.customers_management ?? "Customers Management"} />

            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {a.customers_management ?? "Customers Management"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {(a.total_customers ?? "total customers").replace(":count", customers.total)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.data.map((customer) => (
                        <div
                            key={customer.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 truncate">
                                        {customer.name}
                                    </h3>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail
                                                size={16}
                                                className="flex-shrink-0"
                                            />
                                            <span className="truncate">
                                                {customer.email}
                                            </span>
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone
                                                    size={16}
                                                    className="flex-shrink-0"
                                                />
                                                <span>{customer.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <ShoppingBag
                                                size={16}
                                                className="flex-shrink-0"
                                            />
                                            <span>
                                                {(a.orders_count ?? "orders").replace(":count", customer.orders_count || 0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500">
                                                {(a.joined ?? "Joined ") + new Date(
                                                    customer.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    router.put(
                                                        route(
                                                            "admin.customers.toggleBan",
                                                            customer.id
                                                        )
                                                    )
                                                }
                                                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    customer.is_banned
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                            >
                                                {customer.is_banned ? (
                                                    <>
                                                        <CheckCircle
                                                            size={14}
                                                        />
                                                        {a.unban ?? "Unban"}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ban size={14} />
                                                        {a.ban ?? "Ban"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {customer.is_banned && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                                {a.banned ?? "Banned"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination links={customers.links} />

                {customers.data.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">
                            {a.no_customers ?? "No customers yet"}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
