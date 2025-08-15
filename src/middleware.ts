import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  return next(); // <— bypass total du middleware juste pour ce test
});
