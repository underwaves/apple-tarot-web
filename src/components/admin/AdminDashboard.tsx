'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Order,
  QueueItem,
  Category,
  StoreSettings,
  MusicTrack,
  Review,
  ThemeColors,
  StoreContact,
} from '@/types';
import { formatBaht, formatThaiDate, extractYouTubeId } from '@/lib/utils';
import { THEME_PRESETS, DEFAULT_THEME_COLORS, ThemePreset } from '@/lib/theme';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Package,
  Settings,
  Music,
  Star,
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
  Camera,
  ImageIcon,
  RotateCcw,
  Lock,
  Unlock,
  Store,
  Palette,
  Sparkles,
  Check,
  MessageCircle,
  ExternalLink,
  Globe,
  Phone,
  ArrowUp,
  ArrowDown,
  Bell,
  Copy,
  Send,
  HelpCircle,
} from 'lucide-react';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { compressImageToDataUrl } from '@/lib/image-client';
import { formatCustomerQueueUpdateMessage } from '@/lib/notifications';

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=300&q=80';

function createReviewRecord(
  customer_name: string,
  rating: number,
  comment: string
): Review {
  return {
    id: `rev-${Date.now()}`,
    customer_name,
    rating,
    comment,
    created_at: new Date().toISOString(),
  };
}

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
  const [settingsNewPassword, setSettingsNewPassword] = useState('');
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isTogglingStore, setIsTogglingStore] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'queues' | 'products' | 'settings' | 'contacts' | 'theme' | 'music' | 'reviews'
  >('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isSavingReviews, setIsSavingReviews] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [queueFilter, setQueueFilter] = useState<'all' | 'express'>('all');

  // Customer queue notification modal state
  const [notifyQueueItem, setNotifyQueueItem] = useState<QueueItem | null>(null);
  const [customNotifyMessage, setCustomNotifyMessage] = useState<string>('');
  const [isTestingNotification, setIsTestingNotification] = useState<boolean>(false);
  const [showLineHelpGuide, setShowLineHelpGuide] = useState<boolean>(false);

  // Slip preview modal
  const [previewSlipUrl, setPreviewSlipUrl] = useState<string | null>(null);

  // YouTube test preview modal
  const [testingYtId, setTestingYtId] = useState<string | null>(null);

  // Custom Confirmation Dialog state (replaces native browser confirm)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    icon?: React.ReactNode;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  // Music playback test
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const testAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const bannerFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const avatarFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [bannerLoadError, setBannerLoadError] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const handleImageUpload = async (
    file: File,
    type: 'banner' | 'avatar'
  ) => {
    const isBanner = type === 'banner';
    if (isBanner) {
      setUploadingBanner(true);
      setBannerLoadError(false);
    } else {
      setUploadingAvatar(true);
      setAvatarLoadError(false);
    }

    try {
      // 1. Immediately compress in browser to an optimized Base64 Data URL (0 server disk dependency)
      const dataUrl = await compressImageToDataUrl(
        file,
        isBanner ? 1200 : 400,
        isBanner ? 500 : 400,
        0.85
      );

      // Immediately set the Data URL so preview works 100% reliably
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              [isBanner ? 'banner_url' : 'avatar_url']: dataUrl,
            }
          : prev
      );

      // 2. Also send to backend to store local copy and trigger any hooks
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      }).catch((e) => console.warn('Background image sync fallback:', e));

      showFeedback(
        `อัปโหลดรูปภาพ${isBanner ? 'แบนเนอร์' : 'โปรไฟล์'}เรียบร้อยแล้ว ✨ อย่าลืมกด "บันทึกการตั้งค่าร้าน" ด้านล่างนะคะ`
      );
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการแปลงรูปภาพ', true);
    } finally {
      if (isBanner) setUploadingBanner(false);
      else setUploadingAvatar(false);
    }
  };

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
        fetch('/api/store?admin=true'),
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
        setReviews(storeData.data.reviews || []);
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
          fetch('/api/store?admin=true'),
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
          setReviews(storeData.data.reviews || []);
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

  const handleSaveSettingsPassword = async () => {
    if (settingsNewPassword.trim().length < 4) {
      showFeedback('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร', true);
      return;
    }
    if (settingsNewPassword !== settingsConfirmPassword) {
      showFeedback('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน', true);
      return;
    }
    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_password: settingsNewPassword.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
      }
      setSettingsNewPassword('');
      setSettingsConfirmPassword('');
      showFeedback('เปลี่ยนรหัสผ่านหลังบ้านสำเร็จเรียบร้อยแล้ว 🔐');
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', true);
    } finally {
      setIsSavingPassword(false);
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
            Auralune Tarot Studio
          </p>

          <form onSubmit={handleLogin} className="space-y-3">
            {loginError && (
              <div className="p-2 bg-[#FCE4EC] border border-[#F6B8C6] text-[#D06D80] rounded-lg text-xs font-medium">
                ⚠️ {loginError}
              </div>
            )}

            <input
              type="password"
              placeholder="รหัสผ่านหลังบ้าน"
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

  // Delete single order
  const handleDeleteOrder = (orderNo: string, customerName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ยืนยันการลบประวัติคำสั่งซื้อ',
      message: `ต้องการลบออเดอร์ "${orderNo}" ของคุณ "${customerName}" ออกจากระบบหรือไม่? ยอดขายจะถูกคำนวณใหม่ตามจริง`,
      confirmText: 'ลบออเดอร์นี้',
      cancelText: 'ยกเลิก',
      variant: 'danger',
      icon: <Trash2 className="w-6 h-6 text-[#D06D80]" />,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/orders?order_no=${encodeURIComponent(orderNo)}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success) {
            setOrders((prev) => prev.filter((o) => o.order_no !== orderNo && o.id !== orderNo));
            showFeedback(`ลบออเดอร์ ${orderNo} สำเร็จแล้วค่ะ ✓`);
            if (onDataUpdated) onDataUpdated();
          } else {
            showFeedback(data.error || 'ลบออเดอร์ไม่สำเร็จ', true);
          }
        } catch {
          showFeedback('เกิดข้อผิดพลาดในการลบออเดอร์', true);
        }
      },
    });
  };

  // Clear all orders (Reset to 0)
  const handleClearAllOrders = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'ยืนยันการล้างประวัติออเดอร์ทั้งหมด',
      message: 'ต้องการล้างประวัติคำสั่งซื้อทั้งหมดเพื่อให้ยอดขายเริ่มนับใหม่ตามจริง (฿0) หรือไม่? การลบนี้ไม่สามารถกู้คืนได้',
      confirmText: 'ล้างประวัติทั้งหมด',
      cancelText: 'ยกเลิก',
      variant: 'danger',
      icon: <Trash2 className="w-6 h-6 text-[#D06D80]" />,
      onConfirm: async () => {
        try {
          const res = await fetch('/api/orders?clear_all=true', {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success) {
            setOrders([]);
            showFeedback('ล้างประวัติคำสั่งซื้อทั้งหมดเรียบร้อยแล้ว ยอดขายรีเซ็ตตามจริงค่ะ ✓');
            if (onDataUpdated) onDataUpdated();
          } else {
            showFeedback(data.error || 'ล้างประวัติไม่สำเร็จ', true);
          }
        } catch {
          showFeedback('เกิดข้อผิดพลาดในการล้างประวัติออเดอร์', true);
        }
      },
    });
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

  // Test shop notification (LINE / Webhook)
  const handleTestNotification = async () => {
    if (!settings) return;
    setIsTestingNotification(true);
    try {
      const res = await fetch('/api/admin/notify/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line_channel_access_token: settings.line_channel_access_token,
          line_admin_user_id: settings.line_admin_user_id,
          webhook_url: settings.webhook_url,
          shop_name: settings.shop_name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('🔔 ส่งข้อความทดสอบเข้า LINE / Webhook สำเร็จแล้วค่ะ!');
      } else {
        showFeedback(data.error || 'การส่งทดสอบล้มเหลว กรุณาตรวจสอบ Token หรือ ID ค่ะ', true);
      }
    } catch {
      showFeedback('เกิดข้อผิดพลาดในการเชื่อมต่อระบบแจ้งเตือน', true);
    } finally {
      setIsTestingNotification(false);
    }
  };

  // Open customer notification modal
  const handleOpenNotifyModal = (q: QueueItem) => {
    const relatedOrder = orders.find((o) => o.order_no === q.order_no);
    const trackingToken = relatedOrder?.tracking_token;
    const hostUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const formattedMsg = formatCustomerQueueUpdateMessage(
      q,
      settings?.shop_name || 'Auralune Tarot',
      hostUrl,
      trackingToken
    );
    const resolvedQ: QueueItem = {
      ...q,
      contact_channel: q.contact_channel || relatedOrder?.contact_channel || 'LINE',
      contact_value: q.contact_value || relatedOrder?.contact_value || '',
    };
    setNotifyQueueItem(resolvedQ);
    setCustomNotifyMessage(formattedMsg);
  };

  // Copy customer message
  const handleCopyCustomerMessage = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showFeedback('คัดลอกข้อความแจ้งเตือนแล้วค่ะ 📋');
  };

  // 1-click launch chat for customer
  const handleOpenCustomerChat = (q: QueueItem, text: string) => {
    const channel = (q.contact_channel || '').toLowerCase().trim();
    const val = (q.contact_value || '').trim();

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }

    if (channel.includes('line')) {
      window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
      showFeedback('คัดลอกข้อความแล้ว! กำลังเปิด LINE ค่ะ 🟢');
    } else if (channel.includes('instagram') || channel.includes('ig')) {
      const cleanUser = val.replace(/^@/, '').trim();
      if (cleanUser) {
        window.open(`https://instagram.com/${cleanUser}/`, '_blank');
        showFeedback(`คัดลอกข้อความแล้ว! กำลังเปิด IG @${cleanUser} ค่ะ 📸`);
      } else {
        showFeedback('คัดลอกข้อความแล้วค่ะ 📋');
      }
    } else if (channel.includes('facebook') || channel.includes('fb')) {
      const cleanUser = val.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').trim();
      if (cleanUser) {
        window.open(val.startsWith('http') ? val : `https://facebook.com/${cleanUser}`, '_blank');
        showFeedback(`คัดลอกข้อความแล้ว! กำลังเปิด Facebook ค่ะ 🔵`);
      } else {
        showFeedback('คัดลอกข้อความแล้วค่ะ 📋');
      }
    } else if (channel.includes('phone') || channel.includes('เบอร์') || channel.includes('tel')) {
      const cleanPhone = val.replace(/[^0-9+]/g, '');
      window.open(`sms:${cleanPhone}?body=${encodeURIComponent(text)}`, '_self');
      showFeedback(`คัดลอกข้อความแล้ว! กำลังเปิด SMS ${cleanPhone} ค่ะ 📱`);
    } else {
      showFeedback('คัดลอกข้อความแล้วค่ะ 📋 นำไปส่งให้ลูกค้าได้เลย');
    }
  };

  // Delete queue
  const handleDeleteQueue = (queueId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ต้องการลบคิวนี้ใช่หรือไม่?',
      message: 'เมื่อกดยืนยัน ข้อมูลคิวนี้จะถูกลบออกจากระบบทันทีค่ะ',
      confirmText: 'ลบคิว',
      cancelText: 'ยกเลิก',
      variant: 'danger',
      icon: <Trash2 className="w-6 h-6 text-[#D06D80]" />,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/queues?id=${queueId}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
            showFeedback('ลบคิวเรียบร้อยแล้วค่ะ');
            loadAllData();
          } else {
            showFeedback('ลบคิวไม่สำเร็จ', true);
          }
        } catch {
          showFeedback('ลบคิวไม่สำเร็จ', true);
        }
      },
    });
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

  // Toggle Store Open / Close Status
  const handleToggleStoreOpen = async (newIsOpen: boolean) => {
    if (!settings) return;
    setIsTogglingStore(true);
    const nextSettings: StoreSettings = {
      ...settings,
      is_store_open: newIsOpen,
    };
    setSettings(nextSettings);

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          settings: nextSettings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(
          newIsOpen
            ? 'เปิดร้านรับออเดอร์เรียบร้อยแล้วค่ะ 🟢 ลูกค้าสั่งซื้อได้ตามปกติ'
            : 'ปิดร้านชั่วคราวแล้วค่ะ 🔴 ล็อคไม่ให้ลูกค้าสั่งซื้อเรียบร้อย'
        );
        if (onDataUpdated) onDataUpdated();
      } else {
        showFeedback(data.error || 'เปลี่ยนสถานะร้านไม่สำเร็จ', true);
      }
    } catch {
      showFeedback('เกิดข้อผิดพลาดในการเปลี่ยนสถานะร้าน', true);
    } finally {
      setIsTogglingStore(false);
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
    const ytId = extractYouTubeId(url);
    if (ytId) {
      // Pause any ongoing HTML5 audio test
      testAudioRef.current?.pause();
      setPlayingTrackId(null);
      // Open YouTube preview modal directly
      setTestingYtId(ytId);
      return;
    }

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
          showFeedback('ไม่สามารถเล่นไฟล์เสียงตรงนี้ได้ แนะนำให้ตรวจสอบลิงก์หรืออัปโหลดไฟล์ MP3 ค่ะ', true);
          setPlayingTrackId(null);
        });
      testAudioRef.current.onended = () => setPlayingTrackId(null);
    }
  };

  const handleSaveReviews = async () => {
    setIsSavingReviews(true);
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_reviews',
          reviews,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('บันทึกข้อมูลรีวิวสำเร็จเรียบร้อยแล้วค่ะ ✓');
        if (onDataUpdated) onDataUpdated();
      } else {
        showFeedback(data.error || 'บันทึกรีวิวไม่สำเร็จ', true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'บันทึกรีวิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      showFeedback(msg, true);
    } finally {
      setIsSavingReviews(false);
    }
  };

  const handleCreateReview = async () => {
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showFeedback('กรุณากรอกชื่อลูกค้าและข้อความรีวิวค่ะ', true);
      return;
    }
    const rev = createReviewRecord(
      newReviewAuthor.trim(),
      newReviewRating,
      newReviewComment.trim()
    );

    const nextReviews = [rev, ...reviews];
    setReviews(nextReviews);
    setIsSavingReviews(true);

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_reviews',
          reviews: nextReviews,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('เพิ่มรีวิวและบันทึกข้อมูลเรียบร้อยแล้วค่ะ! ⭐');
        setNewReviewAuthor('');
        setNewReviewComment('');
        setNewReviewRating(5);
        setIsAddingReview(false);
        if (onDataUpdated) onDataUpdated();
      } else {
        showFeedback(data.error || 'บันทึกรีวิวไม่สำเร็จ', true);
      }
    } catch {
      showFeedback('เกิดข้อผิดพลาดในการบันทึกรีวิว กรุณาลองใหม่อีกครั้ง', true);
    } finally {
      setIsSavingReviews(false);
    }
  };

  const handleDeleteReview = (idx: number, customerName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ยืนยันการลบรีวิว',
      message: `ต้องการลบรีวิวของ "${customerName || 'ลูกค้า'}" หรือไม่?`,
      confirmText: 'ลบรีวิว',
      cancelText: 'ยกเลิก',
      variant: 'danger',
      icon: <Trash2 className="w-6 h-6 text-[#D06D80]" />,
      onConfirm: async () => {
        const nextReviews = reviews.filter((_, i) => i !== idx);
        setReviews(nextReviews);
        try {
          const res = await fetch('/api/store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'save_reviews',
              reviews: nextReviews,
            }),
          });
          const data = await res.json();
          if (data.success) {
            showFeedback('ลบรีวิวและบันทึกลงระบบเรียบร้อยแล้วค่ะ ✓');
            if (onDataUpdated) onDataUpdated();
          } else {
            showFeedback(data.error || 'ลบรีวิวไม่สำเร็จ', true);
          }
        } catch {
          showFeedback('เกิดข้อผิดพลาดในการลบรีวิว', true);
        }
      },
    });
  };

  // Render Theme & Custom Color Customizer Panel
  const renderThemePanel = () => {
    if (!settings) return null;
    const currentColors: ThemeColors = settings.custom_theme || DEFAULT_THEME_COLORS;
    const currentPresetId = settings.theme_preset || 'apple';

    const handleSelectPreset = (preset: ThemePreset) => {
      const nextSettings: StoreSettings = {
        ...settings,
        theme_preset: preset.id,
        custom_theme: { ...preset.colors },
      };
      setSettings(nextSettings);
      showFeedback(`เลือกธีม ${preset.name} เรียบร้อยแล้ว ✨ (กด "บันทึกธีมร้าน" เพื่อใช้งานถาวร)`);
    };

    const handleColorChange = (key: keyof ThemeColors, val: string) => {
      const nextSettings: StoreSettings = {
        ...settings,
        theme_preset: 'custom',
        custom_theme: {
          ...currentColors,
          [key]: val,
        },
      };
      setSettings(nextSettings);
    };

    const handleResetDefault = () => {
      const nextSettings: StoreSettings = {
        ...settings,
        theme_preset: 'apple',
        custom_theme: { ...DEFAULT_THEME_COLORS },
      };
      setSettings(nextSettings);
      showFeedback('รีเซ็ตเป็นธีมดั้งเดิม (Apple Blossom) เรียบร้อยแล้วค่ะ');
    };

    const handleSaveTheme = async () => {
      await handleSaveSettings();
    };

    return (
      <div className="space-y-4 max-w-2xl pb-6">
        {/* Header & Save Button */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#D06D80] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#D06D80]" />
              <span>ปรับแต่งธีม & โทนสีร้านค้า</span>
            </h4>
            <p className="text-xs text-[#947765]">
              เลือกธีมสำเร็จรูปน่ารัก ๆ หรือผสมโค้ดสีเองได้ตามใจชอบแบบเรียลไทม์
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefault}
              className="py-2 px-3 rounded-xl border border-[#F6B8C6] text-xs font-semibold text-[#543E30] hover:bg-[#FCE4EC] transition cursor-pointer flex items-center gap-1"
              title="รีเซ็ตเป็นธีมเริ่มต้น"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#947765]" />
              <span>รีเซ็ต</span>
            </button>
            <button
              onClick={handleSaveTheme}
              className="cta-btn py-2 px-4 text-xs font-semibold text-[#543E30] flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกธีมร้าน</span>
            </button>
          </div>
        </div>

        {/* Preset Themes Grid */}
        <div className="bg-[#FFFEFA] p-4 rounded-2xl border border-[#F6B8C6] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-sm text-[#543E30] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D06D80]" />
              <span>1. ธีมสำเร็จรูป (Presets แนะนำ)</span>
            </h5>
            <span className="text-[11px] text-[#947765]">คลิกเพื่อเปลี่ยนโทนสีทันที</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {THEME_PRESETS.map((preset) => {
              const isSelected = currentPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition relative cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#D06D80] bg-[#FFF8EC] shadow-md ring-2 ring-[#F6B8C6]'
                      : 'border-[#FCE4EC] bg-white hover:border-[#F6B8C6] hover:bg-[#FFFDF9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#543E30]">
                      <span className="text-base">{preset.emoji}</span>
                      <span>{preset.name}</span>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#D06D80] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#947765] line-clamp-2 mb-2.5">
                    {preset.description}
                  </p>
                  {/* Color swatches */}
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-stone-100">
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: preset.colors.primary }}
                      title={`Primary: ${preset.colors.primary}`}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: preset.colors.primary_deep }}
                      title={`Deep: ${preset.colors.primary_deep}`}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: preset.colors.secondary }}
                      title={`Secondary: ${preset.colors.secondary}`}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: preset.colors.bg_vanilla }}
                      title={`Background: ${preset.colors.bg_vanilla}`}
                    />
                    <span className="text-[10px] text-[#947765] ml-auto">
                      {preset.isDark ? '🌙 โทนเข้ม' : '☀️ โทนสว่าง'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Pickers */}
        <div className="bg-[#FFFEFA] p-4 rounded-2xl border border-[#F6B8C6] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F6B8C6]/30">
            <div>
              <h5 className="font-bold text-sm text-[#543E30] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#D06D80]" />
                <span>2. ผสมและเลือกสีเองได้อิสระ (Custom Colors)</span>
              </h5>
              <p className="text-[11px] text-[#947765]">
                คลิกที่วงล้อสีเพื่อจิ้มเลือก หรือพิมพ์โค้ดสี HEX เช่น #F6B8C6 ได้เลยค่ะ
              </p>
            </div>
            {currentPresetId === 'custom' && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FCE4EC] text-[#D06D80] font-bold border border-[#F6B8C6]">
                โหมดปรับแต่งสีเอง ✨
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Primary Color */}
            <div className="p-3 bg-[#FFF8EC]/60 rounded-xl border border-[#FCE4EC]">
              <label className="text-xs font-semibold text-[#543E30] block mb-1">
                🌟 สีหลัก (Primary Color)
              </label>
              <p className="text-[10px] text-[#947765] mb-2">
                ใช้กับปุ่มสั่งซื้อหลัก, กรอบเน้น, ไฮไลท์
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#F6B8C6] p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={currentColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="text-xs font-mono uppercase"
                  placeholder="#F6B8C6"
                />
              </div>
            </div>

            {/* Primary Deep Color */}
            <div className="p-3 bg-[#FFF8EC]/60 rounded-xl border border-[#FCE4EC]">
              <label className="text-xs font-semibold text-[#543E30] block mb-1">
                👑 สีหัวข้อ & ตัวหนังสือเด่น (Primary Deep)
              </label>
              <p className="text-[10px] text-[#947765] mb-2">
                ใช้กับชื่อร้าน, หัวข้อหมวดหมู่, ตัวเลขราคา
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColors.primary_deep}
                  onChange={(e) => handleColorChange('primary_deep', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#F6B8C6] p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={currentColors.primary_deep}
                  onChange={(e) => handleColorChange('primary_deep', e.target.value)}
                  className="text-xs font-mono uppercase"
                  placeholder="#D06D80"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="p-3 bg-[#FFF8EC]/60 rounded-xl border border-[#FCE4EC]">
              <label className="text-xs font-semibold text-[#543E30] block mb-1">
                🌿 สีรอง & เส้นคั่น (Secondary Color)
              </label>
              <p className="text-[10px] text-[#947765] mb-2">
                ใช้กับปุ่มทางลัด (ดูคิว, รีวิว), เส้นแบ่งหมวดหมู่
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#F6B8C6] p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={currentColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="text-xs font-mono uppercase"
                  placeholder="#A8B99A"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="p-3 bg-[#FFF8EC]/60 rounded-xl border border-[#FCE4EC]">
              <label className="text-xs font-semibold text-[#543E30] block mb-1">
                🍦 สีพื้นหลังร้าน (Background Tone)
              </label>
              <p className="text-[10px] text-[#947765] mb-2">
                สีพื้นหลังหลักของร้านค้า
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColors.bg_vanilla}
                  onChange={(e) => handleColorChange('bg_vanilla', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#F6B8C6] p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={currentColors.bg_vanilla}
                  onChange={(e) => handleColorChange('bg_vanilla', e.target.value)}
                  className="text-xs font-mono uppercase"
                  placeholder="#FFF8EC"
                />
              </div>
            </div>

            {/* Text Deep Color */}
            <div className="p-3 bg-[#FFF8EC]/60 rounded-xl border border-[#FCE4EC]">
              <label className="text-xs font-semibold text-[#543E30] block mb-1">
                🖋️ สีตัวหนังสือเนื้อหา (Text Color)
              </label>
              <p className="text-[10px] text-[#947765] mb-2">
                สีข้อความ คำอธิบายสินค้า และรายละเอียด
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColors.text_deep || '#543E30'}
                  onChange={(e) => handleColorChange('text_deep', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#F6B8C6] p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={currentColors.text_deep || '#543E30'}
                  onChange={(e) => handleColorChange('text_deep', e.target.value)}
                  className="text-xs font-mono uppercase"
                  placeholder="#543E30"
                />
              </div>
            </div>

            {/* Light Tint Tone */}
            <div className="p-3 bg-[#FFF8EC]/60 rounded-xl border border-[#FCE4EC]">
              <label className="text-xs font-semibold text-[#543E30] block mb-1">
                🌸 สีกล่องการ์ด / แบดจ์ (Light Tint)
              </label>
              <p className="text-[10px] text-[#947765] mb-2">
                สีพื้นกล่องข้อความ, แบดจ์แจ้งเตือน, การ์ดรีวิว
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColors.light_tone || '#FCE4EC'}
                  onChange={(e) => handleColorChange('light_tone', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#F6B8C6] p-0.5 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={currentColors.light_tone || '#FCE4EC'}
                  onChange={(e) => handleColorChange('light_tone', e.target.value)}
                  className="text-xs font-mono uppercase"
                  placeholder="#FCE4EC"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Mini Preview */}
        <div className="bg-[#FFFEFA] p-4 rounded-2xl border border-[#F6B8C6] shadow-sm space-y-3">
          <h5 className="font-bold text-sm text-[#543E30] flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#D06D80]" />
            <span>3. ตัวอย่างหน้าร้านตามสีที่คุณเลือก (Live Preview)</span>
          </h5>

          <div
            className="p-4 rounded-2xl border transition-all space-y-3 shadow-inner"
            style={{
              backgroundColor: currentColors.bg_vanilla,
              borderColor: currentColors.primary,
            }}
          >
            {/* Sample Title */}
            <div className="text-center">
              <h4
                className="font-bold text-lg"
                style={{ color: currentColors.primary_deep }}
              >
                {settings.shop_name || 'Auralune Tarot'}
              </h4>
              <p
                className="text-xs"
                style={{ color: currentColors.text_soft || currentColors.text_deep }}
              >
                {settings.shop_subtitle || 'ร้านดูดวงไพ่ทาโรต์ อบอุ่น สไตล์คอทเทจ'}
              </p>
            </div>

            {/* Sample Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition"
                style={{
                  backgroundColor: currentColors.bg_vanilla,
                  borderColor: currentColors.secondary,
                  borderWidth: '1.5px',
                  color: currentColors.text_deep,
                }}
              >
                🔮 เช็คคิวดูดวง
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition"
                style={{
                  backgroundColor: currentColors.bg_vanilla,
                  borderColor: currentColors.secondary,
                  borderWidth: '1.5px',
                  color: currentColors.text_deep,
                }}
              >
                ⭐ รีวิวจากลูกค้า
              </button>
            </div>

            {/* Sample Package Card */}
            <div
              className="p-3 rounded-xl border flex items-center justify-between"
              style={{
                backgroundColor: currentPresetId === 'midnight' ? '#241E34' : '#FFFFFF',
                borderColor: currentColors.primary,
              }}
            >
              <div>
                <div
                  className="font-bold text-xs"
                  style={{ color: currentColors.text_deep }}
                >
                  คำถามความรัก & การงาน 1 ข้อ
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: currentColors.text_soft || currentColors.text_deep }}
                >
                  ตอบกระชับ ตรงประเด็น พร้อมคำแนะนำ
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs"
                style={{
                  background: `linear-gradient(135deg, ${currentColors.primary} 0%, ${currentColors.primary_deep} 100%)`,
                  color: currentPresetId === 'midnight' ? '#FFFFFF' : currentColors.text_deep,
                }}
              >
                ฿59 · สั่งซื้อ
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveTheme}
              className="cta-btn py-2.5 px-6 text-xs font-bold text-[#543E30] flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>กดบันทึกธีมและสีร้านค้า</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Contact Channels Management Panel
  const renderContactsPanel = () => {
    if (!settings) return null;
    const socials: StoreContact[] = settings.socials || [];

    const handleAddContact = (presetType?: string) => {
      let defaultType = presetType || 'LINE';
      let defaultName = 'LINE Official';
      let defaultUrl = 'https://lin.ee/';

      if (presetType === 'Instagram') {
        defaultName = '@auralune_a';
        defaultUrl = 'https://instagram.com/';
      } else if (presetType === 'Facebook') {
        defaultName = 'Auralune ดูดวงไพ่ทาโรต์';
        defaultUrl = 'https://facebook.com/';
      } else if (presetType === 'TikTok') {
        defaultName = '@tiktok_shop';
        defaultUrl = 'https://tiktok.com/@';
      } else if (presetType === 'Phone') {
        defaultType = 'เบอร์โทรศัพท์';
        defaultName = '096-889-xxxx';
        defaultUrl = 'tel:0968895279';
      } else if (presetType === 'X') {
        defaultType = 'X (Twitter)';
        defaultName = '@twitter_handle';
        defaultUrl = 'https://x.com/';
      }

      const nextSocials: StoreContact[] = [
        ...socials,
        { type: defaultType, name: defaultName, url: defaultUrl },
      ];
      setSettings({ ...settings, socials: nextSocials });
      showFeedback(`เพิ่มช่องทาง ${defaultType} เรียบร้อยแล้วค่ะ อย่าลืมกดบันทึกนะคะ`);
    };

    const handleUpdateContact = (index: number, field: keyof StoreContact, value: string) => {
      const nextSocials = [...socials];
      nextSocials[index] = { ...nextSocials[index], [field]: value };
      setSettings({ ...settings, socials: nextSocials });
    };

    const handleDeleteContact = (index: number) => {
      const target = socials[index];
      setConfirmDialog({
        isOpen: true,
        title: 'ยืนยันการลบช่องทางติดต่อ',
        message: `ต้องการลบช่องทาง "${target.type} (${target.name || target.url})" ออกจากร้านค้าหรือไม่?`,
        confirmText: 'ลบช่องทาง',
        cancelText: 'ยกเลิก',
        variant: 'danger',
        icon: <Trash2 className="w-6 h-6 text-[#D06D80]" />,
        onConfirm: () => {
          const nextSocials = socials.filter((_, i) => i !== index);
          setSettings({ ...settings, socials: nextSocials });
          showFeedback('ลบช่องทางติดต่อเรียบร้อยแล้วค่ะ');
        },
      });
    };

    const handleMoveContact = (index: number, direction: 'up' | 'down') => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= socials.length) return;
      const list = [...socials];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      setSettings({ ...settings, socials: list });
    };

    const renderContactIcon = (type: string) => {
      const t = (type || '').toLowerCase();
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
      if (t.includes('tiktok')) {
        return (
          <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        );
      }
      if (t.includes('twitter') || t.includes(' x') || t === 'x') {
        return (
          <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      }
      if (t.includes('phone') || t.includes('โทร')) {
        return <Phone className="w-5 h-5 text-[#2E7D32]" />;
      }
      return <Globe className="w-5 h-5 text-[#A8B99A]" />;
    };

    return (
      <div className="space-y-4 max-w-2xl pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#D06D80] flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#D06D80]" />
              <span>จัดการช่องทางติดต่อร้านค้า (Contact Channels)</span>
            </h4>
            <p className="text-xs text-[#947765]">
              แก้ไขหรือเพิ่มช่องทางที่ลูกค้าจะเห็นเมื่อกดปุ่ม &quot;ติดต่อร้านค้า&quot; (LINE, IG, Facebook, TikTok ฯลฯ)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddContact()}
              className="py-2 px-3 rounded-xl border border-[#F6B8C6] text-xs font-semibold text-[#543E30] hover:bg-[#FCE4EC] transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4 text-[#D06D80]" />
              <span>เพิ่มช่องทาง</span>
            </button>
            <button
              onClick={handleSaveSettings}
              className="cta-btn py-2 px-4 text-xs font-semibold text-[#543E30] flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกช่องทางติดต่อ</span>
            </button>
          </div>
        </div>

        {/* Quick Add Presets Bar */}
        <div className="bg-[#FFFEFA] p-3 rounded-xl border border-[#F6B8C6] shadow-sm flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#947765] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D06D80]" />
            <span>เพิ่มด่วน:</span>
          </span>
          {[
            { label: '+ LINE', type: 'LINE' },
            { label: '+ Instagram', type: 'Instagram' },
            { label: '+ Facebook', type: 'Facebook' },
            { label: '+ TikTok', type: 'TikTok' },
            { label: '+ เบอร์โทรศัพท์', type: 'Phone' },
            { label: '+ X (Twitter)', type: 'X' },
          ].map((preset) => (
            <button
              key={preset.type}
              type="button"
              onClick={() => handleAddContact(preset.type)}
              className="px-2.5 py-1 rounded-lg bg-[#FFF8EC] border border-[#F6B8C6] hover:bg-[#FCE4EC] text-[#543E30] font-medium transition cursor-pointer text-xs"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Contacts List */}
        <div className="space-y-3">
          {socials.length === 0 ? (
            <div className="bg-[#FFFEFA] p-8 rounded-2xl border border-dashed border-[#F6B8C6] text-center space-y-3">
              <span className="text-3xl">💬</span>
              <p className="text-xs text-[#947765]">ยังไม่มีข้อมูลช่องทางติดต่อร้านค้า</p>
              <button
                type="button"
                onClick={() => handleAddContact()}
                className="cta-btn py-2 px-4 text-xs font-bold text-[#543E30] inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มช่องทางแรก</span>
              </button>
            </div>
          ) : (
            socials.map((social, index) => (
              <div
                key={index}
                className="bg-[#FFFEFA] p-3.5 rounded-2xl border border-[#F6B8C6] shadow-xs space-y-3 transition hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#FCE4EC] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FFF8EC] border border-[#C9DDB8] flex items-center justify-center shrink-0">
                      {renderContactIcon(social.type)}
                    </div>
                    <span className="font-bold text-xs text-[#543E30]">
                      ช่องทางที่ {index + 1}: {social.type || 'ช่องทางใหม่'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveContact(index, 'up')}
                      title="เลื่อนขึ้น"
                      className="p-1 text-[#947765] hover:text-[#543E30] hover:bg-[#FCE4EC] rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === socials.length - 1}
                      onClick={() => handleMoveContact(index, 'down')}
                      title="เลื่อนลง"
                      className="p-1 text-[#947765] hover:text-[#543E30] hover:bg-[#FCE4EC] rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {social.url && (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="ทดสอบเปิดลิงก์"
                        className="p-1 text-[#0284c7] hover:bg-[#e0f2fe] rounded cursor-pointer ml-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteContact(index)}
                      title="ลบช่องทางนี้"
                      className="p-1 text-[#D06D80] hover:bg-[#FCE4EC] rounded cursor-pointer ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-[#543E30] block mb-1">
                      ประเภทช่องทาง (Platform)
                    </label>
                    <input
                      type="text"
                      value={social.type}
                      placeholder="เช่น LINE, Instagram, Facebook"
                      onChange={(e) => handleUpdateContact(index, 'type', e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#543E30] block mb-1">
                      ชื่อที่แสดง / ไอดี (Display Name)
                    </label>
                    <input
                      type="text"
                      value={social.name}
                      placeholder="เช่น @auralune_a, LINE Official"
                      onChange={(e) => handleUpdateContact(index, 'name', e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#543E30] block mb-1">
                      ลิงก์ปลายทาง (URL / tel:)
                    </label>
                    <input
                      type="text"
                      value={social.url}
                      placeholder="https://... หรือ tel:..."
                      onChange={(e) => handleUpdateContact(index, 'url', e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Customer Modal Preview Card */}
        {socials.length > 0 && (
          <div className="bg-[#FFFEFA] p-4 rounded-2xl border border-[#F6B8C6] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-sm text-[#543E30] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#D06D80]" />
                <span>ตัวอย่างหน้าต่างติดต่อที่ลูกค้าจะเห็น (Live Modal Preview)</span>
              </h5>
              <span className="text-[11px] text-[#947765]">อัปเดตตามที่พิมพ์ทันที</span>
            </div>

            <div className="bg-[#FFF8EC] p-4 rounded-2xl border border-[#F6B8C6]/50 max-w-sm mx-auto shadow-inner space-y-2.5">
              <div className="text-center pb-2 border-b border-[#F6B8C6]/30">
                <span className="text-xl">💬</span>
                <h4 className="font-bold text-sm text-[#D06D80]">
                  ติดต่อร้าน {settings.shop_name || 'Auralune'}
                </h4>
                <p className="text-[10px] text-[#947765]">
                  สามารถทักแชทสอบถามรายละเอียดหรือแจ้งชำระเงินได้ตลอดเวลาค่ะ
                </p>
              </div>

              <div className="space-y-2">
                {socials.map((social, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-[#F6B8C6]/60 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FFF8EC] flex items-center justify-center border border-[#C9DDB8]">
                        {renderContactIcon(social.type)}
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-[#543E30] block">
                          {social.type || 'ช่องทางติดต่อ'}
                        </span>
                        <span className="text-[10px] text-[#947765] block truncate max-w-[170px]">
                          {social.name || social.url || '-'}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#A8B99A]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="cta-btn py-2.5 px-6 text-xs font-bold text-[#543E30] flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>กดบันทึกช่องทางติดต่อทั้งหมด</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
                Auralune Tarot Studio · ข้อมูลอัปเดตตามเวลาจริง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {settings && (
              <button
                type="button"
                onClick={() => handleToggleStoreOpen(settings.is_store_open === false ? true : false)}
                disabled={isTogglingStore}
                title={settings.is_store_open === false ? 'คลิกเพื่อเปิดร้านรับออเดอร์' : 'คลิกเพื่อปิดร้านชั่วคราว (ล็อคการสั่งซื้อ)'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border ${
                  settings.is_store_open === false
                    ? 'bg-rose-100 text-rose-700 border-rose-300 hover:bg-rose-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                }`}
              >
                {isTogglingStore ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : settings.is_store_open === false ? (
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
                <span className="hidden sm:inline">
                  {settings.is_store_open === false ? 'ร้านปิดอยู่ (คลิกเปิด)' : 'ร้านเปิดอยู่ (คลิกปิด)'}
                </span>
                <span className="sm:hidden">
                  {settings.is_store_open === false ? 'ปิดอยู่' : 'เปิดอยู่'}
                </span>
              </button>
            )}

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
            { id: 'contacts' as const, label: 'ช่องทางติดต่อ 💬', icon: <MessageCircle className="w-4 h-4" /> },
            { id: 'theme' as const, label: 'ธีม & สีร้านค้า 🎨', icon: <Palette className="w-4 h-4" /> },
            { id: 'music' as const, label: 'จัดการเพลง', icon: <Music className="w-4 h-4" /> },
            { id: 'reviews' as const, label: `จัดการรีวิว (${reviews.length})`, icon: <Star className="w-4 h-4" /> },
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
                  {/* Store Status Banner */}
                  {settings && (
                    <div
                      className={`p-4 rounded-2xl border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        settings.is_store_open === false
                          ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200'
                          : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                            settings.is_store_open === false
                              ? 'bg-rose-500 text-white'
                              : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {settings.is_store_open === false ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <Store className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#543E30]">
                              สถานะร้านค้าขณะนี้:{' '}
                              <span
                                className={
                                  settings.is_store_open === false
                                    ? 'text-rose-600 font-extrabold'
                                    : 'text-emerald-700 font-extrabold'
                                }
                              >
                                {settings.is_store_open === false
                                  ? '🔴 ปิดรับคิวชั่วคราว (ล็อคการสั่งซื้อ)'
                                  : '🟢 เปิดร้านรับออเดอร์ตามปกติ'}
                              </span>
                            </h4>
                          </div>
                          <p className="text-xs text-[#947765] mt-0.5">
                            {settings.is_store_open === false
                              ? `ลูกค้าจะไม่สามารถกดสั่งซื้อหรือใส่ตะกร้าได้ · ข้อความที่แจ้งหน้าร้าน: "${settings.store_close_message || 'ร้านปิดรับคิวชั่วคราว'}"`
                              : 'ลูกค้าสามารถเลือกแพ็กเกจ ใส่ตะกร้า และสั่งซื้อดูดวงได้ตามปกติ'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStoreOpen(settings.is_store_open === false ? true : false)
                          }
                          disabled={isTogglingStore}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 ${
                            settings.is_store_open === false
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-rose-600 hover:bg-rose-700 text-white'
                          }`}
                        >
                          {isTogglingStore ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : settings.is_store_open === false ? (
                            <>
                              <Unlock className="w-4 h-4" />
                              <span>คลิกเพื่อเปิดร้าน</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>คลิกเพื่อปิดร้านชั่วคราว</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

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
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#D06D80]">
                        จัดการคำสั่งซื้อและตรวจสลิป ({orders.length})
                      </h4>
                      <p className="text-xs text-[#947765]">
                        กด &quot;ยืนยันชำระเงิน&quot; เพื่อดึงเข้าคิวอัตโนมัติ หรือกดไอคอนถังขยะเพื่อลบประวัติ
                      </p>
                    </div>
                    {orders.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllOrders}
                        className="secondary-btn py-1.5 px-3 text-xs text-[#D06D80] border-[#F6B8C6] hover:bg-[#FCE4EC] flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ล้างประวัติทั้งหมด</span>
                      </button>
                    )}
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
                                  className="w-16 h-16 rounded-lg overflow-hidden border border-[#C9DDB8] cursor-pointer hover:opacity-80 transition relative bg-[#FFF8EC] flex items-center justify-center shrink-0 shadow-xs"
                                  title="คลิกเพื่อดูสลิปเต็ม"
                                >
                                  <Image
                                    src={o.slip_url}
                                    alt="Slip"
                                    width={64}
                                    height={64}
                                    unoptimized
                                    onError={(e) => {
                                      // If an old slip file from a previous ephemeral container is unavailable
                                      const target = e.currentTarget as HTMLElement;
                                      target.style.opacity = '0.3';
                                    }}
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

                            {/* Verification Button & Delete */}
                            <div className="flex items-center gap-2">
                              {o.status !== 'confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => handleConfirmPayment(o.id)}
                                  className="cta-btn py-2 px-3 text-xs font-semibold text-[#543E30] flex items-center gap-1.5 cursor-pointer shadow-md"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>ยืนยันชำระเงิน & เข้าคิว</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(o.order_no, o.customer_name)}
                                className="p-2 text-[#D06D80] hover:bg-[#FCE4EC] rounded-lg border border-transparent hover:border-[#F6B8C6]/50 transition cursor-pointer"
                                title="ลบประวัติออเดอร์นี้"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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

                          {/* Customer Contact & Direct Notification Bar */}
                          {(() => {
                            const relOrder = orders.find((o) => o.order_no === q.order_no);
                            const ch = q.contact_channel || relOrder?.contact_channel;
                            const val = q.contact_value || relOrder?.contact_value;
                            return (
                              <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-[#FFF8EC]/80 border border-[#F6B8C6]/40">
                                <div className="flex items-center gap-1.5 text-[11px] text-[#543E30]">
                                  <span className="font-semibold text-[#D06D80]">📱 ข้อมูลติดต่อ:</span>
                                  <span className="font-medium">{ch || 'ช่องทาง'}:</span>
                                  <span className="font-bold text-[#D06D80]">{val || q.contact_info || '-'}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleOpenNotifyModal(q)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-[#F6B8C6] to-[#FCE4EC] hover:brightness-95 text-[#543E30] border border-[#F6B8C6] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                                  title="ส่งข้อความอัปเดตสถานะคิวให้ลูกค้า"
                                >
                                  <Send className="w-3 h-3 text-[#D06D80]" />
                                  <span>แจ้งเตือนคิวลูกค้า 💬</span>
                                </button>
                              </div>
                            );
                          })()}

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
                              setConfirmDialog({
                                isOpen: true,
                                title: 'ยืนยันการลบหมวดหมู่',
                                message: `ต้องการลบหมวดหมู่ "${cat.name || 'ไม่มีชื่อ'}" ใช่หรือไม่?\nรายการสินค้าในหมวดนี้ทั้งหมดจะถูกลบออกด้วยค่ะ`,
                                confirmText: 'ลบหมวดหมู่',
                                cancelText: 'ยกเลิก',
                                variant: 'danger',
                                icon: <Trash2 className="w-6 h-6 text-[#D06D80]" />,
                                onConfirm: () => {
                                  setCategories(categories.filter((_, i) => i !== catIdx));
                                  showFeedback('ลบหมวดหมู่แล้ว (อย่าลืมกดปุ่ม "บันทึกหมวดหมู่และสินค้า" นะคะ)');
                                },
                              });
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
                                    setConfirmDialog({
                                      isOpen: true,
                                      title: 'ยืนยันการลบสินค้า',
                                      message: `ต้องการลบ "${pkg.name || 'สินค้านี้'}" ใช่หรือไม่?`,
                                      confirmText: 'ลบสินค้า',
                                      cancelText: 'ยกเลิก',
                                      variant: 'danger',
                                      icon: <Trash2 className="w-6 h-6 text-[#D06D80]" />,
                                      onConfirm: () => {
                                        const next = [...categories];
                                        next[catIdx].packages.splice(pkgIdx, 1);
                                        setCategories(next);
                                        showFeedback('ลบสินค้าแล้ว (อย่าลืมกดปุ่ม "บันทึกหมวดหมู่และสินค้า" นะคะ)');
                                      },
                                    });
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

                  {/* Store Status Card */}
                  <div className="bg-[#FFFEFA] p-4 rounded-xl border-2 border-[#F6B8C6] text-xs shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F6B8C6]/40">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏪</span>
                        <div>
                          <h5 className="font-bold text-sm text-[#D06D80]">
                            ระบบเปิด-ปิดร้านค้า
                          </h5>
                          <p className="text-[11px] text-[#947765]">
                            เมื่อปิดร้าน ลูกค้าจะไม่สามารถกดสั่งซื้อหรือใส่ตะกร้าได้
                          </p>
                        </div>
                      </div>

                      {/* Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextIsOpen = settings.is_store_open === false ? true : false;
                          handleToggleStoreOpen(nextIsOpen);
                        }}
                        disabled={isTogglingStore}
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
                          settings.is_store_open !== false ? 'bg-emerald-500' : 'bg-stone-300'
                        }`}
                        title={settings.is_store_open !== false ? 'คลิกเพื่อปิดร้าน' : 'คลิกเพื่อเปิดร้าน'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[11px] ${
                            settings.is_store_open !== false ? 'translate-x-7' : 'translate-x-0'
                          }`}
                        >
                          {settings.is_store_open !== false ? '🟢' : '🔒'}
                        </span>
                      </button>
                    </div>

                    <div
                      className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
                        settings.is_store_open !== false
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          {settings.is_store_open !== false ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>ร้านเปิดรับออเดอร์ตามปกติ</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-rose-600" />
                              <span className="text-rose-700">ร้านปิดรับคิวชั่วคราว (ล็อคการสั่งซื้อ)</span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-[#947765] mt-0.5">
                          {settings.is_store_open !== false
                            ? 'ลูกค้าสามารถดูดวงและชำระเงินได้ตามปกติ'
                            : 'ระบบล็อคปุ่มสั่งซื้อและซ่อนแถบตะกร้าสินค้าอัตโนมัติ'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleStoreOpen(settings.is_store_open === false ? true : false)
                        }
                        disabled={isTogglingStore}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                          settings.is_store_open !== false
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isTogglingStore ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : settings.is_store_open !== false ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>ปิดร้าน</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>เปิดร้าน</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] text-[#543E30] font-semibold block mb-1">
                        ข้อความแจ้งเตือนเมื่อปิดร้าน (แสดงที่หัวเว็บและปุ่มสินค้า)
                      </label>
                      <input
                        type="text"
                        value={settings.store_close_message || ''}
                        placeholder="เช่น ร้านปิดรับคิวชั่วคราว ขออภัยในความไม่สะดวกค่ะ 🙏"
                        onChange={(e) =>
                          setSettings({ ...settings, store_close_message: e.target.value })
                        }
                      />
                      <p className="text-[10px] text-[#947765] mt-1">
                        * ข้อความนี้จะแสดงในกล่องแจ้งเตือนสีแดงหน้าร้านเมื่อคุณปิดร้าน
                      </p>
                    </div>
                  </div>

                  {/* Theme & Colors Quick Card */}
                  <div className="bg-[#FFFEFA] p-4 rounded-xl border border-[#F6B8C6] text-xs shadow-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🎨</span>
                      <div>
                        <h5 className="font-bold text-sm text-[#D06D80]">
                          ธีมและโทนสีร้านค้า
                        </h5>
                        <p className="text-[11px] text-[#947765]">
                          เลือก 7 ธีมสำเร็จรูป หรือผสมโค้ดสีเองอิสระ (Live Preview)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('theme')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6B8C6] to-[#FCE4EC] hover:brightness-95 text-[#543E30] text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
                    >
                      <Palette className="w-4 h-4 text-[#D06D80]" />
                      <span>ปรับแต่งสีร้านค้า ✨</span>
                    </button>
                  </div>

                  {/* Contact Channels Quick Card */}
                  <div className="bg-[#FFFEFA] p-4 rounded-xl border border-[#F6B8C6] text-xs shadow-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">💬</span>
                      <div>
                        <h5 className="font-bold text-sm text-[#D06D80]">
                          ช่องทางติดต่อร้านค้า (Socials)
                        </h5>
                        <p className="text-[11px] text-[#947765]">
                          จัดการ LINE, Instagram, Facebook, TikTok, เบอร์โทร สำหรับให้ลูกค้าติดต่อ
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contacts')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F6B8C6] to-[#FCE4EC] hover:brightness-95 text-[#543E30] text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 text-[#D06D80]" />
                      <span>จัดการช่องทางติดต่อ ✨</span>
                    </button>
                  </div>

                  {/* Notification Settings Card (LINE & Webhook) */}
                  <div className="bg-[#FFFEFA] p-4 rounded-xl border-2 border-[#F6B8C6] text-xs shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F6B8C6]/40">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F6B8C6] to-[#FCE4EC] flex items-center justify-center text-lg shadow-2xs">
                          🔔
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm text-[#D06D80]">
                              ระบบแจ้งเตือนร้านค้า (LINE & Webhook)
                            </h5>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-emerald-700 border border-emerald-200">
                              แนะนำ ✨
                            </span>
                          </div>
                          <p className="text-[11px] text-[#947765]">
                            ส่งแจ้งเตือนเข้า LINE หรือ Webhook ทันทีเมื่อลูกค้าแนบสลิปใหม่ หรือเมื่ออัปเดตคิว
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notification Toggles */}
                    <div className="space-y-2.5 bg-[#FFF8EC]/60 p-3 rounded-xl border border-[#F6B8C6]/50">
                      <label className="flex items-center gap-2.5 cursor-pointer text-[#543E30] font-semibold">
                        <input
                          type="checkbox"
                          checked={settings.notify_on_slip !== false}
                          onChange={(e) =>
                            setSettings({ ...settings, notify_on_slip: e.target.checked })
                          }
                          className="w-4 h-4 accent-[#D06D80] rounded cursor-pointer"
                        />
                        <span>🔔 แจ้งเตือนเมื่อมีลูกค้าโอนเงินและแนบสลิปใหม่ (แนะนำมาก!)</span>
                      </label>
                      <p className="text-[10px] text-[#947765] pl-6.5">
                        เมื่อลูกค้าอัปโหลดสลิปที่หน้าเว็บ ระบบจะส่งรายละเอียดออเดอร์ ยอดเงิน และข้อมูลติดต่อเข้า LINE ของคุณทันที
                      </p>

                      <label className="flex items-center gap-2.5 cursor-pointer text-[#543E30] font-semibold pt-1">
                        <input
                          type="checkbox"
                          checked={settings.notify_on_queue === true}
                          onChange={(e) =>
                            setSettings({ ...settings, notify_on_queue: e.target.checked })
                          }
                          className="w-4 h-4 accent-[#D06D80] rounded cursor-pointer"
                        />
                        <span>📋 แจ้งเตือนร้านค้าเมื่อสถานะคิวงานมีการเปลี่ยนแปลง</span>
                      </label>
                      <p className="text-[10px] text-[#947765] pl-6.5">
                        บันทึกประวัติการเปลี่ยนสถานะคิวเข้า LINE / Webhook
                      </p>
                    </div>

                    {/* LINE Messaging API Credentials */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <h6 className="font-bold text-xs text-[#543E30] flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#06C755]" />
                          <span>ตั้งค่า LINE Messaging API (ฟรี 100%)</span>
                        </h6>
                        <button
                          type="button"
                          onClick={() => setShowLineHelpGuide(!showLineHelpGuide)}
                          className="text-[11px] text-[#D06D80] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{showLineHelpGuide ? 'ซ่อนวิธีตั้งค่า' : 'วิธีรับ Token ฟรี (3 ขั้นตอน)'}</span>
                        </button>
                      </div>

                      {/* Collapsible LINE setup guide */}
                      {showLineHelpGuide && (
                        <div className="p-3.5 rounded-xl bg-[#E8F5E9]/50 border border-[#A5D6A7] text-[11px] text-[#2E7D32] space-y-2">
                          <p className="font-bold text-xs flex items-center gap-1 text-[#1B5E20]">
                            <span>💡 วิธีเชื่อมต่อ LINE Messaging API ฟรีใน 2 นาที:</span>
                          </p>
                          <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                            <li>
                              เข้าเว็บไซต์{' '}
                              <a
                                href="https://developers.line.biz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline font-bold text-[#1B5E20]"
                              >
                                developers.line.biz
                              </a>{' '}
                              แล้วกด <b>Log in</b> ด้วยบัญชี LINE ส่วนตัวของคุณ
                            </li>
                            <li>
                              กดสร้าง <b>Provider</b> (เช่น ตั้งชื่อว่า <i>Apple Tarot</i>) แล้วเลือก <b>Create a Messaging API channel</b>
                            </li>
                            <li>
                              ไปที่แท็บ <b>Messaging API</b> เลื่อนลงล่างสุด แล้วกดปุ่ม <b>Issue</b> ตรง <i>Channel access token (long-lived)</i> แล้วคัดลอกมาวางในช่องด้านล่าง
                            </li>
                            <li>
                              ไปที่แท็บ <b>Basic settings</b> เลื่อนลงมาที่หัวข้อ <i>Your user ID</i> (ขึ้นต้นด้วย <code>U...</code>) แล้วคัดลอกมาวางในช่อง User ID
                            </li>
                            <li>
                              สแกน QR Code เพื่อแอดเพื่อนกับ LINE Official Bot ของคุณ (เพื่อให้บอทส่งข้อความหาคุณได้)
                            </li>
                            <li>
                              กดปุ่ม <b>&quot;ทดสอบส่งข้อความแจ้งเตือน&quot;</b> ด้านล่าง แล้วกด <b>&quot;บันทึกการตั้งค่า&quot;</b> ค่ะ 🎉
                            </li>
                          </ol>
                        </div>
                      )}

                      <div>
                        <label className="text-[11px] text-[#543E30] font-semibold block mb-1">
                          LINE Channel Access Token (Long-lived)
                        </label>
                        <input
                          type="password"
                          value={settings.line_channel_access_token || ''}
                          placeholder="วาง Channel Access Token ที่ได้จาก LINE Developers (เช่น eyJhbGciOi...)"
                          onChange={(e) =>
                            setSettings({ ...settings, line_channel_access_token: e.target.value })
                          }
                          className="font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[#543E30] font-semibold block mb-1">
                          LINE Admin User ID หรือ Group ID (ผู้รับแจ้งเตือน)
                        </label>
                        <input
                          type="text"
                          value={settings.line_admin_user_id || ''}
                          placeholder="User ID ของคุณ (ขึ้นต้นด้วย U...) หรือ Group ID (ขึ้นต้นด้วย C... / R...)"
                          onChange={(e) =>
                            setSettings({ ...settings, line_admin_user_id: e.target.value })
                          }
                          className="font-mono text-xs"
                        />
                        <p className="text-[10px] text-[#947765] mt-1">
                          * ดู Your user ID ได้ที่แท็บ Basic settings ใน LINE Developers Console
                        </p>
                      </div>
                    </div>

                    {/* Webhook fallback */}
                    <div className="space-y-2 pt-2 border-t border-[#F6B8C6]/30">
                      <label className="text-[11px] text-[#543E30] font-semibold block">
                        Webhook URL ทางเลือกเสริม (เช่น Discord Webhook / Make / Zapier)
                      </label>
                      <input
                        type="text"
                        value={settings.webhook_url || ''}
                        placeholder="https://discord.com/api/webhooks/... หรือ https://hook.eu2.make.com/..."
                        onChange={(e) =>
                          setSettings({ ...settings, webhook_url: e.target.value })
                        }
                        className="font-mono text-xs"
                      />
                    </div>

                    {/* Test Notification Button */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#F6B8C6]/30">
                      <button
                        type="button"
                        onClick={handleTestNotification}
                        disabled={
                          isTestingNotification ||
                          (!settings.line_channel_access_token && !settings.webhook_url)
                        }
                        className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#D06D80] to-[#E28E9D] hover:brightness-105 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                      >
                        {isTestingNotification ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>กำลังทดสอบส่งข้อความ...</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5" />
                            <span>🔔 ทดสอบส่งข้อความแจ้งเตือนทันที</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-[#947765]">
                        * กรุณากด &quot;บันทึกการตั้งค่า&quot; ด้านบนเพื่อบันทึกการเปลี่ยนแปลง
                      </span>
                    </div>
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
                      <h5 className="font-semibold text-sm text-[#D06D80] mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#D06D80]" />
                          <span>รูปภาพร้านค้า (อัปโหลดเองได้ 📸)</span>
                        </span>
                        <span className="text-[11px] font-normal text-[#947765]">
                          รองรับ .jpg, .png, .webp
                        </span>
                      </h5>

                      <div className="space-y-4">
                        {/* Banner Image */}
                        <div className="bg-[#FFF8EC]/60 p-3 rounded-2xl border border-[#F6B8C6]/50">
                          <label className="text-xs text-[#543E30] font-semibold block mb-1.5">
                            🌄 รูปภาพแบนเนอร์ร้าน (Banner)
                          </label>

                          {/* Banner Preview */}
                          {settings.banner_url && (
                            <div className="relative w-full h-28 sm:h-36 rounded-xl overflow-hidden mb-2.5 border border-[#F6B8C6] shadow-xs bg-[#FFF8EC]">
                              <Image
                                src={bannerLoadError ? DEFAULT_BANNER : settings.banner_url}
                                alt="Banner Preview"
                                fill
                                unoptimized
                                onError={() => setBannerLoadError(true)}
                                className="object-cover"
                              />
                            </div>
                          )}

                          <input
                            type="file"
                            ref={bannerFileInputRef}
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'banner');
                            }}
                          />

                          <div className="flex flex-wrap gap-2 items-center">
                            <button
                              type="button"
                              onClick={() => bannerFileInputRef.current?.click()}
                              disabled={uploadingBanner}
                              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#F6B8C6] to-[#FCE4EC] hover:brightness-95 text-[#543E30] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                            >
                              {uploadingBanner ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>กำลังแปลงรูป...</span>
                                </>
                              ) : (
                                <>
                                  <Camera className="w-3.5 h-3.5 text-[#D06D80]" />
                                  <span>📁 เลือกรูปแบนเนอร์จากเครื่อง</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSettings({ ...settings, banner_url: DEFAULT_BANNER });
                                setBannerLoadError(false);
                                showFeedback('รีเซ็ตเป็นแบนเนอร์เริ่มต้นเรียบร้อยแล้วค่ะ');
                              }}
                              className="py-2 px-3 rounded-xl border border-[#F6B8C6]/60 bg-[#FFF8EC] text-[#543E30] hover:bg-[#FCE4EC] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                              title="รีเซ็ตกลับเป็นรูปเริ่มต้น"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#947765]" />
                              <span>ใช้รูปเริ่มต้น</span>
                            </button>

                            <span className="text-[11px] text-[#947765]">
                              หรือใส่ลิงก์ภาพโดยตรง
                            </span>
                          </div>

                          <input
                            type="text"
                            placeholder="https://... หรือ data:image/..."
                            value={settings.banner_url}
                            onChange={(e) => {
                              setSettings({ ...settings, banner_url: e.target.value });
                              setBannerLoadError(false);
                            }}
                            className="mt-2 text-xs font-mono"
                          />
                        </div>

                        {/* Avatar Image */}
                        <div className="bg-[#FFF8EC]/60 p-3 rounded-2xl border border-[#F6B8C6]/50">
                          <label className="text-xs text-[#543E30] font-semibold block mb-1.5">
                            🌸 รูปภาพโปรไฟล์ร้าน (Avatar)
                          </label>

                          <div className="flex items-center gap-3 mb-2.5">
                            {/* Avatar Preview */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#F6B8C6] shadow-xs bg-white shrink-0">
                              {settings.avatar_url ? (
                                <Image
                                  src={avatarLoadError ? DEFAULT_AVATAR : settings.avatar_url}
                                  alt="Avatar Preview"
                                  fill
                                  unoptimized
                                  onError={() => setAvatarLoadError(true)}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#D06D80] text-xs">
                                  ไม่มีรูป
                                </div>
                              )}
                            </div>

                            <div className="flex-1 space-y-2">
                              <input
                                type="file"
                                ref={avatarFileInputRef}
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, 'avatar');
                                }}
                              />

                              <div className="flex flex-wrap gap-2 items-center">
                                <button
                                  type="button"
                                  onClick={() => avatarFileInputRef.current?.click()}
                                  disabled={uploadingAvatar}
                                  className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#C9DDB8] to-[#FFF8EC] hover:brightness-95 text-[#543E30] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                                >
                                  {uploadingAvatar ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>กำลังแปลงรูป...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Camera className="w-3.5 h-3.5 text-[#7D946D]" />
                                      <span>📁 เลือกรูปโปรไฟล์จากเครื่อง</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSettings({ ...settings, avatar_url: DEFAULT_AVATAR });
                                    setAvatarLoadError(false);
                                    showFeedback('รีเซ็ตเป็นโปรไฟล์เริ่มต้นเรียบร้อยแล้วค่ะ');
                                  }}
                                  className="py-2 px-3 rounded-xl border border-[#F6B8C6]/60 bg-[#FFF8EC] text-[#543E30] hover:bg-[#FCE4EC] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                  title="รีเซ็ตกลับเป็นรูปเริ่มต้น"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-[#947765]" />
                                  <span>ใช้รูปเริ่มต้น</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <input
                            type="text"
                            placeholder="https://... หรือ data:image/..."
                            value={settings.avatar_url}
                            onChange={(e) => {
                              setSettings({ ...settings, avatar_url: e.target.value });
                              setAvatarLoadError(false);
                            }}
                            className="text-xs font-mono"
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

                    {/* Admin Password Management */}
                    <div className="pt-2 border-t border-[#F6B8C6]/30">
                      <h5 className="font-semibold text-sm text-[#D06D80] mb-2 flex items-center gap-1.5">
                        <span>🔐 รหัสผ่านเข้าสู่ระบบหลังบ้าน (Admin Password)</span>
                      </h5>
                      <div className="bg-[#FFF8EC]/60 p-3.5 rounded-2xl border border-[#F6B8C6]/50 space-y-3">
                        <p className="text-xs text-[#947765]">
                          ลูกค้า / เจ้าของร้านสามารถตั้งหรือเปลี่ยนรหัสผ่านใหม่ได้เองตลอดเวลา:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                              รหัสผ่านใหม่
                            </label>
                            <input
                              type="password"
                              placeholder="อย่างน้อย 4 ตัวอักษร"
                              value={settingsNewPassword}
                              onChange={(e) => setSettingsNewPassword(e.target.value)}
                              className="font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                              ยืนยันรหัสผ่านใหม่
                            </label>
                            <input
                              type="password"
                              placeholder="พิมพ์ซ้ำอีกครั้ง"
                              value={settingsConfirmPassword}
                              onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                              className="font-mono text-xs"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveSettingsPassword}
                          disabled={isSavingPassword || !settingsNewPassword}
                          className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#F6B8C6] to-[#FCE4EC] hover:brightness-95 text-[#543E30] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                        >
                          {isSavingPassword ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>กำลังบันทึกรหัสผ่าน...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5 text-[#D06D80]" />
                              <span>บันทึกรหัสผ่านใหม่</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: THEME & COLOR CUSTOMIZER */}
              {activeTab === 'theme' && renderThemePanel()}

              {/* TAB: CONTACT CHANNELS */}
              {activeTab === 'contacts' && renderContactsPanel()}

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
                                title={
                                  extractYouTubeId(tr.url)
                                    ? 'ทดสอบฟังเพลงจาก YouTube'
                                    : playingTrackId === tr.id
                                    ? 'หยุดทดสอบเสียง'
                                    : 'ทดสอบฟัง'
                                }
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
                                setConfirmDialog({
                                  isOpen: true,
                                  title: 'ยืนยันการลบเพลง',
                                  message: `ต้องการลบเพลง "${tr.title || 'ไม่มีชื่อ'}" ออกจากรายการเพลงหรือไม่?`,
                                  confirmText: 'ลบเพลง',
                                  cancelText: 'ยกเลิก',
                                  variant: 'danger',
                                  icon: <Music className="w-6 h-6 text-[#D06D80]" />,
                                  onConfirm: () => {
                                    setMusicTracks(musicTracks.filter((_, i) => i !== idx));
                                    showFeedback('ลบเพลงแล้ว (อย่าลืมกดปุ่ม "บันทึกเพลง" นะคะ)');
                                  },
                                });
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
                          {tr.url && extractYouTubeId(tr.url) && (
                            <p className="mt-1 text-[11px] text-[#2E7D32] leading-tight flex items-center gap-1 font-medium bg-[#E8F5E9] px-2.5 py-1.5 rounded-lg border border-[#C9DDB8]">
                              <span>✨ ลิงก์ YouTube พร้อมใช้งาน: กดปุ่มเล่น ▷ ด้านบนเพื่อทดสอบฟังได้เลยค่ะ (เมื่อบันทึกจะเล่นบนหน้าเว็บหลัก)</span>
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

              {/* TAB 7: REVIEWS MANAGEMENT */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#D06D80] flex items-center gap-1.5">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span>จัดการรีวิวจากลูกค้า (Customer Reviews)</span>
                      </h4>
                      <p className="text-xs text-[#947765]">
                        จัดการ เพิ่ม แก้ไข และลบรีวิวที่แสดงบนหน้าเว็บให้ลูกค้าเห็น
                      </p>
                    </div>
                    <button
                      onClick={handleSaveReviews}
                      disabled={isSavingReviews}
                      className="cta-btn py-2 px-4 text-xs font-semibold text-[#543E30] flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSavingReviews ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>บันทึกรีวิว</span>
                    </button>
                  </div>

                  {/* Summary Stats & Add Button */}
                  <div className="flex items-center justify-between p-3.5 bg-[#FFF8EC] rounded-xl border border-[#F6B8C6]/60 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F6B8C6]/30 flex items-center justify-center text-lg">
                        ⭐️
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#543E30]">
                          รีวิวทั้งหมด {reviews.length} รายการ
                        </div>
                        <div className="text-[11px] text-[#947765] flex items-center gap-1">
                          <span>คะแนนเฉลี่ย:</span>
                          <span className="font-bold text-amber-600">
                            {reviews.length > 0
                              ? (
                                  reviews.reduce(
                                    (acc, r) => acc + (Number(r.rating) || 5),
                                    0
                                  ) / reviews.length
                                ).toFixed(1)
                              : '5.0'}{' '}
                            / 5.0
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingReview(!isAddingReview)}
                      className="cta-btn py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingReview ? 'ปิดฟอร์ม' : 'เพิ่มรีวิวใหม่'}</span>
                    </button>
                  </div>

                  {/* Add New Review Form */}
                  {isAddingReview && (
                    <div className="p-4 bg-[#FFFEFA] rounded-xl border-2 border-[#F6B8C6] space-y-3 shadow-md animate-in fade-in duration-200">
                      <h5 className="font-bold text-xs text-[#D06D80] flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>เขียน/เพิ่มรีวิวหน้าร้านใหม่</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#543E30] mb-1">
                            ชื่อลูกค้า:
                          </label>
                          <input
                            type="text"
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            placeholder="เช่น คุณแพรว, ลูกค้าประจำ"
                            className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-[#F6B8C6]/50 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#543E30] mb-1">
                            จำนวนดาว (1-5 ดาว):
                          </label>
                          <div className="flex items-center gap-1 py-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setNewReviewRating(s)}
                                className="p-1 hover:scale-110 transition cursor-pointer"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    s <= newReviewRating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-stone-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-amber-600 ml-2">
                              {newReviewRating} ดาว
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#543E30] mb-1">
                          ข้อความรีวิว:
                        </label>
                        <textarea
                          rows={3}
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          placeholder="พิมพ์ข้อความรีวิว หรือความประทับใจของลูกค้า..."
                          className="w-full text-xs p-2.5 rounded-lg border border-[#F6B8C6]/50 bg-white resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingReview(false);
                            setNewReviewAuthor('');
                            setNewReviewComment('');
                          }}
                          className="secondary-btn py-1.5 px-3 text-xs cursor-pointer"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateReview}
                          disabled={isSavingReviews}
                          className="cta-btn py-1.5 px-4 text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          {isSavingReviews ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          <span>+ บันทึกและเพิ่มรีวิว</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Review Cards List */}
                  <div className="space-y-3">
                    {reviews.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[#947765] bg-[#FFF8EC] rounded-xl border border-dashed border-[#F6B8C6]">
                        ยังไม่มีรีวิวในระบบ สามารถกด &quot;เพิ่มรีวิวใหม่&quot; ด้านบนได้เลยค่ะ
                      </div>
                    ) : (
                      reviews.map((rev, idx) => (
                        <div
                          key={rev.id || idx}
                          className="p-3.5 bg-[#FFFEFA] rounded-xl border border-[#FCE4EC] space-y-2.5 text-xs shadow-sm hover:border-[#F6B8C6] transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FCE4EC] pb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-[11px] font-bold text-[#947765]">
                                #{idx + 1}
                              </span>
                              <input
                                type="text"
                                value={rev.customer_name}
                                onChange={(e) => {
                                  const next = [...reviews];
                                  next[idx].customer_name = e.target.value;
                                  setReviews(next);
                                }}
                                placeholder="ชื่อลูกค้า"
                                className="font-semibold text-xs py-1 px-2 rounded border border-transparent hover:border-[#F6B8C6]/40 focus:border-[#F6B8C6] bg-transparent"
                              />
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                              {/* Star selector */}
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => {
                                      const next = [...reviews];
                                      next[idx].rating = s;
                                      setReviews(next);
                                    }}
                                    className="p-0.5 hover:scale-110 transition cursor-pointer"
                                    title={`ให้ ${s} ดาว`}
                                  >
                                    <Star
                                      className={`w-3.5 h-3.5 ${
                                        s <= (rev.rating || 5)
                                          ? 'text-amber-400 fill-amber-400'
                                          : 'text-stone-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>

                              <span className="text-[10px] text-[#947765]">
                                {rev.created_at ? formatThaiDate(rev.created_at) : 'เพิ่งเพิ่ม'}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleDeleteReview(idx, rev.customer_name)}
                                className="text-[#D06D80] p-1.5 hover:bg-[#FCE4EC] rounded cursor-pointer transition"
                                title="ลบรีวิว"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Review comment editor */}
                          <div>
                            <textarea
                              rows={2}
                              value={rev.comment}
                              onChange={(e) => {
                                const next = [...reviews];
                                next[idx].comment = e.target.value;
                                setReviews(next);
                              }}
                              placeholder="ข้อความรีวิว..."
                              className="w-full text-xs p-2 rounded-lg border border-[#FCE4EC] hover:border-[#F6B8C6]/50 focus:border-[#F6B8C6] bg-[#FFF8EC]/30 resize-none"
                            />
                          </div>
                        </div>
                      ))
                    )}
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

      {/* YouTube Music Preview Modal */}
      {testingYtId && (
        <div
          onClick={() => setTestingYtId(null)}
          className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFF8EC] border-2 border-[#F6B8C6] w-full max-w-md rounded-3xl p-5 shadow-2xl text-[#543E30] animate-in zoom-in-95 duration-200 relative"
          >
            <button
              onClick={() => setTestingYtId(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#543E30] hover:bg-[#F6B8C6] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎵</span>
              <h4 className="font-serif font-bold text-[#D06D80] text-base">
                ทดสอบฟังเพลงจาก YouTube
              </h4>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-video border border-[#F6B8C6]/60 shadow-md bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${testingYtId}?autoplay=1&enablejsapi=1`}
                title="YouTube music test"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            <p className="text-xs text-[#947765] mt-3 leading-relaxed">
              ✨ เพลงนี้เชื่อมต่อกับ YouTube เรียบร้อยแล้วค่ะ! เมื่อกดปุ่ม &quot;บันทึกเพลง&quot; ด้านล่าง เพลงนี้จะเล่นเป็นเสียงพื้นหลังบนหน้าเว็บหลักให้ลูกค้าฟังได้ทันทีค่ะ 🍎
            </p>
          </div>
        </div>
      )}

      {/* Customer Queue Update Messaging Modal */}
      {notifyQueueItem && (
        <div
          onClick={() => setNotifyQueueItem(null)}
          className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFF8EC] border-2 border-[#F6B8C6] w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-[#543E30] animate-in zoom-in-95 duration-200 relative max-h-[90vh] flex flex-col"
          >
            <button
              onClick={() => setNotifyQueueItem(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#543E30] hover:bg-[#F6B8C6] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💬</span>
              <div>
                <h4 className="font-serif font-bold text-[#D06D80] text-base">
                  ส่งข้อความแจ้งเตือนลูกค้า
                </h4>
                <p className="text-[11px] text-[#947765]">
                  คุณ {notifyQueueItem.customer_name} · คิว #{notifyQueueItem.queue_no} ({notifyQueueItem.order_no})
                </p>
              </div>
            </div>

            {/* Customer Contact Badge */}
            <div className="my-2 p-2.5 rounded-xl bg-[#FFFEFA] border border-[#F6B8C6]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#D06D80]">ช่องทางติดต่อ:</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFF8EC] text-[#543E30] font-semibold border border-[#F6B8C6]/30">
                  {notifyQueueItem.contact_channel || 'LINE'}: {notifyQueueItem.contact_value || notifyQueueItem.contact_info || '-'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCE4EC] text-[#D06D80]">
                สถานะ: {notifyQueueItem.status}
              </span>
            </div>

            {/* Message Textarea */}
            <div className="flex-1 min-h-[160px] space-y-1.5 mb-3">
              <label className="text-[11px] font-semibold text-[#543E30] block">
                ข้อความที่จะส่งให้ลูกค้า (แก้ไขเพิ่มเติมได้ตามต้องการ):
              </label>
              <textarea
                rows={7}
                value={customNotifyMessage}
                onChange={(e) => setCustomNotifyMessage(e.target.value)}
                className="w-full text-xs font-mono p-3 rounded-xl border border-[#F6B8C6] bg-[#FFFEFA] focus:outline-hidden focus:ring-1 focus:ring-[#D06D80] leading-relaxed resize-y"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#F6B8C6]/40">
              <div className="flex flex-wrap items-center gap-2">
                {/* 1-Click Launch button depending on channel */}
                {(() => {
                  const ch = (notifyQueueItem.contact_channel || '').toLowerCase();
                  if (ch.includes('line')) {
                    return (
                      <button
                        type="button"
                        onClick={() => handleOpenCustomerChat(notifyQueueItem, customNotifyMessage)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>เปิดแอป LINE ส่งข้อความทันที 🟢</span>
                      </button>
                    );
                  }
                  if (ch.includes('instagram') || ch.includes('ig')) {
                    return (
                      <button
                        type="button"
                        onClick={() => handleOpenCustomerChat(notifyQueueItem, customNotifyMessage)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#E1306C] to-[#F56040] hover:brightness-105 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>เปิด IG @{notifyQueueItem.contact_value?.replace(/^@/, '')} (พร้อมคัดลอก) 📸</span>
                      </button>
                    );
                  }
                  if (ch.includes('facebook') || ch.includes('fb')) {
                    return (
                      <button
                        type="button"
                        onClick={() => handleOpenCustomerChat(notifyQueueItem, customNotifyMessage)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>เปิด Facebook (พร้อมคัดลอก) 🔵</span>
                      </button>
                    );
                  }
                  if (ch.includes('phone') || ch.includes('เบอร์') || ch.includes('tel')) {
                    return (
                      <button
                        type="button"
                        onClick={() => handleOpenCustomerChat(notifyQueueItem, customNotifyMessage)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#D06D80] hover:bg-[#c25e71] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>ส่ง SMS หาเบอร์ลูกค้า 📱</span>
                      </button>
                    );
                  }
                  return (
                    <button
                      type="button"
                      onClick={() => handleOpenCustomerChat(notifyQueueItem, customNotifyMessage)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>ส่งข้อความผ่าน LINE 🟢</span>
                    </button>
                  );
                })()}

                {/* Copy Text Button */}
                <button
                  type="button"
                  onClick={() => handleCopyCustomerMessage(customNotifyMessage)}
                  className="py-2 px-3.5 rounded-xl border border-[#F6B8C6] bg-[#FFFEFA] hover:bg-[#FCE4EC] text-[#543E30] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  title="คัดลอกข้อความทั้งหมด"
                >
                  <Copy className="w-3.5 h-3.5 text-[#D06D80]" />
                  <span>คัดลอกข้อความ 📋</span>
                </button>
              </div>

              <p className="text-[10px] text-[#947765] text-center pt-1">
                * เมื่อกดปุ่มส่ง ระบบจะคัดลอกข้อความลง Clipboard อัตโนมัติและเปิดหน้าต่างแชทให้คุณวางส่งได้ทันทีค่ะ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* In-Web Custom Confirm Modal (replaces browser confirm dialog) */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
        icon={confirmDialog.icon}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
