import { describe, expect, test } from 'bun:test'
import { CDM_JAVA_VERSION } from '../../src/java-generator-agent/java-contract'
import {
  readRosettaValidatorPom,
  rosettaValidatorJarPath,
  rosettaValidatorPomPath,
} from '../../src/java-generator-agent/rosetta-validator-bridge'

describe('rosetta validator bridge', () => {
  test('points to the repo-local Maven module and pinned CDM dependency', async () => {
    const pom = await readRosettaValidatorPom()

    expect(rosettaValidatorPomPath()).toContain('rosetta-validator')
    expect(rosettaValidatorJarPath()).toContain('rosetta-validator-1.0.0.jar')
    expect(pom).toContain(`<cdm.version>${CDM_JAVA_VERSION}</cdm.version>`)
    expect(pom).toContain('<artifactId>cdm-java</artifactId>')
    expect(pom).toContain('<artifactId>maven-shade-plugin</artifactId>')
    expect(pom).toContain('<source>${project.basedir}/generated</source>')
  })
})
