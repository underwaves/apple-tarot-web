'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AmbientCanvas from '@/components/AmbientCanvas';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="page-container min-h-screen flex flex-col justify-center items-center">
      <AmbientCanvas />

      <div className="z-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#172d1d] border-2 border-[#95d5b2] flex items-center justify-center text-[#ff6b6b] mx-auto shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-[#ffd4bf]">
          ระบบจัดการหลังบ้าน
        </h1>
        <p className="text-xs text-[#d8c3b0]">
          สวนแอปเปิ้ล ออร์ชาร์ด (Apple Orchard Admin Studio)
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="cta-btn py-2.5 px-5 text-xs font-semibold text-white shadow-lg cursor-pointer"
          >
            เปิดหน้าต่างจัดการหลังบ้าน
          </button>
          <Link
            href="/"
            className="secondary-btn py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าร้าน</span>
          </Link>
        </div>
      </div>

      <AdminDashboard isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}
