'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatBaht } from '@/lib/utils';
import { Order, StoreSettings } from '@/types';
import { createPromptPayCardDataUrl } from '@/lib/promptpay';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Download,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react';

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
  const [qrMode, setQrMode] = useState<'promptpay' | 'kbank' | 'truemoney'>(() => {
    if (typeof window === 'undefined') return 'promptpay';
    const p = new URLSearchParams(window.location.search).get('preview');
    if (p === 'payment_truemoney') return 'truemoney';
    if (p === 'payment_kbank') return 'kbank';
    return 'promptpay';
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrState, setQrState] = useState<{
    key: string;
    qrUrl: string;
    cardUrl: string;
  }>({ key: '', qrUrl: '', cardUrl: '' });
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const promptpayTarget = settings.promptpay_id || '0968895279';
  const accountName = settings.account_name || 'ด.ญ. ณัฐธยาน์ ขันทอง';
  const qrKey =
    isOpen && order
      ? `${order.order_no}:${order.total_amount}:${promptpayTarget}:${accountName}`
      : '';
  const isGeneratingQr = Boolean(qrKey && qrState.key !== qrKey);
  const dynamicQrUrl = qrState.key === qrKey ? qrState.qrUrl : '';
  const cardDownloadUrl = qrState.key === qrKey ? qrState.cardUrl : '';

  // Generate PromptPay Dynamic QR with locked amount
  useEffect(() => {
    if (!isOpen || !order) return;
    let ignore = false;
    const currentKey = `${order.order_no}:${order.total_amount}:${promptpayTarget}:${accountName}`;

    createPromptPayCardDataUrl(promptpayTarget, order.total_amount, {
      accountName,
      orderNo: order.order_no,
    })
      .then(({ qrDataUrl, cardDataUrl }) => {
        if (!ignore) {
          setQrState({
            key: currentKey,
            qrUrl: qrDataUrl,
            cardUrl: cardDataUrl,
          });
        }
      })
      .catch((err) => {
        console.error('Failed to generate PromptPay dynamic QR:', err);
        if (!ignore) {
          setQrState({
            key: currentKey,
            qrUrl: '',
            cardUrl: '',
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [isOpen, order, promptpayTarget, accountName]);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadQr = () => {
    if (!order) return;
    setIsDownloading(true);

    try {
      let downloadHref = '';
      let filename = '';

      if (qrMode === 'promptpay') {
        downloadHref = cardDownloadUrl || dynamicQrUrl;
        filename = `PromptPay-${order.order_no}-${order.total_amount}THB.png`;
      } else if (qrMode === 'kbank') {
        downloadHref = '/images/kbank_qr.png';
        filename = `KBank-QR-${order.order_no}.png`;
      } else {
        downloadHref = '/images/truemoney_qr.png';
        filename = `TrueMoney-QR-${order.order_no}.png`;
      }

      if (!downloadHref) return;

      const link = document.createElement('a');
      link.href = downloadHref;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download QR failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

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
        <div className="flex-1 overflow-y-auto py-3 flex flex-col items-center text-center space-y-3.5">
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
          <div className="flex items-center justify-center gap-1.5 p-1 bg-[#FFF8EC] rounded-2xl border border-[#F6B8C6]/60 text-xs w-full">
            <button
              type="button"
              onClick={() => setQrMode('promptpay')}
              className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition cursor-pointer text-xs flex items-center justify-center gap-1 ${
                qrMode === 'promptpay'
                  ? 'bg-gradient-to-r from-[#002C6C] to-[#1E40AF] text-white shadow-xs'
                  : 'text-[#947765] hover:text-[#543E30]'
              }`}
            >
              <Lock className="w-3 h-3 text-emerald-300" />
              <span>พร้อมเพย์ (ล็อคยอด)</span>
            </button>

            <button
              type="button"
              onClick={() => setQrMode('kbank')}
              className={`flex-1 py-1.5 px-2 rounded-xl font-semibold transition cursor-pointer text-xs ${
                qrMode === 'kbank'
                  ? 'bg-[#138f2d] text-white shadow-xs'
                  : 'text-[#947765] hover:text-[#543E30]'
              }`}
            >
              K+ กสิกร
            </button>

            <button
              type="button"
              onClick={() => setQrMode('truemoney')}
              className={`flex-1 py-1.5 px-2 rounded-xl font-semibold transition cursor-pointer text-xs ${
                qrMode === 'truemoney'
                  ? 'bg-[#ff6f00] text-white shadow-xs'
                  : 'text-[#947765] hover:text-[#543E30]'
              }`}
            >
              TrueMoney
            </button>
          </div>

          {/* Locked Amount Announcement Badge (PromptPay Mode) */}
          {qrMode === 'promptpay' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-emerald-300 text-[11px] text-emerald-800 font-bold shadow-2xs animate-in fade-in duration-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>คิวอาร์นี้ล็อคยอด {formatBaht(order.total_amount)} สแกนแล้วไม่ต้องพิมพ์ยอดเองค่ะ ✨</span>
            </div>
          )}

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-2xl shadow-md border-4 border-[#C9DDB8] relative flex flex-col items-center">
            {qrMode === 'promptpay' ? (
              <div className="flex flex-col items-center">
                <div className="w-full bg-[#002C6C] text-white py-1 px-3 rounded-lg text-center mb-2 flex items-center justify-center gap-1 shadow-2xs">
                  <span className="font-bold text-[11px] tracking-wider">
                    THAI QR PAYMENT · พร้อมเพย์
                  </span>
                </div>

                {isGeneratingQr ? (
                  <div className="w-52 h-52 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-xs text-[#947765] gap-2">
                    <Loader2 className="w-7 h-7 animate-spin text-[#D06D80]" />
                    <span>กำลังสร้าง QR ล็อคยอดเงิน...</span>
                  </div>
                ) : dynamicQrUrl ? (
                  <Image
                    src={dynamicQrUrl}
                    alt="PromptPay Dynamic QR Code"
                    width={224}
                    height={224}
                    unoptimized
                    className="w-52 h-52 sm:w-56 sm:h-56 object-contain"
                  />
                ) : (
                  <Image
                    src="/images/kbank_qr.png"
                    alt="KBank QR Code"
                    width={224}
                    height={224}
                    unoptimized
                    className="w-52 h-52 sm:w-56 sm:h-56 object-contain"
                  />
                )}

                <div className="mt-1 text-[11px] font-bold text-[#002C6C]">
                  ยอดเงินล็อค: {formatBaht(order.total_amount)}
                </div>
              </div>
            ) : qrMode === 'kbank' ? (
              <>
                <Image
                  src="/images/kbank_qr.png"
                  alt="KBank QR Code"
                  width={224}
                  height={224}
                  unoptimized
                  className="w-52 h-52 sm:w-56 sm:h-56 object-contain"
                />
                <div className="mt-1 text-[11px] font-semibold text-[#543E30] uppercase tracking-wider">
                  KBank · ธนาคารกสิกรไทย
                </div>
              </>
            ) : (
              <>
                <Image
                  src="/images/truemoney_qr.png"
                  alt="TrueMoney QR Code"
                  width={224}
                  height={224}
                  unoptimized
                  className="w-52 h-52 sm:w-56 sm:h-56 object-contain"
                />
                <div className="mt-1 text-[11px] font-semibold text-[#543E30] uppercase tracking-wider">
                  TrueMoney Wallet · ทรูมันนี่
                </div>
              </>
            )}
          </div>

          {/* Save QR Code Button (Requested Feature) */}
          <div className="w-full flex flex-col items-center space-y-1">
            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={isDownloading || (qrMode === 'promptpay' && isGeneratingQr)}
              className={`w-full max-w-xs py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50 ${
                downloadSuccess
                  ? 'bg-emerald-600'
                  : qrMode === 'promptpay'
                  ? 'bg-gradient-to-r from-[#002C6C] to-[#1E40AF] hover:brightness-110'
                  : qrMode === 'kbank'
                  ? 'bg-[#138f2d] hover:brightness-110'
                  : 'bg-[#ff6f00] hover:brightness-110'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึกรูป...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>บันทึกรูป QR Code สำเร็จแล้วค่ะ! 📲</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {qrMode === 'promptpay'
                      ? `💾 บันทึกรูป QR Code (ล็อคยอด ${formatBaht(order.total_amount)})`
                      : '💾 บันทึกรูป QR Code ลงเครื่อง'}
                  </span>
                </>
              )}
            </button>
            <p className="text-[10px] text-[#947765]">
              {qrMode === 'promptpay'
                ? '* บันทึกรูปแล้วเปิดแอปธนาคาร เลือก "สแกนจากรูปภาพ" ได้ทันทีค่ะ'
                : '* บันทึกรูปภาพแล้วนำไปสแกนจ่ายในแอปธนาคาร'}
            </p>
          </div>

          {/* Account Details Box */}
          <div className="w-full bg-[#FFFEFA] border border-[#FCE4EC] rounded-2xl p-3.5 text-left space-y-2 text-xs shadow-xs">
            {/* PromptPay */}
            <div className="flex justify-between items-center text-[#947765]">
              <span className="font-medium text-[#543E30]">พร้อมเพย์ (PromptPay):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#D06D80] text-sm">
                  {settings.promptpay_id || '096-889-5279'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyText(settings.promptpay_id || '0968895279', 'promptpay')
                  }
                  className="py-0.5 px-2 rounded-lg bg-[#FCE4EC] text-[#543E30] hover:bg-[#F6B8C6] transition flex items-center gap-1 cursor-pointer"
                  title="คัดลอกเบอร์พร้อมเพย์"
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

            {/* KBank Account */}
            <div className="flex justify-between items-center text-[#947765]">
              <span>กสิกรไทย (KBANK):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#543E30] text-sm">
                  145-1-03659-5
                </span>
                <button
                  type="button"
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

            {/* TrueMoney */}
            <div className="flex justify-between items-center text-[#947765]">
              <span>ทรูมันนี่ วอลเล็ท:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#543E30] text-sm">
                  096-889-5279
                </span>
                <button
                  type="button"
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
            <div className="flex justify-between text-[#947765] pt-1.5 border-t border-[#FCE4EC]">
              <span>ชื่อบัญชีรับเงิน:</span>
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
