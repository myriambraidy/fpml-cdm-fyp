export const GENERATED_JAVA_VERSION = '11'
export const CDM_JAVA_VERSION = '6.7.0'

export const GENERATED_BASE_PACKAGE = 'com.fpml.cdm.fx.mapper'
export const GENERATED_IMPL_PACKAGE = 'com.fpml.cdm.fx.mapper.generated'
export const GENERATED_IMPL_CLASS = 'GeneratedFpmlToCdmMapper'
export const GENERATED_ARTIFACT_ID = 'fpml-cdm-rosetta-mapper'
export const GENERATED_JAR_NAME = 'fpml-cdm-rosetta-mapper'

export const GENERATED_IMPL_SOURCE_ROOT = 'src/main/java/com/fpml/cdm/fx/mapper/generated'

export type RuntimeFixture = {
  id: string
  fixtureFileName: string
  fpmlPath: string
  expectedCdmPath: string
}

export const FX_SINGLE_LEG_RUNTIME_FIXTURES: RuntimeFixture[] = [
  {
    id: 'fx-ex01-fx-spot',
    fixtureFileName: 'fx-ex01-fx-spot.xml',
    fpmlPath: 'data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml',
    expectedCdmPath: 'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json',
  },
  {
    id: 'fx-ex02-spot-cross-w-side-rates',
    fixtureFileName: 'fx-ex02-spot-cross-w-side-rates.xml',
    fpmlPath: 'data_to_learn_from/fpml/fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml',
    expectedCdmPath:
      'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex02-spot-cross-w-side-rates.json',
  },
  {
    id: 'fx-ex03-fx-fwd',
    fixtureFileName: 'fx-ex03-fx-fwd.xml',
    fpmlPath: 'data_to_learn_from/fpml/fx-derivatives/fx-ex03-fx-fwd.xml',
    expectedCdmPath: 'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex03-fx-fwd.json',
  },
  {
    id: 'fx-ex04-fx-fwd-w-settlement',
    fixtureFileName: 'fx-ex04-fx-fwd-w-settlement.xml',
    fpmlPath: 'data_to_learn_from/fpml/fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml',
    expectedCdmPath:
      'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex04-fx-fwd-w-settlement.json',
  },
  {
    id: 'fx-ex05-fx-fwd-w-ssi',
    fixtureFileName: 'fx-ex05-fx-fwd-w-ssi.xml',
    fpmlPath: 'data_to_learn_from/fpml/fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml',
    expectedCdmPath: 'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex05-fx-fwd-w-ssi.json',
  },
  {
    id: 'fx-ex06-fx-fwd-w-splits',
    fixtureFileName: 'fx-ex06-fx-fwd-w-splits.xml',
    fpmlPath: 'data_to_learn_from/fpml/fx-derivatives/fx-ex06-fx-fwd-w-splits.xml',
    expectedCdmPath:
      'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex06-fx-fwd-w-splits.json',
  },
  {
    id: 'fx-ex07-non-deliverable-forward',
    fixtureFileName: 'fx-ex07-non-deliverable-forward.xml',
    fpmlPath: 'data_to_learn_from/fpml/fx-derivatives/fx-ex07-non-deliverable-forward.xml',
    expectedCdmPath:
      'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex07-non-deliverable-forward.json',
  },
]

export const DEFAULT_RUNTIME_FIXTURES: RuntimeFixture[] = FX_SINGLE_LEG_RUNTIME_FIXTURES
