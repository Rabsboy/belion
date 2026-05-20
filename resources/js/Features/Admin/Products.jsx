import { formatRupiah } from "@/Utils/currency";
import React, { useState, useCallback, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Package, Plus, Edit, Trash2, X, Search } from "lucide-react";

import Pagination from "@/Components/Pagination";
import debounce from "lodash/debounce";

export default function Products({ products, categories, filters }) {
    const { translations } = usePage().props;
    const a = translations?.admin ?? {};
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        category_id: "",
        price: "",
        description: "",
        image: null,
        variations: [],
        options: [],
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route("admin.products.index"),
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

    const productListData = products.data || [];

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setData({
                name: product.name,
                category_id: product.category_id,
                price: product.price,
                description: product.description || "",
                image: null,
                variations: product.variations || [],
                options: product.options || [],
            });
        } else {
            setEditingProduct(null);
            reset();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("category_id", data.category_id);
        formData.append("price", data.price);
        formData.append("description", data.description);
        if (data.image) {
            formData.append("image", data.image);
        }

        // Append json fields
        formData.append("variations", JSON.stringify(data.variations));
        formData.append("options", JSON.stringify(data.options));

        if (editingProduct) {
            router.post(
                route("admin.products.update", editingProduct.id),
                formData,
                {
                    onSuccess: () => {
                        closeModal();
                    },
                },
            );
        } else {
            router.post(route("admin.products.store"), formData, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (product) => {
        if (confirm((a.delete_product_confirm ?? 'Delete ":name"?').replace(":name", product.name))) {
            router.delete(route("admin.products.destroy", product.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={a.products_management ?? "Products Management"} />

            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {a.products_management ?? "Products Management"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {(a.total_products ?? "total products").replace(":count", products.total)}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus size={20} />
                        {a.add_product ?? "Add Product"}
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
                            placeholder={a.search_products ?? "Search products..."}
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productListData.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="aspect-[4/3] bg-gray-100 relative">
                                {product.images_name ? (
                                    <img
                                        src={`/${product.images_name}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        🍽️
                                    </div>
                                )}
                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                                    {product.category?.name || (a.uncategorized ?? "Uncategorized")}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[2.5rem]">
                                    {product.description || (a.no_description ?? "No description")}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-orange-600">
                                        {formatRupiah(product.price)}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title={a.edit ?? "Edit"}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product)
                                            }
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title={a.delete ?? "Delete"}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination links={products.links} />

                {productListData.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">
                            {a.no_products ?? "No products found"}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingProduct
                                    ? (a.edit_product ?? "Edit Product")
                                    : (a.add_new_product ?? "Add New Product")}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {a.product_name ?? "Product Name *"}
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
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
                                    {a.category ?? "Category *"}
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData("category_id", e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                    required
                                >
                                    <option value="">{a.select_category ?? "Select a category"}</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {a.price_label ?? "Price *"}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.price}
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
                                    rows="3"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {a.product_image ?? "Product Image"}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData("image", e.target.files[0])
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                />
                                {errors.image && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            {/* Variations Section */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {a.variations ?? "Variations (e.g. Sizes)"}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData("variations", [
                                                ...data.variations,
                                                { name: "", price: "" },
                                            ])
                                        }
                                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        + {a.add_variation ?? "Add Variation"}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.variations.map((variation, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={a.variation_name_placeholder ?? "Name (e.g. Small)"}
                                                value={variation.name}
                                                onChange={(e) => {
                                                    const newVariations = [
                                                        ...data.variations,
                                                    ];
                                                    newVariations[index].name =
                                                        e.target.value;
                                                    setData(
                                                        "variations",
                                                        newVariations,
                                                    );
                                                }}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder={a.variation_price_placeholder ?? "Price"}
                                                value={variation.price}
                                                onChange={(e) => {
                                                    const newVariations = [
                                                        ...data.variations,
                                                    ];
                                                    newVariations[index].price =
                                                        e.target.value;
                                                    setData(
                                                        "variations",
                                                        newVariations,
                                                    );
                                                }}
                                                className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newVariations =
                                                        data.variations.filter(
                                                            (_, i) =>
                                                                i !== index,
                                                        );
                                                    setData(
                                                        "variations",
                                                        newVariations,
                                                    );
                                                }}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Options Section */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {a.extra_options ?? "Extra Options (e.g. Toppings)"}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData("options", [
                                                ...data.options,
                                                { name: "", price: "" },
                                            ])
                                        }
                                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        + {a.add_option ?? "Add Option"}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.options?.map((option, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={a.option_name_placeholder ?? "Name (e.g. Cheese)"}
                                                value={option.name}
                                                onChange={(e) => {
                                                    const newOptions = [
                                                        ...(data.options || []),
                                                    ];
                                                    newOptions[index].name =
                                                        e.target.value;
                                                    setData(
                                                        "options",
                                                        newOptions,
                                                    );
                                                }}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder={a.option_price_placeholder ?? "Price"}
                                                value={option.price}
                                                onChange={(e) => {
                                                    const newOptions = [
                                                        ...data.options,
                                                    ];
                                                    newOptions[index].price =
                                                        e.target.value;
                                                    setData(
                                                        "options",
                                                        newOptions,
                                                    );
                                                }}
                                                className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newOptions =
                                                        data.options.filter(
                                                            (_, i) =>
                                                                i !== index,
                                                        );
                                                    setData(
                                                        "options",
                                                        newOptions,
                                                    );
                                                }}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {processing
                                        ? (a.saving ?? "Saving...")
                                        : editingProduct
                                          ? (a.update_product ?? "Update Product")
                                          : (a.add_product_btn ?? "Add Product")}
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
