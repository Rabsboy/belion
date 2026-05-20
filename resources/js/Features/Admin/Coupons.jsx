import { formatRupiah } from "@/Utils/currency";
import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import {
    Ticket,
    Plus,
    Edit,
    Trash2,
    X,
    Search,
    Calendar,
    Hash,
    Percent,
} from "lucide-react";

import Pagination from "@/Components/Pagination";

export default function Coupons({ coupons }) {
    const { translations } = usePage().props;
    const a = translations?.admin ?? {};
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: "",
        type: "fixed",
        value: "",
        min_order: "0",
        start_at: "",
        end_at: "",
        usage_limit: "",
        per_user_limit: "1",
        is_active: true,
    });

    const openModal = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setData({
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                min_order: coupon.min_order,
                start_at: coupon.start_at
                    ? coupon.start_at.substring(0, 16)
                    : "",
                end_at: coupon.end_at ? coupon.end_at.substring(0, 16) : "",
                usage_limit: coupon.usage_limit || "",
                per_user_limit: coupon.per_user_limit || "1",
                is_active: !!coupon.is_active,
            });
        } else {
            setEditingCoupon(null);
            reset();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCoupon(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCoupon) {
            put(route("admin.coupons.update", editingCoupon.id), {
                onSuccess: () => {
                    closeModal();
                },
            });
        } else {
            post(route("admin.coupons.store"), {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (coupon) => {
        if (confirm((a.delete_coupon_confirm ?? 'Delete coupon ":code"?').replace(":code", coupon.code))) {
            router.delete(route("admin.coupons.destroy", coupon.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={a.coupons_management ?? "Coupons Management"} />

            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {a.coupons_management ?? "Coupons Management"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {(a.total_coupons ?? "total coupons").replace(":count", coupons.total)}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus size={20} />
                        {a.add_coupon ?? "Add Coupon"}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        {a.code ?? "Code"}
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        {a.type ?? "Type"}
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        {a.value ?? "Value"}
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        {a.min_order ?? "Min. Order"}
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        {a.usage ?? "Usage"}
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        {a.status ?? "Status"}
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                                        {a.actions ?? "Actions"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {coupons.data.map((coupon) => (
                                    <tr
                                        key={coupon.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                {coupon.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 capitalize text-sm text-gray-700">
                                            {coupon.type}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {coupon.type === "fixed"
                                                ? formatRupiah(coupon.value)
                                                : `${coupon.value}%`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatRupiah(coupon.min_order)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {coupon.used_count} /{" "}
                                            {coupon.usage_limit || "∞"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    coupon.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {coupon.is_active
                                                    ? (a.active ?? "Active")
                                                    : (a.inactive ?? "Inactive")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        openModal(coupon)
                                                    }
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title={a.edit ?? "Edit"}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(coupon)
                                                    }
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title={a.delete ?? "Delete"}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={coupons.links} />

                {coupons.data.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">
                            {a.no_coupons ?? "No coupons found"}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingCoupon
                                    ? (a.edit_coupon ?? "Edit Coupon")
                                    : (a.add_new_coupon ?? "Add New Coupon")}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {a.coupon_code_label ?? "Coupon Code *"}
                                </label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData(
                                            "code",
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition font-mono uppercase"
                                    placeholder={a.coupon_code_placeholder ?? "E.g. SUMMER50"}
                                    required
                                />
                                {errors.code && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {a.type_label ?? "Type *"}
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) =>
                                            setData("type", e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                    >
                                        <option value="fixed">{a.fixed_rp ?? "Fixed (Rp)"}</option>
                                        <option value="percentage">
                                            {a.percentage ?? "Percentage (%)"}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {a.value_label ?? "Value *"}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.value}
                                            onChange={(e) =>
                                                setData("value", e.target.value)
                                            }
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                            placeholder="0.00"
                                            required
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            {data.type === "fixed" ? (
                                                <Hash size={16} />
                                            ) : (
                                                <Percent size={16} />
                                            )}
                                        </div>
                                    </div>
                                    {errors.value && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.value}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {a.min_order_amount ?? "Min. Order Amount"}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.min_order}
                                        onChange={(e) =>
                                            setData("min_order", e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {a.total_usage_limit ?? "Total Usage Limit"}
                                    </label>
                                    <input
                                        type="number"
                                        value={data.usage_limit}
                                        onChange={(e) =>
                                            setData(
                                                "usage_limit",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                        placeholder={a.no_limit ?? "No limit"}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {a.per_user_limit ?? "Per User Limit"}
                                    </label>
                                    <input
                                        type="number"
                                        value={data.per_user_limit}
                                        onChange={(e) =>
                                            setData(
                                                "per_user_limit",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                        placeholder={a.no_limit ?? "No limit"}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                        <Calendar size={14} /> {a.start_date ?? "Start Date"}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.start_at}
                                        onChange={(e) =>
                                            setData("start_at", e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                        <Calendar size={14} /> {a.end_date ?? "End Date"}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.end_at}
                                        onChange={(e) =>
                                            setData("end_at", e.target.value)
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.checked)
                                    }
                                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    {a.coupon_active ?? "Coupon is Active and usable by customers"}
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {processing
                                        ? (a.saving ?? "Saving...")
                                        : editingCoupon
                                          ? (a.update_coupon ?? "Update Coupon")
                                          : (a.add_coupon_btn ?? "Add Coupon")}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
                                >
                                    {a.cancel ?? "Cancel"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
