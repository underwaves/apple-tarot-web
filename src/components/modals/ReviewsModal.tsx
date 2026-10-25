'use client';

import React, { useState } from 'react';
import { Review } from '@/types';
import { formatThaiDate } from '@/lib/utils';
import { X, Star, MessageSquarePlus, Send, Loader2 } from 'lucide-react';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onReviewAdded: (newReview: Review) => void;
}

export default function ReviewsModal({
  isOpen,
  onClose,
  reviews,
  onReviewAdded,
}: ReviewsModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setErrorMsg('กรุณากรอกชื่อและความคิดเห็นค่ะ');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'ส่งรีวิวไม่สำเร็จ');
      }

      onReviewAdded(data.review);
      setName('');
      setComment('');
      setShowAddForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งรีวิว';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8EC] border-t-2 sm:border-2 border-[#F6B8C6] w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] text-[#543E30] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-[#F6B8C6]/60 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F6B8C6]/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐️</span>
            <h3 className="font-serif text-2xl font-bold text-[#D06D80]">
              รีวิวจากลูกค้า
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#947765] hover:text-[#543E30] hover:bg-[#F6B8C6]/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Write Review Button */}
        <div className="pt-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="secondary-btn w-full py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#D06D80]" />
            <span>{showAddForm ? 'ปิดแบบฟอร์ม' : 'เขียนรีวิวให้สวนแอปเปิ้ล'}</span>
          </button>
        </div>

        {/* Add Review Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-3 p-3.5 bg-[#FFFEFA] border border-[#F6B8C6] rounded-xl space-y-3 shadow-sm"
          >
            {errorMsg && (
              <div className="text-xs text-[#D06D80] font-medium">{errorMsg}</div>
            )}

            <div>
              <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                ชื่อของคุณ *
              </label>
              <input
                type="text"
                placeholder="เช่น คุณกิ๊ก หรือ AppleFan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="py-1.5 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                ให้คะแนนความประทับใจ
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-lg transition"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'text-[#F5A623] fill-[#F5A623]'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#543E30] font-medium block mb-1">
                ข้อความรีวิว *
              </label>
              <textarea
                rows={2}
                placeholder="เล่าความประทับใจเกี่ยวกับสินค้าหรือบริการ..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="py-1.5 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cta-btn w-full py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#543E30] cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งรีวิว</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {reviews.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#947765]">
              ยังไม่มีรีวิวค่ะ มาเป็นคนแรกที่เขียนรีวิวให้สวนแอปเปิ้ลนะคะ 🍎
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3 bg-[#FFFEFA] border border-[#FCE4EC] rounded-xl space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#D06D80]">
                    {rev.customer_name}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'text-[#F5A623] fill-[#F5A623]'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#543E30] leading-relaxed">
                  {rev.comment}
                </p>

                <span className="text-[10px] text-[#947765] block pt-0.5">
                  {formatThaiDate(rev.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
