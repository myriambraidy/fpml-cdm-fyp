import {
  ensureCdmRosettaPreflightReport,
  renderCdmRosettaPreflightMarkdown,
} from '../src/java-generator-agent/cdm-rosetta-preflight'

const report = await ensureCdmRosettaPreflightReport()
console.log(renderCdmRosettaPreflightMarkdown(report))

if (report.status !== 'passed') {
  process.exitCode = 1
}
