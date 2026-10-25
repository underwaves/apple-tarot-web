'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { QueueItem, PublicQueueItem } from '@/types';
import { maskName } from '@/lib/utils';
import { Search, Clock, ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Sparkles, Key } from 'lucide-react';
import AmbientCanvas from '@/components/AmbientCanvas';

function QueueContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order_no') || '';

  const [searchOrderNo, setSearchOrderNo] = useState(() => {
    if (initialOrder) return initialOrder;
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('apple_last_order_no') || '';
      } catch {
        return '';
      }
    }
    return '';
  });

  const [searchTrackingToken, setSearchTrackingToken] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('apple_last_tracking_token') || '';
      } catch {
        return '';
      }
    }
    return '';
  });

  const [publicQueues, setPublicQueues] = useState<PublicQueueItem[]>([]);
  const [personalQueue, setPersonalQueue] = useState<QueueItem | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const refreshQueues = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queues');
      const data = await res.json();
      if (data.success) {
        setPublicQueues(data.queues || []);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch queues', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/queues');
        const data = await res.json();
        if (!ignore && data.success) {
          setPublicQueues(data.queues || []);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch queues', err);
      }
    }
    load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNo.trim()) {
      setSearchError('กรุณากรอกหมายเลขออเดอร์');
      return;
    }
    if (!searchTrackingToken.trim()) {
      setSearchError('กรุณากรอกรหัสติดตามสถานะ (เพื่อความปลอดภัยของข้อมูลส่วนตัว)');
      return;
    }

    setIsLoading(true);
    setSearchError('');
    try {
      const res = await fetch(
        `/api/queues?order_no=${encodeURIComponent(searchOrderNo.trim())}&tracking_token=${encodeURIComponent(
          searchTrackingToken.trim()
        )}`
      );
      const data = await res.json();
      if (data.success && data.queue) {
        setPersonalQueue(data.queue);
      } else {
        setPersonalQueue(null);
        setSearchError(data.error || 'ไม่พบคิวสำหรับออเดอร์นี้ หรือรหัสติดตามไม่ถูกต้อง');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการตรวจสอบคิว';
      setSearchError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'รอตรวจสลิป':
        return {
          bg: 'bg-[#FFF3E0] text-[#D97706] border-[#F6D1B5]',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
      case 'รอตรวจคิว':
        return {
          bg: 'bg-[#FCE4EC] text-[#D06D80] border-[#F6B8C6]',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case 'กำลังดำเนินการ':
        return {
          bg: 'bg-[#FFF0F5] text-[#C25975] border-[#F6B8C6]',
          icon: <Sparkles className="w-3.5 h-3.5" />,
        };
      case 'เสร็จแล้ว':
        return {
          bg: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C9DDB8]',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: 'bg-[#F5F5F5] text-[#947765] border-[#E0E0E0]',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
    }
  };

  return (
    <main className="page-container min-h-screen">
      <AmbientCanvas />

      {/* Back to Home Link */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#947765] hover:text-[#543E30] transition bg-[#FFFEFA] px-3.5 py-1.5 rounded-full border border-[#F6B8C6] shadow-sm hover:bg-[#FCE4EC]/50"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D06D80]" />
          <span>กลับหน้าร้าน</span>
        </Link>
      </div>

      <div className="bg-[#FFF8EC]/95 border-2 border-[#F6B8C6] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md text-[#543E30]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F6B8C6]/40">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏷️</span>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#D06D80]">
                ติดตามคิวและคำสั่งซื้อ
              </h1>
              <p className="text-xs text-[#947765]">
                สวนแอปเปิ้ล ออร์ชาร์ด · Apple Orchard Studio
              </p>
            </div>
          </div>
          <button
            onClick={refreshQueues}
            disabled={isLoading}
            className="text-xs text-[#947765] hover:text-[#543E30] flex items-center gap-1.5 bg-[#FFFEFA] px-3 py-1.5 rounded-lg border border-[#F6B8C6] transition cursor-pointer shadow-sm hover:bg-[#FCE4EC]/50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D06D80] ${isLoading ? 'animate-spin' : ''}`} />
            <span>รีเฟรช</span>
          </button>
        </div>

        {/* Secure Tracking Form */}
        <form onSubmit={handleTrackOrder} className="my-4 p-4 bg-[#FFFEFA] rounded-xl border border-[#F6B8C6]/60 shadow-sm space-y-3">
          <span className="text-xs font-semibold text-[#543E30] block">
            ค้นหาคิวของคุณด้วยหมายเลขออเดอร์และรหัสติดตาม
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#A8B99A]" />
              <input
                type="text"
                placeholder="หมายเลขออเดอร์ (APL-...)"
                value={searchOrderNo}
                onChange={(e) => setSearchOrderNo(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-[#A8B99A]" />
              <input
                type="text"
                placeholder="รหัสติดตาม (trk_...)"
                value={searchTrackingToken}
                onChange={(e) => setSearchTrackingToken(e.target.value)}
                className="pl-9 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 pt-1">
            {searchError ? (
              <span className="text-xs text-[#D06D80] font-medium">⚠️ {searchError}</span>
            ) : (
              <span className="text-[11px] text-[#947765]">
                * เพื่อความเป็นส่วนตัว ต้องระบุรหัสติดตามที่ได้รับหลังสั่งซื้อ
              </span>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="cta-btn text-xs py-2 px-5 font-semibold text-[#543E30] cursor-pointer flex-none"
            >
              ค้นหาคิวของฉัน
            </button>
          </div>
        </form>

        {/* Personal Search Result Highlight */}
        {personalQueue && (
          <div className="my-4 p-4 bg-[#FFFEFA] border-2 border-[#F6B8C6] rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍎</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-xl text-[#D06D80]">
                      คิวของคุณ: #{personalQueue.queue_no}
                    </h3>
                    {personalQueue.is_express && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[11px] font-bold text-[#D97706] shadow-xs animate-pulse">
                        ⚡ ลัดคิว
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#947765] block font-mono">
                    ออเดอร์: {personalQueue.order_no} ({personalQueue.customer_name})
                  </span>
                </div>
              </div>
              <div
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
                  getStatusBadge(personalQueue.status).bg
                }`}
              >
                {getStatusBadge(personalQueue.status).icon}
                <span>{personalQueue.status}</span>
              </div>
            </div>

            {personalQueue.items_summary && (
              <div className="mt-3 text-xs text-[#543E30] bg-[#FFF8EC] p-2.5 rounded-lg border border-[#FCE4EC]">
                <span className="text-[11px] text-[#947765] block font-semibold">รายการ:</span>
                <span>{personalQueue.items_summary}</span>
              </div>
            )}

            {personalQueue.estimated_time && (
              <div className="mt-2 text-xs text-[#A8B99A] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>กำหนดเวลาโดยประมาณ: {personalQueue.estimated_time}</span>
              </div>
            )}

            {personalQueue.shop_note && (
              <div className="mt-2 text-xs text-[#543E30] bg-[#FCE4EC]/60 p-2.5 rounded-lg border border-[#F6B8C6]/50">
                💬 ข้อความจากร้าน: {personalQueue.shop_note}
              </div>
            )}
          </div>
        )}

        {/* Public Queue List */}
        <div className="mt-6">
          <h2 className="font-serif text-lg font-bold text-[#D06D80] mb-3">
            กระดานคิวรวมหน้าร้าน ({publicQueues.length} คิว)
          </h2>

          <div className="space-y-2">
            {publicQueues.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#947765]">
                ยังไม่มีคิวในขณะนี้ค่ะ
              </div>
            ) : (
              publicQueues.map((item) => {
                const badge = getStatusBadge(item.status);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl flex items-center justify-between transition shadow-sm ${
                      item.is_express
                        ? 'bg-[#FFFDF7] border-2 border-[#FCD34D] hover:border-[#F59E0B]'
                        : 'bg-[#FFFEFA] border border-[#FCE4EC] hover:border-[#F6B8C6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-base border ${
                          item.is_express
                            ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#B45309]'
                            : 'bg-[#FFF8EC] border-[#C9DDB8] text-[#D06D80]'
                        }`}
                      >
                        #{item.queue_no}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#543E30] flex items-center gap-1.5">
                          <span>{maskName(item.customer_name)}</span>
                          {item.is_express && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]">
                              ⚡ ลัดคิว
                            </span>
                          )}
                        </div>
                        {item.estimated_time && (
                          <div className="text-xs text-[#947765] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-[#A8B99A]" />
                            <span>{item.estimated_time}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${badge.bg}`}
                    >
                      {badge.icon}
                      <span>{item.status}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function QueuePage() {
  return (
    <Suspense fallback={<div className="page-container text-center py-20 text-[#95d5b2]">กำลังโหลด...</div>}>
      <QueueContent />
    </Suspense>
  );
}
