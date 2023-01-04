import { Command } from 'commander'
import { generateSprite } from '../lib'

const program = new Command()
const version = require('../../package.json').version

program
  .name('sprite-one')
  .version(version, '-v, --version', 'output the version number')
  .arguments('<sprite_filename>')
  .description('generate sprite from icons')
  .requiredOption(
    '-i, --icon <icons...>',
    'A folder path which stores SVG icons. Multiple folders can be set.',
  )
  .option(
    '-r, --ratio <ratios...>',
    'pixel ratio to generate sprite. default is 1.',
  )
  .action(async (spriteFilename: string) => {
    const options = program.opts()
    if (options.ratio) {
      options.ratio = options.ratio.map((r: string) => {
        return Number(r)
      })
    }
    await generateSprite(spriteFilename, options.icon, options.ratio)
  })

program.parse(process.argv)
