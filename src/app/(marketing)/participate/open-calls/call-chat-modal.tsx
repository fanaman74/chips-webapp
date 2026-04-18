"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Call } from "@/lib/calls";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME = "I'm your Horizon Europe call specialist. Ask me anything about this call — scope, eligibility, evaluation criteria, consortium requirements, deadlines, or how to position your proposal.";

export function CallChatModal({ call, onClose }: { call: Call; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const assistantIdx = next.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/call-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: call.id,
          title: call.title,
          programme: call.programme,
          instrument: call.instrument,
          deadline: call.deadline ?? undefined,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const lines = buf.split("\n");
        buf = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const json = JSON.parse(data);
            const token: string = json.choices?.[0]?.delta?.content ?? "";
            if (token) {
              setMessages((prev) => {
                const copy = [...prev];
                copy[assistantIdx] = {
                  role: "assistant",
                  content: copy[assistantIdx].content + token,
                };
                return copy;
              });
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[assistantIdx] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming, call]);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border bg-card px-6 py-4 shadow-sm">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-brand">
            <Info className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest">
              Call Information Agent
            </span>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{call.id}</p>
          <h2 className="mt-0.5 font-display text-base font-semibold leading-snug tracking-tight line-clamp-2">
            {call.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="mt-0.5 rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 md:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-brand text-white rounded-br-sm"
                    : "bg-surface-1 border border-border text-foreground rounded-bl-sm"
                )}
              >
                {m.role === "assistant" && m.content === "" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about scope, eligibility, consortium, evaluation criteria…"
            rows={1}
            disabled={streaming}
            className="flex-1 resize-none rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-50 max-h-32 overflow-y-auto"
            style={{ lineHeight: "1.5" }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-brand/90 disabled:opacity-40"
            aria-label="Send"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-muted-foreground">
          AI-generated answers. Always verify on the official{" "}
          <a
            href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            EU Funding &amp; Tenders Portal
          </a>
          .
        </p>
      </div>
    </div>
  );
}
