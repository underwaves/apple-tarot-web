'use client';

import React from 'react';
import Image from 'next/image';
import { StoreSettings } from '@/types';
import { Clock, Star, MessageCircle, ShieldCheck } from 'lucide-react';

interface HeroProps {
  settings: StoreSettings;
  onOpenQueue: () => void;
  onOpenReviews: () => void;
  onOpenContact: () => void;
  onOpenAdmin: () => void;
}

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=300&q=80';

export default function Hero({
  settings,
  onOpenQueue,
  onOpenReviews,
  onOpenContact,
  onOpenAdmin,
}: HeroProps) {
  const [failedBannerUrl, setFailedBannerUrl] = React.useState<string | null>(null);
  const [failedAvatarUrl, setFailedAvatarUrl] = React.useState<string | null>(null);

  const targetBanner = settings.banner_url || DEFAULT_BANNER;
  const bannerSrc = failedBannerUrl === targetBanner ? DEFAULT_BANNER : targetBanner;

  const targetAvatar = settings.avatar_url || DEFAULT_AVATAR;
  const avatarSrc = failedAvatarUrl === targetAvatar ? DEFAULT_AVATAR : targetAvatar;

  return (
    <header className="relative text-center pt-2 pb-6 flex flex-col items-center">
      {/* Banner with Soft Pastel Frame */}
      <div className="w-full h-36 sm:h-48 md:h-56 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-md border border-[#F6B8C6]/50 mb-[-46px] sm:mb-[-56px] md:mb-[-62px]">
        <Image
          src={bannerSrc}
          alt={settings.shop_name}
          fill
          unoptimized
          onError={() => setFailedBannerUrl(targetBanner)}
          className="w-full h-full object-cover filter brightness-[0.98]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8EC]/80 via-transparent to-transparent" />
      </div>

      {/* Avatar with Pastel Apple & Leaf Wreath Border */}
      <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-[#F6B8C6] via-[#C9DDB8] to-[#F6D1B5] shadow-lg">
        {/* Cute Floating Left Sticker */}
        <div className="absolute -left-5 sm:-left-7 top-1 w-9 h-9 sm:w-11 sm:h-11 pointer-events-none animate-float select-none drop-shadow-sm z-20">
          <Image
            src="/images/decorations/decor_jam_jar.png"
            alt="jam jar"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Cute Floating Right Sticker */}
        <div className="absolute -right-5 sm:-right-7 top-0 w-9 h-9 sm:w-11 sm:h-11 pointer-events-none animate-float-delayed select-none drop-shadow-sm z-20">
          <Image
            src="/images/decorations/decor_pie_slice.png"
            alt="pie slice"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#FFFEFA] bg-[#FFF8EC] relative">
          <Image
            src={avatarSrc}
            alt="Store Avatar"
            width={128}
            height={128}
            unoptimized
            onError={() => setFailedAvatarUrl(targetAvatar)}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="absolute -bottom-1 -right-1 text-2xl sm:text-3xl select-none z-10" role="img" aria-label="apple">
          🍎
        </span>
      </div>

      {/* Shop Title with Side Accents */}
      <div className="relative mt-3">
        <div className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none animate-float-slow select-none opacity-90">
          <Image
            src="/images/decorations/decor_apple_slice.png"
            alt="apple slice"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-10 pointer-events-none animate-float-delayed select-none opacity-90">
          <Image
            src="/images/decorations/decor_juice_bottle.png"
            alt="juice bottle"
            width={32}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="hero-title tracking-wide">
          {settings.shop_title || 'Auralune'}
        </h1>
      </div>

      {/* Subtitle */}
      <p className="mt-2 text-xs sm:text-sm md:text-base text-[#947765] max-w-xl sm:max-w-2xl px-4 font-normal leading-relaxed opacity-95">
        {settings.shop_subtitle || 'ดูดวงไพ่ทาโรต์ · ดูดวงความรัก การงาน การเงิน · สีมงคล · วอลเปเปอร์เสริมดวง'}
      </p>

      {/* Store Status Badge (Open / Closed) */}
      <div className="mt-3 inline-flex items-center justify-center">
        {settings.is_store_open !== false ? (
          <div className="flex items-center gap-2 text-[#2E7D32] bg-[#E8F5E9] border border-[#C9DDB8] px-3.5 py-1 rounded-full text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
            <span>เปิดรับคิวปกติ 🟢</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#D06D80] bg-[#FCE4EC] border border-[#F6B8C6] px-4 py-1.5 rounded-2xl max-w-md shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#D06D80]" />
              <span>ร้านปิดรับคิวชั่วคราว 🔒</span>
            </div>
            {settings.store_close_message && (
              <span className="text-[11px] font-normal text-[#543E30] text-center leading-relaxed">
                {settings.store_close_message}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4 Quick Action Buttons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full mt-6 px-1">
        <button
          onClick={onOpenQueue}
          className="quick-btn flex items-center justify-center gap-2 cursor-pointer hover:border-[#A8B99A] active:scale-95"
        >
          <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#A8B99A]" />
          <span>ดูคิว</span>
        </button>

        <button
          onClick={onOpenReviews}
          className="quick-btn flex items-center justify-center gap-2 cursor-pointer hover:border-[#F6B8C6] active:scale-95"
        >
          <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F6B8C6]" />
          <span>ดูรีวิว</span>
        </button>

        <button
          onClick={onOpenContact}
          className="quick-btn flex items-center justify-center gap-2 cursor-pointer hover:border-[#A8B99A] active:scale-95"
        >
          <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#A8B99A]" />
          <span>ติดต่อร้าน</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="quick-btn flex items-center justify-center gap-2 cursor-pointer hover:border-[#D06D80] active:scale-95"
        >
          <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#D06D80]" />
          <span>หลังบ้าน</span>
        </button>
      </div>
    </header>
  );
}
