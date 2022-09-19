# Generate sprite image and json without Mapnik

## Install

```bash
yarn add @smellman/sprite-zero
```

or

```bash
npm install @smellman/sprite-zero
```

## Usage

- CLI

```zsh
$ sprite-one -h
Usage: sprite-one [options] <sprite_filename> <icons_directory>

generate sprite from icons

Options:
  -v, --version            output the version number
  -r, --ratio <ratios...>  pixel ratio to generate sprite. default is 1.
  -h, --help               display help for command
```

- npm

```javascript
import { generateSprite } from '@smellman/sprite-one'

generateSprite('../out', '../input', [2]).then(() => {})
```

If multiple ratios are specified in either CLI or Nodejs, the default file names when the ratio is more than one will be changed to the standard file name used by mapbox and maplibre (e.g., `sprite.json` for 1 ratio, `sprite@2x.json` for 2 ratio...).

## Develop

via `bin/index.ts`

```bash
git clone https://github.com/smellman/sprite-one.git
cd sprite-one
yarn
npx ts-node bin/index.ts ../../tmp/out ../../tmp/maki/icons
npx ts-node bin/index.ts ../../tmp/out ../../tmp/maki/icons --ratio=2
```
