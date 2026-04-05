import { Component, JSX, createSignal } from 'solid-js'

export interface ColorPickerProps {
  class?: string
  style?: JSX.CSSProperties
  value: string
  onChange?: (color: string) => void
}

export interface ColorAlphaValue {
  color: string
  opacity: number
}

export interface ColorAlphaPickerProps {
  class?: string
  style?: JSX.CSSProperties
  value: ColorAlphaValue
  onChange?: (val: ColorAlphaValue) => void
}

const ColorPicker: Component<ColorPickerProps> = props => {
  let inputRef: HTMLInputElement | undefined

  return (
    <div
      style={props.style}
      class={`klinecharts-pro-color-picker ${props.class ?? ''}`}
      onClick={() => inputRef?.click()}>
      <span class="swatch" style={{ 'background-color': props.value }} />
      <span class="hex">{props.value}</span>
      <input
        ref={inputRef}
        type="color"
        class="native-input"
        value={props.value}
        onInput={e => props.onChange?.((e.target as HTMLInputElement).value)}
      />
    </div>
  )
}

const ColorAlphaPicker: Component<ColorAlphaPickerProps> = props => {
  let inputRef: HTMLInputElement | undefined
  const [dragging, setDragging] = createSignal(false)

  const hex = () => props.value.color
  const opacity = () => props.value.opacity

  const swatchBg = () => {
    const h = hex()
    const r = parseInt(h.slice(1, 3), 16)
    const g = parseInt(h.slice(3, 5), 16)
    const b = parseInt(h.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity() / 100})`
  }

  return (
    <div
      style={props.style}
      class={`klinecharts-pro-color-alpha-picker ${props.class ?? ''}`}>
      <div class="color-part" onClick={() => inputRef?.click()}>
        <span class="swatch" style={{ 'background-color': swatchBg() }} />
        <span class="hex">{hex()}</span>
        <input
          ref={inputRef}
          type="color"
          class="native-input"
          value={hex()}
          onInput={e => props.onChange?.({ color: (e.target as HTMLInputElement).value, opacity: opacity() })}
        />
      </div>
      <div class="opacity-part">
        <input
          type="range"
          class="opacity-slider"
          min="5"
          max="100"
          step="5"
          value={opacity()}
          onInput={e => {
            setDragging(true)
            props.onChange?.({ color: hex(), opacity: parseInt((e.target as HTMLInputElement).value) })
          }}
          onChange={() => setDragging(false)}
        />
        <span class="opacity-val">{opacity()}%</span>
      </div>
    </div>
  )
}

export { ColorAlphaPicker }
export default ColorPicker
