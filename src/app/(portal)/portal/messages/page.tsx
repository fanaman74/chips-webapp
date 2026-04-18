import { MessageSquare, Paperclip } from "lucide-react";
import { PortalContainer, PortalPageHeader } from "@/components/portal/portal-container";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Messages" };

const THREADS = [
  {
    id: "t1",
    from: "Miriam Haas",
    fromRole: "Programme Officer · Chips JU",
    subject: "Review comments on Deliverable D3.2",
    preview: "Three minor comments on the silicon characterisation report. Please address before…",
    time: "10:42",
    unread: true,
  },
  {
    id: "t2",
    from: "WP3 Coordination",
    fromRole: "EUROHPC-EDGE consortium",
    subject: "Tape-out schedule confirmed — 18 July shuttle",
    preview: "The IMEC pilot line has confirmed our shuttle allocation for the 18 July window…",
    time: "yesterday",
    unread: true,
  },
  {
    id: "t3",
    from: "Programme Office",
    fromRole: "Chips JU",
    subject: "Financial reporting period Q2 opens",
    preview: "Reporting period Q2 2026 opens on 1 May. You have 6 weeks to submit the technical and financial…",
    time: "Mon",
    unread: false,
  },
  {
    id: "t4",
    from: "Andreas Weber",
    fromRole: "Infineon Technologies",
    subject: "Partnering opportunity — ECS-2026-2-IA",
    preview: "Hi Elena — we're putting together a consortium for the automotive call in June…",
    time: "Mon",
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <PortalContainer>
      <PortalPageHeader
        eyebrow="Messages"
        title="Inbox"
        description="Communications with the programme office, your consortium partners and the wider ecosystem."
      />
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        {THREADS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-2 ${
              i > 0 ? "border-t border-border" : ""
            }`}
          >
            <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{t.from}</span>
                <span className="text-xs text-muted-foreground truncate">{t.fromRole}</span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                  {t.time}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <h3 className="font-display text-base font-semibold leading-snug tracking-tight truncate">
                  {t.subject}
                </h3>
                {t.unread && <Badge variant="accent">New</Badge>}
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">{t.preview}</p>
            </div>
            <Paperclip className="mt-3 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </PortalContainer>
  );
}
