import { EntityReferenceMetaData } from '../types';

type EntityReferenceMarkText = Pick<EntityReferenceMetaData, 'text'>;

/**
 * This helper can be used when reacting to clicks on overlapping highlights.
 * In that case, the app should show the shortest entity because longer entities
 * typical have other click areas.
 *
 * @param entityReferences
 * @returns entity references with the shortest text
 */
export const getShortestEntityReference = <T extends EntityReferenceMarkText>(
  entityReferences: T[],
): T | undefined => {
  if (entityReferences.length === 0) {
    return undefined;
  }

  let shortestEntity = entityReferences[0];

  for (let i = 1; i < entityReferences.length; i++) {
    if (entityReferences[i].text.length < shortestEntity.text.length) {
      shortestEntity = entityReferences[i];
    }
  }

  return shortestEntity;
};
