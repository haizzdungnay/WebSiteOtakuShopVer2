'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Camera,
  X,
  CheckCircle,
  Send,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  isVerified: boolean;
  isPinned: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatar: string | null;
  };
}

interface ReviewSectionProps {
  productId: string;
  productName: string;
}

export default function ReviewSection({ productId, productName }: ReviewSectionProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
    if (user) {
      checkCanReview();
    }
  }, [productId, user, page, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const ratingParam = filterRating ? `&rating=${filterRating}` : '';
      const response = await fetch(
        `/api/reviews?productId=${productId}&page=${page}&limit=5${ratingParam}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    try {
      // Check if user has purchased and not yet reviewed
      const response = await fetch(`/api/reviews/can-review?productId=${productId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCanReview(data.canReview);
        setHasReviewed(data.hasReviewed);
      }
    } catch (err) {
      console.error('Failed to check review eligibility:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (reviewImages.length + files.length > 5) {
      setError('Tối đa 5 ảnh cho mỗi đánh giá');
      return;
    }

    setUploadingImage(true);
    setError(null);

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh tối đa 5MB');
        continue;
      }

      try {
        // Convert to base64 and store directly (simplified approach)
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setReviewImages(prev => [...prev, base64]);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Upload failed:', err);
        setError('Không thể upload ảnh. Vui lòng thử lại');
      }
    }

    setUploadingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vui lòng đăng nhập để đánh giá');
      return;
    }

    if (title.length < 5) {
      setError('Tiêu đề phải có ít nhất 5 ký tự');
      return;
    }

    if (comment.length < 10) {
      setError('Nội dung đánh giá phải có ít nhất 10 ký tự');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          rating,
          title,
          comment,
          images: reviewImages
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setRating(5);
        setTitle('');
        setComment('');
        setReviewImages([]);
        setShowReviewForm(false);
        setHasReviewed(true);
        setCanReview(false);
        
        // Refresh reviews
        fetchReviews();
      } else {
        setError(data.error || 'Không thể gửi đánh giá');
      }
    } catch (err) {
      console.error('Submit review failed:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (reviewId: string, isHelpful: boolean) => {
    if (!user) {
      setError('Vui lòng đăng nhập để vote');
      return;
    }

    try {
      await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isHelpful })
      });
      
      fetchReviews();
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (count: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const filled = interactive 
        ? starValue <= (hoverRating || rating)
        : starValue <= count;
      
      return (
        <Star
          key={i}
          size={interactive ? 28 : 16}
          className={`${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${
            interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''
          }`}
          onClick={() => interactive && setRating(starValue)}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      );
    });
  };

  // Calculate rating stats
  const ratingStats = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div id="reviews" className="bg-white rounded-lg shadow-sm p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>

      {/* Rating Overview */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-gray-500">
            {reviews.length} đánh giá
          </div>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratingStats[star] || 0;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            
            return (
              <button
                key={star}
                onClick={() => setFilterRating(filterRating === star ? null : star)}
                className={`flex items-center gap-2 w-full group ${
                  filterRating === star ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-sm w-12">{star} sao</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Write Review Button/Form */}
      {user && canReview && !hasReviewed && (
        <div className="mb-8">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full py-3 bg-accent-red text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Star size={20} />
              Viết đánh giá
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Đánh giá của bạn</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              {/* Rating Stars */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá sao
                </label>
                <div className="flex gap-1">
                  {renderStars(rating, true)}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tóm tắt đánh giá của bạn"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent"
                  maxLength={100}
                />
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung đánh giá
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent resize-none"
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {comment.length}/1000
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thêm ảnh (tối đa 5 ảnh)
                </label>
                <div className="flex flex-wrap gap-2">
                  {reviewImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20">
                      <Image
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {reviewImages.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-accent-red transition-colors"
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent-red"></div>
                      ) : (
                        <Camera size={24} className="text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-accent-red text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send size={18} />
                      Gửi đánh giá
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Login prompt */}
      {!user && (
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-600 mb-2">
            Đăng nhập và mua hàng để có thể đánh giá sản phẩm
          </p>
          <a href="/login" className="text-accent-red font-medium hover:underline">
            Đăng nhập ngay
          </a>
        </div>
      )}

      {/* Already reviewed message */}
      {user && hasReviewed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center gap-2 text-green-700">
          <CheckCircle size={20} />
          Bạn đã đánh giá sản phẩm này
        </div>
      )}

      {/* Not purchased message */}
      {user && !canReview && !hasReviewed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-center gap-2 text-yellow-700">
          <AlertCircle size={20} />
          Chỉ khách hàng đã mua và nhận hàng mới có thể đánh giá
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-red"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có đánh giá nào cho sản phẩm này
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className={`pb-6 border-b border-gray-200 last:border-0 ${
                review.isPinned ? 'bg-yellow-50 -mx-6 px-6 py-4 rounded-lg' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {review.user.avatar ? (
                      <Image
                        src={review.user.avatar}
                        alt={review.user.fullName}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                        {review.user.fullName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.user.fullName}
                      </span>
                      {review.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          <CheckCircle size={12} />
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Content */}
              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              )}
              {review.comment && (
                <p className="text-gray-700 mb-3">{review.comment}</p>
              )}

              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {review.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImagePreview(img)}
                      className="relative w-16 h-16 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote(review.id, true)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors"
                >
                  <ThumbsUp size={16} />
                  Hữu ích ({review.helpfulCount})
                </button>
                <button
                  onClick={() => handleVote(review.id, false)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <ThumbsDown size={16} />
                  ({review.unhelpfulCount})
                </button>
              </div>
            </div>
          ))}

          {/* Load More */}
          {totalPages > 1 && page < totalPages && (
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronDown size={18} />
              Xem thêm đánh giá
            </button>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImagePreview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImagePreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImagePreview}
              alt="Preview"
              width={800}
              height={600}
              className="object-contain max-h-[90vh] rounded-lg"
            />
            <button
              onClick={() => setSelectedImagePreview(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
