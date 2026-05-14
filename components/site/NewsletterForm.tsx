"use client";

import { useState } from "react";
export default function NewsLetterForm(){
    const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
    return(
<>
    <form
    onSubmit={(e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
    }}
    className="flex items-center border-b border-foreground/40 pb-2"
    >
    <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Your email address"
    className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
    />
    <button
    type="submit"
    className="text-[11px] tracking-wider-2 uppercase text-foreground hover:text-brand transition-colors"
    >
    Submit
    </button>
    </form>
    {submitted && (
    <p className="text-xs text-muted-foreground animate-fade-in">Thank you — you're on the list.</p>
    )}
</>
    )
}