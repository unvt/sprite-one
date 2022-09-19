import { Command } from 'commander'
import { generateSprite } from '../lib'

const program = new Command()
const version = require('../../package.json').version

program
  .name('sprite-one')
  .version(version, '-v, --version', 'output the version number')
  .arguments('<sprite_filename>')
  .arguments('<icons_directory>')
  .description('generate sprite from icons')
  .option(
    '-r, --ratio <ratio>',
    'pixel ratio to generate sprite. default is 1.'
  )
  .action(async (spriteFilename: string, iconsDirectory: string) => {
    const options = program.opts()
    if (options.ratio) {
      options.ratio = Number(options.ratio)
    }
    await generateSprite(spriteFilename, iconsDirectory, options.ratio)
  })

program.parse(process.argv)
