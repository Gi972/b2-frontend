import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const hostHeader =
    context.request.headers.get("x-original-host") ||
    context.request.headers.get("host") ||
    "";

  const resolvedHost = hostHeader.toLowerCase();

  const res = await fetch(
    `${
      import.meta.env.PUBLIC_API_BASE
    }/tenants/resolve?host=${encodeURIComponent(resolvedHost)}`
  );

  if (!res.ok) {
    return new Response("Tenant not found", { status: 404 });
  }

  const tenant = await res.json();
  context.locals.tenant = tenant;

  return next();
});
