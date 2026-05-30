import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function wantsJson(request: Request) {
  return request.headers.get("accept")?.includes("application/json");
}

export async function POST(request: Request) {
  const formData = await request.formData();

  // Convert FormData to plain object
  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value as string;
  }

  const emailContent = `
    <h2>New Booking from Aura+</h2>
    <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
    <p><strong>Email:</strong> ${data.email_address}</p>
    <p><strong>Phone:</strong> ${data.phone_number}</p>
    <p><strong>Event Date:</strong> ${data.event_date}</p>
    <p><strong>Event Time:</strong> ${data.event_time}</p>
    <p><strong>Event Location:</strong> ${data.event_location}</p>
    <p><strong>Message:</strong> ${data.what_you_want_to_say}</p>
    <hr />
    <h3>Selected Services:</h3>
    <pre>${data.services || "No services specified"}</pre>
  `;

  try {
    const response = await resend.emails.send({
      from: "Aura+ Bookings <onboarding@resend.dev>",
      to: "thetestamentonafowokan@gmail.com",
      subject: `New Booking: ${data.first_name} ${data.last_name}`,
      html: emailContent,
    });

    console.log("Resend response:", response);

    if (response.error) {
      console.error("Resend error:", response.error);
      throw new Error(`Resend API error: ${response.error.message}`);
    }

    if (!response.data?.id) {
      console.error("No email ID in response:", response);
      throw new Error("Failed to send email - no ID returned");
    }

    if (wantsJson(request)) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.redirect(
      new URL("/?booking=success#booking", request.url),
      303,
    );
  } catch (error) {
    console.error("Email error:", error);

    if (wantsJson(request)) {
      return NextResponse.json(
        { error: "Booking submission failed" },
        { status: 502 },
      );
    }

    return NextResponse.redirect(
      new URL("/?booking=error#booking", request.url),
      303,
    );
  }
}
