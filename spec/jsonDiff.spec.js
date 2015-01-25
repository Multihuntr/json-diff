/* jshint node: true */
/* global describe, it, expect, jasmine */
'use strict';

var jsonDiff = require('../jsonDiff.js');

describe("no difference", function() {
		
	it("finds nothing at first level", function() {
		var one = { one: 1 };
		var two = { one: 1 };
		expect(jsonDiff(one, two)).toEqual([]);
	});
	
	it("finds nothing at later levels", function() {
		var one = { one: 1, two: { secondone: 1 }, three: { secondone: { thirdone: 1 } } };
		var two = { one: 1, two: { secondone: 1 }, three: { secondone: { thirdone: 1 } } };
		expect(jsonDiff(one, two)).toEqual([]);
	});
	
	it("finds nothing if order changes", function() {
		var one = { one: 1, three: { secondone: { thirdone: 1 } }, two: { secondone: 1 } };
		var two = { one: 1, two: { secondone: 1 }, three: { secondone: { thirdone: 1 } } };
		expect(jsonDiff(one, two)).toEqual([]);
	});
	
});




describe("additions", function() {
	
	
	
	describe("primitive data types", function() {
		
		
		describe("first level", function() {
			
			it("one", function() {
				var one = { one: 1 };
				var two = { one: 1, two: 2 };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", added: 2 }]);
			});
			
			it("many", function() {
				var one = { one: 1 };
				var two = { one: 1, two: 2, three: 3 };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", added: 2 }, { at: "three", added: 3 }]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one", function() {
				var one = { one: { secondone: { thirdone: 1 } } };
				var two = { one: { secondone: { thirdone: 1, thirdtwo: 2 } } };
				expect(jsonDiff(one, two)).toEqual([{ at: "one.secondone.thirdtwo", added: 2 }]);
			});
			
			it("many in same level", function() {
				var one = { one: { secondone: { thirdone: 1 } } };
				var two = { one: { secondone: { thirdone: 1, thirdtwo: 2, thirdthree: 3 } } };
				expect(jsonDiff(one,two)).toEqual([{ at: "one.secondone.thirdtwo", added: 2 }, { at: "one.secondone.thirdthree", added: 3 }]);
			});
			
			it("many at different levels", function() {
				var one = { one: { secondone: { thirdone: 1 } } };
				var two = { 
					one: { 
						secondone: { 
							thirdone: 1,
							thirdtwo: 2
						},
						secondthree: 3
					},
					four: 4
				};
				expect(jsonDiff(one,two)).toEqual([
					{ at:"one.secondone.thirdtwo", added: 2 },
					{ at:"one.secondthree", added: 3 },
					{ at:"four", added: 4 }
				]);
			});
			
		});
		
		
	});
	
	
	
    describe("objects", function() {
		
		
		describe("first level", function() {
			
			it("one", function() {
				var one = { one: { secondone: 1 } };
				var two = { one: { secondone: 1 }, two: { secondone: 1 } };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", added: { secondone: 1 }}]);
			});
			
			it("many", function() {
				var one = { one: { secondone: 1 } };
				var two = { one: { secondone: 1 }, two: { secondone: 1 }, three: { secondone: 1 } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "two", added: { secondone: 1 } }, 
					{ at: "three", added: { secondone: 1 } }
				]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one addition", function() {
				var one = { one: { secondone: { thirdone: { one: 1 } } } };
				var two = { one: { secondone: { thirdone: { one: 1 }, thirdtwo: { one: 1 } } } };
				expect(jsonDiff(one, two)).toEqual([
					{ at: "one.secondone.thirdtwo", added: { one: 1 }}
				]);
			});
			
			it("many in same level", function() {
				var one = { one: { secondone: { thirdone: { one: 1 } } } };
				var two = { one: { secondone: { thirdone: { one: 1 }, thirdtwo: { one: 1 }, thirdthree: { one: 1 } } } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one.secondone.thirdtwo", added: { one: 1 } },
					{ at: "one.secondone.thirdthree", added: { one: 1 } }
				]);
			});
			
			it("many at different levels", function() {
				var one = { one: { secondone: { thirdone: { one: 1 } } } };
				var two = { 
					one: { 
						secondone: { 
							thirdone: { one: 1 },
							thirdtwo: { two: 2 }
						},
						secondthree: { three: 3 }
					},
					four: { four: 4 }
				};
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one.secondone.thirdtwo", added: { two: 2 } },
					{ at: "one.secondthree", added: { three: 3 } },
					{ at: "four", added: { four: 4 } }
				]);
			});
			
		});
		
		
	});
	
	
	describe("arrays", function() {
		
		it("default", function() {
			var one = { one: [{one: 1}, 2, 3] };
			var two = { one: [2, {one: 1}, {two: 2}, 3] };
			expect(jsonDiff(one,two)).toEqual([
				{ at: "one.2", added: { two:2 } }
			]);
		});
		
		it("order important", function() {
			var one = { one: [{one: 1}, 2, 3] };
			var two = { one: [2, {one: 1}, {two: 2}, 3] };
			expect(jsonDiff(one,two,{arrayOrderImportant: true})).toEqual([
				{ at: "one.0", changed: { one:1 }, to: 2 },
				{ at: "one.1", changed: 2, to: { one:1 } },
				{ at: "one.2", changed: 3, to: { two:2 } },
				{ at: "one.3", added: 3 }
			]);
		});
		
	});
	
	
	
});




describe("removals", function() {
	
	
	
	describe("primitive data types", function() {
		
		
		describe("first level", function() {
			
			it("one", function() {
				var one = { one: 1, two: 2 };
				var two = { one: 1 };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", removed: 2 }]);
			});
			
			it("many", function() {
				var one = { one: 1, two: 2, three: 3 };
				var two = { one: 1 };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", removed: 2 }, { at: "three", removed: 3 }]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one", function() {
				var one = { one: { secondone: { thirdone: 1, thirdtwo: 2 } } };
				var two = { one: { secondone: { thirdone: 1 } } };
				expect(jsonDiff(one, two)).toEqual([{ at: "one.secondone.thirdtwo", removed: 2 }]);
			});
			
			it("many at same level", function() {
				var one = { one: { secondone: { thirdone: 1, thirdtwo: 2, thirdthree: 3 } } };
				var two = { one: { secondone: { thirdone: 1 } } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one.secondone.thirdtwo", removed: 2 },
					{ at: "one.secondone.thirdthree", removed: 3 }
				]);
			});
			
			it("many at different levels", function() {
				var one = { 
					one: { 
						secondone: { 
							thirdone: 1,
							thirdtwo: 2
						},
						secondthree: 3
					},
					four: 4
				};
				var two = { one: { secondone: { thirdone: 1 } } };
				expect(jsonDiff(one,two)).toEqual([
					{ at:"one.secondone.thirdtwo", removed: 2 },
					{ at:"one.secondthree", removed: 3 },
					{ at:"four", removed: 4 }
				]);
			});
			
		});
		
			
	});
		
	
	
    describe("objects", function() {
		
		
		describe("first level", function() {
			
			it("one removal at first level", function() {
				var one = { one: { secondone: 1 }, two: { secondone: 1 } };
				var two = { one: { secondone: 1 } };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", removed: { secondone: 1 }}]);
			});
			
			it("many removals at first level", function() {
				var one = { one: { secondone: 1 }, two: { secondone: 1 }, three: { secondone: 1 } };
				var two = { one: { secondone: 1 } };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", removed: { secondone: 1 } }, { at: "three", removed: { secondone: 1 } }]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one", function() {
				var one = { one: { secondone: { thirdone: { one: 1 }, thirdtwo: { one: 1 } } } };
				var two = { one: { secondone: { thirdone: { one: 1 } } } };
				expect(jsonDiff(one, two)).toEqual([
					{ at: "one.secondone.thirdtwo", removed: { one: 1 }}
				]);
			});
			
			it("many in same level", function() {
				var one = { one: { secondone: { thirdone: { one: 1 }, thirdtwo: { one: 1 }, thirdthree: { one: 1 } } } };
				var two = { one: { secondone: { thirdone: { one: 1 } } } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one.secondone.thirdtwo", removed: { one: 1 } },
					{ at: "one.secondone.thirdthree", removed: { one: 1 } }
				]);
			});
			
			it("many removals at different levels", function() {
				var one = { 
					one: { 
						secondone: { 
							thirdone: { one: 1 },
							thirdtwo: { two: 2 }
						},
						secondthree: { three: 3 }
					},
					four: { four: 4 }
				};
				var two = { one: { secondone: { thirdone: { one: 1 } } } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one.secondone.thirdtwo", removed: { two: 2 } },
					{ at: "one.secondthree", removed: { three: 3 } },
					{ at: "four", removed: { four: 4 } }
				]);
			});
			
		});
		
		
    });
	
	
	describe("arrays", function() {
		
		it("default", function() {
			var one = { one: [{one: 1}, 2, {three: 3}] };
			var two = { one: [2, {one: 1}] };
			expect(jsonDiff(one,two)).toEqual([
				{ at: "one.2", removed: {three:3}}
			]);
		});
		
		it("order important", function() {
			var one = { one: [{one: 1}, 2, {three: 3}] };
			var two = { one: [2, {one: 1}] };
			expect(jsonDiff(one,two,{arrayOrderImportant: true})).toEqual([
				{ at: "one.0", changed: {one:1}, to: 2},
				{ at: "one.1", changed: 2, to: {one:1}},
				{ at: "one.2", removed: {three:3}}
			]);
		});
		
	});



});




describe("changes", function() {
	
	
	describe("primitive data types", function() {
		
		describe("first level", function() {
			
			it("one", function() {
				var one = { one: 1 };
				var two = { one: 2 };
				expect(jsonDiff(one, two)).toEqual([{ at: "one", changed: 1, to: 2 }]);
			});
			
			it("many", function() {
				var one = { one: 1, two: 2, three: 3 };
				var two = { one: 4, two: 5, three: 6 };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one", changed: 1, to: 4 },
					{ at: "two", changed: 2, to: 5 },
					{ at: "three", changed: 3, to: 6 }
				]);
			});
			
		});
		
    });
	
	
	describe("arrays", function() {
		
		it("changes order", function() {
			var one = { one: [{one: 1}, 2, {three: 3}] };
			var two = { one: [{three: 3}, {one: 1}, 2] };
			expect(jsonDiff(one,two)).toEqual([]);
		});
		
		it("changes order with order important", function() {
			var one = { one: [1, 2, 3] };
			var two = { one: [3, 1, 2] };
			expect(jsonDiff(one,two,{arrayOrderImportant: true})).toEqual([
				{ at: "one.0", changed: 1, to: 3},
				{ at: "one.1", changed: 2, to: 1},
				{ at: "one.2", changed: 3, to: 2}
			]);
		});
		
	});
	
	
	
});




describe("combinations", function() {
	
	
	
	it("two of each", function() {
		var one = { one: { secondone: 1, secondtwo: 2, secondthree: 3, secondfour: 4, secondfive: 5, secondsix: 6 } };
		var two = { one: { secondone: 1, secondtwo: 2, secondthree: 7, secondfour: 8, secondnine: 9, secondten: 10 } };
		expect(jsonDiff(one, two)).toEqual([
			{ at: "one.secondthree", changed: 3, to: 7 },
			{ at: "one.secondfour", changed: 4, to: 8 },
			{ at: "one.secondnine", added: 9 },
			{ at: "one.secondten", added: 10 },
			{ at: "one.secondfive", removed: 5 },
			{ at: "one.secondsix", removed: 6 }
		])
	});
	
	
	
});




describe("object structure option", function() {
	
	
	
	it("works for no changes", function() {
		var one = { one: { secondone: 1, secondtwo: 2, secondthree: 3, secondfour: 4, secondfive: 5, secondsix: 6 } };
		var two = { one: { secondone: 1, secondtwo: 2, secondthree: 3, secondfour: 4, secondfive: 5, secondsix: 6 } };
		expect(jsonDiff(one, two, {objectStructure: true})).toEqual({
			changes: [],
			additions: [],
			removals: []
		})
	});
	
	
	
	it("works for a few of each", function() {
		var one = { one: { secondone: 1, secondtwo: 2, secondthree: 3, secondfour: 4, secondfive: 5, secondsix: 6 } };
		var two = { one: { secondone: 1, secondtwo: 2, secondthree: 7, secondfour: 8, secondnine: 9, secondten: 10 } };
		expect(jsonDiff(one, two, {objectStructure: true})).toEqual({
			changes: [
				{ at: "one.secondthree", changed: 3, to: 7 },
				{ at: "one.secondfour", changed: 4, to: 8 }
			],
			additions: [
				{ at: "one.secondnine", added: 9 },
				{ at: "one.secondten", added: 10 }
			],
			removals: [
				{ at: "one.secondfive", removed: 5 },
				{ at: "one.secondsix", removed: 6 }
			]
		})
	});
	
	
	
});