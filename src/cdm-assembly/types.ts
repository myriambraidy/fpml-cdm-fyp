import type { MappingIR, MappingValue, TargetPathTemplate } from '../mapping-ir/types'

export type BindingRegistry = {
  [bindingKey: string]: {
    targetPath: string
    stableIndex: number
    bindingKey: string
    sourceEntityKey?: string
    sourcePaths: string[]
  }
}

export type AssemblyNodePatch = {
  mapping: MappingIR
  target: TargetPathTemplate
  bindingKeyChain: string[]
  value: MappingValue
  sourcePath: string
}
