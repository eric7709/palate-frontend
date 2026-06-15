"use client";
import CartHeader from './CartHeader';
import CartList from './CartList';
import { useOrderRequestStore } from '@/models/orderRequest/store';
import OrderButton from './OrderButton';
import { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { modal, setModal, orderRequest } = useOrderRequestStore();
  const items = orderRequest.items;
  const isOpen = modal === 'cart';
  const isEmpty = items.length === 0;

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setModal(null)}
      />

      {/* Cart Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <CartHeader />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-xs mt-1">Add items from the menu to get started</p>
            </div>
          ) : (
            <CartList />
          )}
        </div>

        {/* Footer with order button (only shows when cart not empty) */}
        {!isEmpty && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
            <OrderButton />
          </div>
        )}
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