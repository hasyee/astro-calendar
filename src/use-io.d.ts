// TODO: remove together with use.io
import 'use.io';

declare module 'use.io' {
  export function useDevTools(state: object, options?: { log?: boolean; logPrimitivesOnly?: boolean }): void;
}
