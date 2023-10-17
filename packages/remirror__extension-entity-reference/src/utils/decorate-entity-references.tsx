import { Decoration } from '@remirror/pm/view';

import { EntityReferenceMetaData } from '../types';
import { findMinMaxRange } from './ranges';

/**
 * Helper function to add decorations for each entity reference and also handles
 */
export const decorateEntityReferences = (
  entityReferences: EntityReferenceMetaData[][],
): Decoration[] => {
  const decorations: Decoration[] = [];

  for (const overlappingEntityReferences of entityReferences) {
    const backgroundShade = Math.min(overlappingEntityReferences.length, 5) / 5;
    const notBlue = 200 * (1 - backgroundShade) + 55;
    const style = `background: rgb(${notBlue}, ${notBlue}, 255);padding: 6px 0;`;
    const [from, to] = findMinMaxRange(overlappingEntityReferences);

    const specs = {
      inclusiveStart: true,
      inclusiveEnd: true,
    };

    // Add decoration to all inline nodes in the given range.
    decorations.push(Decoration.inline(from, to, { style }, specs));
  }

  return decorations;
};

