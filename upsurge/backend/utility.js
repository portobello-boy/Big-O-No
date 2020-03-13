const andSet = new Set(['AND', 'and', '&', '∧', '·']);
const orSet = new Set(['OR', 'or', '|', '∨', '+']);
const xorSet = new Set(['XOR', 'xor', '^', '⊕']);
const notSet = new Set(['NOT', 'not', '~', '!']);

const binOps = new Set([...andSet, ...orSet, ...xorSet]);
const unOps = new Set([...notSet]);

module.exports = {
  andSet: andSet,
  orSet: orSet,
  xorSet: xorSet,
  notSet: notSet,
  binOps: binOps,
  unOps: unOps
};
