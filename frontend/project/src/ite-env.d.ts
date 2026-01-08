// src/vite-env.d.ts
/// <reference types="vite/client" />

declare module '*.jsx' {
  import type { ComponentType } from 'react'
  const component: ComponentType<unknown>
  export default component
}