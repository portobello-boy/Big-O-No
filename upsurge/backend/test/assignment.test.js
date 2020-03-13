const assign = require('../assignment');

test("Starts all false", () => {
	expect(assign.genVals(2)[0]).toStrictEqual([false,false]);
});
