'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Order, StoreContact, StoreSettings } from '@/types';
import { formatBillText, formatQueueNo, getEstimatedWaitTime } from '@/lib/utils';
import { CheckCircle2, Copy, Check, MessageSquare, Clock, ExternalLink } from 'lucide-react';

interface OrderDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  settings: StoreSettings;
  onOpenQueue: () => void;
}

const FALLBACK_SOCIALS: Record<string, StoreContact> = {
  LINE: { type: 'LINE', name: 'LINE Official', url: 'https://lin.ee/zTea2n2' },
  INSTAGRAM: {
    type: 'Instagram',
    name: '@auralune_a',
    url: 'https://www.instagram.com/auralune_a?obrf=cGVvMzNnNDh2eWNk',
  },
  FACEBOOK: {
    type: 'Facebook',
    name: 'Auralune ดูดวงไพ่ทาโรต์',
    url: 'https://www.facebook.com/share/1BqsEL29qw/',
  },
};

export default function OrderDoneModal({
  isOpen,
  onClose,
  order,
  settings,
  onOpenQueue,
}: OrderDoneModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e63946', '#95d5b2', '#ffd4bf', '#ffffff'],
      });
      // Save last tracking credentials to session storage for easy lookup
      if (order?.order_no && order?.tracking_token) {
        try {
          sessionStorage.setItem('apple_last_order_no', order.order_no);
          sessionStorage.setItem('apple_last_tracking_token', order.tracking_token);
        } catch {
          // ignore storage error
        }
      }
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const billText = formatBillText(order);
  const formattedOrderNo = formatQueueNo(order.order_no);
  const waitTimeText = getEstimatedWaitTime(order.items || [], order.is_express);

  const copyBill = () => {
    navigator.clipboard.writeText(billText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Match the exact contact channel chosen by the customer
  const rawChannel = (order.contact_channel || 'LINE').trim();
  const channelUpper = rawChannel.toUpperCase();

  const matchedSocial =
    (settings.socials || []).find(
      (s) =>
        s.type.trim().toUpperCase() === channelUpper ||
        s.name.trim().toUpperCase().includes(channelUpper)
    ) ||
    FALLBACK_SOCIALS[channelUpper] || {
      type: rawChannel,
      name: rawChannel,
      url: '',
    };

  const channelDisplayLabel =
    channelUpper === 'FACEBOOK'
      ? 'Facebook'
      : channelUpper === 'INSTAGRAM'
      ? 'Instagram'
      : channelUpper === 'LINE'
      ? 'LINE'
      : rawChannel;

  const channelBtnStyle =
    channelUpper === 'FACEBOOK'
      ? 'bg-[#1877F2]! border-[#1877F2]! text-white!'
      : channelUpper === 'INSTAGRAM'
      ? 'bg-[#E1306C]! border-[#E1306C]! text-white!'
      : 'bg-[#06c755]! border-[#06c755]! text-white!';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-y-auto text-[#543E30] text-center animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Celebration Icon */}
        <div className="w-14 h-14 rounded-full bg-[#FCE4EC] border-2 border-[#F6B8C6] flex items-center justify-center text-[#D06D80] mx-auto shadow-sm shrink-0">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#D06D80] mt-2">
          ส่งออเดอร์สำเร็จ! 🍎🌷
        </h3>
        <p className="text-xs text-[#543E30] mt-1 font-semibold bg-[#FCE4EC]/70 border border-[#F6B8C6] rounded-xl py-1.5 px-3">
          คัดลอกบิลคำสั่งซื้อและรหัสติดตามสถานะ เพื่อดูคิวที่ช่องดูคิว หน้าแรก
        </p>

        {/* Key Order Summary Box (Required format) */}
        <div className="my-3 p-3.5 bg-[#FFFEFA] border-2 border-[#F6B8C6] rounded-2xl text-left space-y-1.5 shadow-xs">
          <p className="text-xs sm:text-sm font-bold text-[#543E30]">
            🍎 บิลคำสั่งซื้อ: <span className="font-mono text-[#D06D80]">{formattedOrderNo}</span>
          </p>
          <p className="text-xs sm:text-sm font-bold text-[#543E30]">
            🔑 รหัสติดตามสถานะ (ห้ามแชร์):{' '}
            <span className="font-mono text-[#D06D80] bg-[#FFF8EC] px-1.5 py-0.5 rounded border border-[#F6D1B5]">
              {order.tracking_token || '-'}
            </span>
          </p>
          <p className="text-xs sm:text-sm font-bold text-[#543E30]">
            👤 ชื่อลูกค้า: <span className="text-[#543E30]">{order.customer_name}</span>
          </p>
          <div className="pt-1.5 mt-1.5 border-t border-[#FCE4EC] flex items-center justify-between text-[11px] text-[#7D946D] font-semibold">
            <span>⏱️ เวลารอรับบริการ:</span>
            <span className="text-[#D06D80] font-bold">{waitTimeText}</span>
          </div>
        </div>

        {/* Full Bill Text Preview Box */}
        <div className="bg-[#FFFEFA] p-3 rounded-2xl border border-[#C9DDB8] text-left font-mono text-[11px] text-[#543E30] max-h-28 overflow-y-auto whitespace-pre-wrap select-text mb-3 shadow-2xs">
          {billText}
        </div>

        {/* Step-by-Step Instructions & Prominent Action Buttons */}
        <div className="space-y-2.5 text-left">
          {/* Step 1: Copy Bill */}
          <div className="p-3 rounded-2xl bg-[#FCE4EC]/60 border-2 border-[#D06D80]/60 space-y-2">
            <p className="text-xs font-bold text-[#543E30]">
              ขั้นตอนที่ 1: กด ‘คัดลอกข้อความบิล’ แล้วนำไปส่งตามช่องทางที่เลือก
            </p>
            <button
              type="button"
              onClick={copyBill}
              className={`w-full py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition cursor-pointer shadow-md border-2 ${
                copied
                  ? 'bg-[#7D946D] text-white border-[#5F7550]'
                  : 'cta-btn text-[#543E30]! border-[#D06D80]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>คัดลอกข้อความบิลเรียบร้อยแล้ว ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-[#543E30]" />
                  <span>📋 คัดลอกข้อความบิล</span>
                </>
              )}
            </button>
          </div>

          {/* Step 2: Send to chosen contact channel */}
          <div className="p-3 rounded-2xl bg-[#F4F8F0] border border-[#C9DDB8] space-y-2">
            <p className="text-xs font-bold text-[#543E30]">
              ขั้นตอนที่ 2: ส่งข้อความบิลไปที่ช่องทาง {channelDisplayLabel} ของร้าน
            </p>
            {matchedSocial.url ? (
              <a
                href={matchedSocial.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`quick-btn w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold cursor-pointer shadow-sm ${channelBtnStyle}`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>
                  ส่งบิลไปที่ {channelDisplayLabel} ของร้าน ({matchedSocial.name})
                </span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            ) : (
              <div className="p-2.5 rounded-xl bg-[#FFFEFA] border border-[#C9DDB8] text-xs text-[#543E30] font-semibold text-center">
                ส่งข้อความบิลไปที่ {channelDisplayLabel} ของร้าน: {matchedSocial.name}
              </div>
            )}
          </div>

          {/* Step 3: Check Queue */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenQueue();
            }}
            className="secondary-btn w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold text-[#543E30]! border-2 border-[#A8B99A]! cursor-pointer"
          >
            <Clock className="w-4 h-4 text-[#7D946D]" />
            <span>ดูคิว / ติดตามสถานะคิว (สถานะ: รอตรวจสลิป)</span>
          </button>

          {/* Separated Back to Store Link */}
          <div className="pt-2 border-t border-[#FCE4EC] text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-[#947765] hover:text-[#543E30] py-1 px-3 rounded-lg underline transition cursor-pointer"
            >
              กลับสู่หน้าร้าน (หลังคัดลอกบิลแล้ว)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
