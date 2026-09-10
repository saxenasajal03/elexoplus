import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductDetailsTabs from '../components/SingleProductPage/ProductDetailsTabs';

export default function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState('');
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-['Nunito',sans-serif]">
        <p className="text-yellow text-lg font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-12 pb-20 font-['Nunito',sans-serif]">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 max-w-6xl">
        {/* Product Images */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 overflow-x-auto scrollbar-hide">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setActiveImg(img)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition ${
                  activeImg === img ? 'border-yellow' : 'border-transparent hover:border-gray-600'
                }`}
              />
            ))}
          </div>
          <div className="flex-1 bg-gray-900 rounded-lg flex items-center justify-center p-4 min-h-[350px]">
            <img src={activeImg} alt={product.name} className="max-h-96 object-contain" />
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-400 mb-4">{product.category_name}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-yellow">
              ₹ {parseFloat(product.price).toLocaleString('en-IN')}
            </span>
            <span className="text-xl text-gray-500 line-through">
              ₹ {parseFloat(product.mrp).toLocaleString('en-IN')}
            </span>
          </div>

          {product.variants?.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2 font-semibold">Variant</label>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setVariantIdx(i)}
                    className={`px-4 py-1.5 rounded border text-sm font-semibold transition ${
                      variantIdx === i
                        ? 'bg-yellow text-black border-yellow'
                        : 'border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {v.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-700 rounded-full">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1 text-lg text-gray-300 hover:text-white"
              >
                -
              </button>
              <span className="px-3 text-sm font-bold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1 text-lg text-gray-300 hover:text-white"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                addItemToCart(product, variantIdx, qty);
                navigate('/cart');
              }}
              className="bg-yellow text-black font-bold px-8 py-2.5 rounded-full hover:bg-yellow-400 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <ProductDetailsTabs productData={product} />
    </div>
  );
}