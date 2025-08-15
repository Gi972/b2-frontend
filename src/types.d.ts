import "astro";

declare module "astro" {
  interface Locals {
    tenant?: {
      id: string;
      slug: string;
      domain: string | null;
      stripe_account_id: string;
    };
  }
}

export {};

declare global {
  namespace App {
    /**
     * Used by middlewares to store information, that can be read by the user via the global `Astro.locals`
     */
    interface Locals {
      tenant?: {
        id: string;
        slug: string;
        domain: string | null;
        stripe_account_id: string;
      };
    }
  }
}
