'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  icon?: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title = 'ยืนยันการทำรายการ',
  message,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  variant = 'danger',
  icon,
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#FFF8EC] border-2 border-[#F6B8C6] w-full max-w-sm rounded-3xl p-6 shadow-2xl text-[#543E30] animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#543E30] hover:bg-[#F6B8C6] transition cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Cute Themed Icon */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-xs border ${
              variant === 'danger'
                ? 'bg-[#FCE4EC] border-[#F6B8C6] text-[#D06D80]'
                : variant === 'warning'
                ? 'bg-[#FEF3C7] border-[#FCD34D] text-[#D97706]'
                : 'bg-[#E8F5E9] border-[#C9DDB8] text-[#2E7D32]'
            }`}
          >
            {icon ? (
              icon
            ) : variant === 'danger' ? (
              <Trash2 className="w-6 h-6 text-[#D06D80]" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-[#D97706]" />
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-[#D06D80] mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-xs text-[#947765] leading-relaxed mb-6 whitespace-pre-line px-1">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 px-3 rounded-xl border border-[#F6B8C6]/60 bg-[#FFF8EC] text-[#543E30] hover:bg-[#FCE4EC] text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-white shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                variant === 'danger'
                  ? 'bg-[#D06D80] hover:bg-[#b85467]'
                  : 'cta-btn !text-[#543E30]'
              }`}
            >
              {isLoading ? 'กำลังดำเนินการ...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
