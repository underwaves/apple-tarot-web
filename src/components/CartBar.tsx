'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatBaht } from '@/lib/utils';

interface CartBarProps {
  totalCount: number;
  totalAmount: number;
  onOpenCart: () => void;
}

export default function CartBar({
  totalCount,
  totalAmount,
  onOpenCart,
}: CartBarProps) {
  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-[68px] sm:bottom-4 inset-x-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none">
      <button
        onClick={onOpenCart}
        className="pointer-events-auto w-full max-w-[580px] py-3 px-4 sm:py-3.5 sm:px-5 rounded-2xl flex items-center justify-between shadow-xl cursor-pointer bg-[#FFFEFA] border-2 border-[#F6B8C6] hover:border-[#E88E9F] hover:shadow-2xl active:scale-98 transition transform animate-in slide-in-from-bottom-4 duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#F6B8C6] border border-[#FCE4EC] flex items-center justify-center text-[#543E30] shadow-xs">
              <ShoppingBag className="w-5 h-5 text-[#543E30]" />
            </div>
            <span className="absolute -top-1 -right-1 bg-[#D06D80] text-[#FFFEFA] font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {totalCount}
            </span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs text-[#7D946D] font-medium">ตะกร้าของคุณ 🧺</span>
            <span className="text-sm font-semibold text-[#543E30]">
              เลือก {totalCount} รายการ
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-2xl text-[#D06D80]">
            {formatBaht(totalAmount)}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#543E30] group-hover:translate-x-1 transition">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </button>
    </div>
  );
}
