// src/vite-env.d.ts
/// <reference types="vite/client" />

// Pour les imports de composants React
declare module '*.jsx' {
  import type { ComponentType } from 'react'
  const component: ComponentType<unknown>
  export default component
}

// Pour les imports CSS
declare module '*.css' {
  const content: any
  export default content
}

// Pour résoudre les erreurs de types React
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}