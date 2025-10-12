// src/pages/ForgotPassword.tsx (ili gde ti odgovara)
import React, { useState } from 'react';
import { supabase } from '../lib/utils.ts';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://serious-yt-web-3.vercel.app/updatepassword' // promeni na svoj URL
    });
    if (error) {
      setMsg('Došlo je do greške. Proveri email i pokušaj ponovo.');
      console.error(error);
      return;
    }
    setMsg('Ako postoji nalog sa tim emailom, poslat vam je link za reset.');
  }

  return (
    <form onSubmit={submit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tvoj@email.com" />
      <button type="submit">Pošalji link</button>
      <p>{msg}</p>
    </form>
  );
}
