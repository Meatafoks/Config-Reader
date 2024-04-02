import * as path from 'path'
import * as fs from 'fs'
import { LoggerFactory } from '@metafoks/logger'
import { merge } from '@metafoks/toolbox'

export interface MetafoksConfigReaderConfiguration {
  configsPath: string
  profile?: string
  defaultConfig: any
}

export class MetafoksConfigReader {
  public logger = LoggerFactory.create(MetafoksConfigReader)

  public configuration: MetafoksConfigReaderConfiguration = {
    configsPath: 'config',
    profile: undefined,
    defaultConfig: {},
  }

  public constructor() {
    this.logger.level = 'DEBUG'
  }

  public configure(config: Partial<MetafoksConfigReaderConfiguration>) {
    this.logger.info(`configuration changed=${JSON.stringify(config)}`)
    this.configuration = merge(this.configuration, config) as MetafoksConfigReaderConfiguration
  }

  public getConfigDirectoryPath() {
    return path.resolve(this.configuration.configsPath)
  }

  public getConfigActiveProfileFileName() {
    if (this.configuration.profile) return `config.${this.configuration.profile.toLowerCase()}.json`
    return 'config.json'
  }

  public getConfigActiveProfileFilePath() {
    return path.resolve(this.getConfigDirectoryPath(), this.getConfigActiveProfileFileName())
  }

  public getConfigActiveProfileContent() {
    const filePath = this.getConfigActiveProfileFilePath()
    this.logger.debug(`reading config file=${filePath}`)
    if (!fs.existsSync(filePath)) {
      this.logger.warn(`config file is undefined=${filePath}`)
      return { ...this.configuration.defaultConfig }
    }
    const content = JSON.parse(String(fs.readFileSync(filePath)))
    return merge(this.configuration.defaultConfig, content)
  }
}
