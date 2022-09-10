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

```javascript
import { generateSprite } from '@smellman/sprite-one'

generateSprite('../out', '../input', 2).then(() => {})
```

## Develop

via `bin/index.ts`

```bash
git clone https://github.com/smellman/sprite-one.git
cd sprite-one
yarn
npx ts-node bin/index.ts ../../tmp/out ../../tmp/maki/icons
npx ts-node bin/index.ts ../../tmp/out ../../tmp/maki/icons --ratio=2
```
