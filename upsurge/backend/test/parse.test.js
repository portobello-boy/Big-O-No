const parse = require('../parse');

test("pad test 1", () => {
	expect(parse.pad("~(b AND c) OR a")).toBe("( ~ ( b AND c ) OR a )");
});
