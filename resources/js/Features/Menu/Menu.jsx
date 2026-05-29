import { formatRupiah } from "@/Utils/currency";
import React, { useState, useEffect, useCallback } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Plus,
    Sparkles,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Toast from "@/Components/Toast";
import Pagination from "@/Components/Pagination";
import debounce from "lodash/debounce";

export default function Menu({ categories, products, filters }) {
    const { translations, store_open } = usePage().props;
    const { messages: m } = translations;
    const storeIsOpen = store_open !== false && store_open !== "0";
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [toast, setToast] = useState(null);
    const [customizingProduct, setCustomizingProduct] = useState(null);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]); // Array of { ...option, quantity: 1 }
    const [productQuantity, setProductQuantity] = useState(1);

    // Filter products by category and search (Server-side now)
    let productListData = products.data || [];
    // Sort: active products (stock > 0 and is_active) first, inactive to bottom
    productListData = [...productListData].sort((a, b) => {
        const aActive = a.is_active && a.stock > 0 ? 1 : 0;
        const bActive = b.is_active && b.stock > 0 ? 1 : 0;
        return bActive - aActive;
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route("menu"),
                { search: query, category: "all" },
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

    const handleCategoryChange = (categoryId) => {
        router.get(
            route("menu"),
            { category: categoryId, search: searchQuery },
            { preserveState: true },
        );
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    const openCustomization = (product) => {
        // If no variations/options, add to cart immediately
        if (!product.variations?.length && !product.options?.length) {
            addToCart(product, null, []);
            return;
        }

        setCustomizingProduct(product);
        // Auto-select first variation if exists
        if (product.variations?.length > 0) {
            setSelectedVariation(product.variations[0]);
        } else {
            setSelectedVariation(null);
        }
        setSelectedOptions([]);
        setProductQuantity(1);
    };

    const closeCustomization = () => {
        setCustomizingProduct(null);
        setSelectedVariation(null);
        setSelectedOptions([]);
        setProductQuantity(1);
    };

    const updateOptionQuantity = (option, change) => {
        const existing = selectedOptions.find((o) => o.name === option.name);

        if (existing) {
            const newQuantity = existing.quantity + change;

            //Quantity cant be more than 10 for paid options
            if (Number(option.price) > 0 && newQuantity > 10) {
                return;
            }

            if (newQuantity == 0) {
                // will be removed if zero (also covers cant be negative)
                setSelectedOptions(
                    selectedOptions.filter((o) => o.name !== option.name),
                );
            } else {
                // Update quantity
                setSelectedOptions(
                    selectedOptions.map((o) =>
                        o.name === option.name
                            ? { ...o, quantity: newQuantity }
                            : o,
                    ),
                );
            }
        } else if (change > 0) {
            //if price is zero (or not exist) then default quantity 1
            setSelectedOptions([
                ...selectedOptions,
                { ...option, quantity: 1 },
            ]);
        }
    };

    const confirmAddToCart = () => {
        if (!customizingProduct) return;

        if (customizingProduct.variations?.length > 0 && !selectedVariation) {
            alert(m['menu.select_variation_alert']);
            return;
        }

        addToCart(
            customizingProduct,
            selectedVariation,
            selectedOptions,
            productQuantity,
        );
        closeCustomization();
    };

    const addToCart = (
        product,
        variation = null,
        options = [],
        quantity = 1,
    ) => {
        const currentCart = JSON.parse(
            localStorage.getItem("cart_items") || "[]",
        );

        // Create a unique ID for cart item based on product + variation + options
        const cartItemId = `${product.id}-${
            variation ? variation.name : "base"
        }-${options
            .map((o) => `${o.name}x${o.quantity}`)
            .sort()
            .join("-")}`;

        const existingItemIndex = currentCart.findIndex(
            (item) => item.cartItemId === cartItemId,
        );

        const price = variation
            ? Number(variation.price)
            : Number(product.price);
        const optionsTotal = options.reduce(
            (sum, opt) => sum + Number(opt.price) * opt.quantity,
            0,
        );
        const finalPrice = price + optionsTotal;

        if (existingItemIndex >= 0) {
            if (currentCart[existingItemIndex].quantity + quantity <= 10) {
                currentCart[existingItemIndex].quantity += quantity;
            } else {
                alert(m['menu.max_per_product']);
                return;
            }
        } else {
            // Calculate unit price for *one* item including its extras
            const unitBasePrice = variation
                ? Number(variation.price)
                : Number(product.price);
            const unitOptionsPrice = options.reduce(
                (sum, opt) => sum + Number(opt.price) * opt.quantity,
                0,
            );
            const unitTotalPrice = unitBasePrice + unitOptionsPrice;

            currentCart.push({
                ...product,
                cartItemId,
                name: product.name + (variation ? ` (${variation.name})` : ""),
                original_price: product.price,
                price: unitTotalPrice, // Unit price including extras
                quantity: quantity,
                selectedVariation: variation,
                selectedOptions: options,
            });
        }

        localStorage.setItem("cart_items", JSON.stringify(currentCart));
        window.dispatchEvent(new Event("cartUpdated"));
        setToast({
            message: m['menu.added_to_cart'].replace(':product', product.name),
            type: "success",
        });
    };

    const displayPrice = (product) => {
        if (product?.variations && product.variations.length > 0) {
            const prices = product.variations
                .filter((v) => v.is_available !== false)
                .map((v) => Number(v.price));

            if (prices.length > 0) {
                return m['menu.from_price'].replace(':price', formatRupiah(Math.min(...prices)));
            }
        }

        return formatRupiah(Number(product.price || 0));
    };

    return (
        <PublicLayout>
            <Head title={m['menu.title']} />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-white to-amber-50 py-8 md:py-16">
                <div className="absolute inset-0 opacity-60 pointer-events-none">
                    <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-200 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-amber-200 blur-3xl" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
                    <div className="space-y-2 md:space-y-4">
                        <p className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white shadow-sm text-orange-600 text-[11px] md:text-sm font-semibold w-fit">
                            {m['menu.hero_tagline']}
                        </p>
                        <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                            {m['menu.hero_title']}
                        </h1>
                        <p className="text-sm md:text-lg text-gray-600 max-w-2xl">
                            {m['menu.hero_subtitle']}
                        </p>
                    </div>
                    <div className="rounded-2xl md:rounded-3xl bg-white/80 backdrop-blur border border-orange-100 shadow-lg p-4 md:p-6 flex flex-col gap-3 md:gap-4">
                        <h2 className="text-sm md:text-lg font-semibold text-gray-900">
                            {m['menu.search_title']}
                        </h2>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder={m['menu.search_placeholder']}
                                value={searchQuery}
                                onChange={onSearchChange}
                                className="w-full pl-10 pr-4 py-2 md:py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                            <span className={`h-2 w-2 rounded-full ${storeIsOpen ? 'bg-green-500' : 'bg-red-400'}`} />
                            {storeIsOpen ? m['menu.live_status'] : m['menu.live_status_closed']}
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="max-w-6xl mx-auto px-4 md:px-8 pb-4 md:pb-6">
                <div className="sticky top-20 z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-2 md:py-3 backdrop-blur bg-white/70 border-b border-orange-100">
                    <p className="text-xs md:text-sm font-semibold text-orange-600">
                        {m['menu.browse_by_category']}
                    </p>
                </div>
                <div className="w-full py-2 md:py-4">
                    <div className="relative w-full">
                        <div className="flex flex-row gap-1.5 md:gap-2 overflow-x-auto no-scrollbar whitespace-nowrap py-1 md:py-2 px-1">
                            <button
                                className={`rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm flex-shrink-0 font-medium transition-all duration-200 ${
                                    filters.category === "all" ||
                                    !filters.category
                                        ? "bg-orange-600 text-white shadow-md border border-orange-500"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() => handleCategoryChange("all")}
                            >
                                {m['menu.all_items']}
                            </button>
                            {categories?.map((category) => (
                                <button
                                    className={`rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm flex-shrink-0 font-medium transition-all duration-200 ${
                                        filters.category == category.id
                                            ? "bg-orange-600 text-white shadow-md border border-orange-500"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                    key={category.id}
                                    onClick={() =>
                                        handleCategoryChange(category.id)
                                    }
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                        {/* Gradient fade indicators */}
                        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </section>

            {/* Store Closed Banner */}
            {!storeIsOpen && (
                <section className="max-w-6xl mx-auto px-4 md:px-8 pb-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        <div>
                            <p className="text-sm md:text-base font-bold text-red-700">
                                {m['menu.store_closed_title'] ?? "Toko Sedang Tutup"}
                            </p>
                            <p className="text-xs md:text-sm text-red-600">
                                {m['menu.store_closed_desc'] ?? "Maaf, toko sedang tutup. Anda masih bisa melihat menu, tetapi tidak dapat melakukan pemesanan untuk saat ini."}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Products Grid */}
            <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
                <div className="flex items-center justify-between mb-3 md:mb-6">
                    <div>
                            <p className="text-[11px] md:text-sm font-semibold text-orange-600 flex items-center gap-1 md:gap-2">
                                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                                {m['menu.chef_picks']}
                            </p>
                            <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                                {m['menu.highlights']}
                            </h2>
                    </div>
                    {productListData.length > 0 && (
                        <span className="text-[10px] md:text-sm text-gray-500">
                            {m['menu.showing'].replace(':from', products.from).replace(':to', products.to).replace(':total', products.total)}
                        </span>
                    )}
                </div>

                    {productListData.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {productListData.map((product) => {
                            const isUnavailable = !product.is_active || product.stock === 0 || !storeIsOpen;

                            return (
                            <div
                                key={product.id}
                                className={`group h-full rounded-xl md:rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col ${
                                    isUnavailable ? "border-gray-200" : "border-orange-100"
                                }`}
                            >
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50">
                                    {product.images_name ? (
                                        <img
                                            src={`/${product.images_name}`}
                                            alt={product.name}
                                            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                                isUnavailable ? "brightness-50" : ""
                                            }`}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://placehold.co/600x400?text=Bellion";
                                            }}
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-6xl">
                                            🍽️
                                        </div>
                                    )}
                                    {isUnavailable && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg text-[10px] md:text-sm font-bold tracking-wide uppercase shadow-lg">
                                                {m['menu.out_of_stock'] ?? "Stok Habis"}
                                            </span>
                                        </div>
                                    )}
                                    {!isUnavailable && (
                                        <div className="absolute left-2 top-2 md:left-3 md:top-3 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white/90 text-[10px] md:text-xs font-semibold text-orange-700 border border-orange-100">
                                            {m['menu.popular_pick']}
                                        </div>
                                    )}
                                </div>

                                <div className={`flex-1 flex flex-col gap-1.5 md:gap-3 p-2.5 md:p-4 ${isUnavailable ? "opacity-60" : ""}`}>
                                    <div className="flex items-start justify-between gap-1 md:gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm md:text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                                                {product.name}
                                            </p>
                                            {product.description && (
                                                <p className="hidden md:line-clamp-2 md:block text-sm text-gray-500 mt-1">
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-[11px] md:text-base font-semibold text-orange-700 whitespace-nowrap">
                                            {displayPrice(product)}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            !isUnavailable && openCustomization(product)
                                        }
                                        disabled={isUnavailable}
                                        className={`mt-auto inline-flex items-center justify-center gap-1 md:gap-2 rounded-lg md:rounded-xl px-2 py-1.5 md:px-4 md:py-2 text-[11px] md:text-sm font-semibold shadow transition-all duration-200 ${
                                            isUnavailable
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:shadow-md"
                                        }`}
                                    >
                                        {isUnavailable
                                            ? (m['menu.out_of_stock'] ?? "Stok Habis")
                                            : (
                                                <>
                                                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="hidden md:inline">{m['menu.add_to_order']}</span>
                                                    <span className="md:hidden">{m['menu.add'] ?? "Tambah"}</span>
                                                </>
                                            )}
                                    </button>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-orange-200 bg-white p-8 text-center text-gray-600">
                        {searchQuery
                            ? m['menu.no_results'].replace(':query', searchQuery)
                            : m['menu.no_products']}
                    </div>
                )}

                {/* Pagination Controls */}
                <Pagination links={products.links} />
            </section>

            {/* Customization Modal */}
            {customizingProduct && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex-1 overflow-y-auto">
                            <div className="relative aspect-[4/3] bg-gray-100 shrink-0">
                                {customizingProduct.images_name ? (
                                    <img
                                        src={`/${customizingProduct.images_name}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                        🍽️
                                    </div>
                                )}
                                <button
                                    onClick={closeCustomization}
                                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {customizingProduct.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    {customizingProduct.description}
                                </p>

                                {/* Variations */}
                                {customizingProduct.variations?.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            {m['menu.select_variation']}
                                        </h4>
                                        <div className="space-y-2">
                                            {customizingProduct.variations.map(
                                                (v, idx) => (
                                                    <label
                                                        key={idx}
                                                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                                            selectedVariation?.name ===
                                                            v.name
                                                                ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                                                                : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="radio"
                                                                name="variation"
                                                                checked={
                                                                    selectedVariation?.name ===
                                                                    v.name
                                                                }
                                                                onChange={() =>
                                                                    setSelectedVariation(
                                                                        v,
                                                                    )
                                                                }
                                                                className="text-orange-600 focus:ring-orange-500"
                                                            />
                                                            <span className="font-medium text-gray-700">
                                                                {v.name}
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold text-gray-900">
                                                            {formatRupiah(v.price)}
                                                        </span>
                                                    </label>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Options */}
                                {customizingProduct.options?.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            {m['menu.add_extras']}
                                        </h4>
                                        <div className="space-y-3">
                                            {customizingProduct.options.map(
                                                (opt, idx) => {
                                                    const selected =
                                                        selectedOptions.find(
                                                            (o) =>
                                                                o.name ===
                                                                opt.name,
                                                        );
                                                    const quantity = selected
                                                        ? selected.quantity
                                                        : 0;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                                                quantity > 0
                                                                    ? "border-orange-500 bg-orange-50"
                                                                    : "border-gray-200"
                                                            }`}
                                                        >
                                                            <div className="flex-1">
                                                                <span className="font-medium text-gray-700 block">
                                                                    {opt.name}
                                                                </span>
                                                                <span className="text-sm font-semibold text-orange-600">
                                                                    +{formatRupiah(opt.price)}
                                                                </span>
                                                            </div>

                                                            {Number(
                                                                opt.price,
                                                            ) === 0 ? (
                                                                <button
                                                                    onClick={() =>
                                                                        updateOptionQuantity(
                                                                            opt,
                                                                            quantity >
                                                                                0
                                                                                ? -1
                                                                                : 1,
                                                                        )
                                                                    }
                                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                                                        quantity >
                                                                        0
                                                                            ? "bg-orange-600 text-white shadow-sm"
                                                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                                    }`}
                                                                >
                                                                    {quantity >
                                                                    0
                                                                        ? "Selected"
                                                                        : "Add"}
                                                                </button>
                                                            ) : (
                                                                <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                                                                    <button
                                                                        onClick={() =>
                                                                            updateOptionQuantity(
                                                                                opt,
                                                                                -1,
                                                                            )
                                                                        }
                                                                        className={`w-8 h-8 flex items-center justify-center rounded-md transition ${
                                                                            quantity ===
                                                                            0
                                                                                ? "text-gray-300 cursor-default"
                                                                                : "text-orange-600 hover:bg-orange-50"
                                                                        }`}
                                                                        disabled={
                                                                            quantity ===
                                                                            0
                                                                        }
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="w-4 text-center font-bold text-gray-900">
                                                                        {
                                                                            quantity
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        onClick={() =>
                                                                            updateOptionQuantity(
                                                                                opt,
                                                                                1,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            quantity >=
                                                                            10
                                                                        }
                                                                        className={`w-8 h-8 flex items-center justify-center rounded-md transition ${
                                                                            quantity >=
                                                                            10
                                                                                ? "text-gray-300 cursor-not-allowed"
                                                                                : "text-orange-600 hover:bg-orange-50"
                                                                        }`}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Main Product Quantity and Total */}
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">
                                        {m['menu.quantity']}
                                    </span>
                                    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                                        <button
                                            onClick={() =>
                                                setProductQuantity(
                                                    Math.max(
                                                        1,
                                                        productQuantity - 1,
                                                    ),
                                                )
                                            }
                                            className="w-10 h-10 flex items-center justify-center rounded-lg text-orange-600 hover:bg-orange-50 transition font-bold text-lg"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-bold text-gray-900 text-lg">
                                            {productQuantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setProductQuantity(
                                                    Math.min(
                                                        10,
                                                        productQuantity + 1,
                                                    ),
                                                )
                                            }
                                            disabled={productQuantity >= 10}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition font-bold text-lg ${
                                                productQuantity >= 10
                                                    ? "text-gray-300 cursor-not-allowed"
                                                    : "text-orange-600 hover:bg-orange-50"
                                            }`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <button
                                onClick={confirmAddToCart}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98]"
                            >
                                {m['menu.add_to_order_btn']} • {formatRupiah(
                                    (() => {
                                        const base = selectedVariation
                                            ? Number(selectedVariation.price)
                                            : Number(customizingProduct.price);
                                        const extras = selectedOptions.reduce(
                                            (sum, o) =>
                                                sum + Number(o.price) * o.quantity,
                                            0,
                                        );
                                        return (base + extras) * productQuantity;
                                    })()
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
