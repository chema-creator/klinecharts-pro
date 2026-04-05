import { OverlayTemplate } from '@nofx/klinecharts'

const brush: OverlayTemplate = {
  name: 'brush',
  totalStep: 0,
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length < 2) return []
    return [
      {
        type: 'line',
        attrs: { coordinates },
        styles: {
          style: 'solid',
          smooth: true,
          size: 2,
          color: '#1677ff'
        }
      }
    ]
  }
}

export default brush
