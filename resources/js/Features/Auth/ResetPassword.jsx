import React from "react";
import { useForm, Head } from "@inertiajs/react";
import { Lock, ArrowRight, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <>
            <Head title="Reset Password" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <ShoppingBag className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">Reset Password</h2>
                        <p className="text-orange-100 text-sm">Enter your new password below</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    className="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none cursor-not-allowed"
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className={`block w-full pl-11 pr-12 py-3 bg-gray-50 border ${
                                            errors.password ? "border-red-500 bg-red-50" : "border-gray-200"
                                        } rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none`}
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500 ml-1">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        className={`block w-full pl-11 pr-12 py-3 bg-gray-50 border ${
                                            errors.password_confirmation ? "border-red-500 bg-red-50" : "border-gray-200"
                                        } rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none`}
                                        placeholder="Re-enter password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="text-sm text-red-500 ml-1">{errors.password_confirmation}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {processing ? "Resetting..." : "Reset Password"}
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
