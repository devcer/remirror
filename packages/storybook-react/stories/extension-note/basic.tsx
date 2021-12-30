import 'remirror/styles/extension-file.css';

import { useCallback } from 'react';
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  DropCursorExtension,
  EmojiExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension, LinkExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  PlaceholderExtension,
  TaskListExtension,
  UnderlineExtension,
} from 'remirror/extensions';
import { NoteExtension } from '@remirror/extension-note';
import { Remirror, ThemeProvider, useCommands, useRemirror } from '@remirror/react';


const DummyNoteObject = {
  id: null,
  url: 'https://app.heymarvin.com/annotation_tool/event/250a71fb-de29-44b2-bd9f-16c5e44f90bf/',
  title: 'What do you like the most?',
  description: 'People have been asking for a way to sort the order of playlist. This has been asked before this also.',
  duration: '1m 50s',
  interviewName: 'Talk with lattice',
  error: null,
}

const AddNoteButton = () => {
  const commands = useCommands();
  return <button onClick={() => commands.insertNote(DummyNoteObject)}>Insert</button>;
};


const Basic = (): JSX.Element => {
  const extensions = useCallback(() => [
    new NoteExtension({}),
    new DropCursorExtension(),
    new BoldExtension(),
    new ItalicExtension(),
    new CalloutExtension(),
    new LinkExtension({ autoLink: true }),
    new UnderlineExtension(),
    new BlockquoteExtension(),
    new HorizontalRuleExtension(),
    new BulletListExtension(),
    new OrderedListExtension(),
    new TaskListExtension(),
    new ImageExtension({ enableResizing: true }),
    new NodeFormattingExtension(),
    new HeadingExtension(),
    // new PlaceholderExtension({ placeholder: `Type : to insert emojis` }),
  ], []);
  const { manager, state, onChange } = useRemirror({ extensions, content });

  return (
    <>
      <p>
        Default Implementation. Uses <code>FileReader.readAsDataURL</code> under the hood.
      </p>
      <ThemeProvider>
        <Remirror manager={manager} initialContent={state} autoRender autoFocus
          onChange={onChange}
        >
          <AddNoteButton />
        </Remirror>
      </ThemeProvider>
    </>
  );
};

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Drag and drop one or multiple non-image files into the editor.',
        },
      ],
    },
    {
      type: 'note',
      attrs: {
        id: null,
        url: 'https://app.heymarvin.com/annotation_tool/event/250a71fb-de29-44b2-bd9f-16c5e44f90bf/',
        title: 'What do you like the most?',
        description: 'People have been asking for a way to sort the order of playlist. This has been asked before this also.',
        duration: '1m 50s',
        interviewName: 'Talk with lattice',
        error: null,
      },
    },
  ],
};

export default Basic;
