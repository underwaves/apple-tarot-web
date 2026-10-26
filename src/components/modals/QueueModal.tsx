'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { QueueItem, PublicQueueItem } from '@/types';
import { maskName, formatQueueNo } from '@/lib/utils';
import { X, Search, Clock, RefreshCw, CheckCircle, AlertCircle, Sparkles, Key } from 'lucide-react';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNo?: string;
}

export default function QueueModal({
  isOpen,
  onClose,
  initialOrderNo = '',
}: QueueModalProps) {
  const [searchOrderNo, setSearchOrderNo] = useState(() => {
    if (initialOrderNo) return initialOrderNo;
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
  const [isLoading, setIsLoading] = useState(false);
  const [personalQueue, setPersonalQueue] = useState<QueueItem | null>(null);
  const [searchError, setSearchError] = useState('');

  const refreshQueues = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queues?public=1');
      const data = await res.json();
      if (data.success) {
        setPublicQueues(data.queues || []);
      }
      if (searchOrderNo.trim() && searchTrackingToken.trim()) {
        const trackRes = await fetch(
          `/api/queues?order_no=${encodeURIComponent(searchOrderNo.trim())}&tracking_token=${encodeURIComponent(
            searchTrackingToken.trim()
          )}`
        );
        const trackData = await trackRes.json();
        if (trackData.success && trackData.queue) {
          setPersonalQueue(trackData.queue);
          setSearchError('');
        }
      }
    } catch (err: unknown) {
      console.error('Failed to fetch queues', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    let storedOrderNo = initialOrderNo;
    let storedToken = '';
    if (typeof window !== 'undefined') {
      try {
        if (!storedOrderNo) {
          storedOrderNo = sessionStorage.getItem('apple_last_order_no') || '';
        }
        storedToken = sessionStorage.getItem('apple_last_tracking_token') || '';
      } catch {
        // ignore
      }
    }

    const effectiveOrderNo = searchOrderNo.trim() || storedOrderNo.trim();
    const effectiveToken = searchTrackingToken.trim() || storedToken.trim();

    if (!searchOrderNo.trim() && storedOrderNo) {
      setSearchOrderNo(storedOrderNo);
    }
    if (!searchTrackingToken.trim() && storedToken) {
      setSearchTrackingToken(storedToken);
    }

    async function load() {
      try {
        const res = await fetch('/api/queues?public=1');
        const data = await res.json();
        if (!ignore && data.success) {
          setPublicQueues(data.queues || []);
        }

        if (effectiveOrderNo && effectiveToken) {
          const trackRes = await fetch(
            `/api/queues?order_no=${encodeURIComponent(effectiveOrderNo)}&tracking_token=${encodeURIComponent(
              effectiveToken
            )}`
          );
          const trackData = await trackRes.json();
          if (!ignore && trackData.success && trackData.queue) {
            setPersonalQueue(trackData.queue);
            setSearchError('');
          }
        }
      } catch (err: unknown) {
        console.error('Failed to fetch queues', err);
      }
    }
    load();

    return () => {
      ignore = true;
    };
  }, [isOpen, initialOrderNo]);

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

  // Filter public queues for quick display
  const displayedQueues = useMemo(() => {
    return publicQueues;
  }, [publicQueues]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] text-[#543E30] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F6B8C6]/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏷️</span>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
                ติดตามคิวและคำสั่งซื้อ
              </h3>
              <p className="text-[11px] text-[#947765]">
                ระบบติดตามคิวสวนแอปเปิ้ลแบบเรียลไทม์ (ปกป้องข้อมูลส่วนบุคคล)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#947765] hover:text-[#543E30] hover:bg-[#F6B8C6]/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Secure Order Tracking Form */}
        <form onSubmit={handleTrackOrder} className="pt-3 pb-2 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#A8B99A]" />
              <input
                type="text"
                placeholder="เลขบิลคำสั่งซื้อ (เช่น 00001)"
                value={searchOrderNo}
                onChange={(e) => setSearchOrderNo(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-[#A8B99A]" />
              <input
                type="text"
                placeholder="รหัสติดตามสถานะ"
                value={searchTrackingToken}
                onChange={(e) => setSearchTrackingToken(e.target.value)}
                className="pl-9 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-between items-center gap-2">
            {searchError ? (
              <span className="text-[11px] text-[#D06D80] font-medium">⚠️ {searchError}</span>
            ) : (
              <span className="text-[10px] text-[#947765]">
                * ใส่เลขบิลคำสั่งซื้อและรหัสติดตามเพื่อดูสถานะคิวของท่าน
              </span>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="cta-btn text-xs py-1.5 px-4 font-semibold text-[#543E30] cursor-pointer flex-none"
            >
              ค้นหาคิวของฉัน
            </button>
          </div>
        </form>

        {/* Personal Search Result Highlight */}
        {personalQueue && (
          <div className="my-2 p-3.5 bg-[#FFFEFA] border-2 border-[#F6B8C6] rounded-xl shadow-md animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍎</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-[#D06D80]">
                      คิวของคุณ: #{formatQueueNo(personalQueue.queue_no || personalQueue.order_no)}
                    </span>
                    {personalQueue.is_express && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[10px] font-bold text-[#D97706] shadow-xs animate-pulse">
                        ⚡ ลัดคิว
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#947765] block font-mono">
                    บิลคำสั่งซื้อ: {formatQueueNo(personalQueue.order_no)} ({personalQueue.customer_name})
                  </span>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  getStatusBadge(personalQueue.status).bg
                }`}
              >
                {getStatusBadge(personalQueue.status).icon}
                <span>{personalQueue.status}</span>
              </div>
            </div>

            {personalQueue.items_summary && (
              <div className="mt-2 text-xs text-[#543E30] bg-[#FFF8EC] p-2 rounded-lg border border-[#FCE4EC]">
                <span className="text-[10px] text-[#947765] block font-semibold">รายการ:</span>
                <span>{personalQueue.items_summary}</span>
              </div>
            )}

            {personalQueue.estimated_time && (
              <div className="mt-1.5 text-xs text-[#A8B99A] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>กำหนดเวลาโดยประมาณ: {personalQueue.estimated_time}</span>
              </div>
            )}

            {personalQueue.shop_note && (
              <div className="mt-1 text-xs text-[#543E30] bg-[#FCE4EC]/60 p-2 rounded-lg border border-[#F6B8C6]/50">
                💬 ข้อความจากร้าน: {personalQueue.shop_note}
              </div>
            )}
          </div>
        )}

        {/* Public Queue List Header */}
        <div className="flex items-center justify-between pt-2 pb-1 border-t border-[#F6B8C6]/30">
          <span className="text-xs font-semibold text-[#543E30]">
            กระดานคิวรวมหน้าร้าน ({displayedQueues.length} คิว)
          </span>
          <button
            onClick={refreshQueues}
            disabled={isLoading}
            className="text-[11px] text-[#947765] hover:text-[#D06D80] flex items-center gap-1 cursor-pointer transition"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>รีเฟรช</span>
          </button>
        </div>

        {/* Public Queue Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-1">
          {displayedQueues.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#947765]">
              ยังไม่มีคิวในขณะนี้ค่ะ
            </div>
          ) : (
            displayedQueues.map((item) => {
              const badge = getStatusBadge(item.status);
              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl flex items-center justify-between transition shadow-sm ${
                    item.is_express
                      ? 'bg-[#FFFDF7] border-2 border-[#FCD34D] hover:border-[#F59E0B]'
                      : 'bg-[#FFFEFA] border border-[#FCE4EC] hover:border-[#F6B8C6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2.5 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border ${
                        item.is_express
                          ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#B45309]'
                          : 'bg-[#FFF8EC] border-[#C9DDB8] text-[#D06D80]'
                      }`}
                    >
                      #{formatQueueNo(item.queue_no)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#543E30] flex items-center gap-1.5">
                        <span>{maskName(item.customer_name)}</span>
                        {item.is_express && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]">
                            ⚡ ลัดคิว
                          </span>
                        )}
                      </div>
                      {item.estimated_time && (
                        <div className="text-[10px] text-[#947765] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[#A8B99A]" />
                          <span>{item.estimated_time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${badge.bg}`}
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
  );
}
