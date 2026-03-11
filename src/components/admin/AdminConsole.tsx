'use client';

import { startTransition, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
  LogOut,
  Power,
  PowerOff,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import type { SiteStatus, SiteStorageInfo } from '@/lib/siteStatus';

type Props = {
  adminConfigured: boolean;
  adminNote: string;
  initialAuthenticated: boolean;
  initialStatus: SiteStatus | null;
  storageInfo: SiteStorageInfo | null;
};

type ApiPayload = {
  authenticated?: boolean;
  message?: string;
  status?: SiteStatus;
  storageInfo?: SiteStorageInfo;
};

export default function AdminConsole({
  adminConfigured,
  adminNote,
  initialAuthenticated,
  initialStatus,
  storageInfo,
}: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [status, setStatus] = useState(initialStatus);
  const [siteStorageInfo, setSiteStorageInfo] = useState(storageInfo);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const updatedAtLabel = status
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC',
      }).format(new Date(status.updatedAt))
    : null;

  async function readJson(response: Response) {
    return (await response.json()) as ApiPayload;
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await readJson(response);

    if (!response.ok) {
      setMessage(data.message || 'Unable to sign in.');
      setIsBusy(false);
      return;
    }

    startTransition(() => {
      setAuthenticated(true);
      if (data.status) {
        setStatus(data.status);
      }
      if (data.storageInfo) {
        setSiteStorageInfo(data.storageInfo);
      }
      setPassword('');
      setMessage(data.message || 'Signed in.');
      setIsBusy(false);
    });
  }

  async function handleToggle(nextActive: boolean) {
    setIsBusy(true);
    setMessage('');

    const response = await fetch('/api/admin/site-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active: nextActive }),
    });
    const data = await readJson(response);

    startTransition(() => {
      if (response.ok && data.status) {
        setStatus(data.status);
        if (data.storageInfo) {
          setSiteStorageInfo(data.storageInfo);
        }
        setMessage(
          data.message ||
            `Site marked ${nextActive ? 'Active' : 'Not Active'} successfully.`,
        );
      } else {
        setMessage(data.message || 'Unable to update the site status.');
      }
      setIsBusy(false);
    });
  }

  async function handleLogout() {
    setIsBusy(true);
    setMessage('');

    const response = await fetch('/api/admin/logout', {
      method: 'POST',
    });
    const data = await readJson(response);

    startTransition(() => {
      if (response.ok) {
        setAuthenticated(false);
        setPassword('');
        setStatus(null);
        setSiteStorageInfo(null);
      }
      setMessage(data.message || 'Signed out.');
      setIsBusy(false);
    });
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#08111f] px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(70,127,183,0.24),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(211,163,115,0.24),_transparent_34%),linear-gradient(135deg,_#08111f_0%,_#111d31_48%,_#070d17_100%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#4f8fbf]/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 22, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#d3a373]/18 blur-3xl"
        animate={{ x: [0, -26, 0], y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
              <ShieldCheck className="h-4 w-4 text-[#d3a373]" />
              Admin Control
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
              Crafting Corner site status
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Sign in, switch the site between Active and Not Active, and keep
              the payment hold page ready for non-paying clients.
            </p>
          </div>

          <Link
            href="https://www.expertdevstudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#d3a373]/35 bg-[#d3a373]/10 px-5 py-3 text-sm font-medium text-[#f2cfad] transition hover:border-[#d3a373]/60 hover:bg-[#d3a373]/15"
          >
            ExpertDevStudio
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className={`mt-10 grid gap-8 ${
            authenticated
              ? 'lg:grid-cols-[0.95fr_1.05fr]'
              : 'mx-auto max-w-2xl lg:grid-cols-1'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-[2rem] border border-white/10 bg-white/7 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              {authenticated ? (
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
              ) : (
                <ShieldAlert className="h-6 w-6 text-amber-300" />
              )}
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {authenticated ? 'Admin authenticated' : 'Admin sign in'}
                </h2>
                <p className="mt-1 text-sm text-slate-300">{adminNote}</p>
              </div>
            </div>

            {!authenticated ? (
              <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Username
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={isBusy || !adminConfigured}
                    autoComplete="username"
                    className="w-full rounded-2xl border border-white/10 bg-[#091423] px-4 py-3 text-white outline-none transition focus:border-[#4f8fbf] focus:ring-2 focus:ring-[#4f8fbf]/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isBusy || !adminConfigured}
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/10 bg-[#091423] px-4 py-3 text-white outline-none transition focus:border-[#4f8fbf] focus:ring-2 focus:ring-[#4f8fbf]/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isBusy || !adminConfigured}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d3a373] px-5 py-3 text-sm font-semibold text-[#09111d] transition hover:bg-[#e3b989] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Signing in
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Sign in
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="mt-8 space-y-6">
                <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-200">
                        Secure session active
                      </p>
                      <p className="mt-1 text-sm text-emerald-100/80">
                        You can now control the public website state.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isBusy}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}

            {message ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200">
                {message}
              </div>
            ) : null}
          </motion.div>

          {authenticated && status && siteStorageInfo ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="rounded-[2rem] border border-white/10 bg-white/7 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                    Public website
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    {status.active ? 'Active' : 'Not Active'}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                    Updated {updatedAtLabel} UTC by {status.updatedBy}.
                  </p>
                </div>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    status.active
                      ? 'bg-emerald-400/15 text-emerald-200'
                      : 'bg-amber-400/15 text-amber-200'
                  }`}
                >
                  {status.active ? (
                    <Power className="h-4 w-4" />
                  ) : (
                    <PowerOff className="h-4 w-4" />
                  )}
                  {status.active ? 'Site is live' : 'Payment hold page is live'}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={
                    !siteStorageInfo.canUpdate || isBusy || status.active
                  }
                  onClick={() => handleToggle(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-[1.5rem] border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Power className="h-4 w-4" />
                  Set Active
                </button>
                <button
                  type="button"
                  disabled={
                    !siteStorageInfo.canUpdate || isBusy || !status.active
                  }
                  onClick={() => handleToggle(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-[1.5rem] border border-amber-400/25 bg-amber-400/10 px-5 py-4 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PowerOff className="h-4 w-4" />
                  Set Not Active
                </button>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#091423] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                  Storage mode
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {siteStorageInfo.mode === 'github'
                    ? 'GitHub-backed'
                    : 'Local file'}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {siteStorageInfo.note}
                </p>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
