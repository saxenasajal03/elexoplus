/**
 * pricing.js
 * ---------------------------------------------------------------------------
 * Single source of truth for how ElexoPlus displays Selling Price vs MRP
 * (Req: "sales price & mrp difference as in Amazon").
 *
 * IMPORTANT — honesty rule: we only show a strikethrough MRP / "X% off" badge
 * when the backend actually supplies a real `mrp` that is genuinely higher
 * than the selling price. We never invent a fake "original price" just to
 * manufacture a discount — that would mislead customers. Once the Admin
 * Panel lets staff set a real MRP per product (see products.mrp column in
 * the SQL migration), this will light up automatically with zero frontend
 * changes.
 */
export function getPricing(product) {
  const price = parseFloat(product?.base_price ?? product?.price ?? 0) || 0;
  const rawMrp = product?.mrp;
  const mrp = rawMrp !== undefined && rawMrp !== null && rawMrp !== '' ? parseFloat(rawMrp) : null;

  const hasDiscount = mrp !== null && !Number.isNaN(mrp) && mrp > price;
  const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const savings = hasDiscount ? mrp - price : 0;

  return { price, mrp: hasDiscount ? mrp : null, hasDiscount, discountPercent, savings };
}

export function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export function isInStock(product) {
  // Defaults to in-stock if the field isn't present, matching current API behavior.
  return (product?.stock_status || 'In Stock') !== 'Out of Stock';
}

/**
 * Computes cart-wide totals used by both CartPage and Checkout, including
 * the Amazon-style "you saved ₹X" line when items carry a real MRP.
 */
export function getCartTotals(cartItems) {
  return cartItems.reduce(
    (acc, item) => {
      const qty = item.quantity || 0;
      const price = parseFloat(item.price) || 0;
      const mrp = item.mrp && parseFloat(item.mrp) > price ? parseFloat(item.mrp) : price;
      acc.itemCount += qty;
      acc.subtotal += price * qty;
      acc.mrpTotal += mrp * qty;
      return acc;
    },
    { itemCount: 0, subtotal: 0, mrpTotal: 0 }
  );
}
