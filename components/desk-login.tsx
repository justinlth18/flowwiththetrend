"use client";

import { useState } from "react";

export function DeskLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/desk/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "That email or password is not right.");
      return;
    }
    window.location.assign("/desk");
  }

  return (
    <main className="desk-wrap">
      <form className="sheet sheet-yellow desk-card" onSubmit={submit}>
        <p className="kicker">studio desk</p>
        <h1 className="plain-title">Log in.</h1>
        <p>This page stays closed until you sign in with your account.</p>
        <label className="field">
          Email
          <input
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="field">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "checking" : "log in"}
        </button>
      </form>
    </main>
  );
}
