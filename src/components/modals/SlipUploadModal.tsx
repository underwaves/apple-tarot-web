'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Order } from '@/types';
import { X, ArrowLeft, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { compressImageToDataUrl } from '@/lib/image-client';

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
        // Compress slip image to ~50-80KB to ensure fast upload and permanent compact storage
        try {
          const compressedDataUrl = await compressImageToDataUrl(file, 1200, 1600, 0.82);
          const resBlob = await fetch(compressedDataUrl).then((r) => r.blob());
          const compressedFile = new File([resBlob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
            type: 'image/jpeg',
          });
          formData.append('file', compressedFile);
        } catch {
          // Fallback to original file if client compression fails
          formData.append('file', file);
        }
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
        <div className="flex items-center justify-between pb-3 border-b border-[#F6B8C6]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
              แนบสลิปการโอน
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FCE4EC] border border-[#F6B8C6] flex items-center justify-center text-[#543E30] hover:bg-[#F6B8C6] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#FCE4EC] border-2 border-[#D06D80] text-[#543E30] rounded-xl text-xs font-bold">
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
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] shadow-xs ${
              previewUrl
                ? 'border-[#7D946D] bg-[#FFFEFA]'
                : 'border-[#D06D80]/80 hover:border-[#D06D80] bg-[#FFFEFA]'
            }`}
          >
            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="max-h-56 max-w-[240px] rounded-2xl overflow-hidden border-2 border-[#A8B99A] shadow-sm">
                  <Image
                    src={previewUrl}
                    alt="Slip Preview"
                    width={240}
                    height={320}
                    unoptimized
                    className="w-full h-auto object-contain max-h-56"
                  />
                </div>
                <span className="text-xs text-[#543E30] bg-[#FCE4EC] border border-[#E88E9F] px-3.5 py-1.5 rounded-full font-bold shadow-2xs">
                  แตะเพื่อเปลี่ยนรูปสลิป
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#FCE4EC] border-2 border-[#F6B8C6] flex items-center justify-center text-[#D06D80] shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <span className="inline-block text-sm font-bold text-[#543E30] bg-[#FCE4EC] border border-[#E88E9F] px-4 py-1.5 rounded-full shadow-2xs">
                    แตะเพื่อเลือกรูปสลิป
                  </span>
                  <span className="text-xs font-medium text-[#543E30] mt-2 block">
                    หรือลากไฟล์ภาพสลิปมาวางตรงนี้
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#543E30] bg-[#F4F8F0] border border-[#A8B99A] px-3 py-1 rounded-full font-semibold">
                  <ImageIcon className="w-3.5 h-3.5 text-[#7D946D]" />
                  <span>รองรับ JPG, PNG, WEBP</span>
                </div>
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="p-3 rounded-xl bg-[#FFFEFA] border border-[#F6B8C6] text-xs text-[#543E30] font-medium text-center leading-relaxed shadow-2xs">
            เมื่อส่งสลิปแล้ว เจ้าของร้านจะทำการตรวจสอบและนำคำสั่งซื้อของคุณเข้าคิวทันทีค่ะ
          </div>

          {/* Action Buttons */}
          <div className="border-t border-[#F6B8C6] pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={isUploading}
              className="secondary-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold text-[#543E30]! border-2 border-[#A8B99A]! cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับไปหน้า QR</span>
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="cta-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold text-[#543E30]! border-2 border-[#D06D80]/60 shadow-md cursor-pointer"
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
