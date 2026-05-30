import { NextResponse } from "next/server";

function wantsJson(request: Request) {
  return request.headers.get("accept")?.includes("application/json");
}

export async function POST(request: Request) {
  const endpoint = process.env.FORMSUBMIT_ENDPOINT;

  if (!endpoint) {
    if (wantsJson(request)) {
      return NextResponse.json({ error: "Missing form endpoint" }, { status: 500 });
    }

    return NextResponse.redirect(new URL("/?booking=error#booking", request.url), 303);
  }

  const formData = await request.formData();

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (wantsJson(request)) {
      return NextResponse.json({ error: "Booking submission failed" }, { status: 502 });
    }

    return NextResponse.redirect(new URL("/?booking=error#booking", request.url), 303);
  }

  if (wantsJson(request)) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.redirect(new URL("/?booking=success#booking", request.url), 303);
}
