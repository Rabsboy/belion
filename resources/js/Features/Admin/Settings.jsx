import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Save } from "lucide-react";

export default function Settings({ auth, settings }) {
    const { translations } = usePage().props;
    const a = translations?.admin ?? {};
    // Convert settings array/object to keyed object if needed, or assume normalized
    const deliveryFee =
        settings.find((s) => s.key === "delivery_fee")?.value || 50;

    const { data, setData, post, processing, errors, reset } = useForm({
        delivery_fee: deliveryFee,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.settings.update"), {
            onSuccess: () => {
                // optional toast or success handling
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={a.settings ?? "Settings"} />

            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {a.site_settings ?? "Site Settings"}
                    </h1>
                    <p className="text-gray-600">
                        {a.manage_global_config ?? "Manage global configuration for your store."}
                    </p>
                </div>

                <div className="max-w-xl bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                        {a.general_configuration ?? "General Configuration"}
                    </h3>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="delivery_fee"
                                value={a.delivery_fee_label ?? "Delivery Fee (Rp)"}
                            />

                            <TextInput
                                id="delivery_fee"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.delivery_fee}
                                onChange={(e) =>
                                    setData("delivery_fee", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.delivery_fee}
                                className="mt-2"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {a.delivery_fee_helper ?? "This fee will be applied to all new orders."}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <PrimaryButton disabled={processing}>
                                <Save size={16} className="mr-2" />
                                {a.save_settings ?? "Save Settings"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
