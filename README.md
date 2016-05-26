*Under active development - API, UI and features are not fully completed yet*

# PerfCascade
Extensible waterfall-viewer that works with HAR and other formats (in the future).

Live exampe at: https://micmro.github.io/PerfCascade/

![example screenshot](https://raw.githubusercontent.com/micmro/PerfCascade/gh-pages/img/PerfCascade-sample1.png)

## How to use PerfCascade
PerfCascade is exported with [UMD](https://github.com/umdjs/umd), so you can use it as global object, via AMD (e.g. requireJS) or commonJS (internally it uses ES6 modules).

If using it without any module system it exports as a global object `perfCascade`, you can use as following:
```
/** options for PerfCascade (all have defaults) */
var options = {
  rowHeight: 23, //default: 23
  showAlignmentHelpers : true, //default: true
  showIndicatorIcons: true, //default: true
  leftColumnWith: 25 //default: 25
}

/** pass HAR and options to `newPerfCascadeHar` to generate the SVG element*/
var perfCascadeSvg =  perfCascade.fromHar(harData.log, options)
```

## Options
see [options.d.ts](https://github.com/micmro/PerfCascade/blob/master/src/ts/typing/options.d.ts) for source

### `rowHeight`
`number`, default: `23`
Height of every request bar block plus spacer pixel (in px) default: 23

### `showAlignmentHelpers`
`boolean`, default: `true`
Show verticale lines to easier spot potential dependencies/blocking between requests

### `showIndicatorIcons`
`boolean`, default: `true`
Show warning icons for potential issues on the left

### `leftColumnWith`
`number` default: `25`
Relative width of the info column on the left (in percent)

## Dev
- Start live-reload server and Typescript compiler with watch: `npm run watch`
- Create uglified version: `npm run build` (not tracked ITM)
- Build and publish assets to Github Page `npm run ghPages` (pushes to `gh-pages` branch) *(contributers only)*

See `package.json` for other useful tasks like linting etc.

## Specs and ressources

- [W3C HAR Spec](https://w3c.github.io/web-performance/specs/HAR/Overview.html)
- [HAR 1.2 Spec](http://www.softwareishard.com/blog/har-12-spec)
- [HAR Resources](https://github.com/ahmadnassri/har-resources)
