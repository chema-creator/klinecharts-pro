import { Component, createSignal, For } from 'solid-js'

import { Modal, Input, Select, Switch, ColorPicker, ColorAlphaPicker, Tabs, TextStylePicker } from '../../component'
import type { Tab } from '../../component'
import i18n from '../../i18n'
import { OverlaySettingsConfig, OverlaySettingsValues, SettingsField, TextStyleField } from './types'
import { getDefaultValues } from './registry'

export interface OverlaySettingsModalProps {
  locale: string
  overlayName: string
  config: OverlaySettingsConfig
  currentValues: OverlaySettingsValues
  onClose: () => void
  onConfirm: (values: OverlaySettingsValues) => void
}

const OverlaySettingsModal: Component<OverlaySettingsModalProps> = props => {
  const defaults = getDefaultValues(props.config)
  const merged = { ...defaults, ...props.currentValues }
  const [values, setValues] = createSignal<OverlaySettingsValues>({ ...merged })

  const updateField = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const renderField = (field: SettingsField) => {
    switch (field.type) {
      case 'color':
        return (
          <ColorPicker
            value={values()[field.key] ?? field.default}
            onChange={v => updateField(field.key, v)}
          />
        )
      case 'colorAlpha':
        return (
          <ColorAlphaPicker
            value={values()[field.key] ?? field.default}
            onChange={v => updateField(field.key, v)}
          />
        )
      case 'textStyle': {
        const tsField = field as TextStyleField
        return (
          <TextStylePicker
            value={values()[field.key] ?? field.default}
            minSize={tsField.minSize}
            maxSize={tsField.maxSize}
            onChange={v => updateField(field.key, v)}
          />
        )
      }
      case 'number':
        return (
          <Input
            style={{ width: '100px' }}
            value={values()[field.key] ?? field.default}
            precision={field.precision}
            min={field.min}
            max={field.max}
            onChange={v => updateField(field.key, v)}
          />
        )
      case 'select':
        return (
          <Select
            style={{ width: '140px' }}
            value={i18n(field.options.find(o => o.value === values()[field.key])?.labelKey ?? '', props.locale) || values()[field.key]}
            dataSource={field.options.map(o => ({ key: o.value, text: i18n(o.labelKey, props.locale) || o.value }))}
            onSelected={d => {
              const item = d as { key: string; text: any }
              updateField(field.key, item.key)
            }}
          />
        )
      case 'switch':
        return (
          <Switch
            open={values()[field.key] ?? field.default}
            onChange={() => updateField(field.key, !values()[field.key])}
          />
        )
    }
  }

  const renderFieldList = (fields: SettingsField[]) => (
    <div class="klinecharts-pro-overlay-settings-grid">
      <For each={fields}>
        {field => (
          <>
            <label class="field-label">
              {i18n(field.labelKey, props.locale) || field.labelKey}
            </label>
            <div class="field-control">
              {renderField(field)}
            </div>
          </>
        )}
      </For>
    </div>
  )

  const hasInputs = props.config.inputs.length > 0
  const hasStyles = props.config.styles.length > 0

  const tabs: Tab[] = []
  if (hasInputs) {
    tabs.push({
      key: 'inputs',
      label: i18n('stg_tab_inputs', props.locale) || 'Inputs',
      content: () => renderFieldList(props.config.inputs)
    })
  }
  if (hasStyles) {
    tabs.push({
      key: 'styles',
      label: i18n('stg_tab_style', props.locale) || 'Style',
      content: () => renderFieldList(props.config.styles)
    })
  }

  const overlayLabel = i18n(props.overlayName.replace(/([A-Z])/g, '_$1').toLowerCase(), props.locale) || props.overlayName

  return (
    <Modal
      title={`${overlayLabel} — ${i18n('setting', props.locale)}`}
      width={440}
      buttons={[
        {
          children: i18n('restore_default', props.locale),
          onClick: () => setValues({ ...defaults })
        },
        {
          type: 'confirm',
          children: i18n('confirm', props.locale),
          onClick: () => {
            props.onConfirm(values())
            props.onClose()
          }
        }
      ]}
      onClose={props.onClose}>
      {tabs.length > 0
        ? <Tabs tabs={tabs} defaultActiveKey={tabs[0].key} />
        : <div class="klinecharts-pro-overlay-settings-empty">
            {i18n('stg_no_settings', props.locale) || 'No settings available'}
          </div>
      }
    </Modal>
  )
}

export default OverlaySettingsModal
