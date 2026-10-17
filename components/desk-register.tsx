"use client";

import { useState } from "react";
import { CodeSlots } from "@/components/code-slots";

export function DeskRegister({ token }: { token: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"details" | "code">("details");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/desk/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, email, password }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "The code was not sent.");
      return;
    }
    setCode("");
    setStep("code");
  }

  async function verify(nextCode: string) {
    setPending(true);
    setError("");
    const response = await fetch("/api/desk/register/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, code: nextCode }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);
    if (!response.ok) {
      setCode("");
      setError(body?.error ?? "That code is not right.");
      return;
    }
    window.location.assign("/desk");
  }

  if (step === "code") {
    return (
      <main className="desk-wrap">
        <form
          className="sheet sheet-yellow desk-card"
          onSubmit={(event) => {
            event.preventDefault();
            if (code.length === 6) void verify(code);
          }}
        >
          <p className="kicker">studio desk</p>
          <h1 className="plain-title">Type the code.</h1>
          <p>Six numbers were sent to {email}. They close in 10 minutes.</p>
          <CodeSlots
            value={code}
            disabled={pending}
            onChange={(next) => {
              setCode(next);
              if (next.length === 6) void verify(next);
            }}
          />
          {error ? <p className="form-error">{error}</p> : null}
          <button className="btn" type="submit" disabled={pending || code.length < 6}>
            {pending ? "checking" : "create the account"}
          </button>
          <button className="btn btn-green" type="button" disabled={pending} onClick={(event) => void sendCode(event)}>
            send a new code
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="desk-wrap">
      <form className="sheet sheet-yellow desk-card" onSubmit={sendCode}>
        <p className="kicker">studio desk</p>
        <h1 className="plain-title">Create your account.</h1>
        <p>This page only opens from the private registration link. A code is emailed before the account is saved.</p>
        <label className="field">
          Name
          <input name="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={80} />
        </label>
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={10}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "sending the code" : "email me a code"}
        </button>
      </form>
    </main>
  );
}
