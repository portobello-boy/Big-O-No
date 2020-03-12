
var parse = require('./parse');

// n -> number of variables
// return -> array of arrays of assignments (bools)
function genVals(n)
{
	if (n <= 0) {
		console.log("ERROR:", n, "<= 0");
		return;
	} else if (!Number.isInteger(n)) {
		console.log("ERROR:", n, "is not an integer");
		return;
	}

	vals = [];
	for (let i = 0; i < Math.pow(2, n); ++i) {
		arr = [];
		str = parseInt(i.toString(), 10).toString(2).padStart(n, '0');
		str.split('').forEach(val => 
			arr.push(!!+val) // This is disgusting, convert strings '0' and '1' to bool
		);
		vals.push(arr);
	}

	return vals;
}

function assign(vars, assigns)
{
	if (vars.length != assigns.length) {
		console.log("ERROR: Different number of assignments and variables");
		return {};
	}
	var assignments = {};
	for (let i = 0; i < vars.length; ++i) {
		assignments[vars[i]] = assigns[i];
	}
	return assignments;
}

function evalStatement(arr)
{
	if (arr[0] == "NOT") return !(arr[1][0]);
	if (arr[0] == "AND") return (arr[1][0] & arr[2][0]);
	if (arr[0] == "XOR") return (arr[1][0] ^ arr[2][0]);
	if (arr[0] == "OR")  return (arr[1][0] | arr[2][0]);
}

function evalTree(tree, assignment)
{
	//console.log("Tree length:", tree.length);
	//console.log(assignment);
	//console.log(tree);
	if (tree.length == 5) { // Binary expression inside of parentheses
		var side1 = evalTree(tree[1], assignment);
		var side2 = evalTree(tree[3], assignment);
		return [evalStatement([tree[2], side1, side2])];
	} else if (tree.length == 2) { // Unary expression (not)
		var side1 = evalTree(tree[1], assignment);
		return [evalStatement([tree[0], side1])]
	} else if (tree.length == 1) { // Single variable
		return [assignment[tree[0]]];
	}
}

vars = ["x1", "x2", "x3"];
statement = "(NOT(x1 AND((x2 AND NOT x3) AND x2)) AND (x1 OR x3))";
//tree = parse("(NOT(x1 AND((x2 AND NOT x3) AND x2)) AND (x1 OR x3))");
tree = parse(statement);

values = genVals(3);
console.log(statement);

for (let i = 0; i < values.length; ++i) {
	assignments = assign(vars, values[i]);
	console.log(assignments);
	console.log(evalTree(tree, assignments));
}
