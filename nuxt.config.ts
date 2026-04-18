import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath } from "url";

const enableNuxtHub = process.env.NUXT_HUB_ENABLED === "true";

const nuxtHubModule: [string, Record<string, boolean>] = [
  "@nuxthub/core",
  { database: true, kv: true, blob: true, cache: true },
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    ...(enableNuxtHub ? [nuxtHubModule] : []),
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxtjs/supabase",
    "@nuxt/eslint",
  ],
  icon: {
    provider: "iconify",
  },
  // Prevents supabase from locking unauthenticated users to only the login page
  supabase: {
    redirect: false,
  },
  css: ["@/public/assets/css/global.css"],
  nitro: {
    preset: "vercel",
    prerender: {
      autoSubfolderIndex: false,
    },
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },
  experimental: {
    appManifest: false,
  },
  // Development
  devtools: { enabled: true },
  dir: {
    pages: "app/pages",
    layouts: "app/layouts",
    middleware: "app/middleware",
  },
  components: {
    dirs: [
      {
        path: "app/components",
        global: true,
      },
      "app/components",
    ],
  },
  imports: {
    dirs: ["types/*.ts", "types/**/*.ts", "app/composables"],
  },
  postcss: {
    plugins: {
      "tailwindcss/nesting": false,
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  alias: {
    "~/types": fileURLToPath(new URL("./types", import.meta.url)),
    "~/server": fileURLToPath(new URL("./server", import.meta.url)),
    "~/utils": fileURLToPath(new URL("./utils", import.meta.url)),
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: ".",
      },
    },
  },
});
