import React, { useState, useEffect, useMemo } from 'react';

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
            } ${isFilled ? 'text-yellow' : 'text-gray-700'}`}
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

  // Default to 5.0 when reviews list is empty or sum is 0
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
    <div className="max-w-6xl mx-auto my-14 p-6 sm:p-10 bg-lightGray text-white rounded-2xl border border-gray-800 font-['Nunito',sans-serif]">
      {/* Tab Switcher */}
      <div className="flex border-b border-gray-700 mb-8">
        <button
          type="button"
          onClick={() => setTab('details')}
          className={`pb-3 px-6 font-bold text-lg transition-all border-b-2 ${
            tab === 'details'
              ? 'text-yellow border-yellow'
              : 'text-gray-400 border-transparent hover:text-gray-200'
          }`}
        >
          Product Overview
        </button>
        <button
          type="button"
          onClick={() => setTab('reviews')}
          className={`pb-3 px-6 font-bold text-lg transition-all border-b-2 ${
            tab === 'reviews'
              ? 'text-yellow border-yellow'
              : 'text-gray-400 border-transparent hover:text-gray-200'
          }`}
        >
          Rating & Reviews ({reviews.length})
        </button>
      </div>

      {tab === 'details' ? (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Overview</h3>
            <p className="text-gray-300 leading-relaxed text-base">
              {productData?.description || "No overview provided."}
            </p>
          </div>

          {productData?.specifications?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productData.specifications.map((s, i) => (
                  <div key={i} className="bg-black/40 border border-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{s.spec_label}</p>
                    <p className="font-bold text-sm text-white mt-1">{s.spec_value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10 animate-fadeIn">
          {/* Top Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-black/40 border border-gray-800 p-6 md:p-8 rounded-2xl items-center">
            <div className="md:col-span-4 text-center md:border-r md:border-gray-800 md:pr-8">
              <span className="text-5xl font-extrabold text-yellow">{averageScore}</span>
              <span className="text-xl text-gray-500 font-bold"> / 5.0</span>
              <div className="flex justify-center my-2">
                <StarRatingSelector rating={Math.round(Number(averageScore))} />
              </div>
              <p className="text-xs text-gray-400">
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
                  <div key={star} className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="w-12 text-right">{star} Star</span>
                    <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-yellow h-full rounded-full transition-all duration-300"
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
            <div className="bg-black/30 border border-gray-800 p-6 rounded-2xl">
              <h4 className="text-lg font-bold text-white mb-4">Write a Review</h4>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
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
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111] border border-gray-700 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-yellow transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Review Message
                  </label>
                  <textarea
                    placeholder="Share your experience regarding performance and durability..."
                    required
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#111] border border-gray-700 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-yellow transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition text-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>

                {statusMsg.text && (
                  <p className={`text-xs text-center font-medium ${statusMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {statusMsg.text}
                  </p>
                )}
              </form>
            </div>

            {/* Reviews List */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Customer Reviews</h4>
              {loadingReviews ? (
                <p className="text-gray-400 text-sm">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="bg-black/30 border border-gray-800 p-8 rounded-2xl text-center text-gray-400">
                  <p className="font-semibold text-sm text-white"></p>
                  <p className="text-xs text-gray-500 mt-1">Be the first to rate and review this product!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 scrollbar-hide">
                  {reviews.map((r, i) => (
                    <div key={r.review_id || i} className="p-4 bg-black/40 border border-gray-800 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-white">{r.reviewer_name}</span>
                        <StarRatingSelector rating={parseInt(r.rating || 5, 10)} />
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{r.comment}</p>
                      {r.created_at && (
                        <p className="text-[10px] text-gray-500">{new Date(r.created_at).toLocaleDateString('en-IN')}</p>
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