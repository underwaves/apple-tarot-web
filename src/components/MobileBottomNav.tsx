'use client';

import React from 'react';
import { Home, Clock, Star, MessageCircle, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenQueue: () => void;
  onOpenReviews: () => void;
  onOpenContact: () => void;
}

export default function MobileBottomNav({
  cartCount,
  onOpenCart,
  onOpenQueue,
  onOpenReviews,
  onOpenContact,
}: MobileBottomNavProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFEFA]/95 backdrop-blur-md border-t border-[#F6B8C6]/60 shadow-[0_-4px_20px_rgba(148,119,101,0.08)] px-1 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 w-full items-center">
        {/* Home */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center py-1 px-1 text-[#947765] hover:text-[#543E30] active:scale-95 transition cursor-pointer"
        >
          <Home className="w-5 h-5 text-[#A8B99A]" />
          <span className="text-[10px] font-medium mt-0.5">หน้าร้าน</span>
        </button>

        {/* Queue */}
        <button
          type="button"
          onClick={onOpenQueue}
          className="flex flex-col items-center justify-center py-1 px-1 text-[#947765] hover:text-[#543E30] active:scale-95 transition cursor-pointer"
        >
          <Clock className="w-5 h-5 text-[#A8B99A]" />
          <span className="text-[10px] font-medium mt-0.5">ดูคิว</span>
        </button>

        {/* Reviews */}
        <button
          type="button"
          onClick={onOpenReviews}
          className="flex flex-col items-center justify-center py-1 px-1 text-[#947765] hover:text-[#543E30] active:scale-95 transition cursor-pointer"
        >
          <Star className="w-5 h-5 text-[#F6B8C6]" />
          <span className="text-[10px] font-medium mt-0.5">รีวิว</span>
        </button>

        {/* Contact */}
        <button
          type="button"
          onClick={onOpenContact}
          className="flex flex-col items-center justify-center py-1 px-1 text-[#947765] hover:text-[#543E30] active:scale-95 transition cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-[#A8B99A]" />
          <span className="text-[10px] font-medium mt-0.5">ติดต่อ</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-1 text-[#947765] hover:text-[#543E30] active:scale-95 transition cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#D06D80]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D06D80] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">ตะกร้า</span>
        </button>
      </div>
    </nav>
  );
}
