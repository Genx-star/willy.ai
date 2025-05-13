// src/debug.d.ts
declare module "debug" {
  export function checkReactLoading(): boolean;
  export function checkReactDOMLoading(): boolean;
  export function checkRenderingErrors(): boolean;
  export function runDiagnostics(): void;
}
