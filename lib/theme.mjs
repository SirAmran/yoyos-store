/* The full stylesheet, assembled from the modules. */
import { tokens } from './tokens.mjs';
import { ui } from './ui.mjs';
import { head } from './head.mjs';
import { drawer } from './drawer.mjs';
import { foot } from './foot.mjs';
import { hero } from './hero.mjs';
import { pdp } from './pdp.mjs';
import { checkout } from './checkout.mjs';

export const css = [tokens, ui, head, drawer, foot, hero, pdp, checkout].join('\n');
