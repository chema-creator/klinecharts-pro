import { OverlayTemplate } from '@nofx/klinecharts'

const measure: OverlayTemplate = {
  name: 'measure',
  totalStep: 3,
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  styles: {
    polygon: {
      color: 'rgba(22, 119, 255, 0.15)'
    }
  },
  createPointFigures: ({ overlay, coordinates, bounding, barSpace, precision }) => {
    if (coordinates.length < 2) return []
    const points = overlay.points
    if (!points || points.length < 2) return []

    const p0 = points[0]
    const p1 = points[1]
    const c0 = coordinates[0]
    const c1 = coordinates[1]

    const price0 = p0.value ?? 0
    const price1 = p1.value ?? 0
    const ts0 = p0.timestamp ?? 0
    const ts1 = p1.timestamp ?? 0

    const priceDiff = price1 - price0
    const pctChange = price0 !== 0 ? (priceDiff / price0) * 100 : 0
    const barCount = ts1 !== ts0 ? Math.round(Math.abs(c1.x - c0.x) / barSpace.bar) : 0

    const isUp = priceDiff >= 0
    const bgColor = isUp ? 'rgba(38, 166, 154, 0.15)' : 'rgba(239, 83, 80, 0.15)'
    const borderColor = isUp ? '#26a69a' : '#ef5350'
    const textColor = isUp ? '#26a69a' : '#ef5350'

    const minX = Math.min(c0.x, c1.x)
    const maxX = Math.max(c0.x, c1.x)
    const minY = Math.min(c0.y, c1.y)
    const maxY = Math.max(c0.y, c1.y)

    const figures: any[] = []

    figures.push({
      type: 'rect',
      attrs: {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      },
      styles: {
        style: 'fill',
        color: bgColor
      }
    })

    figures.push({
      type: 'rect',
      attrs: {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      },
      styles: {
        style: 'stroke',
        color: borderColor,
        borderSize: 1,
        borderDashedValue: [4, 4],
        borderStyle: 'dashed'
      }
    })

    const sign = priceDiff >= 0 ? '+' : ''
    const priceDiffStr = `${sign}${priceDiff.toFixed(precision.price)}`
    const pctStr = `${sign}${pctChange.toFixed(2)}%`
    const barsStr = `${barCount} bars`

    const labelText = `${priceDiffStr}  (${pctStr})  ${barsStr}`
    const labelX = (minX + maxX) / 2
    const labelY = minY - 8

    figures.push({
      type: 'text',
      attrs: {
        x: labelX,
        y: labelY,
        text: labelText,
        align: 'center',
        baseline: 'bottom'
      },
      styles: {
        color: textColor,
        size: 12,
        family: 'Helvetica Neue, sans-serif',
        weight: 'bold'
      }
    })

    return figures
  }
}

export default measure
