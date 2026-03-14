import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ─── helpers ────────────────────────────────────────────────────────────────

function getAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

async function getAuthUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;
  const supabase = getAdminClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    console.log("getAuthUser error:", error?.message);
    return null;
  }
  return { user, token };
}

// ─── health ─────��──────────────────────────────────────────────────────────

app.get("/make-server-83de676c/health", (c) => {
  return c.json({ status: "ok", service: "CareMe Backend MVP" });
});

// ─── POST /auth/signup ───────────────────────────────────────────────────────
// Creates a new user account with email/password + saves profile to KV store

app.post("/make-server-83de676c/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, phone, role } = body;

    if (!email || !password || !name) {
      return c.json({ error: "Signup error: email, password, dan nama wajib diisi" }, 400);
    }

    const supabase = getAdminClient();

    // Create user with service role — auto-confirm email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        phone: phone || "",
        role: role || "customer",
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log("Signup admin.createUser error:", error.message);
      if (error.message.includes("already registered")) {
        return c.json({ error: "Email sudah terdaftar. Gunakan email lain atau masuk." }, 409);
      }
      return c.json({ error: `Signup error: ${error.message}` }, 400);
    }

    const userId = data.user.id;
    const profile = {
      id: userId,
      google_id: null,
      name,
      email,
      phone: phone || "",
      role: role || "customer",
      role_chosen: true,
      avatar_url: "",
      created_at: new Date().toISOString(),
    };

    await kv.set(`user_profile:${userId}`, profile);
    console.log("Signup success: new user created", email, "role:", role);

    return c.json({ success: true, user: profile }, 201);
  } catch (err) {
    console.log("Signup unexpected error:", err);
    return c.json({ error: `Server error saat registrasi: ${err}` }, 500);
  }
});

// ─── GET /api/me ─────────────────────────────────────────────────────────────
// Returns current authenticated user's profile

app.get("/make-server-83de676c/api/me", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header("Authorization"));
    if (!authResult) {
      return c.json({ error: "Unauthorized: token tidak valid atau tidak ditemukan" }, 401);
    }

    const { user } = authResult;

    // Try to load profile from KV store
    let profile = await kv.get(`user_profile:${user.id}`);
    let isNewUser = false;

    if (!profile) {
      isNewUser = true;
      // First time Google OAuth user — build profile from auth metadata
      const meta = user.user_metadata || {};
      const isGoogle = user.app_metadata?.provider === "google";
      profile = {
        id: user.id,
        google_id: isGoogle ? (meta.sub || meta.provider_id || null) : null,
        name: meta.name || meta.full_name || user.email?.split("@")[0] || "Pengguna",
        email: user.email || "",
        phone: meta.phone || "",
        role: meta.role || "customer",
        role_chosen: !isGoogle, // email signup = role already chosen; Google = needs selection
        avatar_url: meta.avatar_url || meta.picture || "",
        created_at: user.created_at,
      };
      await kv.set(`user_profile:${user.id}`, profile);
      console.log("GET /api/me: created new profile for", user.email, "(provider:", user.app_metadata?.provider, ")");
    }

    return c.json({ user: profile, is_new_user: isNewUser });
  } catch (err) {
    console.log("GET /api/me error:", err);
    return c.json({ error: `Server error mengambil profil user: ${err}` }, 500);
  }
});

// ─── PUT /api/me ────────���──────────────────────────────────────────────────
// Updates current authenticated user's profile

app.put("/make-server-83de676c/api/me", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header("Authorization"));
    if (!authResult) {
      return c.json({ error: "Unauthorized: token tidak valid" }, 401);
    }

    const { user } = authResult;
    const updates = await c.req.json();

    // Prevent overriding immutable fields
    delete updates.id;
    delete updates.email;
    delete updates.created_at;

    const existing = (await kv.get(`user_profile:${user.id}`)) || {};
    const updated = { ...existing, ...updates, id: user.id, email: user.email };

    await kv.set(`user_profile:${user.id}`, updated);
    console.log("PUT /api/me: updated profile for", user.email);

    return c.json({ user: updated });
  } catch (err) {
    console.log("PUT /api/me error:", err);
    return c.json({ error: `Server error mengupdate profil: ${err}` }, 500);
  }
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
// Get public profile of any user (for admin or caregiver lookup)

app.get("/make-server-83de676c/api/users/:id", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header("Authorization"));
    if (!authResult) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const targetId = c.req.param("id");
    const profile = await kv.get(`user_profile:${targetId}`);

    if (!profile) {
      return c.json({ error: "User tidak ditemukan" }, 404);
    }

    // Remove sensitive fields for non-admin
    const callerProfile = await kv.get(`user_profile:${authResult.user.id}`);
    const isAdmin = callerProfile?.role === "admin";
    if (!isAdmin) {
      delete profile.google_id;
    }

    return c.json({ user: profile });
  } catch (err) {
    console.log("GET /api/users/:id error:", err);
    return c.json({ error: `Server error: ${err}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT SYSTEM — Mayar Integration
// ═══════════════════════════════════════════════════════════════════════════════

const MAYAR_API_BASE = "https://api.mayar.id/hl/v1";

function getMayarHeaders() {
  const apiKey = Deno.env.get("MAYAR_API_KEY");
  if (!apiKey) throw new Error("MAYAR_API_KEY not configured");
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

// ─── POST /api/bookings ──────────────────────────────────────────────────────
// Creates a booking and saves it to KV store

app.post("/make-server-83de676c/api/bookings", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header("Authorization"));
    if (!authResult) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = authResult.user.id;
    const body = await c.req.json();

    const {
      caregiverId, caregiverName, caregiverPhoto,
      bookingDate, startTime, endTime, totalHours, totalPrice,
      patientName, hospitalName, hospitalAddress, roomNumber,
      purpose, specialNotes, emergencyContact,
    } = body;

    if (!caregiverId || !bookingDate || !patientName || !hospitalName || !totalPrice) {
      return c.json({ error: "Data booking tidak lengkap" }, 400);
    }

    const profile = await kv.get(`user_profile:${userId}`);
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const booking = {
      id: bookingId,
      customerId: userId,
      customerName: profile?.name || authResult.user.email || "Pengguna",
      customerEmail: profile?.email || authResult.user.email || "",
      caregiverId,
      caregiverName: caregiverName || "",
      caregiverPhoto: caregiverPhoto || "",
      bookingDate,
      startTime: startTime || "",
      endTime: endTime || "",
      totalHours: totalHours || 0,
      totalPrice: totalPrice || 0,
      patientName,
      hospitalName,
      hospitalAddress: hospitalAddress || "",
      roomNumber: roomNumber || "",
      purpose: purpose || "",
      specialNotes: specialNotes || "",
      emergencyContact: emergencyContact || "",
      status: "awaiting_payment",
      paymentStatus: "unpaid",
      paymentId: null,
      paymentUrl: null,
      mayarTransactionId: null,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, booking);

    // Also index by customer for easy listing
    const customerBookingIds: string[] = (await kv.get(`customer_bookings:${userId}`)) || [];
    customerBookingIds.push(bookingId);
    await kv.set(`customer_bookings:${userId}`, customerBookingIds);

    console.log("POST /api/bookings: created booking", bookingId, "for user", userId);
    return c.json({ booking }, 201);
  } catch (err) {
    console.log("POST /api/bookings error:", err);
    return c.json({ error: `Server error saat membuat booking: ${err}` }, 500);
  }
});

// ─── GET /api/bookings ───────────────────────────────────────────────────────
// List bookings for the authenticated user

app.get("/make-server-83de676c/api/bookings", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header("Authorization"));
    if (!authResult) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = authResult.user.id;
    const bookingIds: string[] = (await kv.get(`customer_bookings:${userId}`)) || [];

    if (bookingIds.length === 0) {
      return c.json({ bookings: [] });
    }

    const keys = bookingIds.map((id) => `booking:${id}`);
    const bookings = await kv.mget(keys);

    // Sort by createdAt descending
    const sorted = bookings
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ bookings: sorted });
  } catch (err) {
    console.log("GET /api/bookings error:", err);
    return c.json({ error: `Server error mengambil bookings: ${err}` }, 500);
  }
});

// ─── GET /api/bookings/:id ───────────────────────────────────────────────────

app.get("/make-server-83de676c/api/bookings/:id", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header("Authorization"));
    if (!authResult) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingId = c.req.param("id");
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking tidak ditemukan" }, 404);
    }

    return c.json({ booking });
  } catch (err) {
    console.log("GET /api/bookings/:id error:", err);
    return c.json({ error: `Server error: ${err}` }, 500);
  }
});

// ─── POST /api/payments/create ───────────────────────────────────────────────
// Creates a Mayar payment link for a booking

app.post("/make-server-83de676c/api/payments/create", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header("Authorization"));
    if (!authResult) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { bookingId } = await c.req.json();
    if (!bookingId) {
      return c.json({ error: "bookingId wajib diisi" }, 400);
    }

    const booking = await kv.get(`booking:${bookingId}`);
    if (!booking) {
      return c.json({ error: "Booking tidak ditemukan" }, 404);
    }

    // If already has a payment URL and not expired, return it
    if (booking.paymentUrl && booking.paymentStatus !== "failed") {
      console.log("POST /api/payments/create: returning existing payment URL for", bookingId);
      return c.json({
        paymentUrl: booking.paymentUrl,
        paymentId: booking.paymentId,
        booking,
      });
    }

    // Create Mayar payment link via their API
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const mayarPayload = {
      name: `CareMe Booking ${bookingId}`,
      amount: booking.totalPrice,
      description: `Pembayaran pendampingan pasien - ${booking.caregiverName} | ${booking.patientName} | ${booking.hospitalName} | ${booking.bookingDate} ${booking.startTime}-${booking.endTime}`,
      redirectUrl: `https://invite-patch-27950517.figma.site/dashboard/customer`,
    };

    console.log("POST /api/payments/create: calling Mayar API for booking", bookingId, "amount:", booking.totalPrice);

    const mayarRes = await fetch(`${MAYAR_API_BASE}/payment/create`, {
      method: "POST",
      headers: getMayarHeaders(),
      body: JSON.stringify(mayarPayload),
    });

    const mayarData = await mayarRes.json();
    console.log("Mayar API response status:", mayarRes.status, "data:", JSON.stringify(mayarData));

    if (!mayarRes.ok) {
      console.log("Mayar API error:", mayarData);
      // Fallback: use the static Mayar payment page link
      const fallbackUrl = `https://galaxy-guardian.myr.id/pl/careme`;
      booking.paymentUrl = fallbackUrl;
      booking.paymentId = paymentId;
      booking.paymentStatus = "pending";
      await kv.set(`booking:${bookingId}`, booking);
      await kv.set(`payment:${paymentId}`, {
        id: paymentId,
        bookingId,
        userId: authResult.user.id,
        amount: booking.totalPrice,
        status: "pending",
        paymentUrl: fallbackUrl,
        mayarResponse: mayarData,
        createdAt: new Date().toISOString(),
      });
      console.log("POST /api/payments/create: using fallback URL for", bookingId);
      return c.json({ paymentUrl: fallbackUrl, paymentId, booking });
    }

    // Extract payment link from Mayar response
    const paymentLink = mayarData?.data?.link || mayarData?.data?.payment_url || mayarData?.data?.url || mayarData?.link || `https://galaxy-guardian.myr.id/pl/careme`;
    const mayarTransactionId = mayarData?.data?.id || mayarData?.data?.transactionId || null;

    // Save payment record
    const payment = {
      id: paymentId,
      bookingId,
      userId: authResult.user.id,
      amount: booking.totalPrice,
      status: "pending",
      paymentUrl: paymentLink,
      mayarTransactionId,
      mayarResponse: mayarData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`payment:${paymentId}`, payment);

    // Update booking with payment info
    booking.paymentId = paymentId;
    booking.paymentUrl = paymentLink;
    booking.paymentStatus = "pending";
    booking.mayarTransactionId = mayarTransactionId;
    await kv.set(`booking:${bookingId}`, booking);

    console.log("POST /api/payments/create: payment created", paymentId, "→", paymentLink);
    return c.json({ paymentUrl: paymentLink, paymentId, booking });
  } catch (err) {
    console.log("POST /api/payments/create error:", err);
    return c.json({ error: `Server error saat membuat pembayaran: ${err}` }, 500);
  }
});

// ─── GET /api/payments/:bookingId ────────────────────────────────────────────
// Get payment status for a booking

app.get("/make-server-83de676c/api/payments/:bookingId", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header("Authorization"));
    if (!authResult) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingId = c.req.param("bookingId");
    const booking = await kv.get(`booking:${bookingId}`);
    if (!booking) {
      return c.json({ error: "Booking tidak ditemukan" }, 404);
    }

    let payment = null;
    if (booking.paymentId) {
      payment = await kv.get(`payment:${booking.paymentId}`);
    }

    return c.json({ booking, payment });
  } catch (err) {
    console.log("GET /api/payments/:bookingId error:", err);
    return c.json({ error: `Server error: ${err}` }, 500);
  }
});

// ─── POST /api/payments/webhook ──────────────────────────────────────────────
// Receives webhook callbacks from Mayar when payment status changes

app.post("/make-server-83de676c/api/payments/webhook", async (c) => {
  try {
    // Verify webhook token
    const webhookToken = Deno.env.get("MAYAR_WEBHOOK_TOKEN");
    const headerToken =
      c.req.header("x-callback-token") ||
      c.req.header("X-Callback-Token") ||
      c.req.header("x-webhook-token") ||
      c.req.header("Authorization")?.replace("Bearer ", "");

    if (webhookToken && headerToken !== webhookToken) {
      console.log("Webhook: invalid token. Header:", headerToken?.substring(0, 10) + "...");
      return c.json({ error: "Invalid webhook token" }, 403);
    }

    const payload = await c.req.json();
    console.log("Webhook received:", JSON.stringify(payload));

    // Mayar webhook payload structure
    const event = payload.event || payload.type || "";
    const data = payload.data || payload;
    const transactionId = data.id || data.transactionId || data.transaction_id || "";
    const status = data.status || data.paymentStatus || "";
    const paidAmount = data.amount || data.paidAmount || 0;

    console.log("Webhook event:", event, "| transactionId:", transactionId, "| status:", status);

    // Find the booking by Mayar transaction ID
    // Search through payments by prefix
    const allPayments = await kv.getByPrefix("payment:");
    let matchedPayment = null;
    let matchedBooking = null;

    for (const p of allPayments) {
      if (p.mayarTransactionId === transactionId || p.id === transactionId) {
        matchedPayment = p;
        break;
      }
    }

    if (matchedPayment) {
      matchedBooking = await kv.get(`booking:${matchedPayment.bookingId}`);
    }

    // Also try matching by description or booking ID in the payload
    if (!matchedBooking && data.description) {
      const bookingIdMatch = data.description.match(/BK-[\w-]+/);
      if (bookingIdMatch) {
        matchedBooking = await kv.get(`booking:${bookingIdMatch[0]}`);
        if (matchedBooking && matchedBooking.paymentId) {
          matchedPayment = await kv.get(`payment:${matchedBooking.paymentId}`);
        }
      }
    }

    // Determine if payment is successful
    const isSuccess =
      event === "payment.success" ||
      event === "payment.completed" ||
      status === "success" ||
      status === "completed" ||
      status === "paid" ||
      status === "settled";

    const isFailed =
      event === "payment.failed" ||
      event === "payment.expired" ||
      status === "failed" ||
      status === "expired" ||
      status === "cancelled";

    if (matchedBooking) {
      if (isSuccess) {
        matchedBooking.status = "paid";
        matchedBooking.paymentStatus = "paid";
        matchedBooking.paidAt = new Date().toISOString();
        matchedBooking.paidAmount = paidAmount || matchedBooking.totalPrice;
        await kv.set(`booking:${matchedBooking.id}`, matchedBooking);

        if (matchedPayment) {
          matchedPayment.status = "paid";
          matchedPayment.paidAt = new Date().toISOString();
          matchedPayment.webhookPayload = payload;
          await kv.set(`payment:${matchedPayment.id}`, matchedPayment);
        }

        console.log("Webhook: booking", matchedBooking.id, "marked as PAID");
      } else if (isFailed) {
        matchedBooking.paymentStatus = "failed";
        await kv.set(`booking:${matchedBooking.id}`, matchedBooking);

        if (matchedPayment) {
          matchedPayment.status = "failed";
          matchedPayment.webhookPayload = payload;
          await kv.set(`payment:${matchedPayment.id}`, matchedPayment);
        }

        console.log("Webhook: payment FAILED for booking", matchedBooking.id);
      } else {
        console.log("Webhook: unhandled status for booking", matchedBooking.id, "event:", event, "status:", status);
      }
    } else {
      // Store unmatched webhook for debugging
      await kv.set(`webhook_unmatched:${Date.now()}`, {
        payload,
        receivedAt: new Date().toISOString(),
      });
      console.log("Webhook: no matching booking found for transaction", transactionId);
    }

    return c.json({ received: true });
  } catch (err) {
    console.log("POST /api/payments/webhook error:", err);
    return c.json({ error: `Webhook processing error: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);