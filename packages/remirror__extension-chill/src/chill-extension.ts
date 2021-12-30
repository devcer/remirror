import { extension, PlainExtension } from '@remirror/core';

export interface ChillOptions {}

/**
 * The time to be chill.
 */
@extension<ChillOptions>({})
export class ChillExtension extends PlainExtension<ChillOptions> {
  get name() {
    return 'chill' as const;
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      template: ChillExtension;
    }
  }
}
