import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductDetailsTabs from '../components/SingleProductPage/ProductDetailsTabs';
import { ShieldCheck, Truck, ShoppingBag, Check, Star, ArrowLeft } from 'lucide-react';

export default function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState('');
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`https://project.interndesire.com/api/products.php?product_id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.product) {
          const p = d.product;
          const mainImg =
            p.images?.find((m) => m.is_main)?.image_url ||
            p.images?.[0]?.image_url ||
            '/assets/product-BICEL6TG.png';

          const basePrice = parseFloat(p.base_price || 0);
          const mrpPrice = p.mrp ? parseFloat(p.mrp) : Math.max(basePrice * 1.5, basePrice * 1.3);

          setProduct({
            ...p,
            price: basePrice,
            mrp: mrpPrice,
            images: p.images?.map((i) => i.image_url) || [mainImg],
          });
          setActiveImg(mainImg);
        }
      });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-amber-400 text-sm font-extrabold tracking-wider uppercase">Loading Product Specification...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItemToCart(product, variantIdx, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItemToCart(product, variantIdx, qty);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-36 px-4 md:px-12 pb-20 font-sans selection:bg-amber-400 selection:text-black">
      <div className="container mx-auto max-w-6xl">
        
        {/* Back Link */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-amber-400 transition mb-8 cursor-pointer"
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
                  className={`w-18 h-18 object-contain bg-zinc-900 rounded-2xl cursor-pointer border-2 transition-all p-2 ${
                    activeImg === img ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                />
              ))}
            </div>
            <div className="flex-1 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black rounded-3xl border border-zinc-800/80 flex items-center justify-center p-8 min-h-[420px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Verified Authentic
              </div>
              <img src={activeImg} alt={product.name} className="max-h-[380px] object-contain drop-shadow-2xl" />
            </div>
          </div>

          {/* Product Info & Actions */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20 inline-block mb-3">
                {product.category_name || 'Elexoplus Appliance'}
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-1 text-amber-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="text-xs text-zinc-400 font-semibold ml-2">(4.8 / 5.0 Verified Rating)</span>
              </div>
            </div>
            
            <div className="flex items-baseline gap-4 py-2 border-y border-zinc-800/80">
              <span className="text-3xl md:text-4xl font-black text-amber-400">
                ₹ {parseFloat(product.price).toLocaleString('en-IN')}
              </span>
              <span className="text-lg text-zinc-500 line-through font-bold">
                ₹ {parseFloat(product.mrp).toLocaleString('en-IN')}
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-500/20">
                Inclusive of all taxes
              </span>
            </div>

            {/* Variants Selector */}
            {product.variants?.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Variant / Capacity</label>
                <div className="flex gap-2.5 flex-wrap">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setVariantIdx(i)}
                      className={`px-5 py-2.5 rounded-xl border text-xs font-extrabold transition cursor-pointer ${
                        variantIdx === i
                          ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
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
                <div className="flex items-center border border-zinc-700 bg-zinc-900 rounded-full px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 font-bold text-zinc-300 hover:text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-extrabold text-white">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="px-3 font-bold text-zinc-300 hover:text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                    added ? 'bg-emerald-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                  }`}
                >
                  {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-4 rounded-full uppercase text-xs tracking-wider transition shadow-xl shadow-amber-400/20 cursor-pointer"
              >
                Buy Now — Fast Checkout
              </button>
            </div>

            {/* Trust Badges Footer */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-800/80 text-xs text-zinc-400 font-medium">
              <div className="flex items-center gap-2.5"><ShieldCheck size={20} className="text-emerald-400 shrink-0" /> 2-Year Full Warranty</div>
              <div className="flex items-center gap-2.5"><Truck size={20} className="text-indigo-400 shrink-0" /> Pan-India Secure Logistics</div>
            </div>

          </div>
        </div>

        {/* Product Tabs & Reviews Section */}
        <ProductDetailsTabs productData={product} />

      </div>
    </div>
  );
}