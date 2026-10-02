"use client";

import { FormEvent, useState } from "react";
import { sendInquiry } from "@/lib/api";
import { Button } from "./Button";

export function InquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await sendInquiry({ name, email, phone: phone || undefined, message });
      setNote(res.message ?? "Thank you.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send.");
    } finally {
      setPending(false);
    }
  }

  const field =
    "mt-2 h-12 w-full rounded-xl border border-line bg-paper px-4 text-[15px] outline-none focus:border-gold";

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="name" className="text-[13px] text-stone">
          Name
        </label>
        <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="email" className="text-[13px] text-stone">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-[13px] text-stone">
          Phone
        </label>
        <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="message" className="text-[13px] text-stone">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] outline-none focus:border-gold"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send to the studio"}
      </Button>
      {note ? <p className="text-[14px] text-success">{note}</p> : null}
      {error ? <p className="text-[14px] text-red-800">{error}</p> : null}
    </form>
  );
}
