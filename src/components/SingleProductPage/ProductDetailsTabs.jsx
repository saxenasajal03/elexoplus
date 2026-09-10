import React, { useState, useEffect, useMemo } from 'react';
import { Star, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

function StarRatingSelector({ rating, setRating, hoverRating, setHoverRating, isInteractive = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => {
        const isFilled = (hoverRating || rating) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={!isInteractive}
            onClick={() => isInteractive && setRating(star)}
            onMouseEnter={() => isInteractive && setHoverRating && setHoverRating(star)}
            onMouseLeave={() => isInteractive && setHoverRating && setHoverRating(0)}
            className={`text-2xl transition-transform duration-150 ${
              isInteractive ? 'cursor-pointer hover:scale-125' : 'cursor-default'
            } ${isFilled ? 'text-amber-400' : 'text-zinc-800'}`}
            aria-label={`Select ${star} stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function ProductDetailsTabs({ productData }) {
  const [tab, setTab] = useState('details');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Review Form States
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productId = productData?.product_id;

  useEffect(() => {
    if (productId && tab === 'reviews') {
      setLoadingReviews(true);
      fetch(`https://project.interndesire.com/api/product_reviews.php?product_id=${productId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.reviews) {
            setReviews(d.reviews);
          } else {
            setReviews([]);
          }
        })
        .catch(() => setReviews([]))
        .finally(() => setLoadingReviews(false));
    }
  }, [productId, tab]);

  const { averageScore, ratingDistribution } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        averageScore: '5.0',
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const score = Math.max(1, Math.min(5, parseInt(r.rating || 5, 10)));
      counts[score] = (counts[score] || 0) + 1;
      sum += score;
    });

    const calculated = (sum / reviews.length).toFixed(1);
    const finalScore = parseFloat(calculated) > 0 ? calculated : '5.0';

    return {
      averageScore: finalScore,
      ratingDistribution: counts,
    };
  }, [reviews]);

  const submitReview = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!name.trim() || !comment.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter your name and comments.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("https://project.interndesire.com/api/product_reviews.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          reviewer_name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setReviews((prev) => [
          {
            reviewer_name: name.trim(),
            rating,
            comment: comment.trim(),
            review_id: Date.now(),
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setName('');
        setComment('');
        setRating(5);
        setStatusMsg({ type: 'success', text: 'Review submitted successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to submit review.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-16 p-6 sm:p-10 bg-zinc-950 text-white rounded-3xl border border-zinc-800/80 font-sans shadow-2xl">
      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-800 mb-8 gap-8">
        <button
          type="button"
          onClick={() => setTab('details')}
          className={`pb-4 font-extrabold text-base md:text-lg transition-all border-b-2 cursor-pointer ${
            tab === 'details'
              ? 'text-amber-400 border-amber-400'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          Product Overview & Specs
        </button>
        <button
          type="button"
          onClick={() => setTab('reviews')}
          className={`pb-4 font-extrabold text-base md:text-lg transition-all border-b-2 cursor-pointer ${
            tab === 'reviews'
              ? 'text-amber-400 border-amber-400'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          Ratings & Reviews ({reviews.length})
        </button>
      </div>

      {tab === 'details' ? (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h3 className="text-lg font-extrabold text-white mb-3 flex items-center gap-2">
              <MessageSquare size={18} className="text-amber-400" /> Detailed Description
            </h3>
            <p className="text-zinc-400 leading-relaxed text-sm font-medium">
              {productData?.description || "Engineered for excellence with high-grade components, robust thermal safety insulation, and energy-saving performance."}
            </p>
          </div>

          {productData?.specifications?.length > 0 && (
            <div>
              <h3 className="text-lg font-extrabold text-white mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productData.specifications.map((s, i) => (
                  <div key={i} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold">{s.spec_label}</p>
                    <p className="font-bold text-xs md:text-sm text-white mt-1">{s.spec_value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10 animate-fadeIn">
          {/* Top Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-2xl items-center">
            <div className="md:col-span-4 text-center md:border-r md:border-zinc-800 md:pr-8">
              <span className="text-5xl font-black text-amber-400">{averageScore}</span>
              <span className="text-xl text-zinc-500 font-bold"> / 5.0</span>
              <div className="flex justify-center my-2">
                <StarRatingSelector rating={Math.round(Number(averageScore))} />
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                {reviews.length === 0
                  ? "No reviews yet"
                  : `Based on ${reviews.length} customer review${reviews.length === 1 ? '' : 's'}`}
              </p>
            </div>

            {/* Distribution Bars */}
            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star] || 0;
                const pct = reviews.length ? Math.round((count / reviews.length) * 100) : star === 5 ? 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs text-zinc-400 font-semibold">
                    <span className="w-12 text-right">{star} Star</span>
                    <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-left">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form & Reviews List */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Review Form */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4">
              <h4 className="text-base font-black text-white">Write a Review</h4>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Your Rating
                  </label>
                  <StarRatingSelector
                    rating={rating}
                    setRating={setRating}
                    hoverRating={hoverRating}
                    setHoverRating={setHoverRating}
                    isInteractive={true}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 p-3.5 rounded-xl text-white text-xs focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1">
                    Review Message
                  </label>
                  <textarea
                    placeholder="Share your experience regarding performance and durability..."
                    required
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 p-3.5 rounded-xl text-white text-xs focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-400 text-black font-extrabold py-3.5 rounded-xl hover:bg-amber-500 transition text-xs uppercase tracking-wider disabled:opacity-50 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>

                {statusMsg.text && (
                  <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                    statusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {statusMsg.text}
                  </div>
                )}
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              <h4 className="text-base font-black text-white">Customer Reviews</h4>
              {loadingReviews ? (
                <p className="text-zinc-500 text-xs font-medium">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl text-center text-zinc-500">
                  <p className="font-bold text-xs text-zinc-300">No reviews written yet.</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Be the first to rate and review this product!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 scrollbar-hide">
                  {reviews.map((r, i) => (
                    <div key={r.review_id || i} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-xs text-white">{r.reviewer_name}</span>
                        <StarRatingSelector rating={parseInt(r.rating || 5, 10)} />
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium">{r.comment}</p>
                      {r.created_at && (
                        <p className="text-[10px] text-zinc-500 pt-1">{new Date(r.created_at).toLocaleDateString('en-IN')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}