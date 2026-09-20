/* The browser client, assembled from its four parts into one IIFE.
   STORE is injected here so it stays inside the closure, not on window. */
import { client1 } from './client-1.mjs';
import { client2 } from './client-2.mjs';
import { client3 } from './client-3.mjs';
import { client4 } from './client-4.mjs';

const parts = [client1, client2, client3, client4];

export const client = (store) =>
  '(function(){\n  "use strict";\n  var STORE = ' +
  JSON.stringify(store) +
  ';\n' +
  parts.join('\n') +
  '\n})();';
