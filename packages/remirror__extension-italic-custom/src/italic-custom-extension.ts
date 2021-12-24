import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  extension,
  ExtensionTag,
  InputRule,
  keyBinding,
  KeyBindingProps,
  KeyBindings,
  MarkExtension,
  MarkExtensionSpec,
  markInputRule,
  MarkSpecOverride,
  NamedShortcut,
  PrimitiveSelection,
  toggleMark,
} from '@remirror/core';
import { MarkPasteRule } from '@remirror/pm/paste-rules';

import { toggleItalicCustomOptions } from './italic-utils';

/**
 * Add italic formatting to your editor.
 */
@extension({})
export class ItalicCustomExtension extends MarkExtension {
  get name() {
    return 'italicCustom' as const;
  }

  createTags() {
    return [ExtensionTag.FontStyle, ExtensionTag.FormattingMark];
  }

  createMarkSpec(extra: ApplySchemaAttributes, override: MarkSpecOverride): MarkExtensionSpec {
    return {
      ...override,
      attrs: extra.defaults(),

      parseDOM: [
        { tag: 'i', getAttrs: extra.parse },
        { tag: 'em', getAttrs: extra.parse },
        { style: 'font-style=italic' },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (mark) => ['em', extra.dom(mark), 0],
    };
  }

  createKeymap(): KeyBindings {
    return {
      'Mod-i': toggleMark({ type: this.type }),
    };
  }

  createInputRules(): InputRule[] {
    return [
      markInputRule({
        regexp: /(?:^|[^*])\*([^*]+)\*$/,
        type: this.type,
        ignoreWhitespace: true,
        updateCaptured: ({ fullMatch, start }) =>
          !fullMatch.startsWith('*') ? { fullMatch: fullMatch.slice(1), start: start + 1 } : {},
      }),
      markInputRule({
        regexp: /(?:^|[^_])_([^_]+)_$/,
        type: this.type,
        ignoreWhitespace: true,
        updateCaptured: ({ fullMatch, start }) => {
          return !fullMatch.startsWith('_')
            ? { fullMatch: fullMatch.slice(1), start: start + 1 }
            : {};
        },
      }),
    ];
  }

  createPasteRules(): MarkPasteRule[] {
    return [
      { type: 'mark', markType: this.type, regexp: /_([^_]+)_/g },
      { type: 'mark', markType: this.type, regexp: /\*([^*]+)\*/g },
    ];
  }

  /**
   * Toggle the italic formatting on the selected text.
   */
  @command(toggleItalicCustomOptions)
  toggleItalicCustom(selection?: PrimitiveSelection): CommandFunction {
    return toggleMark({ type: this.type, selection });
  }

  /**
   * Attach the keyboard shortcut for formatting.
   */
  @keyBinding({ shortcut: NamedShortcut.Italic, command: 'toggleItalicCustom' })
  shortcut(props: KeyBindingProps): boolean {
    return this.toggleItalicCustom()(props);
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      italicCustom: ItalicCustomExtension;
    }
  }
}
