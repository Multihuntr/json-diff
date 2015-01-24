# About

A function which takes two jsons and returns a list of changes from the first to the second. No command-line, no need for 'node-document'. Just a function; you can do with it what you want.

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
add			-			{ at:"first.second.one", wasAdded:"newVal" }
remove		-			{ at:"first.second.two", wasRemoved:"oldVal" }
edit		-			{ at:"first.second.three", changed:"origVal", to:"changedVal"}
```

and the output would be an array consisting of each of these

Note: in the case of nested objects (in this case 'first' and 'second' are nested objects), the path to the changed property will be the objects key inside it's parent, followed by a '.' character. That is, any property inside the 'first' object will have "first." prefixed to it's key to tell you that it is inside "first".