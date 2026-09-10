import React, { useState } from 'react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://project.interndesire.com/api/subscribe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMsg(data.message || "Subscribed!");
      setEmail('');
    } catch {
      setMsg("Subscription failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-20 p-8 border border-yellow rounded-xl flex flex-col md:flex-row gap-6 items-center">
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-yellow">Stay Updated!</h2>
        <p className="text-gray-400 text-sm mt-1">Subscribe for new releases and exclusive offers.</p>
      </div>
      <form onSubmit={submit} className="flex-1 w-full flex flex-col gap-2">
        <input
          type="email"
          required
          placeholder="your.email@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-3 bg-gray-900 border border-gray-700 rounded text-white"
        />
        <button type="submit" className="bg-yellow text-black font-bold py-3 rounded">Subscribe</button>
        {msg && <p className="text-xs text-yellow text-center">{msg}</p>}
      </form>
    </div>
  );
}
