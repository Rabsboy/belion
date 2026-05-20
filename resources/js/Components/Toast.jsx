import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, []); // Only run once on mount

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        success: "bg-green-50 border-green-200",
        error: "bg-red-50 border-red-200",
        info: "bg-blue-50 border-blue-200",
    };

    return (
        <div
            className={`fixed top-24 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 ${
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
            } ${bgColors[type]}`}
        >
            {icons[type]}
            <p className="text-sm font-semibold text-gray-800">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
                <X className="w-4 h-4 text-gray-500" />
            </button>
        </div>
    );
};

export default Toast;
