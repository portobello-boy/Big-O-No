var operators = require('./utility')

// Input: string
// Output: string
// Wrap a boolean expression s with parentheses, and wrap each parenthesis with spaces
function pad(s)
{
	// Ensure the expression is wrapped in parentheses
	if (s[0] != '(' || s[s.length-1] != ')') {
		s = '(' + s.concat(')');
	}

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
}

// Input: array of strings
// Output: array of strings
// Return a sub-expression between parentheses with exactly one binary operation
function checkParens(s)
{
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

	return [undefined, undefined, undefined];
}

// Input: string
// Output: string
// Ensure that the count of open and close parentheses match
function validateParens(s)
{
	let stack = [];
	for (let i = 0; i < s.length; ++i) {
		if (s[i] == '(')
			stack.push('(');
		if (s[i] == ')')
			stack.pop();
	}

	return stack.length == 0;
}

// Input: string or array of strings
// Output: parse tree
// Convert a string into a binary parse tree
function parse(s)
{
	if (s.length == 0) // Ensure that there is something to be parsed
		return [];

	if (typeof(s) == "string") { // If a string is passed in
		if (!validateParens(s)) { // Validate parentheses
			console.log("ERROR: Parentheses don't match up");
			return "ERROR: Parentheses don't match up";
		}
		exp = pad(s); // Pad string
		exp = exp.split(" "); // Tokenize on spaces, exp is array of strings
	} else {
		exp = s;
	}

	// Initialize variables for either side of an expression
	var c1 = [];
	var c2 = [];

	if (operators.unOps.has(exp[0])) { // If we see a unary operator
		unary = exp[0];
		c1 = parse(exp.slice(1)); // Parse everything to the right
		r = c1.length ? [unary, c1] : [];
		return r;
	}

	if (exp[0] == '(' && exp[exp.length-1] == ')') { // If the expression is wrapped in parentheses
		var arr = checkParens(exp); // Separate the sides of a binary operation
		if (arr.indexOf(undefined) >= 0 || arr.indexOf('') >= 0) {
			return [];
		} else {
			c1 = parse(arr[0]); // Parse left
			c2 = parse(arr[2]); // Parse right
			if (c1.length && c2.length) {
				r = ['(', c1, arr[1], c2, ')'];
				return r;
			}
			else {
				return [];
			}
		}
	} else
		return exp; // Return variable
}

// console.log(parse("(NOT(x1 AND((x2 AND NOT x3) AND x2)) AND (x1 OR x3))"));

module.exports = parse
