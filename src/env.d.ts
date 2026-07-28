/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_STORAGE_KEY: string
  readonly VITE_RESET_DELAY: string
  readonly VITE_TIME_BLOCKS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
