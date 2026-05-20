import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
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
    ShieldCheck,
} from "lucide-react";
import { isValidPhone } from "@/Utils/validation";

export default function Profile() {
    const { auth, flash, translations } = usePage().props;
    const a = translations?.admin ?? {};
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

        if (!isValidPhone(profileData.phone)) {
            if (
                confirm(
                    a.phone_validation ?? "Please enter a valid 10-13 digit phone number.",
                )
            ) {
                return;
            }
            return;
        }

        router.put(route("admin.profile.update"), profileData, {
            onSuccess: () => {
                setEditMode(false);
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        router.put(route("admin.profile.password"), passwordData, {
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
        <AdminLayout>
            <Head title={a.admin_profile ?? "Admin Profile"} />

            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-orange-500 pl-4">
                        {a.admin_profile ?? "Admin Profile"}
                    </h1>
                    {!editMode && !showPasswordSection && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-200 active:scale-95"
                        >
                            {a.edit_profile ?? "Edit Profile"}
                        </button>
                    )}
                </div>

                <div className="w-full max-w-4xl mx-auto space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transform transition-all hover:shadow-md">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <User size={120} className="text-white" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-6 text-white font-bold text-5xl shadow-2xl rotate-3">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-3xl font-bold text-white">
                                    {user.name}
                                </h2>
                                <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-orange-500/20 backdrop-blur-md text-orange-400 text-sm font-bold uppercase tracking-widest border border-orange-500/30">
                                    {a.system_administrator ?? "System Administrator"}
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={handleProfileSubmit}
                            className="p-10 space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        {a.full_name ?? "Full Name"}
                                    </label>
                                    <div
                                        className={`flex items-center gap-4 p-4 rounded-2xl border ${
                                            editMode
                                                ? "bg-white border-orange-200 ring-4 ring-orange-50"
                                                : "bg-gray-50 border-gray-100"
                                        }`}
                                    >
                                        <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm">
                                            <User size={22} />
                                        </div>
                                        <div className="flex-1">
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
                                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-900 font-bold"
                                                    required
                                                />
                                            ) : (
                                                <p className="text-gray-900 font-bold text-lg">
                                                    {user.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {profileErrors.name && (
                                        <p className="text-red-500 text-xs font-bold mt-1 ml-1">
                                            {profileErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        {a.admin_email ?? "Admin Email"}
                                    </label>
                                    <div
                                        className={`flex items-center gap-4 p-4 rounded-2xl border ${
                                            editMode
                                                ? "bg-white border-orange-200 ring-4 ring-orange-50"
                                                : "bg-gray-50 border-gray-100"
                                        }`}
                                    >
                                        <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm">
                                            <Mail size={22} />
                                        </div>
                                        <div className="flex-1">
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
                                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-900 font-bold"
                                                    required
                                                />
                                            ) : (
                                                <p className="text-gray-900 font-bold text-lg">
                                                    {user.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {profileErrors.email && (
                                        <p className="text-red-500 text-xs font-bold mt-1 ml-1">
                                            {profileErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        {a.phone_number ?? "Phone Number"}
                                    </label>
                                    <div
                                        className={`flex items-center gap-4 p-4 rounded-2xl border ${
                                            editMode
                                                ? "bg-white border-orange-200 ring-4 ring-orange-50"
                                                : "bg-gray-50 border-gray-100"
                                        }`}
                                    >
                                        <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm">
                                            <Phone size={22} />
                                        </div>
                                        <div className="flex-1">
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
                                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-900 font-bold"
                                                    placeholder={a.phone_placeholder ?? "08XXXXXXXXX"}
                                                    required
                                                />
                                            ) : (
                                                <p className="text-gray-900 font-bold text-lg">
                                                    {user.phone || "--"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {profileErrors.phone && (
                                        <p className="text-red-500 text-xs font-bold mt-1 ml-1">
                                            {profileErrors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        {a.admin_since ?? "Admin Since"}
                                    </label>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm">
                                            <Calendar size={22} />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold text-lg">
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
                                </div>
                            </div>

                            {editMode && (
                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={profileProcessing}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-orange-100 hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <Save size={20} />
                                        {profileProcessing
                                            ? (a.saving_changes ?? "Saving Changes...")
                                            : (a.save_profile ?? "Save Profile")}
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
                                        className="px-8 py-4 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
                                    >
                                        {a.cancel ?? "Cancel"}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Password Security Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transform transition-all hover:shadow-md">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                            <button
                                onClick={() =>
                                    setShowPasswordSection(!showPasswordSection)
                                }
                                className="flex items-center justify-between w-full text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm group-hover:rotate-12 transition-transform">
                                        <Key size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl italic underline decoration-orange-500 decoration-2 underline-offset-4">
                                            {a.password_section ?? "Password"}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-500">
                                            {a.change_password ?? "Change Your Password"}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`p-2 rounded-full transition-all ${
                                        showPasswordSection
                                            ? "bg-orange-500 text-white rotate-180"
                                            : "bg-white text-gray-400 border border-gray-100"
                                    }`}
                                >
                                    <Lock size={20} />
                                </div>
                            </button>
                        </div>

                        {showPasswordSection && (
                            <form
                                onSubmit={handlePasswordSubmit}
                                className="p-10 space-y-8 animate-in slide-in-from-top-4 duration-300"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                                            {a.current_password ?? "Current Password"}
                                        </label>
                                        <div className="relative group">
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
                                                className="w-full px-5 py-4 pl-12 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all font-mono"
                                                placeholder={a.current_password ?? "Current Password"}
                                                required
                                            />
                                            <Lock
                                                size={18}
                                                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        !showCurrentPassword,
                                                    )
                                                }
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>
                                        {passwordErrors.current_password && (
                                            <p className="text-red-500 text-xs font-bold mt-1 ml-1">
                                                {
                                                    passwordErrors.current_password
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1 text-orange-600">
                                                {a.new_password ?? "New Password"}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        passwordData.password
                                                    }
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "password",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-5 py-4 pl-12 rounded-2xl border border-orange-100 bg-orange-50/10 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all font-mono"
                                                    placeholder={a.new_password ?? "New Password"}
                                                    required
                                                />
                                                <Key
                                                    size={18}
                                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            !showNewPassword,
                                                        )
                                                    }
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff size={20} />
                                                    ) : (
                                                        <Eye size={20} />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <RequirementItem
                                                    label={a.chars_8 ?? "8+ Chars"}
                                                    met={requirements.length}
                                                />
                                                <RequirementItem
                                                    label={a.uppercase ?? "Uppercase"}
                                                    met={requirements.uppercase}
                                                />
                                                <RequirementItem
                                                    label={a.lowercase ?? "Lowercase"}
                                                    met={requirements.lowercase}
                                                />
                                                <RequirementItem
                                                    label={a.special_char ?? "Special Char"}
                                                    met={requirements.special}
                                                />
                                            </div>
                                            {passwordErrors.password && (
                                                <p className="text-red-500 text-xs font-bold mt-1 ml-1">
                                                    {passwordErrors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                                                {a.confirm_password ?? "Confirm Password"}
                                            </label>
                                            <div className="relative group">
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
                                                    className="w-full px-5 py-4 pl-12 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all font-mono"
                                                    placeholder={a.confirm_password ?? "Confirm New Password"}
                                                    required
                                                />
                                                <ShieldCheck
                                                    size={18}
                                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword,
                                                        )
                                                    }
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff size={20} />
                                                    ) : (
                                                        <Eye size={20} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={passwordProcessing}
                                        className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {passwordProcessing
                                            ? (a.updating_password ?? "Updating Password...")
                                            : (a.update_password ?? "Update Password")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordSection(false);
                                            resetPassword();
                                        }}
                                        className="px-8 py-4 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
                                    >
                                        {a.cancel ?? "Cancel"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function RequirementItem({ label, met }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`w-2 h-2 rounded-full ${
                    met
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                        : "bg-gray-300"
                }`}
            />
            <span
                className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${
                    met ? "text-green-700" : "text-gray-400"
                }`}
            >
                {label}
            </span>
        </div>
    );
}
