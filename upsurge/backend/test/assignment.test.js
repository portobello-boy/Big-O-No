const assign = require('../assignment');
const testUtils = require('./testUtils');

for (let i = 0; i < testUtils.validExprs; ++i) {
    test("Get variables for expression", () => {
        expect(assign.getVars(testUtils.validExprs[i])).toStrictEqual(testUtils.validExprsVars[i]);
    });
}

for (let i = 0; i < testUtils.twoVarAssignments; ++i) {
    test("Generate all true-false assignment for 2 variables", () => {
        expect(assign.genVals(2)[i]).toStrictEqual(twoVarAssignments[i]);
    });
}

for (let i = 0; i < testUtils.threeVarAssignments; ++i) {
    test("Generate all true-false assignment for 3 variables", () => {
        expect(assign.genVals(3)[i]).toStrictEqual(threeVarAssignments[i]);
    });
}

test("Assign to variables ['x1'] the values [false]", () => {
	expect(assign.assign(['x1'], [false])).toStrictEqual({
		'x1': false
	});
});

test("Assign to variables ['x1'] the values [true]", () => {
	expect(assign.assign(['x1'], [true])).toStrictEqual({
		'x1': true
	});
});

test("Assign to variables ['x1', 'x2', 'x3'] the values [true, false, true]", () => {
	expect(assign.assign(['x1', 'x2', 'x3'], [true, false, true])).toStrictEqual({
		'x1': true,
		'x2': false,
		'x3': true
	});
});

test("Evaluate expression tree ['(', [ '(', [ 'x1' ], 'AND', [ 'x2' ], ')' ], 'XOR', [ 'x3' ], ')'] for expression '(x1 AND x2) XOR x3' against the assignment {'x1': true, 'x2': false, 'x3': true}", () => {
	expect(assign.evalTree(['(', [ '(', [ 'x1' ], 'AND', [ 'x2' ], ')' ], 'XOR', [ 'x3' ], ')'], {'x1': true, 'x2': false, 'x3': true})).toStrictEqual([true]);
});

test("Generate truth table for expression ((x1 AND x2) XOR x3)", () => {
	expect(assign.evalExpression("((x1 AND x2) XOR x3)")).toStrictEqual({
		'x1': [false, false, false, false, true, true, true, true],
		'x2': [false, false, true, true, false, false, true, true],
		'x3': [false, true, false, true, false, true, false, true],
		'((x1 AND x2) XOR x3)': [false, true, false, true, false, true, true, false]
	});
});
