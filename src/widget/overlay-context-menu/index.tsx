import { Component, onCleanup, createSignal } from 'solid-js'
import i18n from '../../i18n'

export interface OverlayToolbarProps {
  locale: string
  overlayId: string
  x: number
  y: number
  onRemove: (id: string) => void
  onLock: (id: string, lock: boolean) => void
  onSettings: (id: string) => void
  isLocked: boolean
  onClose: () => void
  onPositionChange?: (x: number, y: number) => void
}

const OverlayToolbar: Component<OverlayToolbarProps> = props => {
  let dragState: { startX: number, startY: number, origX: number, origY: number } | null = null

  const [pos, setPos] = createSignal({ x: props.x, y: props.y })

  const onDragMove = (e: MouseEvent) => {
    if (!dragState) return
    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY
    setPos({ x: dragState.origX + dx, y: dragState.origY + dy })
  }

  const onDragEnd = () => {
    if (dragState) {
      props.onPositionChange?.(pos().x, pos().y)
      dragState = null
    }
    document.removeEventListener('mousemove', onDragMove)
    document.removeEventListener('mouseup', onDragEnd)
  }

  const onHandleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragState = { startX: e.clientX, startY: e.clientY, origX: pos().x, origY: pos().y }
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragEnd)
  }

  onCleanup(() => {
    document.removeEventListener('mousemove', onDragMove)
    document.removeEventListener('mouseup', onDragEnd)
  })

  return (
    <div
      class="klinecharts-pro-overlay-toolbar"
      style={{
        position: 'absolute',
        left: `${pos().x}px`,
        top: `${pos().y}px`,
        'z-index': '100'
      }}>
      <div
        class="toolbar-handle"
        onMouseDown={onHandleMouseDown}>
        <svg viewBox="0 0 16 16" width="16" height="16">
          <circle cx="5" cy="4" r="1" fill="currentColor"/>
          <circle cx="11" cy="4" r="1" fill="currentColor"/>
          <circle cx="5" cy="8" r="1" fill="currentColor"/>
          <circle cx="11" cy="8" r="1" fill="currentColor"/>
          <circle cx="5" cy="12" r="1" fill="currentColor"/>
          <circle cx="11" cy="12" r="1" fill="currentColor"/>
        </svg>
      </div>
      <span class="toolbar-sep"/>
      <button
        class="toolbar-btn"
        title={i18n('setting', props.locale)}
        onClick={() => props.onSettings(props.overlayId)}>
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M6.5 1L6.1 3.1a5.02 5.02 0 0 0-1.27.73L2.8 2.97l-1.5 2.6 1.96 1.16a5.1 5.1 0 0 0 0 1.54L1.3 9.43l1.5 2.6 2.03-.86c.38.3.8.55 1.27.73L6.5 14h3l.4-2.1a5.02 5.02 0 0 0 1.27-.73l2.03.86 1.5-2.6-1.96-1.16a5.1 5.1 0 0 0 0-1.54l1.96-1.16-1.5-2.6-2.03.86a5.02 5.02 0 0 0-1.27-.73L9.5 1h-3zM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="currentColor"/>
        </svg>
      </button>
      <button
        class="toolbar-btn"
        title={props.isLocked ? i18n('ctx_unlock', props.locale) : i18n('ctx_lock', props.locale)}
        onClick={() => props.onLock(props.overlayId, !props.isLocked)}>
        <svg viewBox="0 0 16 16" width="16" height="16">
          {props.isLocked
            ? <path d="M11 5V4a3 3 0 0 0-6 0v1H4v7h8V5h-1zm-4-1a1 1 0 1 1 2 0v1H7V4zm4 7H5V6h6v5z" fill="currentColor"/>
            : <path d="M11 5h1v7H4V5h5V4a1 1 0 0 0-2 0v1H5V4a3 3 0 0 1 6 0v1zm0 1H5v5h6V6z" fill="currentColor"/>
          }
        </svg>
      </button>
      <button
        class="toolbar-btn toolbar-btn-danger"
        title={i18n('ctx_remove', props.locale)}
        onClick={() => {
          props.onRemove(props.overlayId)
          props.onClose()
        }}>
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M6 2h4v1H6V2zM3 4v1h1v8h8V5h1V4H3zm2 1h6v7H5V5zm1 1v5h1V6H6zm3 0v5h1V6H9z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  )
}

export default OverlayToolbar
