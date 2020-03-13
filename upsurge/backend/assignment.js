// const binOps = new Set(['AND', 'OR', 'XOR']);
// const unOps = new Set(['NOT']);

// import { andSet, orSet, xorSet, notSet, binOps, unOps } from './utility'; 

var parse = require('./parse');
var operators = require('./utility')

// Input: string
// Output: array of strings
// Take a boolean expression and determine the variables inside
function getVars(s)
{
	let temp = s.replace(/[()]/g, ' ').trim();
	temp = temp.replace(/\s\s+/g, ' ');
	temp = temp.split(' ');

	console.log(temp);

	for (let i = 0; i < temp.length; ++i) {
		if (operators.binOps.has(temp[i]) || operators.unOps.has(temp[i])) {
			temp.splice(i, 1);
			--i;
		}
	}

	console.log("temp:", temp);

	return Array.from(new Set(temp));
}

// Input: number n (integer)
// Output: Array of arrays of 2^n truth values
// Given a number of variables, generate all possible true-false assignments
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

// Input: array of strings, array of boolean values
// Output: object
// Map variable in vars to truth value in assigns
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

// Input: array of binary expression
// Output: boolean
// Evaluate an expression from an array
function evalStatement(arr)
{
	console.log("Evaluating:", arr);
	if (operators.notSet.has(arr[0])) return Boolean(!(arr[1][0]));
	if (operators.andSet.has(arr[0])) return Boolean(arr[1][0] & arr[2][0]);
	if (operators.xorSet.has(arr[0])) return Boolean(arr[1][0] ^ arr[2][0]);
	if (operators.orSet.has(arr[0]))  return Boolean(arr[1][0] | arr[2][0]);
}

// Input: parse tree, one assignment of variables
// Output: boolean
// Evaluate a parse tree against a true-false assignment of variables
function evalTree(tree, assignment)
{
	// console.log(tree, tree.length);
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

// Input: string of boolean expression
// Output: object
// Evaluate a boolean expression string, return object with truth values for variables and output
function evalExpression(exp)
{
	tree = parse(exp);
	vars = getVars(exp);
	values = genVals(vars.length);
	table = {};

	for (let i = 0; i < vars.length; ++i)
		table[vars[i]] = [];
	table[exp] = [];

	for (let i = 0; i < values.length; ++i) {
		assignment = assign(vars, values[i]);
		result = evalTree(tree, assignment);
		console.log(assignment, result);

		for (let j = 0; j < vars.length; ++j) {
			table[vars[j]].push(assignment[vars[j]]);
		}
		table[exp].push(result[0]);
	}

	return table;
}

// console.log(operators.andSet);
// console.log(operators.orSet);
// console.log(operators.xorSet);
// console.log(operators.notSet);

// statement = "(!(x1 ∧((x2 AND ~ x3) & x2)) · (x1 ⊕ x3))";
// vars = getVars(statement);
// console.log(vars);
// // tree = parse("(NOT(x1 AND((x2 AND NOT x3) AND x2)) AND (x1 OR x3))");
// tree = parse(statement);
// console.log(JSON.stringify(tree));

// values = genVals(3);
// console.log(statement);

// for (let i = 0; i < values.length; ++i) {
// 	assignments = assign(vars, values[i]);
// 	console.log(assignments);
// 	console.log(evalTree(tree, assignments));
// }

// console.log(evalExpression(statement, vars));

module.exports = evalExpression;
