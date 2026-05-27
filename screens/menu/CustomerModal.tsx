"use client";
import { useCreateCustomer } from "@/models/customer/hooks";
import { useForm } from "react-hook-form";
import { CustomerRequestDTO } from "@/models/customer/types";
import { useOrderRequestStore } from "@/models/orderRequest/store";

export default function CustomerFormModal() {
    const { mutate, isPending } = useCreateCustomer();
    const { modal, setModal } = useOrderRequestStore();
    const { register, handleSubmit, reset } = useForm<CustomerRequestDTO>();

    if (modal !== "customer") return null;

    const onSubmit = (data: CustomerRequestDTO) => {
        mutate(data, {
            onSuccess: (newCustomer) => {
                localStorage.setItem("name", newCustomer.name)
                localStorage.setItem("email", String(newCustomer.email))
                localStorage.setItem("id", String(newCustomer.id))
                localStorage.setItem("phone", String(newCustomer.phoneNumber))
                localStorage.setItem("title", String(newCustomer.title))
                reset();
                setModal("cart");
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
                {/* Header with emoticon */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🧑‍🍳</span>
                    <h2 className="text-base font-semibold text-gray-800">Lets Get to Know You</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                            Full Name *
                        </label>
                        <input
                            {...register("name", { required: true })}
                            className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="e.g., John Doe"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                                Title
                            </label>
                            <input
                                {...register("title")}
                                className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="Mr / Ms / Chef"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                                Phone
                            </label>
                            <input
                                {...register("phoneNumber")}
                                className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="+234 800 000 0000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="customer@example.com"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setModal("cart")}
                            className="flex-1 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Saving..." : "Save Customer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}