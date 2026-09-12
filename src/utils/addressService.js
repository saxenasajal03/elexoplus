import { B2B_API_BASE } from '../data/siteContent';

/**
 * addressService.js
 * ---------------------------------------------------------------------------
 * Amazon-style saved address book. Tries the real backend endpoint first
 * (b2b.elexoplus.in/api/addresses.php — see backend delivery for the PHP +
 * SQL migration that creates `customer_addresses`), and transparently falls
 * back to a per-user localStorage store if that endpoint isn't reachable
 * yet. This means the checkout flow works TODAY, and silently upgrades to
 * server-persisted addresses the moment the endpoint goes live — no
 * frontend changes required either way.
 * ---------------------------------------------------------------------------
 */

const storageKey = (userId) => `elexo_addresses_${userId}`;

function readLocal(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(userId, addresses) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(addresses));
  } catch { /* ignore quota errors */ }
}

export async function listAddresses(userId) {
  if (!userId) return [];
  try {
    const res = await fetch(`${B2B_API_BASE}/addresses.php?user_id=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) return json.data;
    }
  } catch { /* fall through to local */ }
  return readLocal(userId);
}

export async function saveAddress(userId, address) {
  const payload = { ...address, user_id: userId };
  try {
    const res = await fetch(`${B2B_API_BASE}/addresses.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: address.id ? 'update' : 'add', ...payload }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success) return json.data ?? { ...address, id: json.id };
    }
  } catch { /* fall through to local */ }

  // Local fallback: assign an id if new, persist to this user's list.
  const list = readLocal(userId);
  if (address.id) {
    const idx = list.findIndex((a) => a.id === address.id);
    if (idx !== -1) list[idx] = { ...address };
  } else {
    address.id = `local-${Date.now()}`;
    if (address.is_default || list.length === 0) {
      list.forEach((a) => { a.is_default = false; });
      address.is_default = true;
    }
    list.push(address);
  }
  writeLocal(userId, list);
  return address;
}

export async function deleteAddress(userId, addressId) {
  try {
    const res = await fetch(`${B2B_API_BASE}/addresses.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', user_id: userId, id: addressId }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success) return true;
    }
  } catch { /* fall through to local */ }

  const list = readLocal(userId).filter((a) => a.id !== addressId);
  writeLocal(userId, list);
  return true;
}

export async function setDefaultAddress(userId, addressId) {
  try {
    const res = await fetch(`${B2B_API_BASE}/addresses.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'set_default', user_id: userId, id: addressId }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.success) return true;
    }
  } catch { /* fall through to local */ }

  const list = readLocal(userId).map((a) => ({ ...a, is_default: a.id === addressId }));
  writeLocal(userId, list);
  return true;
}
