const parser = require('../parse');
const testUtils = require('./testUtils');

console.log("List of valid expressions:", testUtils.validExprs);

for (let i = 0; i < testUtils.validExprs.length; ++i) {
	test("Test pad function", () => {
		expect(parser.pad(testUtils.validExprs[i])).toMatch(testUtils.validExprsPad[i]);
	});

	test("Test parse function", () => {
		expect(parser.parse(testUtils.validExprs[i])).toStrictEqual(testUtils.validExprsTrees[i]);
	});

	test("Test paren validation", () => {
		expect(parser.validateParens(testUtils.validExprs[i])).toBeTruthy();
	});
}

for (let i = 0; i < testUtils.invalidParens.length; ++i) {
	test("Find invalid parens", () => {
		expect(parser.validateParens(testUtils.invalidParens[i])).toBeFalsy();
	});

	test("Parse fails on invalid parens", () => {
		expect(parser.parse(testUtils.invalidParens[i])).toMatch("ERROR: Parentheses do not match up");
	});
}
