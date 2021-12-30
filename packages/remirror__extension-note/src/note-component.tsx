import React, { useEffect, useState } from 'react';
import { UploadContext } from '@remirror/core';
import { NodeViewComponentProps, useCommands } from '@remirror/react';
import { ExtensionNoteTheme } from '@remirror/theme';

import type { NoteAttributes } from './note-extension';

export type NoteComponentProps = NodeViewComponentProps & {
  context?: UploadContext;
  abort: () => void;
};

function openNote(url: string | undefined): void {
  // opens url in new tab
  window.open(url, '_blank');
}

export const NoteComponent: React.FC<NoteComponentProps> = ({
  node
}) => {
  const attrs = node.attrs as NoteAttributes;
  return (
    <div className={ExtensionNoteTheme.NOTE_ROOT} onClick={() => openNote(attrs.url)}>
      <p className={ExtensionNoteTheme.NOTE_TITLE}>{attrs.title}</p>
      <p className={ExtensionNoteTheme.NOTE_DESCRIPTION}>{attrs.description}</p>

      <div className={ExtensionNoteTheme.NOTE_FOOTER_WRAPPER}>
        <p className={ExtensionNoteTheme.NOTE_DURATION}>{attrs.duration}</p>
        <p className={ExtensionNoteTheme.NOTE_INTERVIEW_NAME}>{attrs.interviewName}</p>
      </div>
    </div>
  );
};
