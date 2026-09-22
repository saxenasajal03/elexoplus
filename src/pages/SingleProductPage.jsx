import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductDetailsTabs from '../components/SingleProductPage/ProductDetailsTabs';
import { ShieldCheck, Truck, ShoppingBag, Check, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { getPricing, formatINR, isInStock } from '../utils/pricing';
import { ENDPOINTS } from '../data/siteContent';

export default function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState('');
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`${ENDPOINTS.products}?product_id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.product) {
          const p = d.product;
          const mainImg =
            p.images?.find((m) => m.is_main)?.image_url ||
            p.images?.[0]?.image_url ||
            '/assets/product-BICEL6TG.png';

          setProduct({
            ...p,
            images: p.images?.map((i) => i.image_url) || [mainImg],
          });
          setActiveImg(mainImg);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center font-sans px-6 text-center">
        <div>
          <p className="text-lg font-extrabold text-zinc-900 mb-2">Product Not Found</p>
          <p className="text-sm text-zinc-500 mb-6">This product may have been removed or is temporarily unavailable.</p>
          <button onClick={() => navigate('/store')} className="bg-amber-400 text-black px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer">
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="text-amber-600 animate-spin" />
          <p className="text-amber-600 text-sm font-extrabold tracking-wider uppercase">Loading Product Specification...</p>
        </div>
      </div>
    );
  }

  const { price, mrp, hasDiscount, discountPercent, savings } = getPricing(product);
  const inStock = isInStock(product);

  const handleAddToCart = () => {
    if (!inStock) return;
    addItemToCart(product, variantIdx, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addItemToCart(product, variantIdx, qty);
    navigate('/cart');
  };


  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-28 md:pt-36 px-4 md:px-12 pb-20 font-sans selection:bg-amber-400 selection:text-black">
      <div className="container mx-auto max-w-6xl">
        
        {/* Back Link */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-amber-600 transition mb-8 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Product Images Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto scrollbar-hide py-1">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setActiveImg(img)}
                  className={`w-18 h-18 object-contain bg-zinc-100 rounded-2xl cursor-pointer border-2 transition-all p-2 ${
                    activeImg === img ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-zinc-200 hover:border-zinc-600'
                  }`}
                />
              ))}
            </div>
            <div className="flex-1 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 rounded-3xl border border-zinc-200/80 flex items-center justify-center p-8 min-h-[420px] shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-400/10 text-amber-600 border border-amber-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Verified Authentic
              </div>
              <img src={activeImg} alt={product.name} className="max-h-[380px] object-contain drop-shadow-2xl" />
            </div>
          </div>

          {/* Product Info & Actions */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20 inline-block mb-3">
                {product.category_name || 'ElexoPlus Appliance'}
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-zinc-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-1 text-amber-600 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="text-xs text-zinc-500 font-semibold ml-2">(4.8 / 5.0 Verified Rating)</span>
              </div>
            </div>
            
            <div className="py-2 border-y border-zinc-200/80 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                {hasDiscount && (
                  <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-md">
                    {discountPercent}% OFF
                  </span>
                )}
                <span className="text-3xl md:text-4xl font-black text-amber-600">
                  {formatINR(price)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-zinc-500 line-through font-bold">
                    M.R.P.: {formatINR(mrp)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-emerald-500/10 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Inclusive of all taxes
                </span>
                {hasDiscount && (
                  <span className="text-xs font-bold text-emerald-600">You save {formatINR(savings)}</span>
                )}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${inStock ? 'text-emerald-600 border-emerald-500/20 bg-emerald-500/10' : 'text-rose-600 border-rose-500/20 bg-rose-500/10'}`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants?.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Select Variant / Capacity</label>
                <div className="flex gap-2.5 flex-wrap">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setVariantIdx(i)}
                      className={`px-5 py-2.5 rounded-xl border text-xs font-extrabold transition cursor-pointer ${
                        variantIdx === i
                          ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20'
                          : 'border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-600'
                      }`}
                    >
                      {v.variant_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-300 bg-zinc-100 rounded-full px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-extrabold text-zinc-900">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="px-3 font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
                    !inStock
                      ? 'bg-zinc-100 text-zinc-600 border border-zinc-200 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-600 text-white cursor-pointer'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 cursor-pointer'
                  }`}
                >
                  {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock}
                className={`w-full font-extrabold py-4 rounded-full uppercase text-xs tracking-wider transition shadow-xl ${
                  !inStock
                    ? 'bg-zinc-100 text-zinc-600 border border-zinc-200 cursor-not-allowed'
                    : 'bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20 cursor-pointer'
                }`}
              >
                {inStock ? 'Buy Now — Fast Checkout' : 'Currently Unavailable'}
              </button>
            </div>

            {/* Trust Badges Footer */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-200/80 text-xs text-zinc-500 font-medium">
              <div className="flex items-center gap-2.5"><ShieldCheck size={20} className="text-emerald-600 shrink-0" /> 2-Year Full Warranty</div>
              <div className="flex items-center gap-2.5"><Truck size={20} className="text-indigo-600 shrink-0" /> Pan-India Secure Logistics</div>
            </div>

          </div>
        </div>

        {/* Product Tabs & Reviews Section */}
        <ProductDetailsTabs productData={product} />

      </div>
    </div>
  );
}