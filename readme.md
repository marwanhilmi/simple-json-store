# Simple JSON Store
> Easily load and save data to JSON file  
> Works **synchronously** so use as appropriate (CLI applications, simple writes)

## Usage

```js
const SimpleJsonStore = require('simple-json-store')

// Init a SimpleJsonStore instance with a file path
// and optionally some default values
const store = new JsonStore('./mystore.json', {foo: 'bar'});

store.set('awesome', true);

console.log(store.get('awesome'));
//=> true

console.log(store.get('foo'));
//=> bar

store.del('awesome');

console.log(store.get('awesome'));
//=> undefined
```


## API

### SimpleJsonStore(filePath, [defaults])

Create a new JsonStore instance `store`.

#### filePath

Type: `string`

File path to save JSON file to.

#### defaults

Type: `object`

Default content to init the store with.

### store.set(key, value)

Set an item.

### store.set(object)

Set multiple items at once.

### store.get(key)

Get an item.

### store.del(key)

Delete an item.

### store.clear()

Delete all items.

### store.all

Get all items as an object or replace the current config with an object:

```js
store.all = {
	hello: 'world'
};
```

### store.size

Get the item count.

### store.path

Get the path to the JSON file. Can be used to show the user where the file is located or even better open it for them.

## Related

- [configstore](https://github.com/yeoman/configstore) - same thing but automatically sets up JSON save file for you
- [lowdb](https://github.com/typicode/lowdb/blob/master/src/index.js) - simple JSON database with query capabilities
- [write-json-file](https://github.com/sindresorhus/write-json-file) - write JSON files atomically (async or sync)
- [steno](https://github.com/typicode/steno) - another option to write JSON files atomically

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)  
Copyright Google
