import fs from 'fs'
import os from 'os'
import path from 'path'

import { generateSprite } from '../../src/lib/index'
import { checkFileMatchesFixture, checkIconCountInSpriteJson, checkRatioInSpriteJson } from '../util'
import { checkIconsExistInSpritesheet } from '../util/checkIconsExistsInSpritesheet'

describe('test lib/index.ts', (): void => {
  let tmpDir = ''
  let iconsDir = path.join(__dirname, '../icons')
  let icons2Dir = path.join(__dirname, '../icons2')
  let iconsMakiDir = path.join(__dirname, '../icons-maki')
  let iconsVariedDir = path.join(__dirname, '../icons-varied')

  beforeAll(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spriteone-'))
  })

  afterAll(function () {
    // if (fs.existsSync(tmpDir)) {
    //   fs.rmSync(tmpDir, { recursive: true, force: true })
    // }
  })

  test('sprite (json and png) must exist after generating', async () => {
    const output_file_name = path.join(tmpDir, './test1')
    const pixelRatios = [1]
    await generateSprite(output_file_name, [iconsDir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatios[0])
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 3)
    await checkFileMatchesFixture(`${output_file_name}.png`)
    await checkFileMatchesFixture(`${output_file_name}.json`)

    await checkIconsExistInSpritesheet(`${output_file_name}.json`, `${output_file_name}.png`);
  })

  test('sprite must exist with pixelRatio = 2', async () => {
    const output_file_name = path.join(tmpDir, './test2')
    const pixelRatios = [2]
    await generateSprite(output_file_name, [iconsDir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatios[0])
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 3)
    await checkFileMatchesFixture(`${output_file_name}.png`)
    await checkFileMatchesFixture(`${output_file_name}.json`)

    await checkIconsExistInSpritesheet(`${output_file_name}.json`, `${output_file_name}.png`);
  })

  test('multiple sprites with different ratio should be generated', async () => {
    const output_file_name = path.join(tmpDir, './test3')
    const pixelRatios = [1, 2]
    await generateSprite(output_file_name, [iconsDir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}@2x.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}@2x.png`)).toBeTruthy()

    for (let i = 0; i < pixelRatios.length; i++) {
      const ratio = pixelRatios[i]
      const name = `${output_file_name}${
        ratio > 1 ? `@${ratio}x` : ''
      }`
      const jsonName = `${name}.json`
      await checkRatioInSpriteJson(jsonName, ratio)
      await checkIconCountInSpriteJson(jsonName, 3)
      await checkFileMatchesFixture(`${name}.png`)
      await checkFileMatchesFixture(jsonName)

      await checkIconsExistInSpritesheet(jsonName, `${name}.png`);
    }
  })

  test('sprite must be generated from multiple icon directories', async () => {
    const output_file_name = path.join(tmpDir, './test4')
    const pixelRatios = [1]
    await generateSprite(output_file_name, [iconsDir, icons2Dir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatios[0])
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 5)
    await checkFileMatchesFixture(`${output_file_name}.png`)
    await checkFileMatchesFixture(`${output_file_name}.json`)

    await checkIconsExistInSpritesheet(`${output_file_name}.json`, `${output_file_name}.png`);
  })

  test('sprite works with maki icon set', async () => {
    const output_file_name = path.join(tmpDir, './test5')
    const pixelRatios = [1, 2]
    await generateSprite(output_file_name, [iconsMakiDir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    expect(fs.existsSync(`${output_file_name}@2x.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}@2x.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatios[0])
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 211)
    await checkFileMatchesFixture(`${output_file_name}.png`)
    await checkFileMatchesFixture(`${output_file_name}.json`)

    await checkIconsExistInSpritesheet(`${output_file_name}.json`, `${output_file_name}.png`);

    await checkRatioInSpriteJson(`${output_file_name}@2x.json`, pixelRatios[1])
    await checkIconCountInSpriteJson(`${output_file_name}@2x.json`, 211)
    await checkFileMatchesFixture(`${output_file_name}@2x.png`)
    await checkFileMatchesFixture(`${output_file_name}@2x.json`)

    await checkIconsExistInSpritesheet(`${output_file_name}@2x.json`, `${output_file_name}@2x.png`);
  })
})
