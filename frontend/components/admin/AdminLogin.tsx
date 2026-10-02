"use client";

import { FormEvent, useState } from "react";
import { adminLogin } from "@/lib/api";
import { Button } from "@/components/Button";

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await adminLogin(username, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 pt-16">
      <p className="text-[12px] uppercase tracking-[0.18em] text-gold-deep">Studio</p>
      <h1 className="mt-3 text-[32px] font-medium tracking-tight">Sign in</h1>
      <p className="mt-2 text-[15px] text-stone">Private to Kotalwar Interiors.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="user" className="text-[13px] text-stone">
            Username
          </label>
          <input
            id="user"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-line bg-paper px-4 outline-none focus:border-gold"
          />
        </div>
        <div>
          <label htmlFor="pass" className="text-[13px] text-stone">
            Password
          </label>
          <input
            id="pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-line bg-paper px-4 outline-none focus:border-gold"
          />
        </div>
        {error ? <p className="text-[14px] text-red-800">{error}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Enter"}
        </Button>
      </form>
    </div>
  );
}
