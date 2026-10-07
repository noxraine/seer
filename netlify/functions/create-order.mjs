export default async function handler() {
  var merchantId = process.env.ATLOS_MERCHANT_ID;
  var secret = process.env.ATLOS_API_SECRET;
  if (!merchantId || !secret) {
    return new Response(JSON.stringify({ error: "missing ATLOS env" }), { status: 500 });
  }
  var orderId = "ph" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  var response = await fetch("https://api.atlos.io/gateway/rest/Invoice/Create", {
    method: "POST",
    headers: { "Content-Type": "application/json", ApiSecret: secret },
    body: JSON.stringify({
      MerchantId: merchantId,
      OrderId: orderId,
      OrderAmount: 1,
      OrderCurrency: "USD",
      Memo: "Regime PH 30 days test"
    })
  });
  var data = await response.json().catch(function () { return {}; });
  if (!response.ok || !data.PaymentLink) {
    return new Response(JSON.stringify({ error: "atlos failed", detail: data }), { status: 502 });
  }
  return new Response(JSON.stringify({ orderId: orderId, invoiceId: data.Id, payUrl: data.PaymentLink }), {
    headers: { "Content-Type": "application/json" }
  });
}
