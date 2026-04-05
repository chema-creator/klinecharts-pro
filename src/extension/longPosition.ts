import { OverlayTemplate } from '@nofx/klinecharts'

const DEFAULTS = {
  profitZone: { color: '#26a69a', opacity: 15 },
  lossZone: { color: '#ef5350', opacity: 15 },
  entryLine: { color: '#787b86', opacity: 100 },
  labelText: { color: '#ffffff', size: 12 },
  lineWidth: 1,
  lineStyle: 'solid' as 'solid' | 'dashed',
  showLabels: true,
  showRR: true,
  alwaysShowLabels: false
}

function hexToRgba (hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

function merge<T> (defaults: T, overrides: any): T {
  if (!overrides) return { ...defaults }
  const result: any = { ...defaults }
  for (const k of Object.keys(result)) {
    if (overrides[k] !== undefined) {
      if (typeof result[k] === 'object' && result[k] !== null && !Array.isArray(result[k])) {
        result[k] = { ...result[k], ...overrides[k] }
      } else {
        result[k] = overrides[k]
      }
    }
  }
  return result
}

const LABEL_PADDING = { paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }

function createPositionOverlay (isLong: boolean): OverlayTemplate {
  const name = isLong ? 'longPosition' : 'shortPosition'

  return {
    name,
    totalStep: 4,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    createPointFigures: ({ overlay, coordinates, precision }) => {
      if (coordinates.length < 2) return []
      const points = overlay.points
      if (!points || points.length < 2) return []

      const s = merge(DEFAULTS, overlay.extendData?.settings)
      const hovered = overlay.extendData?._hovered === true
      const selected = overlay.extendData?._selected === true
      const labelsVisible = s.showLabels && (s.alwaysShowLabels || hovered || selected)

      const entry = points[0].value ?? 0
      const c0 = coordinates[0]
      const c1 = coordinates[1]

      const left = Math.min(c0.x, c1.x)
      const right = Math.max(c0.x, c1.x)
      const boxW = right - left
      if (boxW < 2) return []
      const midX = left + boxW / 2

      const tp = points[1].value ?? 0
      const tpDiff = tp - entry
      const tpPct = entry !== 0 ? (tpDiff / entry * 100) : 0
      const tpIsProfit = isLong ? tpDiff >= 0 : tpDiff <= 0
      const tpZone = tpIsProfit ? s.profitZone : s.lossZone

      const figures: any[] = []
      const tpTop = Math.min(c0.y, c1.y)
      const tpBottom = Math.max(c0.y, c1.y)

      figures.push({
        type: 'rect',
        attrs: { x: left, y: tpTop, width: boxW, height: tpBottom - tpTop },
        styles: { style: 'fill', color: hexToRgba(tpZone.color, tpZone.opacity) }
      })

      figures.push({
        type: 'line',
        attrs: { coordinates: [{ x: left, y: c1.y }, { x: right, y: c1.y }] },
        styles: { style: s.lineStyle, size: s.lineWidth, color: tpZone.color, dashedValue: [6, 4] }
      })

      figures.push({
        type: 'line',
        attrs: { coordinates: [{ x: left, y: c0.y }, { x: right, y: c0.y }] },
        styles: { style: 'dashed', dashedValue: [6, 4], size: s.lineWidth, color: s.entryLine.color }
      })

      if (labelsVisible) {
        const tpSign = tpDiff >= 0 ? '+' : ''
        const tpLabel = `Target: ${tpSign}${tpDiff.toFixed(precision.price)} (${tpSign}${tpPct.toFixed(2)}%)`
        const tpAbove = c1.y < c0.y
        figures.push({
          type: 'text',
          ignoreEvent: true,
          attrs: {
            x: midX,
            y: tpAbove ? c1.y - 2 : c1.y + 2,
            text: tpLabel,
            align: 'center',
            baseline: tpAbove ? 'bottom' : 'top'
          },
          styles: {
            color: s.labelText.color,
            size: s.labelText.size,
            family: 'Helvetica Neue, sans-serif',
            weight: 'normal',
            backgroundColor: s.profitZone.color,
            borderRadius: 3,
            ...LABEL_PADDING
          }
        })
      }

      if (coordinates.length >= 3 && points.length >= 3) {
        const sl = points[2].value ?? 0
        const c2 = coordinates[2]
        const slDiff = sl - entry
        const slPct = entry !== 0 ? (slDiff / entry * 100) : 0
        const slIsLoss = isLong ? slDiff < 0 : slDiff > 0
        const slZone = slIsLoss ? s.lossZone : s.profitZone

        const slTop = Math.min(c0.y, c2.y)
        const slBottom = Math.max(c0.y, c2.y)

        figures.push({
          type: 'rect',
          attrs: { x: left, y: slTop, width: boxW, height: slBottom - slTop },
          styles: { style: 'fill', color: hexToRgba(slZone.color, slZone.opacity) }
        })

        figures.push({
          type: 'line',
          attrs: { coordinates: [{ x: left, y: c2.y }, { x: right, y: c2.y }] },
          styles: { style: s.lineStyle, size: s.lineWidth, color: slZone.color, dashedValue: [6, 4] }
        })

        if (labelsVisible) {
          const slSign = slDiff >= 0 ? '+' : ''
          const slLabel = `Stop: ${slSign}${slDiff.toFixed(precision.price)} (${slSign}${slPct.toFixed(2)}%)`
          const slBelow = c2.y > c0.y
          figures.push({
            type: 'text',
            ignoreEvent: true,
            attrs: {
              x: midX,
              y: slBelow ? c2.y + 2 : c2.y - 2,
              text: slLabel,
              align: 'center',
              baseline: slBelow ? 'top' : 'bottom'
            },
            styles: {
              color: s.labelText.color,
              size: s.labelText.size,
              family: 'Helvetica Neue, sans-serif',
              weight: 'normal',
              backgroundColor: s.lossZone.color,
              borderRadius: 3,
              ...LABEL_PADDING
            }
          })

          const rr = slDiff !== 0 ? Math.abs(tpDiff / slDiff) : 0
          const entryParts = [`P&L: ${entry.toFixed(precision.price)}`]
          if (s.showRR) entryParts.push(`R:R ${rr.toFixed(2)}`)
          const entryBgColor = tpIsProfit ? s.profitZone.color : s.lossZone.color

          figures.push({
            type: 'text',
            ignoreEvent: true,
            attrs: {
              x: midX,
              y: c0.y,
              text: entryParts.join('  |  '),
              align: 'center',
              baseline: 'middle'
            },
            styles: {
              color: s.labelText.color,
              size: s.labelText.size,
              family: 'Helvetica Neue, sans-serif',
              weight: 'bold',
              backgroundColor: entryBgColor,
              borderRadius: 3,
              borderSize: 1,
              borderColor: s.labelText.color,
              ...LABEL_PADDING
            }
          })
        }
      } else if (labelsVisible) {
        figures.push({
          type: 'text',
          ignoreEvent: true,
          attrs: {
            x: midX,
            y: c0.y,
            text: `Entry: ${entry.toFixed(precision.price)}`,
            align: 'center',
            baseline: 'middle'
          },
          styles: {
            color: s.labelText.color,
            size: s.labelText.size,
            family: 'Helvetica Neue, sans-serif',
            weight: 'bold',
            backgroundColor: s.entryLine.color,
            borderRadius: 3,
            ...LABEL_PADDING
          }
        })
      }

      return figures
    }
  }
}

export const longPosition = createPositionOverlay(true)
export const shortPosition = createPositionOverlay(false)
