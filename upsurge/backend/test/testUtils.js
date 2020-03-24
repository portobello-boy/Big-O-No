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

const validExprsVars = [
    ['x1'],
    ['x1', 'x2'],
    ['x1'],
    ['x1', 'x2'],
    ['x1', 'x2'],
    ['x1', 'x2'],
    ['x1', 'x2', 'x3'],
    ['x1', 'x2', 'x3'],
];

const invalidParens = [
	"(x1",
	"(x1 and x2))",
	"(x1 and (x2)",
	"((x1 and x2)",
	"(x1 and (x2 and not x3)))"
];

const twoVarAssignments = [
    [false, false],
    [false, true],
    [true, false],
    [true, true]
];

const threeVarAssignments = [
    [false, false, false],
    [false, false, true],
    [false, true, false],
    [false, true, true],
    [true, false, false],
    [true, false, true],
    [true, true, false],
    [true, true, true],
];

module.exports = {
    validExprs,
    validExprsPad,
    validExprsTrees,
    validExprsVars,
    invalidParens,
    twoVarAssignments,
    threeVarAssignments
}
