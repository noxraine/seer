import crypto from "crypto";
import { getStore } from "@netlify/blobs";

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response("ok");
  }
  var secret = process.env.ATLOS_API_SECRET;
  var raw = await request.text();
  var signature = request.headers.get("Signature") || "";
  var hmac = crypto.createHmac("sha256", secret || "");
  hmac.update(raw);
  var expected = hmac.digest("base64");
  if (!secret || signature !== expected) {
    return new Response("bad signature", { status: 401 });
  }
  var body = JSON.parse(raw);
  if (body.Status !== 100 || !body.OrderId) {
    return new Response("ignored", { status: 200 });
  }
  var until = Date.now() + 30 * 86400000;
  var store = getStore("access-codes");
  await store.setJSON(body.OrderId, {
    paid: true,
    until: until,
    transactionId: body.TransactionId || "",
    paidAmount: body.PaidAmount || 0
  });
  return new Response("saved", { status: 200 });
}
