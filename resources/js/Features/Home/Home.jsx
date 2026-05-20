import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    ArrowRight,
    MapPin,
    Clock,
    CheckCircle,
    Sparkles,
    Zap,
    Heart,
    Star,
} from "lucide-react";

const features = (m) => [
    {
        icon: <Zap className="w-8 h-8" />,
        title: m['home.feature_1_title'],
        description: m['home.feature_1_desc'],
        gradient: "from-warning-500 to-primary-500",
    },
    {
        icon: <Heart className="w-8 h-8" />,
        title: m['home.feature_2_title'],
        description: m['home.feature_2_desc'],
        gradient: "from-red-500 to-pink-500",
    },
    {
        icon: <Star className="w-8 h-8" />,
        title: m['home.feature_3_title'],
        description: m['home.feature_3_desc'],
        gradient: "from-purple-500 to-indigo-500",
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: m['home.feature_4_title'],
        description: m['home.feature_4_desc'],
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: <CheckCircle className="w-8 h-8" />,
        title: m['home.feature_5_title'],
        description: m['home.feature_5_desc'],
        gradient: "from-green-500 to-emerald-500",
    },
    {
        icon: <MapPin className="w-8 h-8" />,
        title: m['home.feature_6_title'],
        description: m['home.feature_6_desc'],
        gradient: "from-primary-500 to-rose-500",
    },
];

export default function Home() {
    const { translations } = usePage().props;
    const { messages: m } = translations;
    const featureList = features(m);

    return (
        <PublicLayout>
            <Head title="Bellion Bake and Brew" />

            <main className="w-full min-h-screen bg-white">
                <section className="relative overflow-hidden min-h-screen flex items-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-rose-50">
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                            <div
                                className="absolute top-40 right-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl"
                                style={{ animationDelay: "0.7s" }}
                            />
                            <div
                                className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl"
                                style={{ animationDelay: "1s" }}
                            />
                        </div>
                    </div>

                    <div
                        className="absolute top-1/4 right-1/4 text-6xl animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                    >
                        ☕
                    </div>
                    <div
                        className="absolute bottom-1/3 left-1/4 text-5xl animate-bounce"
                        style={{ animationDelay: "0.7s" }}
                    >
                        🥖
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border border-primary-100 mb-8">
                                <Sparkles className="w-4 h-4 text-primary-600" />
                                <span className="text-sm font-semibold text-gray-700">
                                    {m['home.hero_badge']}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
                                {m['home.hero_title_1']}
                                <br />
                                <span className="text-primary-600">
                                    {m['home.hero_title_2']}
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                                {m['home.hero_subtitle']}
                            </p>

                            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => router.visit("/menu")}
                                    className="group bg-gradient-to-r from-primary-600 to-primary-500 text-white px-10 py-5 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-xl"
                                >
                                    {m['home.order_now']}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-700">
                                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
                                    <Clock className="w-5 h-5 text-primary-600" />
                                    <span className="font-semibold">
                                        {m['home.operating_hours']}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
                                    <MapPin className="w-5 h-5 text-primary-600" />
                                    <span
                                        onClick={() =>
                                            (window.location.href =
                                                "https://maps.app.goo.gl/D1oe2cKiaTCZPjWG8")
                                        }
                                        className="font-semibold cursor-pointer"
                                    >
                                        Bellion Bake & Brew Location
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                {m['home.why_title']}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                {m['home.why_subtitle']}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featureList.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                                >
                                    <div
                                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-20 left-10 text-8xl">
                            🍽️
                        </div>
                        <div className="absolute bottom-20 right-10 text-8xl">
                            ✨
                        </div>
                    </div>

                    <div className="relative max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {m['home.cta_title_1']}
                            <br />
                            <span className="text-primary-600">
                                {m['home.cta_title_2']}
                            </span>
                        </h2>

                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                            {m['home.cta_subtitle']}
                        </p>

                        <button
                            onClick={() => router.visit("/menu")}
                            className="group bg-gradient-to-r from-primary-600 to-primary-500 text-white px-12 py-6 rounded-2xl font-bold text-xl inline-flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-xl"
                        >
                            {m['home.cta_button']}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-8 text-gray-500 text-sm">
                            {m['home.cta_note']}
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}
