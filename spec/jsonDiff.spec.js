/* jshint node: true */
/* global describe, it, expect, jasmine */
'use strict';

var jsonDiff = require('../jsonDiff.js');

describe("no difference", function() {
	
	
	
    describe("primitive data types", function() {
		
		
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
		
		
    });
	
	
	
});

describe("additions", function() {
	
	
	
	describe("primitive data types", function() {
		
		
		describe("first level", function() {
			
			it("one addition", function() {
				var one = { one: 1 };
				var two = { one: 1, two: 2 };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", wasAdded: 2}]);
			});
			
			it("many additions", function() {
				var one = { one: 1 };
				var two = { one: 1, two: 2, three: 3 };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", wasAdded: 2 }, { at: "three", wasAdded: 3 }]);
			});
			
		});
		
		
		describe("deeper levels", function() {
			
			it("one addition", function() {
				var one = { one: { secondone: { thirdone: 1 } } };
				var two = { one: { secondone: { thirdone: 1, thirdtwo: 2 } } };
				expect(jsonDiff(one, two)).toEqual([{ at: "one.secondone.thirdtwo", wasAdded: 2}]);
			});
			
			it("many additions in same level", function() {
				var one = { one: { secondone: { thirdone: 1 } } };
				var two = { one: { secondone: { thirdone: 1, thirdtwo: 2, thirdthree: 3 } } };
				expect(jsonDiff(one,two)).toEqual([{ at: "one.secondone.thirdtwo", wasAdded: 2 }, { at: "one.secondone.thirdthree", wasAdded: 3 }]);
			});
			
		});
		
		
	});
	
	
	
    describe("objects", function() {
		
		
		describe("first level", function() {
			
			it("one addition at first level", function() {
				var one = { one: { secondone: 1 } };
				var two = { one: { secondone: 1 }, two: { secondone: 1 } };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", wasAdded: { secondone: 1 }}]);
			});
			
			it("many additions at first level", function() {
				var one = { one: { secondone: 1 } };
				var two = { one: { secondone: 1 }, two: { secondone: 1 }, three: { secondone: 1 } };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", wasAdded: { secondone: 1 } }, { at: "three", wasAdded: { secondone: 1 } }]);
			});
			
		});
		
		
    });
	
	
	
});



describe("removals", function() {
	
	
	
    describe("primitive data types", function() {
		
		describe("first level", function() {
			
			it("one removal at first level", function() {
				var one = { one: 1, two: 2 };
				var two = { one: 1 };
				expect(jsonDiff(one, two)).toEqual([{ at: "two", wasRemoved: 2}]);
			});
			
			it("many removal at first level", function() {
				var one = { one: 1, two: 2, three: 3 };
				var two = { one: 1 };
				expect(jsonDiff(one,two)).toEqual([{ at: "two", wasRemoved: 2 }, { at: "three", wasRemoved: 3 }]);
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
		
		
    });
	
	
	
	
});