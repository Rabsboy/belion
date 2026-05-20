import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head } from "@inertiajs/react";
import { Users, Target, Award, Heart, Clock, MapPin } from "lucide-react";

export default function About() {
    const values = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Quality First",
            description:
                "We source the freshest ingredients and prepare every meal with care and attention to detail.",
            gradient: "from-red-500 to-pink-500",
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Fast Delivery",
            description:
                "Your time matters. We ensure quick preparation and prompt delivery to your doorstep.",
            gradient: "from-primary-500 to-orange-500",
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Customer Focused",
            description:
                "Your satisfaction is our priority. We listen, adapt, and continuously improve our service.",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Excellence",
            description:
                "We strive for perfection in every dish, every delivery, and every customer interaction.",
            gradient: "from-purple-500 to-indigo-500",
        },
    ];

    return (
        <PublicLayout>
            <Head title="About Us" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-50 via-white to-orange-50 py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary-300 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200 rounded-full blur-3xl"
                        style={{ animationDelay: "1s" }}
                    />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-4 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mb-6">
                        Our Story
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                        Delivering Happiness,
                        <br />
                        <span className="text-primary-600">
                            One Meal at a Time
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        We're passionate about bringing delicious,
                        freshly-prepared meals straight to your door. Our
                        mission is simple: make quality food accessible,
                        convenient, and delightful for everyone.
                    </p>
                </div>
            </section>

            {/* Our Values */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What We Stand For
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our core values guide everything we do, from sourcing
                        ingredients to delivering your order.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                        >
                            <div
                                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.gradient} text-white mb-4 group-hover:scale-110 transition-transform`}
                            >
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Story */}
            <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                From Kitchen to Your Home
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Founded with a vision to revolutionize home food
                                delivery, Bellion Bake & Brew started as a small kitchen
                                with big dreams. Today, we serve thousands of
                                happy customers across the city.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Every dish is prepared by our experienced chefs
                                using fresh, locally-sourced ingredients. We
                                believe that great food should be accessible to
                                everyone, delivered fast and fresh.
                            </p>
                            <div className="flex flex-wrap gap-8 pt-4">
                                <div>
                                    <p className="text-4xl font-bold text-primary-600">
                                        5000+
                                    </p>
                                    <p className="text-gray-600 font-medium">
                                        Happy Customers
                                    </p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-primary-600">
                                        50+
                                    </p>
                                    <p className="text-gray-600 font-medium">
                                        Menu Items
                                    </p>
                                </div>
                                <div>
                                    <p className="text-4xl font-bold text-primary-600">
                                        30min
                                    </p>
                                    <p className="text-gray-600 font-medium">
                                        Avg Delivery
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-100 to-orange-100 flex items-center justify-center text-8xl">
                                🍽️
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 lg:p-12 space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Visit Us
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Address
                                        </p>
                                        <p className="text-gray-600">
                                            <a href="https://maps.app.goo.gl/D1oe2cKiaTCZPjWG8">
                                                Jl. Cililitan Besar No.1, RT.1/RW.3, Cililitan, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13640   
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Hours
                                        </p>
                                        <p className="text-gray-600">
                                            Daily: 9:00 AM - 10:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 h-64 lg:h-auto flex items-center justify-center text-gray-400">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3999.006664274649!2d90.38042105834032!3d23.886391165031956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c4740ff3528d%3A0x866161a44b3e8e3e!2sBamnartek%20Rd%2C%20Dhaka%201230!5e0!3m2!1sen!2sbd!4v1769092094956!5m2!1sen!2sbd"
                                width="600"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
