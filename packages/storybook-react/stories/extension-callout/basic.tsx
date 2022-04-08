import 'remirror/styles/all.css';

import { useCallback } from 'react';
import { htmlToProsemirrorNode } from 'remirror';
import { BlockquoteExtension, CalloutExtension } from 'remirror/extensions';
import { Remirror, ThemeProvider, useActive, useCommands, useRemirror } from '@remirror/react';

const BlockquoteButton = () => {
  const commands = useCommands();
  const active = useActive(true);
  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => commands.toggleBlockquote()}
      className={active.blockquote() && 'active'}
    >
      Blockquote
    </button>
  );
};


const Basic = (): JSX.Element => {
  const basicExtensions = useCallback(() => [new CalloutExtension(), new BlockquoteExtension()], []);
  const { manager, state, onChange } = useRemirror({
    extensions: basicExtensions,
    content:
      '<div data-callout-type="info"><p>Info callout</p></div><p />' +
      '<div data-callout-type="warning"><p>Warning callout</p></div><p />' +
      '<div data-callout-type="error"><p>Error callout</p></div><p />' +
      '<div data-callout-type="success"><p>Success callout</p></div>',
    stringHandler: htmlToProsemirrorNode,
  });

  return (
    <ThemeProvider>
      <Remirror
        manager={manager}
        autoFocus
        onChange={onChange}
        initialContent={state}
        autoRender='end'
      >
        <BlockquoteButton />
      </Remirror>
    </ThemeProvider>
  );
};

export default Basic;
