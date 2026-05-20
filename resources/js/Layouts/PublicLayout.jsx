import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";

export default function PublicLayout({ children }) {
    const { flash, errors } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: "success", message: flash.success });
        } else if (flash?.error) {
            setToast({ type: "error", message: flash.error });
        } else if (errors?.error) {
            setToast({ type: "error", message: errors.error });
        }
    }, [flash, errors]);

    return (
        <div className="w-full min-h-screen bg-gray-50 font-sans text-gray-900 antialiased flex flex-col">
            <Navbar />
            <main className="pt-20 flex-grow">{children}</main>
            <Footer />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
