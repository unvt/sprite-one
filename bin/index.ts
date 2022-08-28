import { exit } from 'process'
import { generateSprite } from '../lib'

const help_text = `
sprite-one [output filename] [input directory]

--ratio=[n]   pixel ratio
`

if (require.main === module) {
  const argv = process.argv
  if (argv[0].indexOf('ts-node')) {
    argv.shift()
  }
  if (argv.length < 3) {
    console.log(help_text)
    exit(1)
  }
  let ratio = 1
  if (argv.length == 4) {
    const ratio_option = argv[3]
    ratio = Number(ratio_option.split('=')[1])
  }
  console.log(argv)
  const output_file_name = argv[1]
  const input_directory = argv[2]
  generateSprite(output_file_name, input_directory, ratio).then(() => {
    console.log('finish generate')
  })
}
