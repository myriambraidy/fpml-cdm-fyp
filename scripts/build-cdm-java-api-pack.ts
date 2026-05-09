import {
  buildCdmJavaApiPack,
  cdmJavaApiIndexPath,
  cdmJavaApiPackMarkdownPath,
  cdmJavaApiSummaryMarkdownPath,
  cdmJavaFxSingleLegPackMarkdownPath,
  cdmJavaMissingClassesPath,
  ensureCdmJavaApiPack,
} from '../src/java-generator-agent/cdm-java-api-pack'
import { CDM_JAVA_VERSION } from '../src/java-generator-agent/java-contract'

const checkOnly = process.argv.includes('--check')

if (checkOnly) {
  const pack = await ensureCdmJavaApiPack(CDM_JAVA_VERSION)
  console.log(`CDM Java API pack ready for ${pack.manifest.groupId}:${pack.manifest.artifactId}:${pack.manifest.version}`)
  console.log(cdmJavaApiIndexPath(CDM_JAVA_VERSION))
  console.log(cdmJavaApiPackMarkdownPath(CDM_JAVA_VERSION))
  console.log(cdmJavaFxSingleLegPackMarkdownPath(CDM_JAVA_VERSION))
  console.log(cdmJavaApiSummaryMarkdownPath(CDM_JAVA_VERSION))
  console.log(cdmJavaMissingClassesPath(CDM_JAVA_VERSION))
} else {
  const pack = await buildCdmJavaApiPack(CDM_JAVA_VERSION)
  console.log(`Built CDM Java API pack for ${pack.manifest.groupId}:${pack.manifest.artifactId}:${pack.manifest.version}`)
  console.log(`Indexed classes: ${pack.index.classes.length}`)
  console.log(`Prompt seed classes: ${pack.index.promptSeedClasses.length}`)
  console.log(`Missing-class observations: ${pack.missingClassObservations.length}`)
  console.log(cdmJavaFxSingleLegPackMarkdownPath(CDM_JAVA_VERSION))
}
