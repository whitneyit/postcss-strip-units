# PostCSS Strip Units [![Build Status][ci-img]][ci]

[PostCSS] plugin that strips units off of property values.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/whitneyit/postcss-strip-units.svg
[ci]:      https://travis-ci.org/whitneyit/postcss-strip-units

When working with vertical rhythm the need to do mathematical operations on
variables arises. This plugin tries to aid in the requirement.

In its simplest form it converts the following:
```css
.foo {
    test: strip(2em);
}
```

Will produce the following.
```css
.foo {
    test: 2;
}
```

You can also use [`postcss-calc`](https://github.com/postcss/postcss-calc) and
[`postcss-custom-properties`](https://github.com/postcss/postcss-custom-properties)
to achieve the following.

```css
:root {
    --base-spacing-unit: 20px;
    --base-font-size: 14px;
    --rhythm: calc((strip(var(--base-spacing-unit)) / strip(var(--base-font-size))) * 1em);
}
.foo {
    font-size: var(--base-font-size);
    line-height: var(--rhythm);
}
```

You will generate the following css.
```css
.foo {
    font-size: 14px;
    line-height: 1.428571429;
}
```

## Usage

```js
postcss([ require('postcss-strip-units') ])
```

If you want to use the `calc` and `var` functions you can configure `postcss`
like so.
```js
postcss([
    require('postcss-custom-properties'),
    require('postcss-strip-units'),
    require('postcss-calc')
])
```

See [PostCSS] docs for examples for your environment.


## Options

Example:
```js
const stripe = require('postcss-strip');
const postcssPlugins = [stripe({
	functionName : 'removeUnit'
})]
```

### `functionName`

Type: `string`  
Default: `stripe`

The name of the funciton to use in your CSS. By default it is `strip()`
