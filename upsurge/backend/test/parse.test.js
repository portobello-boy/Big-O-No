const parser = require('../parse');

const validExprs = [
	"x1",
	"(x1 and x2)",
	"not x1",
	"not (x1 and x2)",
	"(not x1 and x2)", 
	"(x1 and not x2)",
	"((x1 and x2) and not x3)",
	"(x1 AND (x2 OR x3))"
];

const validExprsPad = [
	"x1",
	"( x1 and x2 )",
	"not x1",
	"not ( x1 and x2 )",
	"( not x1 and x2 )", 
	"( x1 and not x2 )",
	"( ( x1 and x2 ) and not x3 )",
	"( x1 AND ( x2 OR x3 ) )"
];

const validExprsTrees = [
	['x1'],
	['(', ['x1'], 'and', ['x2'], ')'],
	['not', ['x1']],
	['not', ['(', ['x1'], 'and', ['x2'], ')']],
	['(', ['not', ['x1']], 'and', ['x2'], ')'],
	['(', ['x1'], 'and', ['not', ['x2']], ')'],
	['(', ['(', ['x1'], 'and', ['x2'], ')'], 'and', ['not', ['x3']], ')'],
	['(', ['x1'], 'AND', ['(', ['x2'], 'OR', ['x3'], ')'], ')']
];

const invalidParens = [
	"(x1",
	"(x1 and x2))",
	"(x1 and (x2)",
	"((x1 and x2)",
	"(x1 and (x2 and not x3)))"
];

console.log("List of valid expressions:", validExprs);

for (let i = 0; i < validExprs.length; ++i) {
	test("Test pad function", () => {
		expect(parser.pad(validExprs[i])).toMatch(validExprsPad[i]);
	});

	test("Test parse function", () => {
		expect(parser.parse(validExprs[i])).toStrictEqual(validExprsTrees[i]);
	});

	test("Test paren validation", () => {
		expect(parser.validateParens(validExprs[i])).toBeTruthy();
	});
}

for (let i = 0; i < invalidParens.length; ++i) {
	test("Find invalid parens", () => {
		expect(parser.validateParens(invalidParens[i])).toBeFalsy();
	});

	test("Parse fails on invalid parens", () => {
		expect(parser.parse(invalidParens[i])).toMatch("ERROR: Parentheses do not match up");
	});
}
