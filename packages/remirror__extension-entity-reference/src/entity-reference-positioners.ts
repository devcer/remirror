import type { Coords } from '@remirror/core';
import type { Positioner } from '@remirror/extension-positioner';
import { selectionPositioner } from '@remirror/extension-positioner';

import type { EntityReferenceMetaData } from './types';

type MinimalEntityReference = Pick<EntityReferenceMetaData, 'from' | 'to'> & {
  text: string | undefined;
};

/**
 * Render a positioner that captures the selected entityReference.
 *
 * @remarks
 *
 * This extends the selection positioner. The difference is that the from and to
 * coordinates are picked from the shortest entity reference selected.
 */
export const centeredEntityReferencePositioner: Positioner<{ from: Coords; to: Coords }> =
  selectionPositioner.clone({
    getActive: (props) => {
      const { state, view, helpers } = props;

      if (state.selection.empty) {
        const entityReferences: MinimalEntityReference[] = helpers.getEntityReferencesAt(
          state.selection.from,
        );

        if (entityReferences.length > 0) {
          const shortestEntityReference = entityReferences.sort(
            (entityReference1, entityReference2) =>
              (entityReference1.text?.length || 0) - (entityReference2.text?.length || 0),
          )[0];

          if (shortestEntityReference) {
            const from: Coords = view.coordsAtPos(shortestEntityReference.from);
            const to: Coords = view.coordsAtPos(shortestEntityReference.to);
            return [{ from, to }];
          }
        }
      }

      return [];
    },
  });
