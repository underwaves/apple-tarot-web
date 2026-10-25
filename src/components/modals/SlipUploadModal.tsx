'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Order } from '@/types';
import { X, ArrowLeft, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';

interface SlipUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  order: Order | null;
  onUploadSuccess: (updatedOrder: Order) => void;
}

export default function SlipUploadModal({
  isOpen,
  onClose,
  onBack,
  order,
  onUploadSuccess,
}: SlipUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !order) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setErrorMsg('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setErrorMsg('ขนาดไฟล์เกิน 10MB กรุณาเลือกรูปขนาดเล็กลงค่ะ');
        return;
      }
      setErrorMsg('');
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith('image/')) {
      setErrorMsg('');
      setFile(dropped);
      setPreviewUrl(URL.createObjectURL(dropped));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !previewUrl) {
      setErrorMsg('กรุณาแนบรูปสลิปการโอนเงินก่อนส่งค่ะ');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('order_no', order.order_no);
      if (order.tracking_token) {
        formData.append('tracking_token', order.tracking_token);
      }
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch('/api/orders/slip', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'อัปโหลดสลิปไม่สำเร็จ');
      }

      onUploadSuccess(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งสลิป กรุณาลองใหม่อีกครั้ง';
      setErrorMsg(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] text-[#543E30] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#FCE4EC]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
              แนบสลิปการโอน
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#FCE4EC] border border-[#F6B8C6] text-[#D06D80] rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Dropzone Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] ${
              previewUrl
                ? 'border-[#A8B99A] bg-[#FFFEFA]'
                : 'border-[#C9DDB8] hover:border-[#F6B8C6] bg-[#FFFEFA]'
            }`}
          >
            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="max-h-56 max-w-[240px] rounded-2xl overflow-hidden border border-[#C9DDB8] shadow-sm">
                  <Image
                    src={previewUrl}
                    alt="Slip Preview"
                    width={240}
                    height={320}
                    unoptimized
                    className="w-full h-auto object-contain max-h-56"
                  />
                </div>
                <span className="text-xs text-[#D06D80] underline font-medium">
                  แตะเพื่อเปลี่ยนรูปสลิป
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#D06D80] shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#543E30] block">
                    แตะเพื่อเลือกรูปสลิป
                  </span>
                  <span className="text-xs text-[#947765] mt-0.5 block">
                    หรือลากไฟล์ภาพสลิปมาวางตรงนี้
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-[#7D946D] bg-[#F4F8F0] border border-[#C9DDB8] px-3 py-1 rounded-full font-medium">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>JPG, PNG, WEBP (สูงสุด 5MB)</span>
                </div>
              </div>
            )}
          </div>

          {/* Info note */}
          <p className="text-xs text-[#d8c3b0]/80 text-center leading-relaxed">
            เมื่อส่งสลิปแล้ว เจ้าของร้านจะทำการตรวจสอบและนำคำสั่งซื้อของคุณเข้าคิวทันทีค่ะ
          </p>

          {/* Action Buttons */}
          <div className="border-t border-[#95d5b2]/30 pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={isUploading}
              className="secondary-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับไปหน้า QR</span>
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="cta-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-white cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังส่งข้อมูล...</span>
                </>
              ) : (
                <span>ส่งข้อมูลรับบิล</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
