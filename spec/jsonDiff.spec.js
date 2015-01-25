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
				expect(jsonDiff(one, two)).toEqual([{ at: "two", wasAdded: 2 }]);
			});
			
			it("many", function() {
				var one = { one: 1 };
				var two = { one: 1, two: 2, three: 3 };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", wasAdded: 2 }, { at: "three", wasAdded: 3 }]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one", function() {
				var one = { one: { secondone: { thirdone: 1 } } };
				var two = { one: { secondone: { thirdone: 1, thirdtwo: 2 } } };
				expect(jsonDiff(one, two)).toEqual([{ at: "one.secondone.thirdtwo", wasAdded: 2 }]);
			});
			
			it("many in same level", function() {
				var one = { one: { secondone: { thirdone: 1 } } };
				var two = { one: { secondone: { thirdone: 1, thirdtwo: 2, thirdthree: 3 } } };
				expect(jsonDiff(one,two)).toEqual([{ at: "one.secondone.thirdtwo", wasAdded: 2 }, { at: "one.secondone.thirdthree", wasAdded: 3 }]);
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
					{ at:"one.secondone.thirdtwo", wasAdded: 2 },
					{ at:"one.secondthree", wasAdded: 3 },
					{ at:"four", wasAdded: 4 }
				]);
			});
			
		});
		
		
	});
	
	
	
    describe("objects", function() {
		
		
		describe("first level", function() {
			
			it("one", function() {
				var one = { one: { secondone: 1 } };
				var two = { one: { secondone: 1 }, two: { secondone: 1 } };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", wasAdded: { secondone: 1 }}]);
			});
			
			it("many", function() {
				var one = { one: { secondone: 1 } };
				var two = { one: { secondone: 1 }, two: { secondone: 1 }, three: { secondone: 1 } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "two", wasAdded: { secondone: 1 } }, 
					{ at: "three", wasAdded: { secondone: 1 } }
				]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one addition", function() {
				var one = { one: { secondone: { thirdone: { one: 1 } } } };
				var two = { one: { secondone: { thirdone: { one: 1 }, thirdtwo: { one: 1 } } } };
				expect(jsonDiff(one, two)).toEqual([
					{ at: "one.secondone.thirdtwo", wasAdded: { one: 1 }}
				]);
			});
			
			it("many in same level", function() {
				var one = { one: { secondone: { thirdone: { one: 1 } } } };
				var two = { one: { secondone: { thirdone: { one: 1 }, thirdtwo: { one: 1 }, thirdthree: { one: 1 } } } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one.secondone.thirdtwo", wasAdded: { one: 1 } },
					{ at: "one.secondone.thirdthree", wasAdded: { one: 1 } }
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
					{ at: "one.secondone.thirdtwo", wasAdded: { two: 2 } },
					{ at: "one.secondthree", wasAdded: { three: 3 } },
					{ at: "four", wasAdded: { four: 4 } }
				]);
			});
			
		});
		
		
	});
	
	
	
});




describe("removals", function() {
	
	
	
	describe("primitive data types", function() {
		
		
		describe("first level", function() {
			
			it("one", function() {
				var one = { one: 1, two: 2 };
				var two = { one: 1 };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", wasRemoved: 2 }]);
			});
			
			it("many", function() {
				var one = { one: 1, two: 2, three: 3 };
				var two = { one: 1 };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", wasRemoved: 2 }, { at: "three", wasRemoved: 3 }]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one", function() {
				var one = { one: { secondone: { thirdone: 1, thirdtwo: 2 } } };
				var two = { one: { secondone: { thirdone: 1 } } };
				expect(jsonDiff(one, two)).toEqual([{ at: "one.secondone.thirdtwo", wasRemoved: 2 }]);
			});
			
			it("many at same level", function() {
				var one = { one: { secondone: { thirdone: 1, thirdtwo: 2, thirdthree: 3 } } };
				var two = { one: { secondone: { thirdone: 1 } } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one.secondone.thirdtwo", wasRemoved: 2 },
					{ at: "one.secondone.thirdthree", wasRemoved: 3 }
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
					{ at:"one.secondone.thirdtwo", wasRemoved: 2 },
					{ at:"one.secondthree", wasRemoved: 3 },
					{ at:"four", wasRemoved: 4 }
				]);
			});
			
		});
		
			
	});
		
	
	
    describe("objects", function() {
		
		
		describe("first level", function() {
			
			it("one removal at first level", function() {
				var one = { one: { secondone: 1 }, two: { secondone: 1 } };
				var two = { one: { secondone: 1 } };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", wasRemoved: { secondone: 1 }}]);
			});
			
			it("many removals at first level", function() {
				var one = { one: { secondone: 1 }, two: { secondone: 1 }, three: { secondone: 1 } };
				var two = { one: { secondone: 1 } };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", wasRemoved: { secondone: 1 } }, { at: "three", wasRemoved: { secondone: 1 } }]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one", function() {
				var one = { one: { secondone: { thirdone: { one: 1 }, thirdtwo: { one: 1 } } } };
				var two = { one: { secondone: { thirdone: { one: 1 } } } };
				expect(jsonDiff(one, two)).toEqual([
					{ at: "one.secondone.thirdtwo", wasRemoved: { one: 1 }}
				]);
			});
			
			it("many in same level", function() {
				var one = { one: { secondone: { thirdone: { one: 1 }, thirdtwo: { one: 1 }, thirdthree: { one: 1 } } } };
				var two = { one: { secondone: { thirdone: { one: 1 } } } };
				expect(jsonDiff(one,two)).toEqual([
					{ at: "one.secondone.thirdtwo", wasRemoved: { one: 1 } },
					{ at: "one.secondone.thirdthree", wasRemoved: { one: 1 } }
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
					{ at: "one.secondone.thirdtwo", wasRemoved: { two: 2 } },
					{ at: "one.secondthree", wasRemoved: { three: 3 } },
					{ at: "four", wasRemoved: { four: 4 } }
				]);
			});
			
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
	
	
	
});