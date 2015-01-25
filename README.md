# About

A small project created because I couldn't find a proper json diff function on the internet. A function which takes two jsons and returns a list of changes from the first to the second. No command-line, no need for 'node-document'. Just a function; you can do with it what you want.

Turns out someone HAS made what I wanted, but I didn't find it before spending time on this. If you've found this page, I recommend https://www.npmjs.com/package/deep-diff

It looks like they've spent some significant time on theirs.

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

There are three possibilities for each change, and their formats are as follows:
```
add			-			{ at:"first.second.one", added:"newVal" }
remove		-			{ at:"first.second.two", removed:"oldVal" }
change		-			{ at:"first.second.three", changed:"origVal", to:"changedVal"}
```

so
```
jsonDiff(orig, changed);
```
will return 
```
[
	{ at:"first.second.one", added:"newVal" },
	{ at:"first.second.two", removed:"oldVal" },
	{ at:"first.second.three", changed:"origVal", to:"changedVal"}
]
```

# Options
The third (optional) parameter is called 'options' (guess what it does)
It's should be an object and depending on what you want, should have one or more of these properties:
<h3>objectStructure</h3>
If this is set to true, it will return in an object structure, instead of the default array.

e.g. if you were to call
```
jsonDiff({one: 1}, {one: 11, two:2}, {objectStructure: true});
```
then the response would be:
```
{
	changes: [{ at: "one", changed: 1, to: 11 }],
	additions: [{ at: "two", added: 2}],
	removals: []
}
```
<h3>arrayOrderImportant</h3>
By default it ignores the order of an array. If this option is set to true, then it will list any changes to the order of the elements as actual changes. Effectively; this treats arrays as objects, as order being important is really the only difference between them.

<b>NOTE</b>: This option may not function how you expect it to for arrays of objects. 'Change' is only triggered on primitive data types (see: [`Nested Objects`](#nested-objects))


# Nested objects

Firstly, in the case of nested objects (in the previous case 'first' and 'second' would be nested objects), the path to the changed property will be the objects key inside it's parent, followed by a '.' character. That is, any property inside the 'first' object will have "first." prefixed to it's key to tell you that it is inside "first".

Secondly; 'change' is only triggered on primitive data types (Numbers and Strings). It will assume that the nested object is the same object and so will find removals and additions
For example:
```
var one = { first: { one: 1 } };
var two = { first: { two: 2 } };
jsonDiff(one, two);
```
will return
```
[
	{ at: "first.one", removed: 1 },
	{ at: "first.two", added: 2 }
]
```

However, if you change from an object to a primitive data type, then it can pick up on that.
eg.
```
var one = { first: 1 };
var two = { first: {one: 1} };
jsonDiff(one, two);
```
will return
```
[
	{ at:"first", changed: 1, to: {one: 1} }
]
```