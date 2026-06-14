'use client';

import { useEffect, useRef, useState } from 'react';
import type { SiteInfo } from '@/lib/content';
import s from './LiveChat.module.css';

type Msg = { from: 'user' | 'bot'; text: string; time: string };

function now() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function LiveChat({ site }: { site: SiteInfo }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [step, setStep] = useState<'name' | 'chat'>('name');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [shake, setShake] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Greeting setelah 4 detik kalau belum dibuka
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) { setUnread(1); setShake(true); setTimeout(() => setShake(false), 800); }
    }, 4000);
    return () => clearTimeout(t);
  }, [open]);

  // Auto-scroll ke bawah saat pesan baru
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [msgs]);

  // Focus input saat chat terbuka
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Tambah greeting bot pertama kali buka
  function handleOpen() {
    setOpen(true);
    if (msgs.length === 0) {
      setMsgs([{ from: 'bot', text: site.chatGreeting, time: now() }]);
    }
  }

  async function submitName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStep('chat');
    setMsgs((m) => [
      ...m,
      { from: 'bot', text: `Halo ${name.trim()}! 👋 Silakan ketik pesanmu ya.`, time: now() },
    ]);
  }

  async function sendMsg(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Msg = { from: 'user', text, time: now() };
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'chat', name: name || 'Tamu', message: text }),
      });
      const data = await res.json();

      // Typing delay sebelum reply bot
      setTimeout(() => {
        setMsgs((m) => [
          ...m,
          {
            from: 'bot',
            text: 'Terima kasih pesannya! Kami akan segera membalas via WhatsApp. ☕',
            time: now(),
          },
        ]);
        setSending(false);

        // Buka WA otomatis
        if (data.waLink) window.open(data.waLink, '_blank');
      }, 900);
    } catch {
      setSending(false);
      setMsgs((m) => [...m, { from: 'bot', text: 'Ups, ada gangguan. Coba lagi ya.', time: now() }]);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        className={`${s.fab} ${shake ? s.shake : ''} ${open ? s.fabOpen : ''}`}
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label={open ? 'Tutup chat' : 'Buka live chat'}
      >
        {open ? (
          /* X icon — clean close */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          /* WhatsApp-style solid chat icon */
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.308 2 11.625c0 2.18.78 4.183 2.07 5.76L2.5 21.5l4.356-1.528A10.18 10.18 0 0012 21.25c5.523 0 10-4.308 10-9.625S17.523 2 12 2zm-1 13.5H8.5V9H11v6.5zm3.5 0H13V9h1.5v6.5zm0-8.25a.875.875 0 110-1.75.875.875 0 010 1.75zm-3.5 0a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
          </svg>
        )}
        {unread > 0 && !open && <span className={s.badge}>{unread}</span>}
      </button>

      {/* Tooltip hint */}
      {!open && unread > 0 && (
        <div className={s.tooltip} onClick={handleOpen}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6}}><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.477 2 2 6.308 2 11.625c0 2.18.78 4.183 2.07 5.76L2.5 21.5l4.356-1.528A10.18 10.18 0 0012 21.25c5.523 0 10-4.308 10-9.625S17.523 2 12 2z"/></svg> Chat dengan kami!</span>
        </div>
      )}

      {/* Chat panel */}
      <div className={`${s.panel} ${open ? s.panelOpen : ''}`} role="dialog" aria-label="Live Chat">
        {/* Header */}
        <div className={s.header}>
          <div className={s.avatar}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/>
            </svg>
          </div>
          <div className={s.headerInfo}>
            <strong>Strata Coffee</strong>
            <span className={s.online}>
              <span className={s.onlineDot} /> Online sekarang
            </span>
          </div>
          <button className={s.closeBtn} onClick={() => setOpen(false)} aria-label="Tutup">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body / messages */}
        <div className={s.body} ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`${s.msg} ${m.from === 'user' ? s.msgUser : s.msgBot}`}>
              <div className={s.bubble}>{m.text}</div>
              <span className={s.time}>{m.time}</span>
            </div>
          ))}
          {sending && (
            <div className={`${s.msg} ${s.msgBot}`}>
              <div className={`${s.bubble} ${s.typing}`}>
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className={s.footer}>
          {step === 'name' ? (
            <form onSubmit={submitName} className={s.nameForm}>
              <p className={s.nameLabel}>Siapa nama kamu?</p>
              <div className={s.nameRow}>
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  className={s.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu..."
                  required
                />
                <button type="submit" className={s.sendBtn} aria-label="Kirim nama">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={sendMsg} className={s.chatForm}>
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                className={s.textarea}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(e as unknown as React.FormEvent); } }}
                placeholder={site.chatPlaceholder}
                rows={2}
              />
              <button type="submit" className={s.sendBtn} disabled={!input.trim() || sending} aria-label="Kirim">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </form>
          )}
          <p className={s.powered}>
            Pesan diteruskan via WhatsApp · <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">Chat langsung ↗</a>
          </p>
        </div>
      </div>
    </>
  );
}
