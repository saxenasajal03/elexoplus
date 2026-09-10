import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function OrderItems({ orderId }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(`https://b2b.elexoplus.in/api/order-items.php?order_id=${orderId}`)
      .then(res => res.json())
      .then(data => setItems(data.items || []));
  }, [orderId]);

  return (
    <div className="mt-4 border-t border-gray-800 pt-4">
      <h3 className="text-lg mb-3">Items</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.item_id} className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded">
            <div>
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">₹{item.price_at_purchase}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderTracker({ order }) {
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    if (order.tracking_id) {
      fetch(`https://b2b.elexoplus.in/api/track-order.php?awb=${order.tracking_id}`)
        .then(res => res.json())
        .then(data => setTracking(data));
    }
  }, [order.tracking_id]);

  if (order.status === "Cancelled") {
    return (
      <div className="mt-5 bg-red-900/10 border border-red-900/50 p-4 rounded-lg">
        <p className="text-red-400">🚫 This order was cancelled.</p>
      </div>
    );
  }

  const shipment = tracking?.ShipmentData?.[0]?.Shipment;
  const scans = [...(shipment?.Scans || [])].sort((a, b) => new Date(b.ScanDetail.ScanDateTime) - new Date(a.ScanDetail.ScanDateTime));

  return (
    <div className="mt-6 space-y-4">
      {shipment?.ExpectedDeliveryDate && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex justify-between">
          <div>
            <p className="text-xs text-yellow-500 font-bold uppercase">Expected Delivery</p>
            <p className="text-lg font-semibold">{new Date(shipment.ExpectedDeliveryDate).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Status</p>
            <p className="text-sm text-green-400 font-medium">{shipment?.Status?.Status || "In Transit"}</p>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {scans.map((s, idx) => (
          <div key={idx} className="border-l-2 border-yellow-500 pl-4 py-1">
            <p className="font-bold text-sm text-yellow-500">{s.ScanDetail.Instructions || s.ScanDetail.Status}</p>
            <p className="text-xs text-gray-400">{s.ScanDetail.ScannedLocation} — {new Date(s.ScanDetail.ScanDateTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`https://b2b.elexoplus.in/api/my_orders.php?email=${user.email}`)
        .then(res => res.json())
        .then(data => setOrders(data.orders || []));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-24">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(o => (
            <div key={o.order_id} className="bg-[#111] border border-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-bold">{o.display_id || o.order_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p>{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Advance Paid</p>
                  <p className="font-semibold text-green-400">₹{o.advance_paid}</p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === o.order_id ? null : o.order_id)}
                  className="text-yellow-400 text-sm font-semibold"
                >
                  {expandedId === o.order_id ? "Hide Details" : "View Details"}
                </button>
              </div>
              {expandedId === o.order_id && (
                <>
                  <OrderItems orderId={o.order_id} />
                  <OrderTracker order={o} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
