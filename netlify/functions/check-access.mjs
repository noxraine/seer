import { getStore } from "@netlify/blobs";

export default async function handler(request) {
  var url = new URL(request.url);
  var orderId = url.searchParams.get("orderId") || "";
  if (!orderId) {
    return new Response(JSON.stringify({ paid: false }), { headers: { "Content-Type": "application/json" } });
  }
  var store = getStore("access-codes");
  var row = await store.get(orderId, { type: "json" });
  var paid = !!(row && row.paid && row.until > Date.now());
  return new Response(JSON.stringify({ paid: paid, until: paid ? row.until : 0 }), {
    headers: { "Content-Type": "application/json" }
  });
}
