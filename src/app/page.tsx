'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AmbientCanvas from '@/components/AmbientCanvas';
import MusicPlayer from '@/components/MusicPlayer';
import Hero from '@/components/Hero';
import ProductCatalog from '@/components/ProductCatalog';
import CartBar from '@/components/CartBar';
import MobileBottomNav from '@/components/MobileBottomNav';

import CartModal from '@/components/modals/CartModal';
import CustomerInfoModal from '@/components/modals/CustomerInfoModal';
import PaymentModal from '@/components/modals/PaymentModal';
import SlipUploadModal from '@/components/modals/SlipUploadModal';
import OrderDoneModal from '@/components/modals/OrderDoneModal';
import QueueModal from '@/components/modals/QueueModal';
import ContactModal from '@/components/modals/ContactModal';
import ReviewsModal from '@/components/modals/ReviewsModal';
import ConfirmModal from '@/components/modals/ConfirmModal';
import AdminDashboard from '@/components/admin/AdminDashboard';

import { Category, PackageItem, StoreSettings, MusicTrack, Review, Order, OrderType } from '@/types';

export default function HomePage() {
  // Store Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Cart State (id -> quantity)
  const [selectedItemIds, setSelectedItemIds] = useState<Record<string, number>>(() => {
    const empty: Record<string, number> = {};
    if (typeof window === 'undefined') return empty;
    const p = new URLSearchParams(window.location.search).get('preview');
    if (p === 'cart') return { 'pkg-2': 1, 'pkg-8': 1 };
    if (p === 'checkout_fortune') return { 'pkg-2': 1 };
    if (p === 'checkout_express') return { 'pkg-3': 1 };
    if (p === 'checkout_physical') return { 'pkg-8': 1 };
    return empty;
  });

  // Checkout Flow Modal States
  const [isCartOpen, setIsCartOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'cart';
  });
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const p = new URLSearchParams(window.location.search).get('preview');
    return p === 'checkout_fortune' || p === 'checkout_physical' || p === 'checkout_express';
  });
  const [isPaymentOpen, setIsPaymentOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const p = new URLSearchParams(window.location.search).get('preview');
    return p === 'payment' || p === 'payment_express' || p === 'payment_kbank' || p === 'payment_truemoney';
  });
  const [isSlipOpen, setIsSlipOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'slip';
  });
  const [isDoneOpen, setIsDoneOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'done';
  });

  // Current active order in checkout
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search).get('preview');
    if (
      p === 'payment' ||
      p === 'payment_express' ||
      p === 'payment_kbank' ||
      p === 'payment_truemoney' ||
      p === 'done' ||
      p === 'slip'
    ) {
      const mockOrder: Order = {
        id: 'ord-mock-showcase-01',
        order_no: 'APL-261025-APP777',
        tracking_token: 'trk_7d8e9f1a2b3c4d5e',
        order_type: 'fortune',
        customer_name: 'คุณณิชาภัทร สวนแอปเปิ้ล',
        contact_channel: 'line',
        contact_value: '@nichapat_tarot',
        items: [
          {
            id: p === 'payment_express' ? 'pkg-3' : 'pkg-2',
            name: p === 'payment_express' ? 'ลัดคิวแบบเจาะจง (ด่วนพิเศษ ⚡)' : 'คำถามเจาะจง (เปิดไพ่เจาะลึก)',
            price: p === 'payment_express' ? 32 : 25,
            quantity: 1,
            product_type: 'fortune',
          },
        ],
        total_amount: p === 'payment_express' ? 32 : 25,
        is_express: p === 'payment_express',
        express_fee: p === 'payment_express' ? 0 : undefined,
        status: p === 'done' ? 'pending_verification' : 'pending_slip',
        created_at: '2026-10-25T14:30:00.000Z',
        updated_at: '2026-10-25T14:30:00.000Z',
      };
      return mockOrder;
    }
    return null;
  });
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Navigation Modals
  const [isQueueOpen, setIsQueueOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'queue';
  });
  const [isReviewsOpen, setIsReviewsOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'reviews';
  });
  const [isContactOpen, setIsContactOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'contact';
  });
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('preview') === 'admin';
  });

  // In-web alert modal for general errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch store data callback (e.g. after backoffice updates)
  const fetchStoreData = useCallback(async () => {
    try {
      const res = await fetch('/api/store');
      const json = await res.json();
      if (json.success && json.data) {
        setCategories(json.data.categories || []);
        setSettings(json.data.settings || null);
        setMusicTracks(json.data.music_tracks || []);
        setReviews(json.data.reviews || []);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch store data', err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch('/api/store');
        const json = await res.json();
        if (!ignore && json.success && json.data) {
          setCategories(json.data.categories || []);
          setSettings(json.data.settings || null);
          setMusicTracks(json.data.music_tracks || []);
          setReviews(json.data.reviews || []);
        }
      } catch (err: unknown) {
        console.error('Failed to load store data:', err);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Cart helper functions
  const handleToggleItem = (pkg: PackageItem) => {
    setSelectedItemIds((prev) => {
      const next = { ...prev };
      if (next[pkg.id]) {
        delete next[pkg.id];
      } else {
        next[pkg.id] = 1;
      }
      return next;
    });
  };

  const handleUpdateQuantity = (pkgId: string, delta: number) => {
    setSelectedItemIds((prev) => {
      const current = prev[pkgId] || 0;
      const nextVal = current + delta;
      const next = { ...prev };
      if (nextVal <= 0) {
        delete next[pkgId];
      } else {
        next[pkgId] = nextVal;
      }
      return next;
    });
  };

  const handleRemoveItem = (pkgId: string) => {
    setSelectedItemIds((prev) => {
      const next = { ...prev };
      delete next[pkgId];
      return next;
    });
  };

  // Compile cart items array
  const allPackages = categories.flatMap((c) => c.packages);
  const cartItems = Object.entries(selectedItemIds)
    .map(([id, qty]) => {
      const pkg = allPackages.find((p) => p.id === id);
      return pkg ? { pkg, quantity: qty } : null;
    })
    .filter(Boolean) as { pkg: PackageItem; quantity: number }[];

  const totalCount = Object.values(selectedItemIds).reduce((a, b) => a + b, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.pkg.price * item.quantity, 0);

  // Proceed from Info to Payment (Create Order in DB)
  const handleProceedToPayment = async (customerData: {
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
  }) => {
    setIsCreatingOrder(true);
    try {
      const orderPayload = {
        ...customerData,
        items: cartItems.map((it) => ({
          id: it.pkg.id,
          quantity: it.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'สร้างออเดอร์ไม่สำเร็จ');
      }

      setActiveOrder(data.order);
      setIsCustomerInfoOpen(false);
      setIsPaymentOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างออเดอร์';
      setErrorMessage(msg);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <main className="page-container">
      {/* Ambient Drifting Leaves & Apple Blossoms */}
      <AmbientCanvas />

      {/* Floating Music Player */}
      <MusicPlayer tracks={musicTracks} />

      {/* Hero Header */}
      {settings && (
        <Hero
          settings={settings}
          onOpenQueue={() => setIsQueueOpen(true)}
          onOpenReviews={() => setIsReviewsOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* Product Catalog */}
      <ProductCatalog
        categories={categories}
        selectedItemIds={selectedItemIds}
        onToggleItem={handleToggleItem}
      />

      {/* Sticky Bottom Cart Bar */}
      <CartBar
        totalCount={totalCount}
        totalAmount={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Step 1: Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onNext={() => {
          setIsCartOpen(false);
          setIsCustomerInfoOpen(true);
        }}
      />

      {/* Step 2: Customer Info Modal */}
      <CustomerInfoModal
        isOpen={isCustomerInfoOpen}
        onClose={() => setIsCustomerInfoOpen(false)}
        onBack={() => {
          setIsCustomerInfoOpen(false);
          setIsCartOpen(true);
        }}
        cartItems={cartItems}
        settings={settings}
        onProceedToPayment={handleProceedToPayment}
        isLoading={isCreatingOrder}
      />

      {/* Step 3: Payment Details Modal */}
      {settings && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onBack={() => {
            setIsPaymentOpen(false);
            setIsCustomerInfoOpen(true);
          }}
          onProceedToSlip={() => {
            setIsPaymentOpen(false);
            setIsSlipOpen(true);
          }}
          order={activeOrder}
          settings={settings}
        />
      )}

      {/* Step 4: Slip Upload Modal */}
      <SlipUploadModal
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        onBack={() => {
          setIsSlipOpen(false);
          setIsPaymentOpen(true);
        }}
        order={activeOrder}
        onUploadSuccess={(updatedOrder) => {
          setActiveOrder(updatedOrder);
          setSelectedItemIds({}); // Clear cart on success
          setIsSlipOpen(false);
          setIsDoneOpen(true);
        }}
      />

      {/* Step 5: Order Confirmation / Bill Modal */}
      {settings && (
        <OrderDoneModal
          isOpen={isDoneOpen}
          onClose={() => setIsDoneOpen(false)}
          order={activeOrder}
          settings={settings}
          onOpenQueue={() => {
            setIsDoneOpen(false);
            setIsQueueOpen(true);
          }}
        />
      )}

      {/* Queue Modal */}
      <QueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        initialOrderNo={activeOrder?.order_no || ''}
      />

      {/* Contact Channels Modal */}
      {settings && (
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          settings={settings}
        />
      )}

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        reviews={reviews}
        onReviewAdded={(newRev) => setReviews((prev) => [newRev, ...prev])}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataUpdated={fetchStoreData}
      />

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-[#947765] pb-12 sm:pb-6">
        <p>© 2026 {settings?.shop_name || 'Auralune'} · All rights reserved.</p>
        <p className="mt-1 text-[11px] text-[#A8B99A]">
          Cottagecore Handcrafted with Love 🍎🌷
        </p>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        cartCount={totalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenReviews={() => setIsReviewsOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* In-Web Alert / Error Modal */}
      <ConfirmModal
        isOpen={Boolean(errorMessage)}
        title="แจ้งเตือน"
        message={errorMessage || ''}
        confirmText="ตกลง"
        cancelText="ปิด"
        variant="warning"
        onConfirm={() => setErrorMessage(null)}
        onClose={() => setErrorMessage(null)}
      />
    </main>
  );
}
