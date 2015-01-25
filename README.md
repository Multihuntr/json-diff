# About

A function which takes two jsons and returns a list of changes from the first to the second. No command-line, no need for 'node-document'. Just a function; you can do with it what you want.
e.g.
```
jsonDiff({one: 1},{one: 11, two:2});
```
will return: 
```
[
	{ at: "one", changed: 1, to: 11 },
	{ at: "two", added: 2}
]
```

# Options
The third (optional) parameter is called 'options' (guess what it does)
It's should be an object and depending on what you want, should have one or more of these properties
<h3>objectStructure</h3>
If this is set to true, it will return the differences in an object structure, instead of the default array.
e.g. the above example would be returned as:
```
{
	changes: [{ at: "one", changed: 1, to: 11 }],
	additions: [{ at: "two", added: 2}],
	removals: []
}
```
<h3>arrayOrderImportant</h3>
If this is set to true, then it will list any changes in order to the array as 'changed' listing the original value at that index and what the value of that index is now. Effectively; this treats arrays as objects, as order being important is really the only difference between them.
NOTE: This option may not function how you expect it to for arrays of objects. 'Change' is only triggered on primitive data types (see: [`Nested Objects`](#nested-objects))

# Format of output

Let's say we have two json objects:
```
var orig = { 
	"first": { 
		"second": { 
			two:"origVal", 
			three:"origVal" 
		} 
	} 
};
var changed = { 
	"first": { 
		"second": { 
			one:"newVal", 
			three:"changedVal" 
		} 
	} 
};
```

There are three operations, and their format is as follows:
```
add			-			{ at:"first.second.one", added:"newVal" }
remove		-			{ at:"first.second.two", wasRemoved:"oldVal" }
change		-			{ at:"first.second.three", changed:"origVal", to:"changedVal"}
```

and the output would be an array consisting of each of these

# Nested objects

Firstly, in the case of nested objects (in the previous case 'first' and 'second' would be nested objects), the path to the changed property will be the objects key inside it's parent, followed by a '.' character. That is, any property inside the 'first' object will have "first." prefixed to it's key to tell you that it is inside "first".

Secondly; 'change' is only triggered on primitive data types (Numbers and Strings). It will assume that the nested object is the 'same' and so will find removals and additions
For example:
```
var one = { first: { one: 1 } };
var two = { first: { two: 2 } };
var difs = jsonDiff(one, two);
```
will set 'difs' to:
```
[
	{ at: "first.one", wasRemoved: 1 },
	{ at: "first.two", added: 2 }
]
```

However, if you change from an object to a primitive data type, then it can pick up on that.
eg.
```
var one = { first: 1 };
var two = { first: {one: 1} };
jsonDiff(one, two); //will return [{ at:"one", changed: 1, to: {one: 1} }]
```

# Arrays

By it ignores the order of an array, and just tells you the position of any additions or removals.