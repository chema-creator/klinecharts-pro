import arrow from './arrow'
import brush from './brush'

import circle from './circle'
import rect from './rect'
import parallelogram from './parallelogram'
import triangle from './triangle'
import fibonacciCircle from './fibonacciCircle'
import fibonacciSegment from './fibonacciSegment'
import fibonacciSpiral from './fibonacciSpiral'
import fibonacciSpeedResistanceFan from './fibonacciSpeedResistanceFan'
import fibonacciExtension from './fibonacciExtension'
import gannBox from './gannBox'
import threeWaves from './threeWaves'
import fiveWaves from './fiveWaves'
import eightWaves from './eightWaves'
import anyWaves from './anyWaves'
import { longPosition, shortPosition } from './longPosition'
import measure from './measure'
import supportResistance from './supportResistance'
import abcd from './abcd'
import xabcd from './xabcd'

const overlays = [
  arrow, brush,
  circle, rect, triangle, parallelogram,
  fibonacciCircle, fibonacciSegment, fibonacciSpiral,
  fibonacciSpeedResistanceFan, fibonacciExtension, gannBox,
  threeWaves, fiveWaves, eightWaves, anyWaves, abcd, xabcd,
  measure, longPosition, shortPosition, supportResistance
]

export default overlays
