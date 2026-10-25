'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { generatePromptPayPayload } from '@/lib/promptpay';
import { formatBaht } from '@/lib/utils';
import { Order, StoreSettings } from '@/types';
import { X, ArrowLeft, ArrowRight, Copy, Check, QrCode } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onProceedToSlip: () => void;
  order: Order | null;
  settings: StoreSettings;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onBack,
  onProceedToSlip,
  order,
  settings,
}: PaymentModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrMode, setQrMode] = useState<'kbank' | 'promptpay' | 'truemoney'>(() => {
    if (typeof window === 'undefined') return 'kbank';
    const p = new URLSearchParams(window.location.search).get('preview');
    if (p === 'payment_promptpay') return 'promptpay';
    if (p === 'payment_truemoney') return 'truemoney';
    return 'kbank';
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    if (!isOpen || !order) return;

    const target = settings.promptpay_id || '0968895279';
    const payload = generatePromptPayPayload(target, order.total_amount);

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: {
        dark: '#1b4332',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [isOpen, order, settings.promptpay_id]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] text-[#543E30] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#FCE4EC]">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
              สแกนจ่ายเงิน
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#543E30] hover:bg-[#F6B8C6] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col items-center text-center space-y-4">
          {/* Order No Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE4EC] border border-[#F6B8C6]/50 text-xs text-[#7D946D]">
            <span>ออเดอร์:</span>
            <span className="font-mono font-bold text-[#D06D80]">
              {order.order_no}
            </span>
          </div>

          {/* Amount Badge */}
          <div>
            <span className="text-xs text-[#947765]">ยอดที่ต้องชำระ</span>
            <div className="font-serif font-bold text-3xl sm:text-4xl text-[#D06D80] drop-shadow-xs">
              {formatBaht(order.total_amount)}
            </div>
            {order.is_express && (
              <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[11px] font-bold text-[#D97706] shadow-xs">
                <span>⚡ บริการลัดคิวพิเศษ (เรทเดียว 32 บาท)</span>
              </div>
            )}
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="flex items-center justify-center gap-1.5 p-1 bg-[#FFF8EC] rounded-xl border border-[#F6B8C6]/50 text-xs w-full">
            <button
              type="button"
              onClick={() => setQrMode('kbank')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                qrMode === 'kbank'
                  ? 'bg-[#138f2d] text-white shadow-xs'
                  : 'text-[#947765] hover:text-[#543E30]'
              }`}
            >
              K+ กสิกร (แนะนำ)
            </button>
            <button
              type="button"
              onClick={() => setQrMode('promptpay')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                qrMode === 'promptpay'
                  ? 'bg-[#F6B8C6] text-[#543E30] shadow-xs'
                  : 'text-[#947765] hover:text-[#543E30]'
              }`}
            >
              พร้อมเพย์ (QR ตามยอด)
            </button>
            <button
              type="button"
              onClick={() => setQrMode('truemoney')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                qrMode === 'truemoney'
                  ? 'bg-[#ff6f00] text-white shadow-xs'
                  : 'text-[#947765] hover:text-[#543E30]'
              }`}
            >
              TrueMoney
            </button>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-2xl shadow-md border-4 border-[#C9DDB8] relative">
            {qrMode === 'promptpay' ? (
              qrDataUrl ? (
                <Image
                  src={qrDataUrl}
                  alt="PromptPay QR Code"
                  width={224}
                  height={224}
                  unoptimized
                  className="w-52 h-52 sm:w-56 sm:h-56 object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-[#7D946D]">
                  <QrCode className="w-12 h-12 animate-pulse" />
                </div>
              )
            ) : qrMode === 'kbank' ? (
              <Image
                src="/images/kbank_qr.png"
                alt="KBank QR Code"
                width={224}
                height={224}
                unoptimized
                className="w-52 h-52 sm:w-56 sm:h-56 object-contain"
              />
            ) : (
              <Image
                src="/images/truemoney_qr.png"
                alt="TrueMoney QR Code"
                width={224}
                height={224}
                unoptimized
                className="w-52 h-52 sm:w-56 sm:h-56 object-contain"
              />
            )}
            <div className="mt-1 text-[11px] font-semibold text-[#543E30] uppercase tracking-wider">
              {qrMode === 'promptpay'
                ? 'Thai QR Payment · พร้อมเพย์'
                : qrMode === 'kbank'
                ? 'KBank · ธนาคารกสิกรไทย'
                : 'TrueMoney Wallet · ทรูมันนี่'}
            </div>
          </div>

          {/* Account Details Box */}
          <div className="w-full bg-[#FFFEFA] border border-[#FCE4EC] rounded-2xl p-3.5 text-left space-y-2 text-xs shadow-xs">
            {/* KBank Account */}
            <div className="flex justify-between items-center text-[#947765]">
              <span>กสิกรไทย (KBANK):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#543E30] text-sm">
                  145-1-03659-5
                </span>
                <button
                  onClick={() => copyText('1451036595', 'kbank')}
                  className="py-0.5 px-2 rounded-lg bg-[#FCE4EC] text-[#543E30] hover:bg-[#F6B8C6] transition flex items-center gap-1 cursor-pointer"
                  title="คัดลอกเลขบัญชี"
                >
                  {copiedField === 'kbank' ? (
                    <Check className="w-3.5 h-3.5 text-[#7D946D]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px] font-semibold">
                    {copiedField === 'kbank' ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </span>
                </button>
              </div>
            </div>

            {/* PromptPay */}
            <div className="flex justify-between items-center text-[#947765]">
              <span>พร้อมเพย์:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#543E30] text-sm">
                  {settings.promptpay_id || '096-889-5279'}
                </span>
                <button
                  onClick={() => copyText(settings.promptpay_id || '0968895279', 'promptpay')}
                  className="py-0.5 px-2 rounded-lg bg-[#FCE4EC] text-[#543E30] hover:bg-[#F6B8C6] transition flex items-center gap-1 cursor-pointer"
                  title="คัดลอก"
                >
                  {copiedField === 'promptpay' ? (
                    <Check className="w-3.5 h-3.5 text-[#7D946D]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px] font-semibold">
                    {copiedField === 'promptpay' ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </span>
                </button>
              </div>
            </div>

            {/* TrueMoney */}
            <div className="flex justify-between items-center text-[#947765]">
              <span>ทรูมันนี่ วอลเล็ท:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#543E30] text-sm">
                  096-889-5279
                </span>
                <button
                  onClick={() => copyText('0968895279', 'truemoney')}
                  className="py-0.5 px-2 rounded-lg bg-[#FCE4EC] text-[#543E30] hover:bg-[#F6B8C6] transition flex items-center gap-1 cursor-pointer"
                  title="คัดลอกเบอร์วอลเล็ท"
                >
                  {copiedField === 'truemoney' ? (
                    <Check className="w-3.5 h-3.5 text-[#7D946D]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px] font-semibold">
                    {copiedField === 'truemoney' ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </span>
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div className="flex justify-between text-[#947765] pt-1 border-t border-[#FCE4EC]">
              <span>ชื่อบัญชี:</span>
              <span className="font-semibold text-[#543E30]">
                {settings.account_name || 'ด.ญ. ณัฐธยาน์ ขันทอง'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#947765] leading-relaxed">
            * สแกน QR Code แล้วกดปุ่ม &quot;แนบสลิป&quot; ด้านล่างเพื่อส่งหลักฐานการโอนเงินค่ะ 🍎
          </p>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#FCE4EC] pt-3 mt-2 flex items-center gap-3">
          <button
            onClick={onBack}
            className="secondary-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>แก้ไขข้อมูล</span>
          </button>

          <button
            onClick={onProceedToSlip}
            className="cta-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#543E30] cursor-pointer"
          >
            <span>แนบสลิป · ส่งให้ร้าน</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
