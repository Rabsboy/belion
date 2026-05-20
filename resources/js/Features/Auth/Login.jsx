import React, { useState } from "react";
import { useForm, Head, Link, usePage } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ArrowRight,
    ShoppingBag,
    Home,
} from "lucide-react";

export default function Login({ fromCheckout }) {
    const { translations } = usePage().props;
    const { auth: t, messages: m } = translations;
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            <Head title={t.login} />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4 relative">
                <Link
                    href="/"
                    className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl text-gray-700 font-semibold hover:bg-white hover:text-primary-600 transition-all shadow-sm group"
                >
                    <Home
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                    />
                    {t.back_to_home}
                </Link>

                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100">
                    <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <ShoppingBag className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">
                            {t.welcome_back}
                        </h2>
                        <p className="text-orange-100 text-sm">
                            {t.sign_in_to_continue}
                        </p>
                    </div>

                    {fromCheckout && (
                        <div className="mx-8 mt-6 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 font-medium text-center">
                            {t.please_sign_in}
                        </div>
                    )}

                    <div className="p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    {t.email}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                                            errors.email
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200"
                                        } rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none`}
                                        placeholder={t.email_placeholder}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 ml-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    {t.password}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className={`block w-full pl-11 pr-12 py-3 bg-gray-50 border ${
                                            errors.password
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200"
                                        } rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none`}
                                        placeholder={t.password_placeholder}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500 ml-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                    />
                                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                                        {t.remember_me}
                                    </span>
                                </label>
                                <a
                                    href="/forgot-password"
                                    className="text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    {t.forgot}
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {processing ? t.signing_in : t.sign_in}
                                <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            {t.dont_have_account}{" "}
                            <a
                                href={route("register")}
                                className="text-orange-600 hover:text-orange-700 font-semibold"
                            >
                                {t.create_one}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
