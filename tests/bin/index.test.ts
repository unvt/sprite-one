import fs from 'fs'
import os from 'os'
import path from 'path'
import child_process from 'child_process'
import util from 'util'
const execSync = util.promisify(child_process.exec)

import { checkIconCountInSpriteJson, checkRatioInSpriteJson } from '../util'

const baseCommand = `${path.join(
  __dirname,
  '../../node_modules/.bin/ts-node'
)} ${path.join(__dirname, '../../src/bin/index.ts')}`

describe('test bin/index.ts', (): void => {
  let tmpDir = ''
  let iconsDir = path.join(__dirname, '../icons')
  let icons2Dir = path.join(__dirname, '../icons2')

  beforeAll(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spriteone-'))
  })

  afterAll(function () {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  test('sprite (json and png) must exist after generating', async () => {
    const output_file_name = path.join(tmpDir, './test1')
    const pixelRatio = 1

    const cmd = `${baseCommand} ${output_file_name} -i ${iconsDir} -r ${pixelRatio}`
    const { stdout, stderr } = await execSync(cmd, {
      encoding: 'utf8',
    })
    expect(stdout).toEqual('')
    expect(stderr).toEqual('')
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatio)
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 3)
  })

  test('sprite must exist with pixelRatio = 2', async () => {
    const output_file_name = path.join(tmpDir, './test2')
    const pixelRatio = 2
    const cmd = `${baseCommand} ${output_file_name} -i ${iconsDir} -r ${pixelRatio}`
    const { stdout, stderr } = await execSync(cmd, {
      encoding: 'utf8',
    })
    expect(stdout).toEqual('')
    expect(stderr).toEqual('')
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatio)
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 3)
  })

  test('multiple sprites with different ratio should be generated', async () => {
    const output_file_name = path.join(tmpDir, './test3')
    const pixelRatios = [1, 2]
    const cmd = `${baseCommand} ${output_file_name} -i ${iconsDir} -r ${pixelRatios[0]} -r ${pixelRatios[1]}`
    const { stdout, stderr } = await execSync(cmd, {
      encoding: 'utf8',
    })
    expect(stdout).toEqual('')
    expect(stderr).toEqual('')
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}@2x.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}@2x.png`)).toBeTruthy()

    for (let i = 0; i < pixelRatios.length; i++) {
      const ratio = pixelRatios[i]
      const jsonName = `${output_file_name}${
        ratio > 1 ? `@${ratio}x` : ''
      }.json`
      await checkRatioInSpriteJson(jsonName, ratio)
      await checkIconCountInSpriteJson(jsonName, 3)
    }
  })

  test('sprite must be generated from multiple icon directories', async () => {
    const output_file_name = path.join(tmpDir, './test4')
    const pixelRatios = [1]
    const cmd = `${baseCommand} ${output_file_name} -i ${iconsDir} -i ${icons2Dir} -r ${pixelRatios[0]}`
    const { stdout, stderr } = await execSync(cmd, {
      encoding: 'utf8',
    })
    expect(stdout).toEqual('')
    expect(stderr).toEqual('')
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatios[0])
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 5)
  })
})
