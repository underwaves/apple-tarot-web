'use client';

import React from 'react';
import { StoreSettings } from '@/types';
import { X, Phone, ExternalLink, Globe } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

export default function ContactModal({
  isOpen,
  onClose,
  settings,
}: ContactModalProps) {
  if (!isOpen) return null;

  const renderIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('line')) {
      return (
        <svg className="w-5 h-5 fill-[#06c755]" viewBox="0 0 24 24">
          <path d="M24 10.3c0-4.6-4.5-8.3-10-8.3S4 5.7 4 10.3c0 4.1 3.6 7.5 8.5 8.1.3.1.8.2.9.6.1.3.1.7 0 1-.1.4-.4 1.4-.5 1.7-.1.4-.3 1.2.7.7 1-.6 5.4-3.2 7.4-5.5 2-2.1 3-4.1 3-6.1z" />
        </svg>
      );
    }
    if (t.includes('insta')) {
      return (
        <svg className="w-5 h-5 fill-[#e1306c]" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    }
    if (t.includes('face')) {
      return (
        <svg className="w-5 h-5 fill-[#1877f2]" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    }
    if (t.includes('phone') || t.includes('โทร')) {
      return <Phone className="w-5 h-5 text-[#A8B99A]" />;
    }
    return <Globe className="w-5 h-5 text-[#A8B99A]" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col text-[#543E30] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F6B8C6]/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
              ติดต่อสวนแอปเปิ้ล
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#947765] hover:text-[#543E30] hover:bg-[#F6B8C6]/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact Links */}
        <div className="py-4 space-y-2.5">
          {settings.socials && settings.socials.length > 0 ? (
            settings.socials.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pkg-btn w-full p-3.5 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8EC] flex items-center justify-center border border-[#C9DDB8] shadow-sm">
                    {renderIcon(social.type)}
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-[#543E30] block">
                      {social.type}
                    </span>
                    <span className="text-xs text-[#947765] block">
                      {social.name || social.url}
                    </span>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-[#A8B99A] group-hover:text-[#D06D80] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </a>
            ))
          ) : (
            <p className="text-center text-xs text-[#947765]">ยังไม่มีข้อมูลช่องทางติดต่อ</p>
          )}
        </div>

        <p className="text-[11px] text-[#947765] text-center">
          สามารถทักแชทสอบถามรายละเอียดหรือแจ้งชำระเงินได้ตลอดเวลาค่ะ 🍎
        </p>
      </div>
    </div>
  );
}
