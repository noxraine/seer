import { getStore } from "@netlify/blobs";

export default async (req) => {
  const k = new URL(req.url).searchParams.get("k") || "";
  const data = k ? await getStore("bot-keys").get(k, { type: "json" }) : null;
  return Response.json(data && data.until ? { ok: true, until: data.until } : { ok: false }, {
    headers: { "access-control-allow-origin": "*" }
  });
};
