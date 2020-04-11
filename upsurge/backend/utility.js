const andSet = new Set(['AND', 'and', '&', '∧', '·']);
const orSet = new Set(['OR', 'or', '|', '∨', '+']);
const xorSet = new Set(['XOR', 'xor', '^', '⊕']);
const notSet = new Set(['NOT', 'not', '~', '!']);
const nandSet = new Set(['NAND', 'nand']);
const norSet = new Set(['NOR', 'nor']);
const xnorSet = new Set(['XNOR', 'xnor'])

const binOps = new Set([...andSet, ...orSet, ...xorSet, ...nandSet, ...norSet, ...xnorSet]);
const unOps = new Set([...notSet]);

module.exports = {
  andSet: andSet,
  orSet: orSet,
  xorSet: xorSet,
  notSet: notSet,
  nandSet: nandSet,
  norSet: norSet,
  xnorSet: xnorSet,
  binOps: binOps,
  unOps: unOps
};
