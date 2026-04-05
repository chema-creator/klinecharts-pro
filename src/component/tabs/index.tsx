import { Component, JSX, For, createSignal } from 'solid-js'

export interface Tab {
  key: string
  label: string | JSX.Element
  content: () => JSX.Element
}

export interface TabsProps {
  class?: string
  style?: JSX.CSSProperties
  tabs: Tab[]
  defaultActiveKey?: string
}

const Tabs: Component<TabsProps> = props => {
  const [active, setActive] = createSignal(props.defaultActiveKey ?? props.tabs[0]?.key ?? '')

  return (
    <div
      style={props.style}
      class={`klinecharts-pro-tabs ${props.class ?? ''}`}>
      <div class="tabs-header">
        <For each={props.tabs}>
          {tab => (
            <button
              class={`tab-item ${active() === tab.key ? 'tab-item-active' : ''}`}
              onClick={() => setActive(tab.key)}>
              {tab.label}
            </button>
          )}
        </For>
      </div>
      <div class="tabs-content">
        <For each={props.tabs}>
          {tab => (
            <div
              class="tab-panel"
              style={{ display: active() === tab.key ? 'block' : 'none' }}>
              {tab.content()}
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export default Tabs
