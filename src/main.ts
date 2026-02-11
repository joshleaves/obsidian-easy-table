import { MarkdownRenderer, Plugin } from 'obsidian'
import { parseEasyTableBlock } from './easy-table/parser'
import { renderEasyTableHtml } from './easy-table/renderer'

export default class ObsidianEasyTablePlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor('easy-table', async (source, el, ctx) => {
      const parsed = parseEasyTableBlock(source)

      el.empty()
      el.innerHTML = renderEasyTableHtml(parsed)

      const markdownNodes = Array.from(el.querySelectorAll<HTMLElement>('.easy-table-markdown'))

      for (const node of markdownNodes) {
        const markdown = node.textContent ?? ''

        node.empty()
        await MarkdownRenderer.render(this.app, markdown, node, ctx.sourcePath, this)
      }
    })
  }
}
