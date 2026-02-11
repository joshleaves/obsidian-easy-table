import { App, MarkdownRenderer, Plugin, PluginSettingTab, Setting, getLanguage } from 'obsidian'
import { parseEasyTableBlock } from './easy-table/parser'
import { renderEasyTableHtml } from './easy-table/renderer'

interface ObsidianEasyTableSettings {
  numberLocale: string
}

const DEFAULT_SETTINGS: ObsidianEasyTableSettings = {
  numberLocale: '',
}

export default class ObsidianEasyTablePlugin extends Plugin {
  settings: ObsidianEasyTableSettings = DEFAULT_SETTINGS

  async onload() {
    await this.loadSettings()
    this.addSettingTab(new ObsidianEasyTableSettingTab(this.app, this))

    this.registerMarkdownCodeBlockProcessor('easy-table', async (source, el, ctx) => {
      const parsed = parseEasyTableBlock(source)
      const locale = this.getDisplayLocale()

      el.empty()
      el.innerHTML = renderEasyTableHtml(parsed, { locale })

      const markdownNodes = Array.from(el.querySelectorAll<HTMLElement>('.easy-table-markdown'))

      for (const node of markdownNodes) {
        const markdown = node.textContent ?? ''

        node.empty()
        await MarkdownRenderer.render(this.app, markdown, node, ctx.sourcePath, this)
      }
    })
  }

  private getDisplayLocale(): string | undefined {
    const override = this.settings.numberLocale.trim()

    if (override) {
      return override
    }

    const appLanguage = getLanguage().trim()

    if (appLanguage) {
      return appLanguage
    }

    return window.navigator.language
  }

  private async loadSettings(): Promise<void> {
    const loaded = await this.loadData()
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(loaded ?? {}),
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings)
  }
}

class ObsidianEasyTableSettingTab extends PluginSettingTab {
  plugin: ObsidianEasyTablePlugin

  constructor(app: App, plugin: ObsidianEasyTablePlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()

    new Setting(containerEl)
      .setName('Number locale override')
      .setDesc('Optional locale for numeric display (example: en-US, fr-FR). Leave empty to use Obsidian language.')
      .addText((text) => {
        text
          .setPlaceholder('Use Obsidian language')
          .setValue(this.plugin.settings.numberLocale)
          .onChange(async (value) => {
            this.plugin.settings.numberLocale = value.trim()
            await this.plugin.saveSettings()
          })
      })
  }
}
