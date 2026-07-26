'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { authConfigured, ensureSession, signInWithPassword, signOut, type SunsetDeckSession } from '@/lib/sunset-deck-auth';
import styles from './sunset-deck-auth.module.css';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SunsetDeckSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureSession()
      .then((current) => { if (!cancelled) setSession(current); })
      .catch(() => { if (!cancelled) setSession(null); })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const nextSession = await signInWithPassword(email.trim(), password);
      setSession(nextSession);
      setPassword('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'ログインできませんでした。');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    setSession(null);
  }

  if (checking) {
    return <main className={styles.loginPage}><div className={styles.loading}>SUNSET DECK STUDIOを準備しています。</div></main>;
  }

  if (!authConfigured) {
    return (
      <main className={styles.loginPage}>
        <section className={styles.loginCard}>
          <p className={styles.eyebrow}>SUNSET DECK STUDIO</p>
          <h1>Cloud setup required.</h1>
          <p>VercelにSupabaseのURLとAnon Keyを設定すると、ログイン画面が有効になります。</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.loginPage}>
        <section className={styles.loginCard}>
          <p className={styles.eyebrow}>SUNSET DECK STUDIO</p>
          <h1>Every Garden Has a Story.</h1>
          <p className={styles.intro}>制作、承認、公開をひとつの場所で管理します。</p>
          <form onSubmit={handleSubmit}>
            <label>EMAIL</label>
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label>PASSWORD</label>
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {error ? <p className={styles.error}>{error}</p> : null}
            <button type="submit" disabled={submitting}>{submitting ? 'SIGNING IN…' : 'ENTER STUDIO'}</button>
          </form>
          <small>Authorized members only.</small>
        </section>
      </main>
    );
  }

  return (
    <>
      <div className={styles.sessionBar}>
        <span>{session.user.email || 'Studio member'}</span>
        <button onClick={handleSignOut}>ログアウト</button>
      </div>
      {children}
    </>
  );
}
