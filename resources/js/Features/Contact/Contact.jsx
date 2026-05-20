import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head } from "@inertiajs/react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "WhatsApp",
            content: "+62 812-3456-7890",
            gradient: "from-green-500 to-emerald-500",
            link: "https://wa.me/6281234567890",
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email",
            content: "contact@bellionbakery.com",
            gradient: "from-blue-500 to-cyan-500",
            link: "mailto:contact@bellionbakery.com",
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Alamat",
            content:
                "Bellion Bake and Brew, Jl. Cililitan Besar No.1, Jakarta Timur",
            gradient: "from-orange-500 to-red-500",
            link: "https://maps.app.goo.gl/D1oe2cKiaTCZPjWG8",
        },
    ];

    return (
        <PublicLayout>
            <Head title="Kontak Kami" />

            {/* Header */}
            <section className="bg-gradient-to-br from-primary-50 to-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Kontak <span className="text-primary-600">Kami</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Hubungi kami melalui WhatsApp, Email, atau datang langsung
                        ke toko.
                    </p>
                </div>
            </section>

            {/* Contact Info */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {contactInfo.map((info, index) => (
                        <div
                            key={index}
                            onClick={() =>
                                (window.location.href = info.link)
                            }
                            className="cursor-pointer bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div
                                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${info.gradient} text-white mb-4`}
                            >
                                {info.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">
                                {info.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {info.content}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}