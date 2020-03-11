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

function checkAtomic(s)
{
	if (s.length != 1)
		return false;
	let re = new RegExp("[#a-zA-Z]");
	return re.test(s)
}

function checkParens(s)
{
	stack = [];
	length = 0;
	for (let i = 0; i < s.length; ++i) {
		if (s[i] == '(') {
			stack.push('(');
		} else if (s[i] == ')' && stack.length) {
			stack.pop();
		} else if (stack.length == 1 && binOps.has(s[i])) {
			o = [s.slice(1, i), (s.slice(i, i+1))[0], s.slice(i+1, s.length-1)];
			return o;
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

	if (unOps.has(exp[0])) {
		unary = exp[0];
		c1 = parse(exp.slice(1));
		r = c1.length ? [unary, c1] : [];
		return r;
	}

	if (exp[0] == '(' && exp[exp.length-1] == ')') {
		var arr = checkParens(exp);
		if (arr.indexOf(undefined) >= 0 || arr.indexOf('') >= 0)
			return [];
		else {
			c1 = parse(arr[0]);
			c2 = parse(arr[2]);
			if (c1.length && c2.length) {
				r = ['(', c1, arr[1], c2, ')'];
				return r;
			}
			else
				return [];
		}
	} else
		return checkAtomic(exp) ? exp : [];
}

// console.log(parse("(NOT(A AND NOT B) AND (C OR A))"));

module.exports = parse
