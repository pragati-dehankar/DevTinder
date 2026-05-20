const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../model/connectionRequest");
const { sendEmail } = require("./sendEmail");

// Runs every day at 8:00 AM — notifies users who have pending connection requests
cron.schedule("0 8 * * *", async () => {
  console.log("[Cron] Running daily pending-requests email job: " + new Date());
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("fromUserId", "firstName lastName emailId")
      .populate("toUserId",   "firstName lastName emailId");

    // Map: toUser email → list of senders
    const emailMap = new Map();
    for (const req of pendingRequests) {
      if (!req.toUserId || !req.toUserId.emailId) continue;
      const recipientEmail = req.toUserId.emailId;
      const senderName = `${req.fromUserId?.firstName ?? ""} ${req.fromUserId?.lastName ?? ""}`.trim();

      if (!emailMap.has(recipientEmail)) {
        emailMap.set(recipientEmail, {
          recipientName: `${req.toUserId.firstName ?? "there"}`,
          senders: [],
        });
      }
      emailMap.get(recipientEmail).senders.push(senderName);
    }

    // Send one email per unique recipient
    for (const [email, { recipientName, senders }] of emailMap.entries()) {
      const senderList = senders
        .map((name) => `<li style="margin:4px 0;">👤 ${name}</li>`)
        .join("");

      const html = `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:32px 24px;text-align:center;">
            <h1 style="margin:0;font-size:28px;color:#fff;">💌 DevTinder</h1>
            <p style="margin:8px 0 0;color:#f3e8ff;font-size:14px;">Your connection requests are waiting!</p>
          </div>
          <div style="padding:32px 24px;">
            <p style="font-size:16px;">Hey <strong>${recipientName}</strong> 👋,</p>
            <p style="color:#94a3b8;">You have <strong style="color:#a78bfa;">${senders.length} pending connection request${senders.length > 1 ? "s" : ""}</strong> from yesterday that you haven't reviewed yet:</p>
            <ul style="background:#1e293b;border-radius:8px;padding:16px 24px;list-style:none;margin:16px 0;">
              ${senderList}
            </ul>
            <p style="color:#94a3b8;">Don't keep them waiting — log in and accept or ignore their requests.</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="http://localhost:5173/requests"
                 style="background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;display:inline-block;">
                View Requests →
              </a>
            </div>
          </div>
          <div style="background:#0f172a;border-top:1px solid #1e293b;padding:16px 24px;text-align:center;">
            <p style="color:#475569;font-size:12px;margin:0;">© ${new Date().getFullYear()} DevTinder · You're receiving this because you have an account.</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: `🔔 You have ${senders.length} pending connection request${senders.length > 1 ? "s" : ""} on DevTinder`,
        html,
      });
    }

    console.log(`[Cron] Done — emailed ${emailMap.size} user(s).`);
  } catch (error) {
    console.error("[Cron] Error in daily email job:", error.message);
  }
});
