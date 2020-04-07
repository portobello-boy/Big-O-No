let operators = require('./utility')
let error = require('./error')

// Input: string
// Output: string
// Wrap a boolean expression s with parentheses, and wrap each parenthesis with spaces
function pad(s)
{
	try {
		// Pad spaces around every set of parentheses
		for (let i = 0; i < s.length; ++i) {
			if (i != 0 && s[i-1] != ' ' && s[i] == '(') {
				s = [s.slice(0, i), " ", s.slice(i)].join('');
				++i;
			} 
			if (s[i] == '(' && s[i+1] != ' ') {
				s = [s.slice(0, i+1), " ", s.slice(i+1)].join('');
				++i;
			} 
			if (s[i-1] != ' ' && s[i] == ')') {
				s = [s.slice(0, i), " ", s.slice(i)].join('');
				++i;
			}

			if (i != s.length-1 && s[i] == ')' && s[i+1] != ' ') {
				s = [s.slice(0, i+1), " ", s.slice(i+1)].join('');
				++i;
			}
		}
		return s;
	} catch (err) {
		console.log("ERROR: pad");
		console.log(err.message);
		if (err.val)
			throw err;
		throw new error.Err(1);
	}
}

// Input: array of strings
// Output: array of strings
// Return a sub-expression between parentheses with exactly one binary operation
function checkParens(s)
{
	console.log(s);
	try {
		stack = [];
		length = 0;
		for (let i = 0; i < s.length; ++i) {
			if (s[i] == '(') {
				stack.push('(');
			} else if (s[i] == ')' && stack.length) {
				stack.pop();
			} else if (stack.length == 1 && operators.binOps.has(s[i])) {
				return [s.slice(1, i), (s.slice(i, i+1))[0], s.slice(i+1, s.length-1)];
			}
		}

		throw new Error("Error checking parens");
	} catch (err) {
		console.log("ERROR: checkParens");
		console.log("Given:", s);
		console.log(err.message);
		if (err.val)
			throw err;
		throw new error.Err(2);
	}
}

// Input: string
// Output: boolean
// Ensure that the count of open and close parentheses match
function validateParens(s)
{
	try {
		let count = 0;
		for (let i = 0; i < s.length; ++i) {
			if (s[i] == '(')
				++count;
			if (s[i] == ')')
				--count;
		}

		return count == 0;
	} catch (err) {
		console.log("ERROR: validateParens");
		console.log(err.message);
		if (err.val)
			throw err;
		throw new error.Err(3);
	}
}

// Input: string or array of strings
// Output: parse tree
// Convert a string into a binary parse tree
function parse(s)
{
	console.log(s);
	try {
		if (s.length == 0) // Ensure that there is something to be parsed
			return [];

		if (typeof(s) == "string") { // If a string is passed in
			if (!validateParens(s)) { // Validate parentheses
				throw new error.Err(3);
			}
			exp = pad(s); // Pad string
			exp = exp.split(" "); // Tokenize on spaces, exp is array of strings
		} else {
			exp = s;
		}

		// Initialize variables for either side of an expression
		let c1 = [];
		let c2 = [];

		if (operators.unOps.has(exp[0])) { // If we see a unary operator
			unary = exp[0];
			c1 = parse(exp.slice(1)); // Parse everything to the right
			return c1.length ? [unary, c1] : [];
		}

		if (exp[0] == '(' && exp[exp.length-1] == ')') { // If the expression is wrapped in parentheses
			let arr = checkParens(exp); // Separate the sides of a binary operation
			// if (typeof(arr) == "string") {
			// 	return "ERROR: Non-matching parentheses, or more than one connective between parentheses";
			// } else {
			c1 = parse(arr[0]); // Parse left
			c2 = parse(arr[2]); // Parse right
			if (c1.length && c2.length) {
				r = ['(', c1, arr[1], c2, ')'];
				return r;
			}
			else {
				throw new error.Err(4);
			}
			// }
		} else
			return exp; // Return variable
	} catch (err) {
		console.log("ERROR: parse");
		console.log(err.message);
		if (err.val)
			throw err;
		throw new error.Err(5);
	}
}

module.exports = {
	pad,
	checkParens,
	validateParens,
	parse,
}
