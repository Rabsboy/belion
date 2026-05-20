import React, { useState } from "react";
import { useForm, Head, Link, usePage } from "@inertiajs/react";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    ArrowRight,
    ShoppingBag,
    Phone as PhoneIcon,
    Home,
} from "lucide-react";
import { isValidPhone } from "@/Utils/validation";

export default function Register() {
    const { translations } = usePage().props;
    const { auth: t } = translations;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const [localErrors, setLocalErrors] = useState({});

    const validatePassword = (password) => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    };

    const requirements = validatePassword(data.password);
    const isPasswordStrong = Object.values(requirements).every(Boolean);

    const submit = (e) => {
        e.preventDefault();

        if (!isPasswordStrong) {
            setLocalErrors({
                password: t.password_requirements_note,
            });
            return;
        }

        if (!isValidPhone(data.phone)) {
            setLocalErrors({
                phone: t.phone_validation_error,
            });
            return;
        }

        setLocalErrors({});
        post(route("register"));
    };

    return (
        <>
            <Head title={t.register} />
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
                            {t.create_account}
                        </h2>
                        <p className="text-orange-100 text-sm">
                            {t.join_in_seconds}
                        </p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    {t.full_name}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                                            errors.name
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200"
                                        } rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none`}
                                        placeholder={t.name_placeholder}
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-red-500 ml-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

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
                                    {t.phone}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                );
                                            if (value.length <= 13)
                                                setData("phone", value);
                                        }}
                                        className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                                            errors.phone
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200"
                                        } rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none`}
                                        placeholder={t.phone_placeholder}
                                        required
                                    />
                                </div>
                                {errors.phone || localErrors.phone ? (
                                    <p className="text-sm text-red-500 ml-1">
                                        {errors.phone || localErrors.phone}
                                    </p>
                                ) : null}
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
                                        placeholder={t.password_min}
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

                                <div className="mt-3 grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <RequirementItem
                                        label={t.password_min}
                                        met={requirements.length}
                                    />
                                    <RequirementItem
                                        label={t.password_uppercase}
                                        met={requirements.uppercase}
                                    />
                                    <RequirementItem
                                        label={t.password_lowercase}
                                        met={requirements.lowercase}
                                    />
                                    <RequirementItem
                                        label={t.password_special}
                                        met={requirements.special}
                                    />
                                </div>

                                {(errors.password || localErrors.password) && (
                                    <p className="text-sm text-red-500 ml-1">
                                        {errors.password ||
                                            localErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    {t.confirm_password}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        className={`block w-full pl-11 pr-12 py-3 bg-gray-50 border ${
                                            errors.password_confirmation
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200"
                                        } rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none`}
                                        placeholder={t.confirm_password_placeholder}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-500 ml-1">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {processing ? t.creating : t.create_account}
                                <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            {t.already_have_account}{" "}
                            <a
                                href={route("login")}
                                className="text-orange-600 hover:text-orange-700 font-semibold"
                            >
                                {t.sign_in_link}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function RequirementItem({ label, met }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`w-1.5 h-1.5 rounded-full ${met ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span
                className={`text-[10px] font-medium transition-colors ${met ? "text-green-600" : "text-gray-400"}`}
            >
                {label}
            </span>
        </div>
    );
}
