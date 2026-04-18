import { INDUSTRY_MEMBERS } from "@/data/members";
import { Container, Eyebrow } from "@/components/ui/container";

export function LogoWall() {
  return (
    <section className="border-b border-border bg-surface-2/60 py-14">
      <Container>
        <Eyebrow className="justify-center flex">
          <span>Trusted by Europe&rsquo;s leading semiconductor ecosystem</span>
        </Eyebrow>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {INDUSTRY_MEMBERS.map((name) => (
            <div
              key={name}
              className="flex h-14 items-center justify-center rounded-md border border-border bg-card px-3 font-display text-[11px] font-semibold tracking-tight text-foreground/70 transition-colors hover:text-foreground sm:text-xs lg:text-sm text-center leading-tight"
            >
              {name}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
