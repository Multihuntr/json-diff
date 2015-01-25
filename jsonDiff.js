var _ = require("underscore");

function jsonDiff(orig, changed, options) {
    options = (options || {});
	
    var changes = [];
	var additions = [];
	var removals = [];
	
	var addChange = function(at, o, c) {
		changes.push({ at: at, changed: o, to: c });
	};
	
	var addRemoval = function(at, elem) {
		removals.push({ at: at, removed: elem })
	};
	
	var addAddition = function(at, elem) {
		additions.push({ at: at, added: elem })
	};
    
	var deepArrayDiff = function (o, c, at) {		
		
		var pushDiffs = function(one, two, addFnc) {
			one.forEach(function(elem, index) {
				var found = _.find(two, function(secondElem) {
					return _.isEqual(elem, secondElem);
				});
				if (!found) {
					addFnc(at+index,elem);
				}
			});
		}
		
		pushDiffs(o, c, addRemoval);
		pushDiffs(c, o, addAddition);
		
	};
	
    var flatGetDiff = function (o, c, at) {
        var tO = typeof o,
            tC = typeof c;
        if (tO !== tC) {
            if (tO === "undefined") {
                addAddition(at, c);
            } else if (tC === "undefined") {
                addRemoval(at, o);
            } else {
				addChange(at, o, c);
			}
        } else if (o !== c) {
            addChange(at, o, c);
        }
    };
    
    var recursiveGetDiff = function (orig, changed, parentKey) {
        var combined = _.extend(JSON.parse(JSON.stringify(changed)), orig);
        _.each(combined, function (elem, key) {
            if (typeof orig[key] === "object" && typeof changed[key] === "object") {
				if (!options.arrayOrderImportant && orig[key].length && changed[key].length) {
					deepArrayDiff(orig[key], changed[key], parentKey+key+".");
				} else {
					recursiveGetDiff(orig[key], changed[key], parentKey+key+".");
				}
            }else {
                flatGetDiff(orig[key], changed[key], parentKey+key);
            }
        });
    };
    
    recursiveGetDiff(orig, changed, "");
    
	if (options.objectStructure) {
		return { changes: changes, additions: additions, removals: removals };
	} else {
		return changes.concat(additions).concat(removals);
	}
};

module.exports = jsonDiff;