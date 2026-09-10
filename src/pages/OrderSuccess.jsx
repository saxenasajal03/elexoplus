import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('id');
  const [orderData, setOrderData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetch(`https://b2b.elexoplus.in/api/get-order-receipt.php?id=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.order) {
          setOrderData(data.order);
          setItems(data.items || []);
        }
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading receipt...</div>;
  if (!orderData) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Receipt not found.</div>;

  const advancePaid = parseFloat(orderData.advance_paid || 0).toFixed(2);
  const codDue = parseFloat(orderData.cod_due || 0).toFixed(2);
  const totalAmount = parseFloat(orderData.full_amount || (orderData.total_amount_paisa ? orderData.total_amount_paisa / 100 : 0)).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl print:bg-white print:text-black">
        <div className="mb-6 border-b border-gray-600 pb-3 flex justify-between items-start">
          <img src="/assets/logo-BJqIBdaq.png" alt="ElexoPlus" className="w-32" />
          <div className="text-right text-sm text-gray-400 print:text-black">
            <h2 className="text-xl font-bold">TAX INVOICE</h2>
            <p className="text-xs">Order #{orderData.display_order_no || orderId}</p>
          </div>
        </div>

        <div className="my-6">
          <table className="w-full text-left text-sm border border-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-2 border border-gray-700">Product</th>
                <th className="p-2 text-center border border-gray-700">Qty</th>
                <th className="p-2 text-right border border-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-t border-gray-700">
                  <td className="p-2 border border-gray-700">{item.product_name}</td>
                  <td className="p-2 text-center border border-gray-700">{item.quantity}</td>
                  <td className="p-2 text-right border border-gray-700">₹{item.price_at_purchase * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-700 rounded-lg text-sm space-y-1">
          <div className="flex justify-between"><span>Advance Paid:</span><span className="text-green-400 font-bold">₹{orderData.advance_paid}</span></div>
          <div className="flex justify-between"><span>COD Due:</span><span className="text-yellow font-bold">₹{orderData.cod_due}</span></div>
        </div>

        <div className="flex justify-between mt-6 no-print">
          <Link to="/" className="bg-yellow text-black font-bold px-6 py-2 rounded">Home</Link>
          <button onClick={() => window.print()} className="border border-gray-600 px-6 py-2 rounded">Print</button>
        </div>
      </div>
    </div>
  );
}
