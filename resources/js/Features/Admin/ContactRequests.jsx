import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import {
    Mail,
    Calendar,
    User,
    MessageSquare,
    Check,
    X,
    Send,
} from "lucide-react";
import Pagination from "@/Components/Pagination";
import Modal from "@/Components/Modal";

export default function ContactRequests({ messages }) {
    const { translations } = usePage().props;
    const a = translations?.admin ?? {};
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { data, setData, put, processing, reset, errors } = useForm({
        status: "pending",
    });

    const openModal = (msg) => {
        setSelectedMessage(msg);
        setData({
            status: msg.status,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMessage(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.contact-requests.update", selectedMessage.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AdminLayout>
            <Head title={a.contact_requests_title ?? "Contact Requests"} />

            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {a.contact_requests_title ?? "Contact Requests"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {(a.messages_received ?? "messages received").replace(":count", messages.total)}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 font-semibold text-gray-700">
                                        {a.date ?? "Date"}
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">
                                        {a.from ?? "From"}
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">
                                        {a.subject ?? "Subject"}
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">
                                        {a.status ?? "Status"}
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">
                                        {a.action ?? "Action"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {messages.data.map((msg) => (
                                    <tr
                                        key={msg.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(
                                                msg.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {msg.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {msg.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800">
                                            {msg.subject}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    msg.status === "resolved"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {msg.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    msg.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => openModal(msg)}
                                                className="text-primary-600 hover:text-primary-700 font-medium"
                                            >
                                                {a.view_update ?? "View & Update"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={messages.links} />

                {/* Reply/Resolve Modal */}
                <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {a.message_details ?? "Message Details"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {selectedMessage && (
                            <div className="space-y-6">
                                {/* Message Info */}
                                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-gray-900">
                                            {selectedMessage.subject}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            {new Date(
                                                selectedMessage.created_at
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-sm text-gray-600">
                                        <User size={16} />{" "}
                                        <span>
                                            {selectedMessage.name} (
                                            {selectedMessage.email})
                                        </span>
                                        {selectedMessage.phone && (
                                            <span>
                                                • {selectedMessage.phone}
                                            </span>
                                        )}
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <p className="whitespace-pre-wrap text-gray-800">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Form */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {a.update_status_label ?? "Update Status"}
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            >
                                                <option value="pending">
                                                    {a.pending ?? "Pending"}
                                                </option>
                                                <option value="resolved">
                                                    {a.resolved ?? "Resolved"}
                                                </option>
                                            </select>
                                        </div>
                                        <div className="flex-1 flex justify-end items-end h-full">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <Check size={18} />
                                                {a.update_status_label ?? "Update Status"}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 italic">
                                        {a.notify_email ?? "* Updating the status will automatically notify the user via email."}
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
}
