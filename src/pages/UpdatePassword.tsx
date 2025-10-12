// src/pages/UpdatePassword.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/utils.ts';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // opciono: možeš detektovati PASSWORD_RECOVERY event
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // korisnik je preusmeren posle klika u emailu
      }
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMsg('Greška pri ažuriranju lozinke.');
      console.error(error);
      return;
    }
    setMsg('Lozinka uspešno promenjena. Možete se prijaviti.');
  }

  return (
    <form onSubmit={submit}>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nova lozinka" />
      <button type="submit">Postavi novu lozinku</button>
      <p>{msg}</p>
    </form>
  );
}
