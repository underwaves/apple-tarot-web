'use client';

import React from 'react';
import { PackageItem } from '@/types';
import { formatBaht, getEstimatedWaitTime } from '@/lib/utils';
import { X, Plus, Minus, Trash2, ArrowRight, Clock } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { pkg: PackageItem; quantity: number }[];
  onUpdateQuantity: (pkgId: string, delta: number) => void;
  onRemoveItem: (pkgId: string) => void;
  onNext: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onNext,
}: CartModalProps) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.pkg.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] text-[#543E30] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#FCE4EC]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧺</span>
            <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
              ตะกร้าของคุณ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#543E30] hover:bg-[#F6B8C6] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-[#947765]">
              <p>ไม่มีสินค้าในตะกร้า 🍎</p>
            </div>
          ) : (
            cartItems.map(({ pkg, quantity }) => (
              <div
                key={pkg.id}
                className="bg-[#FFFEFA] p-3.5 rounded-2xl border border-[#FCE4EC] shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-[#543E30]">{pkg.name}</h4>
                  <p className="text-xs text-[#7D946D] mt-0.5 font-medium">
                    {formatBaht(pkg.price)} / ชิ้น
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#C9DDB8] rounded-xl bg-[#F4F8F0] px-1 py-0.5">
                    <button
                      onClick={() => onUpdateQuantity(pkg.id, -1)}
                      className="p-1 text-[#543E30] hover:text-[#D06D80] transition cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#543E30]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(pkg.id, 1)}
                      className="p-1 text-[#543E30] hover:text-[#7D946D] transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(pkg.id)}
                    className="p-1.5 text-[#D06D80]/70 hover:text-[#D06D80] transition cursor-pointer"
                    title="ลบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#FCE4EC] pt-3.5 mt-2 space-y-3">
            <div className="bg-[#FFFEFA] border border-[#F6B8C6]/70 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs">
              <span className="text-[#947765] flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#D06D80] shrink-0" />
                <span>เวลารอรับบริการ:</span>
              </span>
              <span className="font-bold text-[#D06D80] text-right">
                {getEstimatedWaitTime(cartItems.map((it) => it.pkg))}
              </span>
            </div>

            <div className="flex items-baseline justify-between px-1">
              <span className="text-sm text-[#947765]">ยอดรวมทั้งหมด:</span>
              <span className="font-serif font-bold text-2xl text-[#D06D80]">
                {formatBaht(totalAmount)}
              </span>
            </div>

            <button
              onClick={onNext}
              className="cta-btn w-full py-3 px-4 flex items-center justify-center gap-2 text-[#543E30] cursor-pointer"
            >
              <span>ถัดไป · กรอกข้อมูล</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
