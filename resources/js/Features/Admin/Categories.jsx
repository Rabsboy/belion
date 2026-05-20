import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Layers, Plus, Edit, Trash2, X, Search } from "lucide-react";
import Pagination from "@/Components/Pagination";
import debounce from "lodash/debounce";
import { useCallback } from "react";

export default function Categories({ categories }) {
    const { flash, translations } = usePage().props;
    const a = translations?.admin ?? {};
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route("admin.categories.index"),
                { search: query },
                { preserveState: true, replace: true },
            );
        }, 300),
        [],
    );

    const onSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        handleSearch(query);
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setData({
                name: category.name,
                description: category.description || "",
            });
        } else {
            setEditingCategory(null);
            reset();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCategory) {
            put(route("admin.categories.update", editingCategory.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("admin.categories.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (category) => {
        if (
            confirm(
                (a.delete_category_confirm ?? 'Delete category ":name"? This will only work if no products are assigned to it.').replace(":name", category.name),
            )
        ) {
            router.delete(route("admin.categories.destroy", category.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={a.categories_management ?? "Categories Management"} />

            <div className="p-6 md:p-8">
                {/* Flash Message */}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {a.categories_management ?? "Categories Management"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {(a.total_categories ?? "total categories").replace(":count", categories.total)}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus size={20} />
                        {a.add_category ?? "Add Category"}
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder={a.search_categories ?? "Search categories..."}
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                        />
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.category_name ?? "Category Name"}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.description ?? "Description"}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.products ?? "Products"}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                                        {a.actions ?? "Actions"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.data.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">
                                                {category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                                {category.description ||
                                                    (a.no_description ?? "No description")}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {(a.products_count ?? "products").replace(":count", category.products_count)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() =>
                                                        openModal(category)
                                                    }
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title={a.edit ?? "Edit"}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(category)
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

                    {categories.data.length === 0 && (
                        <div className="p-12 text-center">
                            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">
                                {a.no_categories ?? "No categories found"}
                            </p>
                        </div>
                    )}
                </div>

                <Pagination links={categories.links} />
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingCategory
                                    ? (a.edit_category ?? "Edit Category")
                                    : (a.add_new_category ?? "Add New Category")}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-white hover:text-red-500 transition-colors rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {a.category_name_label ?? "Category Name *"}
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className={`w-full px-4 py-2.5 rounded-xl border ${
                                        errors.name
                                            ? "border-red-500"
                                            : "border-gray-200"
                                    } focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition`}
                                    placeholder={a.category_name_placeholder ?? "Enter category name"}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {a.description ?? "Description"}
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                    rows="4"
                                    placeholder={a.category_description_placeholder ?? "Enter category description (optional)"}
                                ></textarea>
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {processing
                                        ? (a.saving ?? "Saving...")
                                        : editingCategory
                                          ? (a.update_category ?? "Update Category")
                                          : (a.add_category_btn ?? "Add Category")}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3.5 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition active:scale-95"
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
