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
        stock: 0,
        is_active: true,
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
                stock: product.stock ?? 0,
                is_active: product.is_active ?? true,
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
        formData.append("stock", data.stock ?? 0);
        formData.append("is_active", data.is_active ? "1" : "0");
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

            <div className="p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                            {a.products_management ?? "Products Management"}
                        </h1>
                        <p className="text-xs md:text-base text-gray-600 mt-0.5 md:mt-1">
                            {(a.total_products ?? "total products").replace(":count", products.total)}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all w-full md:w-auto justify-center"
                    >
                        <Plus size={18} />
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
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                    {productListData.map((product) => {
                        const outOfStock = product.stock === 0;
                        const notActive = !product.is_active;
                        const isDisabled = outOfStock || notActive;

                        return (
                        <div
                            key={product.id}
                            className={`bg-white rounded-xl md:rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow ${
                                isDisabled ? "border-gray-200 opacity-75" : "border-gray-100"
                            }`}
                        >
                            <div className="aspect-[4/3] bg-gray-100 relative">
                                {product.images_name ? (
                                    <img
                                        src={`/${product.images_name}`}
                                        alt={product.name}
                                        className={`w-full h-full object-cover ${isDisabled ? "brightness-50" : ""}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl">
                                        🍽️
                                    </div>
                                )}
                                <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold text-gray-700">
                                    {product.category?.name || (a.uncategorized ?? "Uncategorized")}
                                </span>
                                {notActive && (
                                    <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold">
                                        {a.inactive ?? "Inactive"}
                                    </span>
                                )}
                                {outOfStock && (
                                    <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-gray-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold">
                                        {a.out_of_stock ?? "Out of Stock"}
                                    </span>
                                )}
                            </div>
                            <div className="p-2.5 md:p-4">
                                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="hidden md:line-clamp-2 text-sm text-gray-500 mb-2 min-h-[2.5rem]">
                                    {product.description || (a.no_description ?? "No description")}
                                </p>
                                <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                                    <span className={`text-[10px] md:text-xs font-semibold px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full ${
                                        product.stock > 0
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {product.stock > 0
                                            ? (a.stock_label ?? "Stock").replace(":count", product.stock)
                                            : (a.out_of_stock_label ?? "Stok Habis")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm md:text-xl font-bold text-orange-600">
                                        {formatRupiah(product.price)}
                                    </span>
                                    <div className="flex gap-1 md:gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(
                                                    route("admin.products.toggle-active", product.id),
                                                )
                                            }
                                            className={`p-1 md:p-2 rounded-lg transition ${
                                                product.is_active
                                                    ? "text-green-600 hover:bg-green-50"
                                                    : "text-gray-400 hover:bg-gray-100"
                                            }`}
                                            title={product.is_active ? (a.deactivate ?? "Deactivate") : (a.activate ?? "Activate")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-[18px] md:h-[18px]">
                                                <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
                                                <circle cx={product.is_active ? "15" : "9"} cy="12" r="3"/>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => openModal(product)}
                                            className="p-1 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title={a.edit ?? "Edit"}
                                        >
                                            <Edit size={16} className="md:w-[18px] md:h-[18px]" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product)
                                            }
                                            className="p-1 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title={a.delete ?? "Delete"}
                                        >
                                            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        );
                    })}
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
                <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
                    <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
                            <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                                {editingProduct
                                    ? (a.edit_product ?? "Edit Product")
                                    : (a.add_new_product ?? "Add New Product")}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-5">
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
                                    {a.stock ?? "Stock"}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData("stock", parseInt(e.target.value) || 0)
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                />
                                {errors.stock && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {a.is_active ?? "Active"}
                                    </label>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {data.is_active
                                            ? (a.product_active_desc ?? "Product is visible and can be purchased")
                                            : (a.product_inactive_desc ?? "Product is hidden and cannot be purchased")}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData("is_active", !data.is_active)
                                    }
                                    className={`relative w-14 h-7 rounded-full transition-colors ${
                                        data.is_active
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                                            data.is_active
                                                ? "translate-x-7"
                                                : "translate-x-0"
                                        }`}
                                    />
                                </button>
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
