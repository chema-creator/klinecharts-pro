import { OverlaySettingsConfig, OverlaySettingsValues, SettingsField } from './types'

const registry: Record<string, OverlaySettingsConfig> = {}

export function registerOverlaySettings (name: string, config: OverlaySettingsConfig): void {
  registry[name] = config
}

export function getOverlaySettings (name: string): OverlaySettingsConfig | null {
  return registry[name] ?? null
}

export function getDefaultValues (config: OverlaySettingsConfig): OverlaySettingsValues {
  const values: OverlaySettingsValues = {}
  const merge = (fields: SettingsField[]) => {
    for (const f of fields) {
      values[f.key] = f.default
    }
  }
  merge(config.inputs)
  merge(config.styles)
  return values
}

const positionStyles: SettingsField[] = [
  { key: 'profitZone', labelKey: 'stg_profit_zone', type: 'colorAlpha', default: { color: '#26a69a', opacity: 15 } },
  { key: 'lossZone', labelKey: 'stg_loss_zone', type: 'colorAlpha', default: { color: '#ef5350', opacity: 15 } },
  { key: 'entryLine', labelKey: 'stg_entry_line', type: 'colorAlpha', default: { color: '#787b86', opacity: 100 } },
  { key: 'labelText', labelKey: 'stg_label_text', type: 'textStyle', default: { color: '#ffffff', size: 12 } },
  { key: 'lineWidth', labelKey: 'stg_line_width', type: 'number', default: 1, min: 1, max: 5, step: 1, precision: 0 },
  { key: 'lineStyle', labelKey: 'stg_line_style', type: 'select', default: 'solid', options: [
    { value: 'solid', labelKey: 'stg_solid' },
    { value: 'dashed', labelKey: 'stg_dashed' }
  ]}
]

const positionInputs: SettingsField[] = [
  { key: 'showLabels', labelKey: 'stg_show_labels', type: 'switch', default: true },
  { key: 'alwaysShowLabels', labelKey: 'stg_always_show_labels', type: 'switch', default: false },
  { key: 'showRR', labelKey: 'stg_show_rr', type: 'switch', default: true }
]

registerOverlaySettings('longPosition', { inputs: positionInputs, styles: positionStyles })
registerOverlaySettings('shortPosition', { inputs: positionInputs, styles: positionStyles })
