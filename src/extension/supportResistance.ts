import { OverlayTemplate } from '@nofx/klinecharts'

const supportResistance: OverlayTemplate = {
  name: 'supportResistance',
  totalStep: 1,
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  lock: true,
  createPointFigures: ({ overlay, bounding }) => {
    const zones: Array<{ high: number, low: number, type: 'support' | 'resistance' }> = overlay.extendData?.zones ?? []
    if (zones.length === 0) return []

    const yAxis = overlay.extendData?.yAxis
    if (!yAxis) return []

    const figures: any[] = []
    const w = bounding.width

    for (const zone of zones) {
      const yHigh = yAxis.convertToPixel(zone.high)
      const yLow = yAxis.convertToPixel(zone.low)
      const isSupport = zone.type === 'support'
      const color = isSupport ? 'rgba(38, 166, 154, 0.08)' : 'rgba(239, 83, 80, 0.08)'
      const borderColor = isSupport ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)'

      figures.push({
        type: 'rect',
        attrs: {
          x: 0,
          y: Math.min(yHigh, yLow),
          width: w,
          height: Math.abs(yHigh - yLow)
        },
        styles: { style: 'fill', color }
      })

      figures.push({
        type: 'line',
        ignoreEvent: true,
        attrs: { coordinates: [{ x: 0, y: (yHigh + yLow) / 2 }, { x: w, y: (yHigh + yLow) / 2 }] },
        styles: { style: 'dashed', dashedValue: [4, 4], size: 0.5, color: borderColor }
      })
    }
    return figures
  }
}

export default supportResistance
