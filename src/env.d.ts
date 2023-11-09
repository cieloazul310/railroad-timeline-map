/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TILE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
