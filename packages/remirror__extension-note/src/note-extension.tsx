import { ComponentType } from 'react';
import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  DOMCompatibleAttributes,
  extension,
  ExtensionPriority,
  ExtensionTag,
  getTextSelection,
  Handler,
  keyBinding,
  KeyBindingProps,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  NodeWithPosition,
  omitExtraAttributes,
  PrimitiveSelection,
  ProsemirrorNode,
  Transaction,
} from '@remirror/core';
import { NodeViewComponentProps } from '@remirror/react';

import { NoteComponent, NoteComponentProps } from './note-component';

export interface NoteOptions {
  render?: (props: NoteComponentProps) => React.ReactElement<HTMLElement> | null;

  /**
   * Called after the `commands.deleteFile` has been called.
   */
  onDeleteFile?: Handler<(props: { tr: Transaction; pos: number; node: ProsemirrorNode }) => void>;
}

/**
 * Adds a file node to the editor
 */
@extension<NoteOptions>({
  defaultOptions: {
    render: NoteComponent,
  },
  handlerKeys: ['onDeleteFile'],
})
export class NoteExtension extends NodeExtension<NoteOptions> {
  get name() {
    return 'note' as const;
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = (props) => {
    return this.options.render({ ...props, abort: () => { }, context: undefined });
  };

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
    return {
      attrs: {
        ...extra.defaults(),
        id: { default: null },
        url: { default: '' },
        title: { default: '' },
        description: { default: '' },
        duration: { default: '' },
        interviewName: { default: '' },
        labels: { default: [] },
        error: { default: null },
      },
      selectable: true,
      draggable: true,
      atom: true,
      content: '',
      ...override,
      parseDOM: [
        {
          tag: 'div[data-note]',
          priority: ExtensionPriority.Low,
          getAttrs: (dom) => {
            const anchor = dom as HTMLAnchorElement;
            const url = anchor.getAttribute('data-url');
            const title = anchor.getAttribute('data-title');
            const description = anchor.getAttribute('data-description');
            const duration = anchor.getAttribute('data-duration');
            const interviewName = anchor.getAttribute('data-interview-name');

            return {
              ...extra.parse(dom),
              url,
              title,
              description,
              duration,
              interviewName,
            };
          },
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        const { url, error, ...rest } = omitExtraAttributes(node.attrs, extra);
        const attrs: DOMCompatibleAttributes = {
          ...extra.dom(node),
          ...rest,
          'data-url': url,
          'data-title': node.attrs.title,
          'data-description': node.attrs.description,
          'data-duration': node.attrs.duration,
          'data-interview-name': node.attrs.interviewName,
        };

        if (error) {
          attrs['data-error'] = error;
        }

        return ['div', attrs];
      },
    };
  }

  @command()
  insertNote(attributes: NoteAttributes, selection?: PrimitiveSelection): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create(attributes);

      dispatch?.(tr.replaceRangeWith(from, to, node));

      return true;
    };
  }

  @command()
  deleteFile(pos: number): CommandFunction {
    return ({ tr, state, dispatch }) => {
      const node = state.doc.nodeAt(pos);

      if (node && node.type === this.type) {
        tr.delete(pos, pos + 1).scrollIntoView();
        this.options.onDeleteFile({ tr, pos, node });
        dispatch?.(tr);
        return true;
      }

      return false;
    };
  }

  @keyBinding({ shortcut: ['Backspace', 'Delete'] })
  backspaceShortcut(props: KeyBindingProps): boolean {
    const { tr, state } = props;
    const { from, to, empty } = tr.selection;

    if (!this.hasHandlers('onDeleteFile') || empty) {
      return false;
    }

    // Collect a list of files nodes contained within this delete range
    const onDeleteFileCallbacks: NodeWithPosition[] = [];
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type === this.type) {
        onDeleteFileCallbacks.push({ node, pos });
      }

      return true;
    });

    // Call the onDeleteFile callback for each file being deleted.
    onDeleteFileCallbacks.forEach(({ node, pos }) => {
      this.options.onDeleteFile({ tr, node, pos });
    });

    // Don't need to handle the delete ourselves, just the callbacks
    return false;
  }
}

export interface NoteAttributes {
  /**
   * Unique identifier for a note
   */
  id?: unknown;

  /**
   * URL where the clipping
   */
  url?: string;

  /**
   * title of the note
   */
  title?: string;

  /**
   * Mime type of the file, e.g. "image/jpeg"
   */
  description?: string;

  /**
   * duration of note
   */
  duration?: string;

  /**
   * name of the interview
   */
  interviewName?: string;

  /**
   * Error state for the file, e.g. upload failed
   */
  error?: string | null;
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      note: NoteExtension;
    }
  }
}
