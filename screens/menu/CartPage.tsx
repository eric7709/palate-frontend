import CartHeader from './CartHeader';
import CartList from './CartList';
import { useOrderRequestStore } from '@/models/orderRequest/store';
import OrderButton from './OrderButton';
import { useEffect } from 'react';

export default function CartPage() {
  const { modal, setModal } = useOrderRequestStore();
  const isOpen = modal === 'cart';

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with fade */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setModal(null)}
      />

      {/* Cart Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <CartHeader />
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          <CartList />
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
          <OrderButton />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}