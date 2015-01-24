var _ = require("underscore");

function jsonDiff(orig, changed) {
    
    var changes = [];
    
    var flatGetDiff = function (o, c, at) {
        var tO = typeof o,
            tC = typeof c;
        if (tO !== tC) {
            if (tO === "undefined") {
                changes.push({ at: at, wasAdded: c });
            }
            if (tC === "undefined") {
                changes.push({ at: at, wasRemoved: o });
            }
        } else if (o !== c) {
            changes.push({ at: at, changed: o, to: c });
        }
    };
    
    var recursiveGetDiff = function (orig, changed, parentKey) {
        var combined = _.extend(JSON.parse(JSON.stringify(changed)), orig);
        _.each(combined, function (elem, key) {
            if (typeof orig[key] === "object" && typeof changed[key] === "object") {
                recursiveGetDiff(orig[key], changed[key], parentKey+key+".");
            } else {
                flatGetDiff(orig[key], changed[key], parentKey+key);
            }
        });
    };
    
    recursiveGetDiff(orig, changed, "");
    
    return changes;
};

module.exports = jsonDiff;