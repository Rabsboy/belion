import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ links }) {
    if (!links || links.length < 3) return null;

    const prev = links[0];
    const next = links[links.length - 1];
    const pages = links.slice(1, -1); // ambil angka saja

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {/* PREVIOUS */}
            <Link
                href={prev.url || "#"}
                preserveScroll
                preserveState
                className={`flex items-center justify-center w-10 h-10 rounded-xl border transition
                    ${
                        prev.url
                            ? "bg-white text-gray-700 hover:border-orange-500 hover:text-orange-600"
                            : "text-gray-300 border-gray-100 pointer-events-none"
                    }`}
            >
                <ChevronLeft className="w-5 h-5" />
            </Link>

            {/* PAGE NUMBERS */}
            {pages.map((page, i) => (
                <Link
                    key={i}
                    href={page.url || "#"}
                    preserveScroll
                    preserveState
                    className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-xl font-semibold transition
                        ${
                            page.active
                                ? "bg-orange-600 text-white border border-orange-500 shadow"
                                : page.url
                                ? "bg-white text-gray-700 border border-gray-200 hover:border-orange-500 hover:text-orange-600"
                                : "text-gray-300 border border-gray-100 pointer-events-none"
                        }`}
                >
                    {page.label}
                </Link>
            ))}

            {/* NEXT */}
            <Link
                href={next.url || "#"}
                preserveScroll
                preserveState
                className={`flex items-center justify-center w-10 h-10 rounded-xl border transition
                    ${
                        next.url
                            ? "bg-white text-gray-700 hover:border-orange-500 hover:text-orange-600"
                            : "text-gray-300 border-gray-100 pointer-events-none"
                    }`}
            >
                <ChevronRight className="w-5 h-5" />
            </Link>
        </div>
    );
}