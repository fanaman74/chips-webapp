import { cookies } from "next/headers";

export type Role = "applicant" | "partner" | "admin";

export type Session = {
  role: Role;
  name: string;
  org: string;
  email: string;
  avatar?: string;
};

const COOKIE = "chipsju_session";

const PROFILES: Record<Role, Session> = {
  applicant: {
    role: "applicant",
    name: "Dr. Elena Moreau",
    org: "ETH Zurich — Integrated Systems Lab",
    email: "elena.moreau@ethz.ch",
  },
  partner: {
    role: "partner",
    name: "Andreas Weber",
    org: "Infineon Technologies AG",
    email: "andreas.weber@infineon.com",
  },
  admin: {
    role: "admin",
    name: "Sofia Ricci",
    org: "Chips JU Programme Office",
    email: "sofia.ricci@chips-ju.europa.eu",
  },
};

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const role = raw as Role;
    if (role in PROFILES) return PROFILES[role];
    return null;
  } catch {
    return null;
  }
}

export async function setSession(role: Role) {
  const store = await cookies();
  store.set(COOKIE, role, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export { PROFILES };
