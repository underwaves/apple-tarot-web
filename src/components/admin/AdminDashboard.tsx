'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Order,
  QueueItem,
  Category,
  StoreSettings,
  MusicTrack,
} from '@/types';
import { formatBaht, formatThaiDate } from '@/lib/utils';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Package,
  Settings,
  Music,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Loader2,
  Eye,
  Play,
  Pause,
  Upload,
  LogOut,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated?: () => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  onDataUpdated,
}: AdminDashboardProps) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'queues' | 'products' | 'settings' | 'music'
  >('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [queueFilter, setQueueFilter] = useState<'all' | 'express'>('all');

  // Slip preview modal
  const [previewSlipUrl, setPreviewSlipUrl] = useState<string | null>(null);

  // Music playback test
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const testAudioRef = React.useRef<HTMLAudioElement | null>(null);

  // Notification message
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const showFeedback = (text: string, isError = false) => {
    setFeedbackMsg({ text, isError });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const loadAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [storeRes, ordersRes, queuesRes] = await Promise.all([
        fetch('/api/store'),
        fetch('/api/orders'),
        fetch('/api/queues'),
      ]);

      const storeData = await storeRes.json();
      const ordersData = await ordersRes.json();
      const queuesData = await queuesRes.json();

      if (storeData.success) {
        setCategories(storeData.data.categories || []);
        setSettings(storeData.data.settings || null);
        setMusicTracks(storeData.data.music_tracks || []);
      }
      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }
      if (queuesData.success) {
        setQueues(queuesData.queues || []);
      }
    } catch (err: unknown) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Check existing session on modal open
  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/session');
        const data = await res.json();
        if (!ignore && data.success && data.authenticated) {
          setIsAuthenticated(true);
        }
      } catch {
        // ignore
      }
    }
    checkSession();
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    let ignore = false;
    async function load() {
      try {
        const [storeRes, ordersRes, queuesRes] = await Promise.all([
          fetch('/api/store'),
          fetch('/api/orders'),
          fetch('/api/queues'),
        ]);

        const storeData = await storeRes.json();
        const ordersData = await ordersRes.json();
        const queuesData = await queuesRes.json();

        if (ignore) return;

        if (storeData.success) {
          setCategories(storeData.data.categories || []);
          setSettings(storeData.data.settings || null);
          setMusicTracks(storeData.data.music_tracks || []);
        }
        if (ordersData.success) {
          setOrders(ordersData.orders || []);
        }
        if (queuesData.success) {
          setQueues(queuesData.queues || []);
        }
      } catch (err: unknown) {
        console.error('Failed to load admin data', err);
      } finally {
        if (!ignore) setIsLoadingData(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [isOpen, isAuthenticated]);

  // Check login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setLoginError(data.error || 'รหัสผ่านไม่ถูกต้อง');
      }
    } catch {
      setLoginError('ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setIsAuthenticated(false);
      setOrders([]);
      setQueues([]);
      setPasswordInput('');
    }
  };

  if (!isOpen) return null;

  // -----------------------------------------------------------------
  // 1. Password Prompt View
  // -----------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl text-[#543E30] text-center animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
          <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-3 sm:hidden" />
          <div className="w-14 h-14 rounded-full bg-[#FCE4EC] border-2 border-[#F6B8C6] flex items-center justify-center text-[#D06D80] mx-auto mb-3 shadow-md">
            <span className="text-2xl">🔐</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
            เข้าสู่ระบบหลังบ้าน
          </h3>
          <p className="text-xs text-[#947765] mt-1 mb-4">
            สวนแอปเปิ้ล ออร์ชาร์ด · Apple Orchard Studio
          </p>

          <form onSubmit={handleLogin} className="space-y-3">
            {loginError && (
              <div className="p-2 bg-[#FCE4EC] border border-[#F6B8C6] text-[#D06D80] rounded-lg text-xs font-medium">
                ⚠️ {loginError}
              </div>
            )}

            <input
              type="password"
              placeholder="ใส่รหัสผ่านหลังบ้าน"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="text-center font-mono text-sm tracking-wider"
              required
            />

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="secondary-btn flex-1 py-2.5 text-xs font-semibold cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="cta-btn flex-1 py-2.5 text-xs font-semibold text-[#543E30] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>เข้าสู่ระบบ</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 2. ADMIN ACTIONS
  // -----------------------------------------------------------------

  // Confirm payment & Auto queue
  const handleConfirmPayment = async (orderId: string) => {
    try {
      const res = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('ยืนยันชำระเงินและนำเข้าคิวเรียบร้อยแล้วค่ะ! 🍎');
        loadAllData();
        if (onDataUpdated) onDataUpdated();
      } else {
        showFeedback(data.error || 'เกิดข้อผิดพลาด', true);
      }
    } catch {
      showFeedback('ไม่สามารถบันทึกได้', true);
    }
  };

  // Update queue status
  const handleUpdateQueue = async (
    queueId: string,
    status: string,
    estimatedTime?: string,
    shopNote?: string,
    isExpress?: boolean
  ) => {
    try {
      const res = await fetch('/api/queues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          queue_id: queueId,
          status,
          estimated_time: estimatedTime,
          shop_note: shopNote,
          is_express: isExpress,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('อัปเดตสถานะคิวสำเร็จ');
        loadAllData();
      }
    } catch {
      showFeedback('อัปเดตคิวไม่สำเร็จ', true);
    }
  };

  // Delete queue
  const handleDeleteQueue = async (queueId: string) => {
    if (!confirm('ต้องการลบคิวนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/queues?id=${queueId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showFeedback('ลบคิวเรียบร้อย');
        loadAllData();
      }
    } catch {
      showFeedback('ลบคิวไม่สำเร็จ', true);
    }
  };

  // Save Categories & Packages
  const handleSaveCategories = async () => {
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_categories',
          categories,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('บันทึกหมวดหมู่และสินค้าแล้ว หน้าเว็บจะอัปเดตทันที ✓');
        if (onDataUpdated) onDataUpdated();
      }
    } catch {
      showFeedback('บันทึกไม่สำเร็จ', true);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          settings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('บันทึกการตั้งค่าร้านสำเร็จ ✓');
        if (onDataUpdated) onDataUpdated();
      }
    } catch {
      showFeedback('บันทึกการตั้งค่าไม่สำเร็จ', true);
    }
  };

  // Save Music Tracks
  const handleSaveMusic = async () => {
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_music',
          music_tracks: musicTracks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('บันทึกเพลงเรียบร้อยแล้วค่ะ ✓');
        if (onDataUpdated) onDataUpdated();
      } else {
        showFeedback(data.error || 'บันทึกเพลงไม่สำเร็จ', true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'บันทึกเพลงไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      showFeedback(msg, true);
    }
  };

  const handleUploadMusicFile = async (idx: number, file: File) => {
    setIsUploadingMusic(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', musicTracks[idx]?.title || file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/music/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const next = [...musicTracks];
        next[idx].url = data.url;
        if (!next[idx].title || next[idx].title.includes('เพลงใหม่')) {
          next[idx].title = data.title;
        }
        setMusicTracks(next);
        showFeedback('อัปโหลดไฟล์เสียงสำเร็จแล้วค่ะ อย่าลืมกดปุ่มบันทึกเพลงนะคะ');
      } else {
        showFeedback(data.error || 'อัปโหลดไฟล์เพลงไม่สำเร็จ', true);
      }
    } catch {
      showFeedback('อัปโหลดไฟล์เพลงไม่สำเร็จ', true);
    } finally {
      setIsUploadingMusic(false);
    }
  };

  const toggleTestAudio = (url: string, id: string) => {
    if (playingTrackId === id) {
      testAudioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (!testAudioRef.current) {
        testAudioRef.current = new Audio();
      }
      testAudioRef.current.src = url;
      testAudioRef.current
        .play()
        .then(() => setPlayingTrackId(id))
        .catch(() => {
          showFeedback('ลิงก์นี้ไม่สามารถเล่นเป็นไฟล์เสียงตรงได้ (หากเป็น YouTube แนะนำให้อัปโหลดไฟล์ MP3)', true);
          setPlayingTrackId(null);
        });
      testAudioRef.current.onended = () => setPlayingTrackId(null);
    }
  };

  // Stats calculation
  const totalRevenue = orders
    .filter((o) => o.status === 'confirmed')
    .reduce((sum, o) => sum + o.total_amount, 0);
  const pendingSlipsCount = orders.filter((o) => o.status === 'pending_verification').length;
  const activeQueuesCount = queues.filter((q) => q.status !== 'เสร็จแล้ว' && q.status !== 'ยกเลิก').length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-4xl h-[95vh] sm:h-[92vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col text-[#543E30] overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        {/* Top Bar */}
        <div className="p-3 sm:p-4 bg-[#FFFEFA] border-b border-[#F6B8C6]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍏</span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#D06D80]">
                ระบบจัดการหลังบ้าน (Admin Studio)
              </h3>
              <p className="text-[11px] text-[#947765]">
                สวนแอปเปิ้ล ออร์ชาร์ด · ข้อมูลอัปเดตตามเวลาจริง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {feedbackMsg && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  feedbackMsg.isError
                    ? 'bg-[#FCE4EC] border-[#F6B8C6] text-[#D06D80]'
                    : 'bg-[#E8F5E9] border-[#C9DDB8] text-[#2E7D32]'
                }`}
              >
                {feedbackMsg.text}
              </span>
            )}
            <button
              onClick={handleLogout}
              title="ออกจากระบบ"
              className="flex items-center gap-1 text-xs text-[#D06D80] hover:text-[#543E30] bg-[#FCE4EC] border border-[#F6B8C6] px-2.5 py-1 rounded-lg transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออก</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#947765] hover:text-[#543E30] hover:bg-[#F6B8C6]/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto bg-[#FFF8EC] border-b border-[#F6B8C6]/30 text-xs px-2 py-1.5 gap-1.5">
          {[
            { id: 'overview' as const, label: 'ภาพรวม', icon: <LayoutDashboard className="w-4 h-4" /> },
            {
              id: 'orders' as const,
              label: `ออเดอร์ & สลิป ${pendingSlipsCount > 0 ? `(${pendingSlipsCount})` : ''}`,
              icon: <ShoppingBag className="w-4 h-4" />,
            },
            {
              id: 'queues' as const,
              label: `จัดการคิว (${activeQueuesCount})`,
              icon: <ListOrdered className="w-4 h-4" />,
            },
            { id: 'products' as const, label: 'สินค้า & หมวดหมู่', icon: <Package className="w-4 h-4" /> },
            { id: 'settings' as const, label: 'ตั้งค่าร้านค้า', icon: <Settings className="w-4 h-4" /> },
            { id: 'music' as const, label: 'จัดการเพลง', icon: <Music className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#F6B8C6] text-[#543E30] font-bold shadow-sm border border-[#F6B8C6]'
                  : 'text-[#947765] bg-[#FFFEFA] hover:bg-[#FCE4EC] hover:text-[#543E30] border border-[#FCE4EC]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingData ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-[#95d5b2]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs">กำลังโหลดข้อมูล...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-[#FFFEFA] border border-[#FCE4EC] rounded-xl shadow-sm">
                      <span className="text-xs text-[#947765]">ออเดอร์ทั้งหมด</span>
                      <div className="font-serif font-bold text-2xl text-[#543E30] mt-1">
                        {orders.length}
                      </div>
                    </div>
                    <div className="p-3.5 bg-[#FFFEFA] border border-[#F6B8C6] rounded-xl shadow-sm">
                      <span className="text-xs text-[#D06D80]">สลิปรอตรวจสอบ</span>
                      <div className="font-serif font-bold text-2xl text-[#D06D80] mt-1">
                        {pendingSlipsCount}
                      </div>
                    </div>
                    <div className="p-3.5 bg-[#FFFEFA] border border-[#C9DDB8] rounded-xl shadow-sm">
                      <span className="text-xs text-[#2E7D32]">คิวกำลังดำเนินการ</span>
                      <div className="font-serif font-bold text-2xl text-[#2E7D32] mt-1">
                        {activeQueuesCount}
                      </div>
                    </div>
                    <div className="p-3.5 bg-[#FFFEFA] border border-[#F6D1B5] rounded-xl shadow-sm">
                      <span className="text-xs text-[#D97706]">ยอดขายที่ยืนยันแล้ว</span>
                      <div className="font-serif font-bold text-2xl text-[#D06D80] mt-1">
                        {formatBaht(totalRevenue)}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="bg-[#FFFEFA] border border-[#FCE4EC] rounded-xl p-4 shadow-sm">
                    <h4 className="font-serif text-lg font-bold text-[#D06D80] mb-3">
                      ออเดอร์ล่าสุด
                    </h4>
                    {orders.length === 0 ? (
                      <p className="text-xs text-[#947765] py-4 text-center">
                        ยังไม่มีคำสั่งซื้อ
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {orders.slice(0, 5).map((o) => (
                          <div
                            key={o.id}
                            className="p-2.5 bg-[#FFF8EC] rounded-lg border border-[#FCE4EC] flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-mono font-bold text-[#D06D80]">
                                {o.order_no}
                              </span>
                              <span className="text-[#543E30] ml-2 font-medium">
                                {o.customer_name} ({formatBaht(o.total_amount)})
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                o.status === 'confirmed'
                                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                  : o.status === 'pending_verification'
                                  ? 'bg-[#FCE4EC] text-[#D06D80]'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {o.status === 'confirmed'
                                ? 'ชำระเงินแล้ว'
                                : o.status === 'pending_verification'
                                ? 'รอตรวจสลิป'
                                : 'รอแนบสลิป'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS & SLIPS */}
              {activeTab === 'orders' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-[#D06D80]">
                      จัดการคำสั่งซื้อและตรวจสลิป ({orders.length})
                    </h4>
                    <span className="text-xs text-[#947765]">
                      กด &quot;ยืนยันชำระเงิน&quot; เพื่อดึงเข้าคิวอัตโนมัติ
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-16 text-center text-xs text-[#947765]">
                      ยังไม่มีรายการสั่งซื้อ
                    </div>
                  ) : (
                    orders.map((o) => (
                      <div
                        key={o.id}
                        className={`p-4 bg-[#FFFEFA] rounded-xl border transition shadow-sm ${
                          o.status === 'pending_verification'
                            ? 'border-[#F6B8C6] shadow-md'
                            : 'border-[#FCE4EC]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F6B8C6]/30 pb-2 mb-2">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#D06D80]">
                              {o.order_no}
                            </span>
                            {o.is_express && (
                              <span className="ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D] shadow-xs">
                                ⚡ ลัดคิว (เรท 32฿)
                              </span>
                            )}
                            <span className="text-xs text-[#947765] ml-2">
                              {formatThaiDate(o.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-lg text-[#D06D80]">
                              {formatBaht(o.total_amount)}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                o.status === 'confirmed'
                                  ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C9DDB8]'
                                  : o.status === 'pending_verification'
                                  ? 'bg-[#FCE4EC] text-[#D06D80] border border-[#F6B8C6]'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {o.status === 'confirmed'
                                ? 'ชำระแล้ว ✓'
                                : o.status === 'pending_verification'
                                ? 'รอตรวจสลิป ⚠️'
                                : 'ยังไม่แนบสลิป'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#947765]">
                          <div>
                            <p>
                              <strong className="text-[#543E30]">ลูกค้า:</strong> {o.customer_name}
                            </p>
                            {o.birth_date && (
                              <p>
                                <strong className="text-[#543E30]">วันเกิด:</strong> {o.birth_date}
                                {o.birth_time ? ` (เวลา ${o.birth_time})` : ''}
                              </p>
                            )}
                            {o.zodiac_sign && (
                              <p>
                                <strong className="text-[#543E30]">ราศี:</strong> {o.zodiac_sign}
                              </p>
                            )}
                            {o.question && (
                              <p className="mt-1 p-2 bg-[#FFF8EC] rounded border border-[#C9DDB8] text-[#543E30]">
                                <strong>🔮 เรื่องที่ต้องการดู:</strong> {o.question}
                              </p>
                            )}
                            <p className="mt-1">
                              <strong className="text-[#543E30]">ช่องทางติดต่อ:</strong>{' '}
                              {o.contact_channel} ({o.contact_value})
                            </p>
                            {o.customer_note && (
                              <p className="mt-1 text-[#543E30]">
                                <strong>โน้ต:</strong> {o.customer_note}
                              </p>
                            )}
                            {o.shipping_address && (
                              <div className="mt-1.5 p-2 bg-[#FFF8EC] rounded border border-[#F6B8C6] text-[#543E30]">
                                <strong className="text-[#D06D80]">📦 ข้อมูลจัดส่งสินค้าจริง:</strong>
                                <p>ผู้รับ: {o.shipping_name || o.customer_name} ({o.shipping_phone || '-'})</p>
                                <p>ที่อยู่: {[o.shipping_address, o.shipping_subdistrict, o.shipping_district, o.shipping_province, o.shipping_postal_code].filter(Boolean).join(' ')}</p>
                              </div>
                            )}
                            {o.tracking_token && (
                              <p className="mt-1 text-[11px] font-mono text-[#A8B99A]">
                                <strong>🔑 Tracking Token:</strong> {o.tracking_token}
                              </p>
                            )}
                            <div className="mt-2 text-[#543E30]">
                              <strong>รายการ:</strong>
                              <ul className="list-disc list-inside mt-0.5">
                                {o.items.map((it, idx) => (
                                  <li key={idx}>
                                    {it.name} x{it.quantity} ({formatBaht(it.price * it.quantity)})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Slip Preview & Actions */}
                          <div className="flex flex-col items-start sm:items-end justify-between gap-3">
                            {o.slip_url ? (
                              <div className="flex items-center gap-2">
                                <div
                                  onClick={() => setPreviewSlipUrl(o.slip_url || null)}
                                  className="w-16 h-16 rounded-lg overflow-hidden border border-[#C9DDB8] cursor-pointer hover:opacity-80 transition relative"
                                >
                                  <Image
                                    src={o.slip_url}
                                    alt="Slip"
                                    width={64}
                                    height={64}
                                    unoptimized
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPreviewSlipUrl(o.slip_url || null)}
                                  className="secondary-btn py-1 px-2.5 text-[11px] flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>ดูสลิปเต็ม</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-stone-400">ยังไม่มีสลิป</span>
                            )}

                            {/* Verification Button */}
                            <div className="flex items-center gap-2">
                              {o.status !== 'confirmed' && (
                                <button
                                  onClick={() => handleConfirmPayment(o.id)}
                                  className="cta-btn py-2 px-3 text-xs font-semibold text-[#543E30] flex items-center gap-1.5 cursor-pointer shadow-md"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>ยืนยันชำระเงิน & เข้าคิว</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: QUEUE MANAGEMENT */}
              {activeTab === 'queues' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-serif text-lg font-bold text-[#D06D80]">
                      จัดการคิวงาน ({queues.length})
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQueueFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                          queueFilter === 'all'
                            ? 'bg-[#F6B8C6] text-[#543E30] border-[#F6B8C6]'
                            : 'bg-[#FFFEFA] text-[#947765] border-[#FCE4EC] hover:border-[#F6B8C6]'
                        }`}
                      >
                        ทั้งหมด ({queues.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueueFilter('express')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          queueFilter === 'express'
                            ? 'bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]'
                            : 'bg-[#FFFEFA] text-[#947765] border-[#FCE4EC] hover:border-[#FCD34D]'
                        }`}
                      >
                        <span>⚡ คิวด่วน ({queues.filter((q) => q.is_express).length})</span>
                      </button>
                    </div>
                  </div>

                  {queues.length === 0 ? (
                    <div className="py-16 text-center text-xs text-[#947765]">
                      ยังไม่มีรายการคิว
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(queueFilter === 'express' ? queues.filter((q) => q.is_express) : queues).map((q) => (
                        <div
                          key={q.id}
                          className={`p-3.5 rounded-xl border space-y-2 text-xs shadow-sm transition ${
                            q.is_express
                              ? 'bg-[#FFFDF7] border-2 border-[#FCD34D]'
                              : 'bg-[#FFFEFA] border border-[#FCE4EC]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#D06D80]">
                                คิว #{q.queue_no} · {q.customer_name} ({q.order_no})
                              </span>
                              {q.is_express && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]">
                                  ⚡ ลัดคิว
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#947765]">
                              {q.items_summary}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                            {/* Status Selector */}
                            <div>
                              <label className="text-[11px] text-[#543E30] block mb-1 font-medium">
                                สถานะงาน
                              </label>
                              <select
                                value={q.status}
                                onChange={(e) =>
                                  handleUpdateQueue(q.id, e.target.value, q.estimated_time, q.shop_note)
                                }
                                className="py-1 text-xs"
                              >
                                <option value="รอตรวจสลิป">รอตรวจสลิป</option>
                                <option value="รอตรวจคิว">รอตรวจคิว</option>
                                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                                <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
                                <option value="เสร็จแล้ว">เสร็จแล้ว</option>
                                <option value="ยกเลิก">ยกเลิก</option>
                              </select>
                            </div>

                            {/* Estimated Time */}
                            <div>
                              <label className="text-[11px] text-[#543E30] block mb-1 font-medium">
                                เวลาประมาณ
                              </label>
                              <input
                                type="text"
                                defaultValue={q.estimated_time || ''}
                                onBlur={(e) =>
                                  handleUpdateQueue(q.id, q.status, e.target.value, q.shop_note)
                                }
                                placeholder="เช่น 1-2 วัน หรือ 28 ต.ค."
                                className="py-1 text-xs"
                              />
                            </div>

                            {/* Shop Note */}
                            <div>
                              <label className="text-[11px] text-[#543E30] block mb-1 font-medium">
                                โน้ตถึงลูกค้า
                              </label>
                              <input
                                type="text"
                                defaultValue={q.shop_note || ''}
                                onBlur={(e) =>
                                  handleUpdateQueue(q.id, q.status, q.estimated_time, e.target.value)
                                }
                                placeholder="เช่น กำลังลงสีแอปเปิ้ล"
                                className="py-1 text-xs"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-[#FCE4EC]/50">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQueue(
                                  q.id,
                                  q.status,
                                  q.estimated_time,
                                  q.shop_note,
                                  !q.is_express
                                )
                              }
                              className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border transition cursor-pointer flex items-center gap-1 ${
                                q.is_express
                                  ? 'bg-[#FEF3C7] text-[#D97706] border-[#FCD34D] hover:bg-[#FDE68A]'
                                  : 'bg-[#FFF8EC] text-[#947765] border-[#FCE4EC] hover:border-[#F6B8C6]'
                              }`}
                            >
                              <span>⚡ {q.is_express ? 'ยกเลิกลัดคิว' : 'ตั้งเป็นลัดคิว'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteQueue(q.id)}
                              className="text-[11px] text-[#D06D80] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ลบคิว</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PRODUCTS & CATEGORIES */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#D06D80]">
                        จัดการหมวดหมู่และสินค้า
                      </h4>
                      <p className="text-xs text-[#947765]">
                        แก้ไขแล้วกด &quot;บันทึกสินค้าทั้งหมด&quot; เพื่ออัปเดตหน้าเว็บทันที
                      </p>
                    </div>
                    <button
                      onClick={handleSaveCategories}
                      className="cta-btn py-2 px-4 text-xs font-semibold text-[#543E30] flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>บันทึกสินค้าทั้งหมด</span>
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    {categories.map((cat, catIdx) => (
                      <div
                        key={cat.id}
                        className="p-4 bg-[#FFFEFA] border border-[#F6B8C6] rounded-xl space-y-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) => {
                              const next = [...categories];
                              next[catIdx].name = e.target.value;
                              setCategories(next);
                            }}
                            placeholder="ชื่อหมวดหมู่"
                            className="font-bold text-sm text-[#D06D80] bg-[#FFF8EC] py-1.5"
                          />
                          <button
                            onClick={() => {
                              if (confirm('ต้องการลบหมวดหมู่นี้หรือไม่?')) {
                                setCategories(categories.filter((_, i) => i !== catIdx));
                              }
                            }}
                            className="text-[#D06D80] p-1.5 hover:bg-[#FCE4EC] rounded cursor-pointer"
                            title="ลบหมวดหมู่"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Packages inside Category */}
                        <div className="space-y-2 pl-2 border-l-2 border-[#C9DDB8]">
                          {cat.packages.map((pkg, pkgIdx) => (
                            <div
                              key={pkg.id}
                              className="p-2.5 bg-[#FFF8EC] rounded-lg border border-[#FCE4EC] grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs"
                            >
                              <div className="sm:col-span-2">
                                <input
                                  type="text"
                                  value={pkg.name}
                                  onChange={(e) => {
                                    const next = [...categories];
                                    next[catIdx].packages[pkgIdx].name = e.target.value;
                                    setCategories(next);
                                  }}
                                  placeholder="ชื่อสินค้า"
                                  className="font-medium text-xs py-1"
                                />
                                <input
                                  type="text"
                                  value={pkg.description}
                                  onChange={(e) => {
                                    const next = [...categories];
                                    next[catIdx].packages[pkgIdx].description = e.target.value;
                                    setCategories(next);
                                  }}
                                  placeholder="คำอธิบายสินค้า"
                                  className="text-[11px] text-[#947765] mt-1 py-1"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <div>
                                  <label className="text-[10px] text-[#543E30] font-medium block">ราคา (฿)</label>
                                  <input
                                    type="number"
                                    value={pkg.price}
                                    onChange={(e) => {
                                      const next = [...categories];
                                      next[catIdx].packages[pkgIdx].price = parseFloat(e.target.value) || 0;
                                      setCategories(next);
                                    }}
                                    className="w-20 text-xs py-1"
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    const next = [...categories];
                                    next[catIdx].packages.splice(pkgIdx, 1);
                                    setCategories(next);
                                  }}
                                  className="text-[#D06D80] p-1 mt-4 hover:bg-[#FCE4EC] rounded cursor-pointer"
                                  title="ลบสินค้านี้"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => {
                              const next = [...categories];
                              next[catIdx].packages.push({
                                id: 'pkg-' + Date.now(),
                                category_id: cat.id,
                                name: 'สินค้าใหม่',
                                description: 'คำอธิบายสินค้า...',
                                price: 100,
                                is_active: true,
                              });
                              setCategories(next);
                            }}
                            className="secondary-btn py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ เพิ่มสินค้าในหมวดหมู่นี้</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setCategories([
                          ...categories,
                          {
                            id: 'cat-' + Date.now(),
                            name: 'หมวดหมู่ใหม่',
                            description: '',
                            sort_order: categories.length + 1,
                            packages: [],
                          },
                        ]);
                      }}
                      className="secondary-btn w-full py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ เพิ่มหมวดหมู่ใหม่</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: STORE SETTINGS */}
              {activeTab === 'settings' && settings && (
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-[#D06D80]">
                      ตั้งค่าร้านค้า & บัญชีรับเงิน
                    </h4>
                    <button
                      onClick={handleSaveSettings}
                      className="cta-btn py-2 px-4 text-xs font-semibold text-[#543E30] flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>บันทึกการตั้งค่า</span>
                    </button>
                  </div>

                  <div className="space-y-3 bg-[#FFFEFA] p-4 rounded-xl border border-[#F6B8C6] text-xs shadow-sm">
                    <div>
                      <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                        ชื่อร้านค้า
                      </label>
                      <input
                        type="text"
                        value={settings.shop_name}
                        onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                        หัวข้อหน้าร้าน (ขึ้นบรรทัดใหม่ด้วยการเคาะ Enter)
                      </label>
                      <textarea
                        rows={2}
                        value={settings.shop_title}
                        onChange={(e) => setSettings({ ...settings, shop_title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                        สโลแกน / คำอธิบายใต้ชื่อร้าน
                      </label>
                      <textarea
                        rows={2}
                        value={settings.shop_subtitle}
                        onChange={(e) => setSettings({ ...settings, shop_subtitle: e.target.value })}
                      />
                    </div>

                    <div className="pt-2 border-t border-[#F6B8C6]/30">
                      <h5 className="font-semibold text-sm text-[#D06D80] mb-2">
                        💳 ข้อมูลรับเงิน (พร้อมเพย์)
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                            เบอร์พร้อมเพย์ / เลขบัตร ปชช.
                          </label>
                          <input
                            type="text"
                            value={settings.promptpay_id}
                            onChange={(e) =>
                              setSettings({ ...settings, promptpay_id: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                            ชื่อเจ้าของบัญชี
                          </label>
                          <input
                            type="text"
                            value={settings.account_name}
                            onChange={(e) =>
                              setSettings({ ...settings, account_name: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F6B8C6]/30">
                      <h5 className="font-semibold text-sm text-[#D06D80] mb-2">
                        🖼️ ลิงก์รูปภาพ
                      </h5>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                            URL รูปภาพแบนเนอร์
                          </label>
                          <input
                            type="text"
                            value={settings.banner_url}
                            onChange={(e) =>
                              setSettings({ ...settings, banner_url: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                            URL รูปภาพโปรไฟล์ร้าน
                          </label>
                          <input
                            type="text"
                            value={settings.avatar_url}
                            onChange={(e) =>
                              setSettings({ ...settings, avatar_url: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Express Queue Settings */}
                    <div className="pt-2 border-t border-[#F6B8C6]/30">
                      <h5 className="font-semibold text-sm text-[#D06D80] mb-2 flex items-center gap-1.5">
                        <span>⚡ บริการลัดคิวพิเศษ (Express Queue)</span>
                      </h5>
                      <div className="space-y-3 bg-[#FFFDF7] p-3 rounded-xl border border-[#FCD34D]">
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-[#543E30]">
                          <input
                            type="checkbox"
                            checked={settings.enable_express_queue !== false}
                            onChange={(e) =>
                              setSettings({ ...settings, enable_express_queue: e.target.checked })
                            }
                            className="w-4 h-4 accent-[#D06D80] rounded cursor-pointer"
                          />
                          <span>เปิดให้บริการลัดคิวพิเศษในขั้นตอน Checkout</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                              ค่าบริการลัดคิว (บาท) - เรทเดียว 32 บาท
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={settings.express_queue_fee ?? 32}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  express_queue_fee: Math.max(0, Number(e.target.value) || 0),
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                              ระยะเวลาส่งงานคิวด่วน (โดยประมาณ)
                            </label>
                            <input
                              type="text"
                              value={settings.express_estimated_time || '⚡ ภายใน 12-24 ชั่วโมง'}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  express_estimated_time: e.target.value,
                                })
                              }
                              placeholder="เช่น ⚡ ภายใน 12-24 ชั่วโมง"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: MUSIC MANAGEMENT */}
              {activeTab === 'music' && (
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#D06D80]">
                        จัดการเพลงพื้นหลัง (Background Music)
                      </h4>
                      <p className="text-xs text-[#947765]">
                        กำหนดเพลงที่มีสิทธิ์ใช้งานเพื่อให้เล่นบนหน้าเว็บ
                      </p>
                    </div>
                    <button
                      onClick={handleSaveMusic}
                      className="cta-btn py-2 px-4 text-xs font-semibold text-[#543E30] flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>บันทึกเพลง</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {musicTracks.map((tr, idx) => (
                      <div
                        key={tr.id}
                        className="p-3 bg-[#FFFEFA] rounded-xl border border-[#FCE4EC] space-y-2 text-xs shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={tr.title}
                            onChange={(e) => {
                              const next = [...musicTracks];
                              next[idx].title = e.target.value;
                              setMusicTracks(next);
                            }}
                            placeholder="ชื่อเพลง"
                            className="font-semibold text-xs py-1"
                          />
                          <div className="flex items-center gap-1">
                            {tr.url && (
                              <button
                                type="button"
                                onClick={() => toggleTestAudio(tr.url, tr.id)}
                                className={`p-1.5 rounded transition ${
                                  playingTrackId === tr.id
                                    ? 'bg-[#F6B8C6] text-[#543E30]'
                                    : 'bg-[#FFF8EC] text-[#947765] hover:text-[#543E30]'
                                }`}
                                title={playingTrackId === tr.id ? 'หยุดทดสอบเสียง' : 'ทดสอบฟัง'}
                              >
                                {playingTrackId === tr.id ? (
                                  <Pause className="w-3.5 h-3.5" />
                                ) : (
                                  <Play className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setMusicTracks(musicTracks.filter((_, i) => i !== idx));
                              }}
                              className="text-[#D06D80] p-1.5 hover:bg-[#FCE4EC] rounded cursor-pointer"
                              title="ลบเพลง"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={tr.url}
                            onChange={(e) => {
                              const next = [...musicTracks];
                              next[idx].url = e.target.value;
                              setMusicTracks(next);
                            }}
                            placeholder="ลิงก์ YouTube (เช่น https://youtu.be/...) หรือลิงก์ MP3 หรือกดอัปโหลดไฟล์ด้านล่าง"
                            className="font-mono text-[11px] py-1"
                          />

                          {/* YouTube notice */}
                          {tr.url && (tr.url.includes('youtu.be') || tr.url.includes('youtube.com')) && (
                            <p className="mt-1 text-[11px] text-[#A8B99A] leading-tight flex items-center gap-1 font-medium">
                              <span>✨ ตรวจพบลิงก์ YouTube: ระบบเปิดเล่นเพลงเป็นเสียงพื้นหลังให้อัตโนมัติแล้วค่ะ</span>
                            </p>
                          )}
                        </div>

                        {/* File Upload Button for this Track */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="secondary-btn py-1 px-2.5 text-[11px] flex items-center gap-1.5 cursor-pointer hover:border-[#F6B8C6]">
                            <Upload className="w-3.5 h-3.5 text-[#A8B99A]" />
                            <span>{isUploadingMusic ? 'กำลังอัปโหลด...' : '📁 อัปโหลดไฟล์ MP3/WAV จากเครื่อง'}</span>
                            <input
                              type="file"
                              accept="audio/*,.mp3,.wav,.m4a,.ogg"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleUploadMusicFile(idx, f);
                              }}
                            />
                          </label>
                          <span className="text-[10px] text-[#947765]">
                            รองรับ MP3, WAV, M4A
                          </span>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setMusicTracks([
                          ...musicTracks,
                          {
                            id: 'track-' + Date.now(),
                            title: 'เพลงใหม่ (Apple Song)',
                            url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
                            is_active: true,
                          },
                        ]);
                      }}
                      className="secondary-btn w-full py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ เพิ่มเพลงใหม่</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Slip Fullscreen Lightbox Modal */}
      {previewSlipUrl && (
        <div
          onClick={() => setPreviewSlipUrl(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-md max-h-[85vh] rounded-xl overflow-hidden shadow-2xl relative">
            <Image
              src={previewSlipUrl}
              alt="Full Slip"
              width={600}
              height={800}
              unoptimized
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
