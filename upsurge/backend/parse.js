const binOps = new Set(['AND', 'OR', 'XOR']);
const unOps = new Set(['NOT']);

// Pad s with spaces 
function pad(s)
{
	for (let i = 0; i < s.length; ++i) {
		//console.log(s);
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
	//console.log(s);
	return s;
}

function checkConnective(s)
{
	arr = Array.from(binOps);
	for (let i = 0; i < arr.length; ++i) {
		if (s.indexOf(arr[i]) == 0) {
			return arr[i].length;
		}
	}
	return 0;
}

function checkParens(s)
{
	stack = [];
	length = 0;
	for (let i = 0; i < s.length; ++i) {
		if (s[i] == '(')
			stack.push('(');
		else if (s[i] == ')' && stack.length)
			stack.pop();
		else if (stack.length == 1 && (length = checkConnective(s.slice(i))) > 0) {
			return [s.slice(1, i), s.slice(i, i+length), s.slice(i+length, s.length-1)];
		}
	}

	return [undefined, undefined, undefined];
}

function parse(s)
{
	if (s.length == 0)
		return [];

	if (typeof(s) == "string") {
		exp = pad(s);
		exp = exp.split(" ");
	} else {
		exp = s;
	}

	var c1 = [];
	var c2 = [];

	console.log(exp);

	if (unOps.has(exp[0])) {
		console.log("First character is", exp[0]);
		c1 = parse(exp.slice(1));
		//console.log("c1 is", c1);
		return c1.length ? [exp[0], c1] : [];
	}

	if (exp[0] == '(' && exp[exp.length-1] == ')') {
		console.log("Inside parens!");
		var arr = checkParens(exp);
		if (arr.indexOf(undefined) >= 0 || arr.indexOf('') >= 0)
			return [];
		else {
			side1 = parse(arr[0]);
			side2 = parse(arr[2]);
			if (side1.length && side2.length)
				return ['(', side1, arr[1], side2, ')'];
			else
				return [];
		}
	} else
		return exp;

	//console.log(exp);

	//return exp;
}

module.exports = parse
