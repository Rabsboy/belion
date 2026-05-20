import { formatRupiah } from "@/Utils/currency";
import { ShoppingCart, Trash2, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function CartSummary({ onClose }) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        loadCartItems();
    }, []);

    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    const loadCartItems = () => {
        const items = JSON.parse(localStorage.getItem("cart_items") || "[]");
        setCartItems(items);
    };

    const removeItem = (index) => {
        const items = [...cartItems];
        items.splice(index, 1);
        localStorage.setItem("cart_items", JSON.stringify(items));
        setCartItems(items);
        window.dispatchEvent(new Event("cartUpdated")); // Update Navbar count
    };

    const clearCart = () => {
        if (confirm("Clear all items from cart?")) {
            localStorage.removeItem("cart_items");
            setCartItems([]);
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };

    const updateQuantity = (index, change) => {
        const items = [...cartItems];
        const newQuantity = items[index].quantity + change;

        if (newQuantity >= 1 && newQuantity <= 10) {
            items[index].quantity = newQuantity;
            localStorage.setItem("cart_items", JSON.stringify(items));
            setCartItems(items);
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };

    const { delivery_fee } = usePage().props;
    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0,
    );
    const total =
        subtotal + (cartItems.length > 0 ? parseFloat(delivery_fee) : 0);

    const handleCheckout = () => {
        window.location.href = route("checkout.index");
    };

    return (
        <div className="h-screen fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                            <ShoppingCart size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Cart
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length > 0 ? (
                        <div className="space-y-4">
                            {cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary-100 transition-colors"
                                >
                                    <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                        {item.images_name ? (
                                            <img
                                                src={`/${item.images_name}`}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-300">
                                                <ShoppingCart size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {item.name}
                                        </h3>
                                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                            {item.selectedVariation && (
                                                <p>
                                                    Size:{" "}
                                                    {
                                                        item.selectedVariation
                                                            .name
                                                    }
                                                </p>
                                            )}
                                            {item.selectedOptions?.length >
                                                0 && (
                                                <p>
                                                    Extras:{" "}
                                                    {item.selectedOptions
                                                        .map(
                                                            (o) =>
                                                                `${
                                                                    o.quantity >
                                                                    1
                                                                        ? `${o.quantity}x `
                                                                        : ""
                                                                }${o.name}`,
                                                        )
                                                        .join(", ")}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Unit Price: {formatRupiah(item.price)}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            index,
                                                            -1,
                                                        )
                                                    }
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-semibold text-gray-900 w-4 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(index, 1)
                                                    }
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                                                    disabled={
                                                        item.quantity >= 10
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="font-bold text-primary-600">
                                            {formatRupiah(
                                                parseFloat(item.price) *
                                                item.quantity
                                            )}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition h-max self-center"
                                        title="Remove Item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={clearCart}
                                className="text-sm text-red-500 hover:text-red-700 hover:underline font-medium"
                            >
                                Clear All Items
                            </button>

                            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-800 mt-2">
                                <span className="font-semibold">Note:</span>{" "}
                                Maximum 10 items allowed per product. For bulk
                                orders, please contact us by phone.
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <ShoppingCart size={40} />
                            </div>
                            <p className="text-gray-900 font-semibold text-lg">
                                Your cart is empty
                            </p>
                            <p className="text-gray-500 mt-1">
                                Looks like you haven't added anything yet.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-6 text-primary-600 font-bold hover:underline"
                            >
                                Browse Menu
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer - Summary & Checkout */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50/50 rounded-b-2xl">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium">
                                    {formatRupiah(subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span className="font-medium">
                                    {formatRupiah(delivery_fee)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-primary-600">
                                    {formatRupiah(total)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] hover:from-primary-700 hover:to-primary-600 transition-all duration-200"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
