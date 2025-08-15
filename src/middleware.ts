import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const url = new URL(context.request.url);

    // Bypass static assets/files (avoid pointless 500s on favicon, etc.)
    if (
      url.pathname.startsWith("/_astro/") ||
      url.pathname.startsWith("/assets/") ||
      url.pathname === "/favicon.ico" ||
      url.pathname === "/robots.txt" ||
      url.pathname.startsWith("/sitemap") ||
      url.pathname === "/healthz"
    ) {
      return next();
    }

    const hostHeader =
      context.request.headers.get("x-original-host") ||
      context.request.headers.get("host") ||
      "";

    const base = import.meta.env.PUBLIC_API_BASE;
    if (!base) {
      return new Response("Missing PUBLIC_API_BASE on Pages env", {
        status: 500,
      });
    }

    const res = await fetch(
      `${base}/tenants/resolve?host=${encodeURIComponent(
        hostHeader.toLowerCase()
      )}`
    );

    if (res.status === 404) {
      return new Response(`Tenant not found for host: ${hostHeader}`, {
        status: 404,
      });
    }
    if (!res.ok) {
      return new Response(`Resolve failed: HTTP ${res.status}`, {
        status: 502,
      });
    }

    context.locals.tenant = await res.json();

    console.log("Tenant resolution result:", context.locals.tenant);

    return next();
  } catch (err: any) {
    return new Response(`Middleware error: ${err?.message || String(err)}`, {
      status: 500,
    });
  }
});
