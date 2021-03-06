# bemjson-to-scss
> BEMJSON to CSS/SCSS serializer

This is a generator of CSS/SCSS from BEMJSON.

[DEMO](https://pvoznyuk.github.io/bemjson-to-scss/)

## API

### Installing

`npm install bemjson-to-scss --save`

To run this library in a browser you can use `bundle.js` file. 

### new BEMJSON([options])

Creates serializer object.

__Options__:

 * `compileTo` _String_ - `css` or `scss` to serialize to (default: `scss`).
 * `compact` _Boolean_ - removes all the whitespaces if `true`  (default: `false`).
 * `tab` _String_ - you can choose tabs for inner classes e.g ` ` or `\t`  (default: `  `, two spaces).
 * `modificatorSeparator` _String_ - Suffix to use for mods instead of default `--` one. (E.g. `{modificatorSeparator: '_'}`).

### BEMJSON.toCSS(bemjson)

Returns serialized CSS string.

## License

MIT (c) [Pavlo Vozniuk](pavlo.vozniuk@gmail.com)

[npm-url]: https://npmjs.org/package/bemjson-to-scss
