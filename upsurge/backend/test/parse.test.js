const parser = require('../parse');

const expr = "(x1 AND (x2 OR x3))";
const parens = parser.checkParens(parser.pad(expr).split(" "));

test("Pad expression ~(b AND c) OR a", () => {
	expect(parser.pad("~(b AND c) OR a")).toBe("( ~ ( b AND c ) OR a )");
});

test("Return parse-tree separation on outer parens of (x1 AND (x2 OR x3))", () => {
	expect(parens).toStrictEqual([['x1'], 'AND', ['(', 'x2', 'OR', 'x3', ')']]);
});

test("Validate that parens are equal in expression (x1 AND (x2 OR x3))", () => {
	expect(parser.validateParens(expr)).toStrictEqual(true);
});

test("Validate that parens are not equal in expression (x1 AND ((x2 OR x3))", () => {
	expect(parser.validateParens("(x1 AND ((x2 OR x3))")).toStrictEqual(false);
});

test("Generate parse tree from expression (x1 AND (x2 OR x3))", () => {
	expect(parser.parse("(x1 AND (x2 OR x3))")).toStrictEqual(['(', ['x1'], 'AND', ['(', ['x2'], 'OR', ['x3'], ')'], ')']);
});
