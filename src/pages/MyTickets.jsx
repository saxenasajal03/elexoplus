import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Ticket, Loader2, AlertCircle, Send, RotateCw, ChevronLeft,
  Paperclip, ChevronDown,
} from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { useAuth } from '../context/AuthContext';
import { ENDPOINTS } from '../data/siteContent';

const STATUS_STYLE = {
  Open: 'bg-blue-50 text-blue-600 border-blue-200',
  Assigned: 'bg-amber-50 text-amber-600 border-amber-200',
  'In Progress': 'bg-amber-50 text-amber-600 border-amber-200',
  'Pending Customer': 'bg-orange-50 text-orange-600 border-orange-200',
  'Pending Internal Team': 'bg-zinc-100 text-zinc-600 border-zinc-200',
  Resolved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Closed: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  Reopened: 'bg-rose-50 text-rose-600 border-rose-200',
};

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLE[status] || 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
      {status}
    </span>
  );
}

function TicketDetail({ code, verify, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [reopening, setReopening] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    fetch(`${ENDPOINTS.tickets}?ticket_code=${encodeURIComponent(code)}&verify=${encodeURIComponent(verify)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) { setTicket(d.ticket); setMessages(d.messages || []); }
        else setError(d.message || 'We could not find this ticket.');
      })
      .catch(() => setError('We could not reach our support service right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [code, verify]);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(ENDPOINTS.ticketReply, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_code: code, verify, message: reply.trim() }),
      });
      const data = await res.json();
      if (data.success) { setReply(''); load(); }
      else setError(data.message || 'Could not send your message.');
    } catch {
      setError('Could not reach our support service right now.');
    } finally {
      setSending(false);
    }
  };

  const reopen = async () => {
    setReopening(true);
    try {
      const res = await fetch(ENDPOINTS.ticketReply, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_code: code, verify, action: 'reopen' }),
      });
      const data = await res.json();
      if (data.success) load();
      else setError(data.message || 'Could not reopen this ticket.');
    } catch {
      setError('Could not reach our support service right now.');
    } finally {
      setReopening(false);
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2 text-zinc-500 text-sm py-16 justify-center"><Loader2 size={18} className="animate-spin" /> Loading ticket...</div>;
  }
  if (error && !ticket) {
    return (
      <div className="text-center py-16">
        <AlertCircle size={28} className="text-rose-400 mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">{error}</p>
      </div>
    );
  }
  if (!ticket) return null;

  const isClosed = ticket.status === 'Closed';
  const canReopen = ['Resolved', 'Closed'].includes(ticket.status);

  return (
    <div>
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-600 mb-5 cursor-pointer">
        <ChevronLeft size={14} /> Back to My Tickets
      </button>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Ticket</p>
            <p className="font-mono font-extrabold text-zinc-900">{ticket.ticket_code}</p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5 pb-5 border-b border-zinc-200">
          <div><p className="text-zinc-400">Category</p><p className="font-bold text-zinc-700 mt-0.5">{ticket.category}</p></div>
          <div><p className="text-zinc-400">Priority</p><p className="font-bold text-zinc-700 mt-0.5">{ticket.priority}</p></div>
          <div><p className="text-zinc-400">Order ID</p><p className="font-bold text-zinc-700 mt-0.5">{ticket.order_id || '—'}</p></div>
          <div><p className="text-zinc-400">Raised</p><p className="font-bold text-zinc-700 mt-0.5">{new Date(ticket.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p></div>
        </div>

        {/* Conversation thread */}
        <div className="space-y-3 mb-5 max-h-96 overflow-y-auto pr-1">
          {messages.map((m) => {
            const isCustomer = m.sender_type === 'Customer';
            const isSystem = m.sender_type === 'System';
            if (isSystem) {
              return <p key={m.id} className="text-[11px] text-zinc-400 text-center italic py-1">{m.message}</p>;
            }
            return (
              <div key={m.id} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isCustomer ? 'bg-amber-400 text-black' : 'bg-zinc-100 text-zinc-800'}`}>
                  <p className="whitespace-pre-wrap break-words">{m.message}</p>
                  {m.attachment_url && (
                    <a href={m.attachment_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] mt-1.5 underline">
                      <Paperclip size={11} /> Attachment
                    </a>
                  )}
                  <p className={`text-[10px] mt-1.5 ${isCustomer ? 'text-black/50' : 'text-zinc-400'}`}>
                    {new Date(m.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className="text-rose-600 text-xs mb-3">{error}</p>}

        {canReopen ? (
          <button
            type="button" onClick={reopen} disabled={reopening}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {reopening ? <Loader2 size={14} className="animate-spin" /> : <RotateCw size={14} />}
            Not Satisfied? Reopen This Ticket
          </button>
        ) : (
          <form onSubmit={sendReply} className="flex items-end gap-2">
            <textarea
              rows={2}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={isClosed ? 'This ticket is closed.' : 'Type a reply...'}
              disabled={isClosed}
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none disabled:opacity-60"
            />
            <button
              type="submit" disabled={sending || isClosed || !reply.trim()}
              className="bg-amber-400 hover:bg-amber-500 text-black p-3 rounded-xl transition cursor-pointer disabled:opacity-40 shrink-0"
              aria-label="Send reply"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function MyTickets() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const prefillCode = params.get('ticket') || '';

  const [tickets, setTickets] = useState([]);
  const [loadingList, setLoadingList] = useState(!!user?.id);

  const [lookupCode, setLookupCode] = useState(prefillCode);
  const [lookupVerify, setLookupVerify] = useState(user?.email || '');
  const [active, setActive] = useState(null); // { code, verify }

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${ENDPOINTS.tickets}?user_id=${encodeURIComponent(user.id)}`)
      .then((r) => r.json())
      .then((d) => setTickets(d.success ? d.tickets || [] : []))
      .catch(() => setTickets([]))
      .finally(() => setLoadingList(false));
  }, [user]);

  // If arriving with ?ticket=CODE and we already know the user's email
  // (logged in), jump straight to the detail view — no need to ask again.
  useEffect(() => {
    if (prefillCode && user?.email) {
      setActive({ code: prefillCode, verify: user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLookup = (e) => {
    e.preventDefault();
    if (!lookupCode.trim() || !lookupVerify.trim()) return;
    setActive({ code: lookupCode.trim().toUpperCase(), verify: lookupVerify.trim() });
  };

  if (active) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans pt-28 md:pt-36 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <TicketDetail code={active.code} verify={active.verify} onBack={() => setActive(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-400 selection:text-black">
      <PageHero
        eyebrow="Support & Ticketing"
        title="My Tickets"
        subtitle="Track status, chat with our support team, and reopen a ticket if you're not satisfied with the resolution."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Logged-in ticket list */}
        {user?.id && (
          <div className="mb-10">
            {loadingList ? (
              <div className="flex items-center gap-2 text-zinc-500 text-sm py-6 justify-center"><Loader2 size={16} className="animate-spin" /> Loading your tickets...</div>
            ) : tickets.length === 0 ? (
              <p className="text-center text-zinc-400 text-sm py-6">You haven't raised any tickets yet.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActive({ code: t.ticket_code, verify: user.email })}
                    className="w-full text-left bg-white border border-zinc-200 hover:border-amber-400/40 rounded-2xl p-4 transition cursor-pointer flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-mono font-bold text-sm text-zinc-900 truncate">{t.ticket_code}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{t.category}{t.order_id ? ` · Order ${t.order_id}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={t.status} />
                      <ChevronDown size={14} className="text-zinc-300 -rotate-90" />
                    </div>
                  </button>
                ))}
              </div>
            )}
            <Link to="/raise-ticket" className="block text-center mt-5 text-xs font-bold text-amber-600 hover:underline">
              + Raise a New Ticket
            </Link>
          </div>
        )}

        {/* Lookup form — for guests, or to check a ticket from another email */}
        <div className={user?.id ? 'pt-8 border-t border-zinc-200' : ''}>
          {user?.id && <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-500 mb-4">Look Up a Different Ticket</h2>}
          <form onSubmit={handleLookup} className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
              <Ticket size={14} className="text-amber-600 shrink-0" /> Enter your Ticket ID and the email or phone used when raising it.
            </div>
            <input
              type="text" required placeholder="Ticket ID (e.g. TKT-2026-000123)"
              value={lookupCode} onChange={(e) => setLookupCode(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <input
              type="text" required placeholder="Registered Email or Phone Number"
              value={lookupVerify} onChange={(e) => setLookupVerify(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer">
              View Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
