'use client';

import React from 'react';
import Image from 'next/image';
import { Category, PackageItem } from '@/types';
import { formatBaht } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';

const CATEGORY_DECOR_ICONS = [
  '/images/decorations/decor_apple_whole.png',
  '/images/decorations/decor_pie_slice.png',
  '/images/decorations/decor_jam_jar.png',
  '/images/decorations/decor_juice_bottle.png',
  '/images/decorations/decor_apple_glazed.png',
  '/images/decorations/decor_apple_slice.png',
];

interface ProductCatalogProps {
  categories: Category[];
  selectedItemIds: Record<string, number>; // id -> quantity
  onToggleItem: (pkg: PackageItem) => void;
  isStoreOpen?: boolean;
  storeCloseMessage?: string;
  onLockedClick?: () => void;
}

export default function ProductCatalog({
  categories,
  selectedItemIds,
  onToggleItem,
  isStoreOpen = true,
  storeCloseMessage,
  onLockedClick,
}: ProductCatalogProps) {
  return (
    <section className="mt-8 flex flex-col gap-8">
      {/* Store Closed Notice Banner */}
      {!isStoreOpen && (
        <div className="p-4 bg-[#FCE4EC] border-2 border-[#F6B8C6] rounded-2xl text-center text-xs text-[#543E30] flex flex-col items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <div className="w-12 h-12 relative animate-float">
            <Image
              src="/images/decorations/decor_jam_jar.png"
              alt="store closed"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-[#D06D80] text-sm sm:text-base flex items-center gap-1.5">
            🔒 ขณะนี้ร้านปิดรับคิวชั่วคราว
          </span>
          <span className="text-xs text-[#543E30] max-w-lg leading-relaxed">
            {storeCloseMessage || 'ขณะนี้ร้านปิดรับคิวชั่วคราว สามารถแวะชมรายละเอียดบริการหรือทักสอบถามทาง LINE ได้นะคะ 🌙'}
          </span>
          <span className="text-[11px] text-[#947765] font-medium">
            (ระบบล็อคการสั่งซื้อชั่วคราว จนกว่าแม่หมอจะกดเปิดร้านค่ะ)
          </span>
        </div>
      )}

      {categories.map((category, catIdx) => {
        const activePackages = category.packages.filter((p) => p.is_active);
        if (activePackages.length === 0) return null;

        const decorIcon = CATEGORY_DECOR_ICONS[catIdx % CATEGORY_DECOR_ICONS.length];

        return (
          <div key={category.id} className="flex flex-col gap-3.5">
            {/* Category Header */}
            <div>
              <div className="category-header">
                <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 relative">
                  <Image
                    src={decorIcon}
                    alt="category decor"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="tracking-wide text-base sm:text-xl md:text-2xl font-bold text-[#543E30] break-words leading-tight">
                  {category.name}
                </span>
              </div>
              {category.description && (
                <p className="text-xs sm:text-sm text-[#947765] mt-1 pl-8 leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            {/* Packages Grid */}
            <div className="grid gap-3">
              {activePackages.map((pkg) => {
                const qty = selectedItemIds[pkg.id] || 0;
                const isSelected = qty > 0;

                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      if (!isStoreOpen) {
                        if (onLockedClick) onLockedClick();
                        return;
                      }
                      onToggleItem(pkg);
                    }}
                    aria-pressed={isSelected}
                    className={`pkg-btn w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition group ${
                      !isStoreOpen
                        ? 'opacity-85 hover:border-[#F6B8C6] cursor-not-allowed bg-[#FFFBF8]'
                        : 'cursor-pointer'
                    }`}
                  >
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-base sm:text-lg md:text-xl font-semibold text-[#543E30] group-hover:text-[#D06D80] transition leading-snug">
                          {pkg.name}
                        </span>
                        {pkg.badge && (
                          <span className="shrink-0 text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#FCE4EC] text-[#543E30] border border-[#F6B8C6]/60 font-medium shadow-xs">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      {pkg.description && (
                        <p className="text-xs sm:text-sm text-[#947765] mt-1.5 leading-relaxed">
                          {pkg.description}
                        </p>
                      )}
                    </div>

                    {/* Right: Price & Status */}
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <div className="flex items-baseline gap-1.5 font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[#D06D80] group-hover:text-[#E88E9F] transition">
                        {pkg.original_price && pkg.original_price > pkg.price && (
                          <span className="text-xs sm:text-sm text-[#A38C7E] line-through font-normal">
                            {formatBaht(pkg.original_price)}
                          </span>
                        )}
                        <span>{formatBaht(pkg.price)}</span>
                      </div>

                      {/* Select check badge or Locked badge */}
                      {!isStoreOpen ? (
                        <div className="mt-2 flex items-center gap-1 text-[11px] px-2.5 sm:px-3 py-1 rounded-full bg-[#FCE4EC] text-[#D06D80] border border-[#F6B8C6] font-medium shadow-2xs">
                          <span>🔒 ปิดรับคิวชั่วคราว</span>
                        </div>
                      ) : (
                        <div
                          className={`mt-2 flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1 rounded-full transition ${
                            isSelected
                              ? 'bg-[#F6B8C6] text-[#543E30] font-bold shadow-xs border border-[#FCE4EC]'
                              : 'bg-[#F4F8F0] text-[#7D946D] hover:bg-[#E8F0E2] border border-[#C9DDB8]'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>เลือกแล้ว ({qty})</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ เลือก</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
