'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Order, StoreSettings } from '@/types';
import { formatBillText } from '@/lib/utils';
import { CheckCircle2, Copy, Check, MessageSquare, Clock, Key } from 'lucide-react';

interface OrderDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  settings: StoreSettings;
  onOpenQueue: () => void;
}

export default function OrderDoneModal({
  isOpen,
  onClose,
  order,
  settings,
  onOpenQueue,
}: OrderDoneModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

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

  const copyBill = () => {
    navigator.clipboard.writeText(billText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyToken = () => {
    if (order.tracking_token) {
      navigator.clipboard.writeText(order.tracking_token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const lineContact = settings.socials.find((s) => s.type.toUpperCase() === 'LINE');
  const lineUrl = lineContact?.url || 'https://line.me';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] text-[#543E30] text-center animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Celebration Icon */}
        <div className="w-16 h-16 rounded-full bg-[#FCE4EC] border-2 border-[#F6B8C6] flex items-center justify-center text-[#D06D80] mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="font-serif text-3xl font-bold text-[#D06D80] mt-3">
          ส่งออเดอร์สำเร็จ! 🍎🌷
        </h3>
        <p className="text-xs text-[#7D946D] mt-1 font-medium">
          ระบบได้รับหลักฐานการโอนเงินเรียบร้อยแล้วค่ะ
        </p>

        {/* Order Number & Secret Tracking Token Box */}
        <div className="my-3 p-3.5 bg-[#FFFEFA] border border-[#FCE4EC] rounded-2xl space-y-2.5 shadow-xs">
          <div>
            <span className="text-[11px] text-[#947765] block">หมายเลขออเดอร์</span>
            <span className="font-mono font-bold text-base text-[#D06D80] tracking-wider block">
              {order.order_no}
            </span>
            {order.is_express && (
              <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[11px] font-bold text-[#D97706] shadow-xs">
                <span>⚡ คิวด่วนพิเศษ (Express Queue)</span>
              </div>
            )}
          </div>

          {order.tracking_token && (
            <div className="pt-2 border-t border-[#FCE4EC] flex items-center justify-between bg-[#F4F8F0] p-2.5 rounded-xl border border-[#C9DDB8]">
              <div className="text-left">
                <span className="text-[10px] text-[#7D946D] block font-semibold flex items-center gap-1">
                  <Key className="w-3 h-3" /> รหัสติดตามสถานะ (ห้ามแชร์)
                </span>
                <span className="font-mono text-xs text-[#543E30] font-bold block tracking-wider">
                  {order.tracking_token}
                </span>
              </div>
              <button
                type="button"
                onClick={copyToken}
                className="text-[10px] bg-[#FFFEFA] text-[#543E30] hover:bg-[#FCE4EC] px-2.5 py-1 rounded-lg border border-[#C9DDB8] cursor-pointer font-medium"
              >
                {copiedToken ? 'คัดลอกแล้ว' : 'คัดลอก'}
              </button>
            </div>
          )}
        </div>

        {/* Bill Text Box */}
        <div className="bg-[#FFFEFA] p-3 rounded-2xl border border-[#FCE4EC] text-left font-mono text-[11px] text-[#543E30] max-h-32 overflow-y-auto whitespace-pre-wrap select-text mb-3 shadow-2xs">
          {billText}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={copyBill}
            className="secondary-btn w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#7D946D]" />
                <span className="text-[#7D946D]">คัดลอกบิลแล้ว ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#A8B99A]" />
                <span>คัดลอกข้อความบิล</span>
              </>
            )}
          </button>

          {lineUrl && (
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-btn w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold bg-[#06c755]! border-[#06c755]! text-white! cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>ส่งบิลไปที่ LINE ของร้าน</span>
            </a>
          )}

          <button
            onClick={() => {
              onClose();
              onOpenQueue();
            }}
            className="cta-btn w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-white cursor-pointer shadow-lg"
          >
            <Clock className="w-4 h-4" />
            <span>ติดตามสถานะคิว</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs text-[#d8c3b0] hover:text-white pt-1 block mx-auto underline transition cursor-pointer"
          >
            กลับสู่หน้าร้าน
          </button>
        </div>
      </div>
    </div>
  );
}
