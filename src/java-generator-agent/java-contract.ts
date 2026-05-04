export const GENERATED_JAVA_VERSION = '11'

export const GENERATED_BASE_PACKAGE = 'com.fpml.cdm.fx.mapper'
export const GENERATED_IMPL_PACKAGE = 'com.fpml.cdm.fx.mapper.generated'
export const GENERATED_IMPL_CLASS = 'GeneratedFpmlToCdmMapper'

export const GENERATED_IMPL_SOURCE_ROOT = 'src/main/java/com/fpml/cdm/fx/mapper/generated'

export type RuntimeFixture = {
  id: string
  fixtureFileName: string
  fpmlPath: string
  expectedCdmPath: string
}

export const DEFAULT_RUNTIME_FIXTURES: RuntimeFixture[] = [
  {
    id: 'fx-ex01-fx-spot',
    fixtureFileName: 'fx-ex01-fx-spot.xml',
    fpmlPath: 'data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml',
    expectedCdmPath: 'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json',
  },
]

