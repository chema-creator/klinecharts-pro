import { Component, JSX, For } from 'solid-js'

export interface TextStyleValue {
  color: string
  size: number
}

export interface TextStylePickerProps {
  class?: string
  style?: JSX.CSSProperties
  value: TextStyleValue
  minSize?: number
  maxSize?: number
  onChange?: (val: TextStyleValue) => void
}

const TextStylePicker: Component<TextStylePickerProps> = props => {
  let inputRef: HTMLInputElement | undefined
  const minS = () => props.minSize ?? 8
  const maxS = () => props.maxSize ?? 40

  const sizeOptions = () => {
    const opts: number[] = []
    for (let i = minS(); i <= maxS(); i += 1) {
      if (i <= 14 || i % 2 === 0) opts.push(i)
    }
    return opts
  }

  return (
    <div
      style={props.style}
      class={`klinecharts-pro-text-style-picker ${props.class ?? ''}`}>
      <div class="color-part" onClick={() => inputRef?.click()}>
        <span class="swatch" style={{ 'background-color': props.value.color }} />
        <input
          ref={inputRef}
          type="color"
          class="native-input"
          value={props.value.color}
          onInput={e => props.onChange?.({ color: (e.target as HTMLInputElement).value, size: props.value.size })}
        />
      </div>
      <select
        class="size-select"
        value={props.value.size}
        onChange={e => props.onChange?.({ color: props.value.color, size: parseInt((e.target as HTMLSelectElement).value) })}>
        <For each={sizeOptions()}>
          {s => <option value={s}>{s}px</option>}
        </For>
      </select>
    </div>
  )
}

export default TextStylePicker
