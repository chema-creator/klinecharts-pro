export interface ColorField {
  key: string
  labelKey: string
  type: 'color'
  default: string
}

export interface ColorAlphaField {
  key: string
  labelKey: string
  type: 'colorAlpha'
  default: { color: string; opacity: number }
}

export interface TextStyleField {
  key: string
  labelKey: string
  type: 'textStyle'
  default: { color: string; size: number }
  minSize?: number
  maxSize?: number
}

export interface NumberField {
  key: string
  labelKey: string
  type: 'number'
  default: number
  min?: number
  max?: number
  step?: number
  precision?: number
}

export interface SelectField {
  key: string
  labelKey: string
  type: 'select'
  default: string
  options: { value: string; labelKey: string }[]
}

export interface SwitchField {
  key: string
  labelKey: string
  type: 'switch'
  default: boolean
}

export type SettingsField = ColorField | ColorAlphaField | TextStyleField | NumberField | SelectField | SwitchField

export interface OverlaySettingsConfig {
  inputs: SettingsField[]
  styles: SettingsField[]
}

export type OverlaySettingsValues = Record<string, any>
