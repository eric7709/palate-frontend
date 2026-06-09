"use client";
import { useCreateCustomer } from "@/models/customer/hooks";
import { useForm } from "react-hook-form";
import { CustomerRequestDTO } from "@/models/customer/types";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { Loader2, User, ChevronDown } from "lucide-react";

export default function CustomerFormModal() {
  const { mutate, isPending } = useCreateCustomer();
  const { modal, setModal, setCustomerId, setCustomerName, setCustomerPhoneNumber, setCustomerTitle } = useOrderRequestStore();
  const { register, handleSubmit } = useForm<CustomerRequestDTO>();

  if (modal !== "customer") return null;

  const onSubmit = (data: CustomerRequestDTO) => {
    mutate(data, {
      onSuccess: (customer) => {
        // Store in localStorage (for persistence across reloads)
        Object.entries(customer).forEach(([key, val]) => {
          if (val) localStorage.setItem(key, String(val));
        });
        // ✅ Update store with all customer info
        setCustomerId(customer.id);
        setCustomerName(customer.name);
        setCustomerPhoneNumber(customer.phoneNumber);
        setCustomerTitle(customer.title || "");
        // Proceed to confirmation modal
        setModal("confirm");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 isolate">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" 
        onClick={() => setModal("cart")} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-4xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Guest Info</h2>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Required to proceed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <input 
            {...register("name", { required: true })} 
            placeholder="Name" 
            className="w-full bg-gray-100 rounded-full px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
          
          {/* Title & Phone Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select 
                {...register("title")} 
                className="w-full bg-gray-100 rounded-full px-6 py-4 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <option value="">Title</option>
                <option value="Mr">Mr.</option>
                <option value="Ms">Ms.</option>
                <option value="Mrs">Mrs.</option>
                <option value="Dr">Dr.</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <input 
              {...register("phoneNumber")} 
              placeholder="Phone Number" 
              className="w-full bg-gray-100 rounded-full px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full mt-4 bg-gray-900 text-white py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-300/50"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}