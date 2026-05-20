import React, { useState } from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Lock,
    Eye,
    EyeOff,
    Save,
    Key,
} from "lucide-react";

export default function Profile() {
    const { auth, flash, translations } = usePage().props;
    const { messages: m, auth: t } = translations;
    const user = auth.user;
    const [editMode, setEditMode] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile form
    const {
        data: profileData,
        setData: setProfileData,
        put: updateProfile,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
    });

    // Password form
    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        router.put(route("customer.profile.update"), profileData, {
            onSuccess: () => {
                setEditMode(false);
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        router.put(route("customer.profile.password"), passwordData, {
            onSuccess: () => {
                resetPassword();
                setShowPasswordSection(false);
            },
        });
    };

    const validatePassword = (password) => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    };

    const requirements = validatePassword(passwordData.password);

    return (
        <CustomerLayout>
            <Head title={m['customer.my_profile']} />

            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {m['customer.my_profile']}
                    </h1>
                    {!editMode && !showPasswordSection && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition"
                        >
                            {m['customer.edit_profile']}
                        </button>
                    )}
                </div>

                <div className="w-full">
                    {/* Profile Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-center">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 text-white font-bold text-4xl">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                {user.name}
                            </h2>
                            <p className="text-orange-100 mt-1">
                                {m['customer.account_type']}
                            </p>
                        </div>

                        {/* Profile Form */}
                        <form
                            onSubmit={handleProfileSubmit}
                            className="p-8 space-y-6"
                        >
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg text-orange-600">
                                    <User size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 font-medium mb-1">
                                        {m['customer.full_name']}
                                    </p>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) =>
                                                setProfileData(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                            required
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-semibold">
                                            {user.name}
                                        </p>
                                    )}
                                    {profileErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {profileErrors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg text-orange-600">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 font-medium mb-1">
                                        {m['customer.email_address']}
                                    </p>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) =>
                                                setProfileData(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                            required
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-semibold">
                                            {user.email}
                                        </p>
                                    )}
                                    {profileErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {profileErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg text-orange-600">
                                    <Phone size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 font-medium mb-1">
                                        {m['customer.phone_number']}
                                    </p>
                                    {editMode ? (
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    );
                                                if (value.length <= 11)
                                                    setProfileData(
                                                        "phone",
                                                        value,
                                                    );
                                            }}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                            placeholder={t.phone_placeholder}
                                            required
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-semibold">
                                            {user.phone || m['customer.not_provided']}
                                        </p>
                                    )}
                                    {profileErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {profileErrors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg text-orange-600">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {m['customer.member_since']}
                                    </p>
                                    <p className="text-gray-900 font-semibold">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {editMode && (
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={profileProcessing}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                    >
                                        <Save size={20} />
                                        {profileProcessing
                                            ? m['customer.saving']
                                            : m['customer.save_changes']}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            setProfileData({
                                                name: user.name,
                                                email: user.email,
                                                phone: user.phone || "",
                                            });
                                        }}
                                        className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
                                    >
                                        {m['customer.cancel']}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <button
                                onClick={() =>
                                    setShowPasswordSection(!showPasswordSection)
                                }
                                className="flex items-center justify-between w-full text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                        <Key size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {m['customer.change_password']}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {m['customer.update_password_desc']}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-gray-400">
                                    {showPasswordSection ? "−" : "+"}
                                </span>
                            </button>
                        </div>

                        {showPasswordSection && (
                            <form
                                onSubmit={handlePasswordSubmit}
                                className="p-6 space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {m['customer.current_password']}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                passwordData.current_password
                                            }
                                            onChange={(e) =>
                                                setPasswordData(
                                                    "current_password",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    !showCurrentPassword,
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                    {passwordErrors.current_password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {passwordErrors.current_password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {m['customer.new_password']}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={passwordData.password}
                                            onChange={(e) =>
                                                setPasswordData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword,
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Requirements */}
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
                                    {passwordErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {passwordErrors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {m['customer.confirm_new_password']}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                passwordData.password_confirmation
                                            }
                                            onChange={(e) =>
                                                setPasswordData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={passwordProcessing}
                                        className="w-max p-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                    >
                                        {passwordProcessing
                                            ? m['customer.updating']
                                            : m['customer.update_password']}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordSection(false);
                                            resetPassword();
                                        }}
                                        className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
                                    >
                                        {m['customer.cancel']}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
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
