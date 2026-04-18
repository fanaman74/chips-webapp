import * as React from "react";
import { Container, Eyebrow } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, description, children, className }: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border bg-surface-2/40 pt-14 pb-14 md:pt-20 md:pb-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-grid bg-grid-fade opacity-30 dark:opacity-20"
      />
      <Container className="relative">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-3xl text-balance text-muted-foreground md:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
