# sci-parser

## Install

```shell
npm i sci-parser --save
```

## Usage

```js
const genex = require('genex');
const pattern = genex(/(foo|bar|baz){1,2}|snafu/);

// 13
console.log(pattern.count());

/*
[
  'foo', 'foofoo', 'foobar', 'foobaz',
  'bar', 'barfoo', 'barbar', 'barbaz',
  'baz', 'bazfoo', 'bazbar', 'bazbaz',
  'snafu'
]
*/
console.log(pattern.generate());
```

The `generate()` method also accepts an optional callback:

```js
pattern.generate((value) => {
  if (value.startsWith('foo') !== true) {
    return false; // breaks iteration
  }

  console.log(value); // 'foo', 'foofoo', 'foobar', 'foobaz',
});
```

## License

MIT
