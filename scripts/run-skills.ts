import { readFileSync } from 'node:fs'
import { extname } from 'node:path'
import '../src/skills'
import { parseJSON } from '../src/parser/json-parser'
import { parseXML } from '../src/parser/xml-parser'
import { getAllSkills, matchSkills } from '../src/skills/registry'

const fixturePath = process.argv[2] ?? 'test/fixtures/sample-fpml.xml'
const raw = readFileSync(fixturePath, 'utf8')
const extension = extname(fixturePath).toLowerCase()

const fields = extension === '.json' ? parseJSON(raw) : parseXML(raw)
const skills = getAllSkills()

console.log(
  `[harness] ${skills.length} skills loaded, ${fields.length} fields parsed from ${fixturePath}`
)

for (const field of fields) {
  const matched = matchSkills({
    name: field.name,
    type: field.type,
    path: field.path,
  })

  if (matched.length === 0) {
    continue
  }

  for (const skill of matched) {
    const result = await skill.fn({
      fieldName: field.name,
      fieldPath: field.path,
      fieldValue: field.value,
      fieldType: field.type,
      context: field.context,
      minOccurs: field.minOccurs,
      maxOccurs: field.maxOccurs,
      isArray: field.isArray,
    })
    console.log(`${field.path}\t${skill.name}\t${result.confidence}\t${result.cdmPath}`)
  }
}
