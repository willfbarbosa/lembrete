import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const VALID_USER = "willian.barbosa";
    const VALID_PASS = "Fx8350.8gb2017";

    if (username?.trim() === VALID_USER && password === VALID_PASS) {
      const response = NextResponse.json({
        success: true,
        user: { username: VALID_USER, name: "Willian Barbosa" },
      });

      // Set auth cookie
      response.cookies.set({
        name: "auth_session",
        value: "authenticated_willian_barbosa",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Usuário ou senha incorretos." },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao realizar login." },
      { status: 500 }
    );
  }
}
