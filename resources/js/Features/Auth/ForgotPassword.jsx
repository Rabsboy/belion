import React from "react";
import { useForm, Head } from "@inertiajs/react";
import { Mail, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <ShoppingBag className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">Forgot Password?</h2>
                        <p className="text-orange-100 text-sm">No worries, we'll send you reset instructions</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {status && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <p className="text-sm text-green-700">{status}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Email address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                                            errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
                                        } rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none`}
                                        placeholder="you@example.com"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-500 ml-1">{errors.email}</p>}
                                <p className="text-xs text-gray-500 ml-1 mt-2">
                                    We'll send a password reset link to this email
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {processing ? "Sending..." : "Send Reset Link"}
                                <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <a 
                                href={route('login')} 
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back to login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
