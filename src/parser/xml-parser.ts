import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { normalizeFields } from './normalizer'
import type { Field } from './types'

type XmlPrimitive = string | number | boolean | null
type XmlObject = { [key: string]: XmlValue }
type XmlArray = XmlValue[]
type XmlValue = XmlPrimitive | XmlObject | XmlArray

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
})

const isObject = (value: XmlValue): value is XmlObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const inferType = (value: unknown): string => {
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  return typeof value
}

const emitField = (
  out: Field[],
  name: string,
  path: string,
  value: string | undefined,
  ancestors: string[],
  parentName: string | undefined,
  parentPath: string | undefined,
  attributes: Record<string, string | undefined>
): void => {
  const href = attributes.href
  out.push({
    name,
    path,
    value: value ?? href,
    type: value !== undefined ? inferType(value) : 'object',
    context: {
      parentName,
      parentPath,
      ancestors,
      attributes,
      href,
    },
  })
}

const walkXml = (
  node: XmlValue,
  nodeName: string,
  path: string,
  ancestors: string[],
  parentName: string | undefined,
  parentPath: string | undefined,
  out: Field[]
): void => {
  if (Array.isArray(node)) {
    out.push({
      name: nodeName,
      path,
      type: 'array',
      isArray: true,
      context: {
        parentName,
        parentPath,
        ancestors,
        length: node.length,
      },
    })

    node.forEach((child, index) => {
      walkXml(child, nodeName, `${path}[${index}]`, ancestors, parentName, path, out)
    })
    return
  }

  if (!isObject(node)) {
    emitField(
      out,
      nodeName,
      path,
      node == null ? undefined : String(node),
      ancestors,
      parentName,
      parentPath,
      {}
    )
    return
  }

  const attributes: Record<string, string | undefined> = {}
  const childEntries: Array<[string, XmlValue]> = []
  let textValue: string | undefined

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('@_')) {
      attributes[key.slice(2)] = value == null ? undefined : String(value)
      continue
    }
    if (key === '#text') {
      textValue = value == null ? undefined : String(value)
      continue
    }
    childEntries.push([key, value])
  }

  const isAttributeOnlyNode = childEntries.length === 0 && Object.keys(attributes).length > 0
  const hasDirectText = childEntries.length === 0 && textValue !== undefined

  if (hasDirectText || isAttributeOnlyNode) {
    emitField(out, nodeName, path, textValue, ancestors, parentName, parentPath, attributes)
  }

  for (const [childName, childValue] of childEntries) {
    if (childName === '?xml') continue
    const childPath = `${path}/${childName}`
    walkXml(
      childValue,
      childName,
      childPath,
      [...ancestors, nodeName],
      nodeName,
      path,
      out
    )
  }
}

export const parseXML = (xml: string): Field[] => {
  const valid = XMLValidator.validate(xml)
  if (valid !== true) {
    throw new Error(`Invalid XML: ${valid.err.msg} (line ${valid.err.line})`)
  }

  const parsed = parser.parse(xml) as Record<string, XmlValue>
  const fields: Field[] = []

  for (const [rootName, rootNode] of Object.entries(parsed)) {
    if (rootName === '?xml') continue
    walkXml(rootNode, rootName, `/${rootName}`, [], undefined, undefined, fields)
  }

  return normalizeFields(fields)
}
