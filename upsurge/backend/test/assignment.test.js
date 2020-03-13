const genVals = require('../assignment');

test("Starts false", () => {
	expect(genVals(2)[0]).toBeFalsey();
});
