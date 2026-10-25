'use client';

import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Loader2, Sparkles, MapPin } from 'lucide-react';
import { PackageItem, OrderType, StoreSettings } from '@/types';

interface CartEntry {
  pkg: PackageItem;
  quantity: number;
}

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  cartItems: CartEntry[];
  settings?: StoreSettings | null;
  onProceedToPayment: (orderData: {
    customer_name: string;
    order_type: OrderType;
    birth_date?: string;
    birth_time?: string;
    zodiac_sign?: string;
    question?: string;
    shipping_name?: string;
    shipping_phone?: string;
    shipping_address?: string;
    shipping_subdistrict?: string;
    shipping_district?: string;
    shipping_province?: string;
    shipping_postal_code?: string;
    customer_note?: string;
    contact_channel: string;
    contact_value: string;
    is_express?: boolean;
  }) => Promise<void>;
  isLoading: boolean;
}

const ZODIAC_SIGNS = [
  'เลือกราศี (ถ้าทราบ)',
  'ราศีเมษ (13 เม.ย. - 13 พ.ค.)',
  'ราศีพฤษภ (14 พ.ค. - 13 มิ.ย.)',
  'ราศีเมถุน (14 มิ.ย. - 14 ก.ค.)',
  'ราศีกรกฎ (15 ก.ค. - 16 ส.ค.)',
  'ราศีสิงห์ (17 ส.ค. - 16 ก.ย.)',
  'ราศีกันย์ (17 ก.ย. - 16 ต.ค.)',
  'ราศีตุลย์ (17 ต.ค. - 15 พ.ย.)',
  'ราศีพิจิก (16 พ.ย. - 15 ธ.ค.)',
  'ราศีธนู (16 ธ.ค. - 13 ม.ค.)',
  'ราศีมังกร (14 ม.ค. - 12 ก.พ.)',
  'ราศีกุมภ์ (13 ก.พ. - 13 มี.ค.)',
  'ราศีมีน (14 มี.ค. - 12 เม.ย.)',
];

export default function CustomerInfoModal({
  isOpen,
  onClose,
  onBack,
  cartItems,
  settings,
  onProceedToPayment,
  isLoading,
}: CustomerInfoModalProps) {
  // Common
  const [name, setName] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [contactChannel, setContactChannel] = useState<'LINE' | 'Instagram' | 'Facebook' | 'Phone'>('LINE');
  const [contactValue, setContactValue] = useState('');
  const [isExpress, setIsExpress] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'checkout_express';
  });

  // Fortune
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [question, setQuestion] = useState('');

  // Shipping
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingSubdistrict, setShippingSubdistrict] = useState('');
  const [shippingDistrict, setShippingDistrict] = useState('');
  const [shippingProvince, setShippingProvince] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Determine what is inside the cart
  const hasPhysical = cartItems.some((it) => it.pkg.product_type === 'physical');
  const hasFortune = cartItems.some((it) => it.pkg.product_type !== 'physical');
  const orderType: OrderType = hasPhysical && hasFortune ? 'mixed' : hasPhysical ? 'physical' : 'fortune';

  // Check if cart already has an express package selected (like pkg-3 "ลัดคิวแบบเจาะจง")
  const hasExpressPkg = cartItems.some(
    (it) => it.pkg.id === 'pkg-3' || it.pkg.name.includes('ลัดคิว')
  );
  const effectiveIsExpress = isExpress || hasExpressPkg;
  const EXPRESS_FLAT_RATE = 32;

  const expressEstimatedTime = settings?.express_estimated_time || '⚡ ภายใน 12-24 ชั่วโมง';
  const fortuneItems = cartItems.filter((it) => it.pkg.product_type !== 'physical');
  const cartSubtotal = cartItems.reduce((acc, it) => acc + it.pkg.price * it.quantity, 0);

  // If express is active:
  // - If hasExpressPkg, it's already 32 ฿ in cartSubtotal.
  // - If not hasExpressPkg, the fortune question upgrades to the single flat express rate of 32 ฿ ("ลัดคิวมีเรทเดียวเป็นราคา 32 บาทเลย")
  const fortuneSubtotal = fortuneItems.reduce((acc, it) => acc + it.pkg.price * it.quantity, 0);
  const expressAddedCost = hasExpressPkg
    ? 0
    : effectiveIsExpress && fortuneItems.length > 0
    ? Math.max(0, EXPRESS_FLAT_RATE - fortuneSubtotal)
    : effectiveIsExpress
    ? EXPRESS_FLAT_RATE
    : 0;

  const totalWithExpress = cartSubtotal + expressAddedCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('กรุณากรอกชื่อลูกค้า');
      return;
    }

    if (!contactValue.trim()) {
      setErrorMsg(`กรุณากรอกข้อมูลสำหรับติดต่อผ่าน ${contactChannel}`);
      return;
    }

    if (hasFortune && !question.trim()) {
      setErrorMsg('กรุณาระบุคำถามหรือเรื่องที่ต้องการดูดวง');
      return;
    }

    if (hasPhysical) {
      if (!shippingName.trim() && !name.trim()) {
        setErrorMsg('กรุณากรอกชื่อผู้รับสินค้า');
        return;
      }
      if (!shippingPhone.trim()) {
        setErrorMsg('กรุณากรอกเบอร์โทรศัพท์สำหรับจัดส่งพัสดุ');
        return;
      }
      if (!shippingAddress.trim() || !shippingProvince.trim() || !shippingPostalCode.trim()) {
        setErrorMsg('กรุณากรอกที่อยู่จัดส่ง จังหวัด และรหัสไปรษณีย์ให้ครบถ้วน');
        return;
      }
    }

    setErrorMsg('');
    await onProceedToPayment({
      customer_name: name.trim(),
      order_type: orderType,
      birth_date: hasFortune ? birthDate.trim() || undefined : undefined,
      birth_time: hasFortune ? birthTime.trim() || undefined : undefined,
      zodiac_sign: hasFortune && zodiacSign && !zodiacSign.includes('เลือก') ? zodiacSign : undefined,
      question: hasFortune ? question.trim() || undefined : undefined,
      shipping_name: hasPhysical ? (shippingName.trim() || name.trim()) : undefined,
      shipping_phone: hasPhysical ? shippingPhone.trim() : undefined,
      shipping_address: hasPhysical ? shippingAddress.trim() : undefined,
      shipping_subdistrict: hasPhysical ? shippingSubdistrict.trim() || undefined : undefined,
      shipping_district: hasPhysical ? shippingDistrict.trim() || undefined : undefined,
      shipping_province: hasPhysical ? shippingProvince.trim() || undefined : undefined,
      shipping_postal_code: hasPhysical ? shippingPostalCode.trim() || undefined : undefined,
      customer_note: customerNote.trim() || undefined,
      contact_channel: contactChannel,
      contact_value: contactValue.trim(),
      is_express: effectiveIsExpress,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] text-[#543E30] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#FCE4EC]">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {hasPhysical && !hasFortune ? '📦' : hasPhysical && hasFortune ? '🍎' : '🔮'}
            </span>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
                {hasPhysical && !hasFortune
                  ? 'ข้อมูลการจัดส่งสินค้า'
                  : hasPhysical && hasFortune
                  ? 'ข้อมูลดูดวง & จัดส่งสินค้า'
                  : 'ข้อมูลเปิดดวงชะตา'}
              </h3>
              <p className="text-[11px] text-[#7D946D]">
                {hasPhysical && !hasFortune
                  ? 'ระบุที่อยู่จัดส่งพัสดุสำหรับสินค้าจริงในสวนแอปเปิ้ลค่ะ'
                  : hasPhysical && hasFortune
                  ? 'ระบุข้อมูลคำทำนายและที่อยู่จัดส่งของที่ระลึกค่ะ'
                  : 'กรอกข้อมูลเพื่อให้แม่หมออ่านดวงได้แม่นยำที่สุดค่ะ'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#543E30] hover:bg-[#F6B8C6] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {errorMsg && (
            <div className="p-3 bg-[#FCE4EC] border border-[#F6B8C6] text-[#D06D80] rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Section: Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-[#543E30] mb-1">
              ชื่อลูกค้า *
            </label>
            <input
              type="text"
              placeholder="เช่น คุณกานต์ หรือ มุกดา"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* SECTION: FORTUNE TELLING (Only if order contains fortune products) */}
          {hasFortune && (
            <div className="bg-[#FFFEFA] border border-[#F6B8C6]/60 rounded-2xl p-3.5 space-y-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D06D80]">
                <Sparkles className="w-3.5 h-3.5 text-[#F6B8C6]" />
                <span>ข้อมูลสำหรับคำทำนาย</span>
              </div>

              {/* Birth Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#947765] mb-1">
                    วัน/เดือน/ปีเกิด
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#947765] mb-1">
                    เวลาเกิด (ถ้าทราบ)
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Zodiac Sign */}
              <div>
                <label className="block text-[11px] font-medium text-[#947765] mb-1">
                  ราศีเกิด
                </label>
                <select
                  value={zodiacSign}
                  onChange={(e) => setZodiacSign(e.target.value)}
                >
                  {ZODIAC_SIGNS.map((z, idx) => (
                    <option key={idx} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              {/* Questions / Topic */}
              <div>
                <label className="block text-[11px] font-semibold text-[#543E30] mb-1">
                  คำถาม / เรื่องที่อยากดูดวง *
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น เรื่องความรักกับคนคุยปัจจุบัน / เรื่องงานที่สัมภาษณ์ไป"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required={hasFortune}
                />
              </div>
            </div>
          )}

          {/* SECTION: PHYSICAL SHIPPING (Only if order contains physical products) */}
          {hasPhysical && (
            <div className="bg-[#FFFEFA] border border-[#C9DDB8] rounded-2xl p-3.5 space-y-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#7D946D]">
                <MapPin className="w-3.5 h-3.5 text-[#A8B99A]" />
                <span>ข้อมูลที่อยู่จัดส่งพัสดุ (สินค้าจริง)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#947765] mb-1">
                    ชื่อผู้รับพัสดุ *
                  </label>
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล ผู้รับ"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#947765] mb-1">
                    เบอร์โทรศัพท์ผู้รับ *
                  </label>
                  <input
                    type="tel"
                    placeholder="เช่น 0812345678"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    required={hasPhysical}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#947765] mb-1">
                  ที่อยู่ (บ้านเลขที่ / หมู่บ้าน / ถนน / ซอย) *
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น 123/45 หมู่บ้านสวนสุข ถ.แอปเปิ้ล"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required={hasPhysical}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-[#947765] mb-1">ตำบล / แขวง</label>
                  <input
                    type="text"
                    placeholder="ตำบล"
                    value={shippingSubdistrict}
                    onChange={(e) => setShippingSubdistrict(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#947765] mb-1">อำเภอ / เขต</label>
                  <input
                    type="text"
                    placeholder="อำเภอ"
                    value={shippingDistrict}
                    onChange={(e) => setShippingDistrict(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#947765] mb-1">จังหวัด *</label>
                  <input
                    type="text"
                    placeholder="จังหวัด"
                    value={shippingProvince}
                    onChange={(e) => setShippingProvince(e.target.value)}
                    required={hasPhysical}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#947765] mb-1">รหัสไปรษณีย์ *</label>
                  <input
                    type="text"
                    placeholder="10110"
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                    required={hasPhysical}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Channel Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#543E30] mb-1.5">
              ช่องทางติดต่อหลัก *
            </label>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {(['LINE', 'Instagram', 'Facebook', 'Phone'] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setContactChannel(ch)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition cursor-pointer ${
                    contactChannel === ch
                      ? 'bg-[#F6B8C6] text-[#543E30] border-[#E88E9F] font-bold shadow-xs'
                      : 'bg-[#F4F8F0] text-[#7D946D] border-[#C9DDB8] hover:bg-[#E8F0E2]'
                  }`}
                >
                  {ch === 'Phone' ? 'เบอร์โทร' : ch}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder={
                contactChannel === 'LINE'
                  ? 'ใส่ LINE ID เพื่อรับข้อมูลหรือแจ้งสถานะ'
                  : contactChannel === 'Instagram'
                  ? 'ใส่ IG Handle เช่น @my.ig'
                  : contactChannel === 'Facebook'
                  ? 'ใส่ชื่อโปรไฟล์ Facebook'
                  : 'ใส่เบอร์โทรศัพท์ 10 หลัก'
              }
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              required
            />
          </div>

          {/* Express Queue Option */}
          {settings?.enable_express_queue !== false && (
            <div
              className={`p-3.5 rounded-2xl border transition select-none ${
                effectiveIsExpress
                  ? 'bg-gradient-to-r from-[#FFF8EC] to-[#FFF3E0] border-[#F6B8C6] shadow-[0_4px_16px_rgba(246,184,198,0.25)] ring-1 ring-[#F6B8C6]'
                  : 'bg-[#FFFEFA] border-[#FCE4EC] hover:border-[#F6B8C6]/60 shadow-xs cursor-pointer'
              }`}
              onClick={() => {
                if (!hasExpressPkg) {
                  setIsExpress(!isExpress);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="express-queue-toggle"
                  checked={effectiveIsExpress}
                  disabled={hasExpressPkg}
                  onChange={(e) => {
                    if (!hasExpressPkg) {
                      setIsExpress(e.target.checked);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 w-4 h-4 accent-[#D06D80] rounded cursor-pointer disabled:opacity-75"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="express-queue-toggle"
                      className="font-bold text-xs sm:text-sm text-[#543E30] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-sm">⚡</span>
                      <span>บริการลัดคิวพิเศษ (Express Queue)</span>
                    </label>
                    <span className="text-xs font-bold text-[#D06D80] bg-[#FFF8EC] px-2.5 py-0.5 rounded-full border border-[#F6D1B5] shrink-0">
                      {hasExpressPkg
                        ? 'เรทเดียว 32 ฿ (รวมในรายการแล้ว)'
                        : 'เรทเดียว 32 ฿'}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#947765] mt-1 leading-relaxed">
                    {hasExpressPkg
                      ? `คุณได้เลือกแพ็กเกจลัดคิวแบบเจาะจงเรียบร้อยแล้ว ได้รับคำทำนายรวดเร็วทันใจ (${expressEstimatedTime}) 🍎✨`
                      : `ลัดคิวมีเรทเดียวเป็นราคา 32 บาท ได้รับคำทำนายด่วนพิเศษ (${expressEstimatedTime}) 🍎✨`}
                  </p>
                  {effectiveIsExpress && (
                    <div className="mt-2 pt-2 border-t border-[#F6B8C6]/40 flex items-center justify-between text-xs text-[#543E30] font-semibold">
                      <span>ยอดรวมใหม่พร้อมบริการลัดคิว:</span>
                      <span className="font-serif font-bold text-sm text-[#D06D80]">
                        ฿{totalWithExpress.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Customer Note */}
          <div>
            <label className="block text-xs font-semibold text-[#543E30] mb-1">
              ข้อความหรือโน้ตเพิ่มเติมถึงร้านค้า (ไม่บังคับ)
            </label>
            <input
              type="text"
              placeholder="ระบุข้อความเพิ่มเติมถ้ามี"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="secondary-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับไปตะกร้า</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="cta-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#543E30] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <span>ไปหน้าโอนเงิน</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
