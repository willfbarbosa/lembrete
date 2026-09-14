import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("auth_session");

  if (sessionToken && sessionToken.value === "authenticated_willian_barbosa") {
    return NextResponse.json({
      authenticated: true,
      user: { username: "willian.barbosa", name: "Willian Barbosa" },
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
