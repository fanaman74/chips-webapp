import { NextResponse } from "next/server";
import { setSession, type Role } from "@/lib/auth";

const ROLES: Role[] = ["applicant", "partner", "admin"];

export async function POST(req: Request) {
  const form = await req.formData();
  const roleRaw = String(form.get("role") ?? "applicant");
  const role = ROLES.includes(roleRaw as Role) ? (roleRaw as Role) : "applicant";
  await setSession(role);
  const redirect = String(form.get("redirect") ?? "/portal");
  return NextResponse.redirect(new URL(redirect, req.url), { status: 303 });
}
