import React, { useState } from 'react';

export default function WarrantyRegistration() {
  const [form, setForm] = useState({ serial_no: '', customer_name: '', customer_phone: '', customer_email: '' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://project.interndesire.com/api/product_warranty.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const d = await res.json();
      setMsg(d.message || "Submitted successfully");
    } catch {
      setMsg("Error submitting registration");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 flex justify-center">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold text-yellow mb-4">Warranty Registration</h1>
        <form onSubmit={submit} className="space-y-4">
          <input type="text" placeholder="Serial No" required className="w-full bg-gray-800 p-2 rounded text-white" onChange={e => setForm({...form, serial_no: e.target.value.toUpperCase()})} />
          <input type="text" placeholder="Full Name" required className="w-full bg-gray-800 p-2 rounded text-white" onChange={e => setForm({...form, customer_name: e.target.value})} />
          <input type="tel" placeholder="Phone" required className="w-full bg-gray-800 p-2 rounded text-white" onChange={e => setForm({...form, customer_phone: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full bg-gray-800 p-2 rounded text-white" onChange={e => setForm({...form, customer_email: e.target.value})} />
          <button type="submit" className="w-full bg-yellow text-black font-bold py-2 rounded">Submit</button>
        </form>
        {msg && <p className="text-green-400 mt-4 text-center text-sm">{msg}</p>}
      </div>
    </div>
  );
}
