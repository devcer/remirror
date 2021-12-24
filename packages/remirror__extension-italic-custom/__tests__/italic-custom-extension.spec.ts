import { extensionValidityTest, renderEditor } from 'jest-remirror';
import { BoldExtension } from 'remirror/extensions';

import { ItalicCustomExtension } from '../';

extensionValidityTest(ItalicCustomExtension);

describe('inputRules', () => {
  it('makes text italic with `_`', () => {
    const {
      add,
      nodes: { doc, p },
      marks: { italicCustom },
    } = renderEditor([new ItalicCustomExtension()]);

    add(doc(p('<cursor>')))
      .insertText('Text _italic_')
      .callback((content) => {
        expect(content.doc.toJSON()).toEqual(doc(p('Text ', italicCustom('italic'))).toJSON());
      })
      .insertText(' more')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(
          doc(p('Text ', italicCustom('italic'), ' more')),
        );
      });
  });

  it('makes text italic with `*`', () => {
    const {
      add,
      nodes: { doc, p },
      marks: { italicCustom },
    } = renderEditor([new ItalicCustomExtension()]);

    add(doc(p('<cursor>')))
      .insertText('Text *italic*')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(doc(p('Text ', italicCustom('italic'))));
      })
      .insertText(' more')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(
          doc(p('Text ', italicCustom('italic'), ' more')),
        );
      });
  });

  it('should not match only whitespace', () => {
    const {
      add,
      nodes: { doc, p },
    } = renderEditor([new CustomExtension()]);

    add(doc(p('<cursor>')))
      .insertText('_    _')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(doc(p('_    _')));
      })
      .insertText('\n_ * *')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(doc(p('_    _\n'), p('_ * *')));
      });
  });

  it('should not make text italic with mixed `*_` characters', () => {
    const {
      add,
      nodes: { doc, p },
    } = renderEditor([new ItalicCustomExtension()]);

    add(doc(p('<cursor>')))
      .insertText('Text *oops_')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(doc(p('Text *oops_')));
      })
      .insertText('\n _oh*')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(doc(p('Text *oops_\n'), p(' _oh*')));
      });
  });

  it('supports nested input rule matches', () => {
    const {
      add,
      nodes: { doc, p },
      marks: { bold, italicCustom },
    } = renderEditor([new BoldExtension(), new ItalicCustomExtension()]);

    add(doc(p('_**bold italic<cursor>')))
      .insertText('**')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(doc(p('_', bold('bold italic'), '<cursor>')));
      })
      .insertText('_')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(
          doc(p(italicCustom(bold('bold italic')), '<cursor>')),
        );
      })
      .insertText(' more')
      .callback((content) => {
        expect(content.doc).toEqualRemirrorDocument(
          doc(p(italicCustom(bold('bold italic')), ' more')),
        );
      });
  });
});
