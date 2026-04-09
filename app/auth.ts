/**
 * auth.ts — Lightweight auth helpers using localStorage.
 *
 * No JWT. We store the full user object after login/register.
 * All pages read from here to get the current userId.
 */

import type { ApiUser } from './api';

const KEY = 'taskhub_user';

export const saveUser = (user: ApiUser) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(user));
  }
};

export const getUser = (): ApiUser | null => {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(KEY);
  }
};

export const isLoggedIn = () => getUser() !== null;
