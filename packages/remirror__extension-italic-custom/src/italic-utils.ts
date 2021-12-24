import { ExtensionItalicMessages as Messages } from '@remirror/messages';

export const toggleItalicCustomOptions: Remirror.CommandDecoratorOptions = {
  icon: 'italic',
  label: ({ t }) => t(Messages.LABEL),
  description: ({ t }) => t(Messages.DESCRIPTION),
};
