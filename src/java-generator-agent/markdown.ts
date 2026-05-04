export const fence = (language: string, content: string): string =>
  ['```' + language, content, '```'].join('\n')

export const heading = (level: number, title: string): string =>
  `${'#'.repeat(level)} ${title}`

export const bulletList = (items: string[]): string =>
  items.length === 0 ? '- none' : items.map(item => `- ${item}`).join('\n')

export const truncateForLog = (text: string, maxLength = 4000): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength)}\n...[truncated]`
