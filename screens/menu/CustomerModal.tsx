"use client";
import { useCreateCustomer } from "@/models/customer/hooks";
import { useForm } from "react-hook-form";
import { CustomerRequestDTO } from "@/models/customer/types";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { Loader2 } from "lucide-react"; // Suggested: npm install lucide-react

export default function CustomerFormModal() {
  const { mutate, isPending } = useCreateCustomer();
  const { modal, setModal } = useOrderRequestStore();
  const { register, handleSubmit, reset } = useForm<CustomerRequestDTO>();

  if (modal !== "customer") return null;

  const onSubmit = (data: CustomerRequestDTO) => {
    mutate(data, {
      onSuccess: (customer) => {
        // Centralized storage update
        const fields = ["name", "email", "id", "phoneNumber", "title"] as const;
        fields.forEach((field) => {
          if (customer[field]) localStorage.setItem(field, String(customer[field]));
        });

        reset();
        setModal("cart");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2 rounded-full">
              <span className="text-xl">🧑‍🍳</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Guest Details</h2>
              <p className="text-xs text-gray-500">Please provide contact information</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input
                {...register("name", { required: true })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  {...register("title")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  placeholder="Mr/Ms"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone</label>
                <input
                  {...register("phoneNumber")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  placeholder="+234..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                {...register("email")}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                placeholder="customer@email.com"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModal("cart")}
              className="flex-1 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}