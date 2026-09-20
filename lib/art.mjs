/* Inline SVG product illustrations, one per art type, tinted by colour.
   Pure string building, no dependencies, no DOM.
   To use real photography instead, drop files in assets/products/ and set
   a photo path on the item, see assets/products/README.md. */
import { DEF } from './art-core.mjs';
import { shapesA } from './art-a.mjs';
import { shapesB } from './art-b.mjs';

const shapes = Object.assign({}, shapesA, shapesB);

export const ART_TYPES = Object.keys(shapes);

export const art = (type, hex, uid) => {
  const shape = shapes[type] || shapesB.box;
  return shape(String(uid == null ? 0 : uid), hex || DEF);
};
