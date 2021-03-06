var parser = require('./parse');
var operators = require('./utility')
var error = require('./error');

// Input: string
// Output: array of strings
// Take a boolean expression and determine the variables inside
function getVars(s)
{
	try {
		let temp = s.replace(/[()]/g, ' ').trim();
		temp = temp.replace(/\s\s+/g, ' ');
		temp = temp.split(' ');

		for (let i = 0; i < temp.length; ++i) {
			if (operators.binOps.has(temp[i]) || operators.unOps.has(temp[i])) {
				temp.splice(i, 1);
				--i;
			}
		}

		return Array.from(new Set(temp));
	} catch (err) {
		console.log("ERROR: getVars");
		console.log(err);
		if (err.val)
			throw err;
		throw new error.Err(6);
	}
}

// Input: number n (integer)
// Output: Array of arrays of 2^n truth values
// Given a number of variables, generate all possible true-false assignments
function genVals(n)
{
	if (n <= 0 || !Number.isInteger(n))
		throw new error.Err(7);

	try {
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
	} catch (err) {
		console.log("ERROR: genVals");
		console.log(err);
		if (err.val)
			throw err;
		throw new error.Err(7);
	}
}

// Input: array of strings, array of boolean values, optional array of objects to default
// Output: object
// Map variable in vars to truth value in assigns
function assign(vars, assigns, defaults = {})
{
	try {
		var assignments = {};
		for (let i = 0; i < vars.length; ++i) {
			assignments[vars[i]] = assigns[i];
		}

		for (variable in defaults) {
			if (assignments[variable] != defaults[variable])
				return false;
		}
		return assignments;
	} catch (err) {
		console.log("ERROR: assign");
		console.log(err);
		if (err.val)
			throw err;
		throw new error.Err(8);
	}
}

// Input: array of binary expression
// Output: boolean
// Evaluate an expression from an array
function evalStatement(arr)
{
	// console.log("Evaluating:", arr);
	try {
		if (operators.notSet.has(arr[0]))  		return Boolean(!(arr[1][0]));
		else if (operators.andSet.has(arr[0]))  return Boolean(arr[1][0] & arr[2][0]);
		else if (operators.xorSet.has(arr[0]))  return Boolean(arr[1][0] ^ arr[2][0]);
		else if (operators.orSet.has(arr[0]))   return Boolean(arr[1][0] | arr[2][0]);
		else if (operators.nandSet.has(arr[0])) return !Boolean(arr[1][0] & arr[2][0]);
		else if (operators.norSet.has(arr[0]))  return !Boolean(arr[1][0] | arr[2][0]);
		else if (operators.xnorSet.has(arr[0])) return !Boolean(arr[1][0] ^ arr[2][0]);
	} catch (err) {
		console.log("ERROR: evalStatement");
		console.log(err);
		if (err.val)
			throw err;
		throw new error.Err(9);
	}
}

// Input: parse tree, one assignment of variables
// Output: boolean
// Evaluate a parse tree against a true-false assignment of variables
function evalTree(tree, assignment)
{
	try {
		if (tree.length == 5) { // Binary expression inside of parentheses
			var side1 = evalTree(tree[1], assignment);
			var side2 = evalTree(tree[3], assignment);
			return [evalStatement([tree[2], side1, side2])];
		} else if (tree.length == 2) { // Unary expression (not)
			var side1 = evalTree(tree[1], assignment);
			return [evalStatement([tree[0], side1])]
		} else if (tree.length == 1) { // Single variable
			return [assignment[tree[0]]];
		} else {
			throw new error.Err(11);
		}
	} catch (err) {
		console.log("ERROR: evalTree");
		console.log(err);
		if (err.val)
			throw err;
		throw new error.Err(10);
	}
}

// Input: string of boolean expression, optional array of assignments to default
// Output: object
// Evaluate a boolean expression string, return object with truth values for variables and output
function evalExpression(exp, defaultVars = [], defaultAssigns = {})
{
	try {
		let tree, vars, values, table;

		tree = parser.parse(exp);
		defaultVars.length == 0 ? vars = getVars(exp) : vars = defaultVars;
		values = genVals(vars.length);
		table = {};

		for (let i = 0; i < vars.length; ++i)
			table[vars[i]] = [];
		table[exp] = [];

		for (let i = 0; i < values.length; ++i) {
			assignment = assign(vars, values[i], defaultAssigns);
			if (!assignment) {
				continue;
			}

			result = evalTree(tree, assignment);

			for (let j = 0; j < vars.length; ++j) {
				table[vars[j]].push(assignment[vars[j]]);
			}
			table[exp].push(result[0]);
		}

		return table;
	} catch (err) {
		console.log("ERROR: evalExpression");
		console.log(err);
		if (err.val)
			throw err;
		throw new error.Err(12);
	}
}

// console.log(evalExpression("not x1"))

module.exports = {
	getVars,
	genVals,
	assign,
	evalStatement,
	evalTree,
	evalExpression
};
