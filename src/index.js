import mapRange from 'range-fit'
import map from 'lodash.map'
import isNull from 'lodash.isnull'
import { Observable } from 'rx'

const ranges = {
  alpha: [0, 360],
  beta: [-180, 180],
  gamma: [-90, 90]
}

function mapToRange (val, key) {
  try {
    const [lowerInitial, upperInitial] = ranges[key]
    return isNull(val) ? 0 : mapRange(val, lowerInitial, upperInitial, 0, 1)
  } catch (e) {
    return 0
  }
}

export function createOrientationStream () {
  if (window.DeviceOrientationEvent) {
    return Observable.fromEvent(window, 'deviceorientation')
    .map(({alpha, beta, gamma}) => ({alpha, beta, gamma}))
    .map(vals => map(vals, mapToRange))
    .startWith([0, 0, 0])
  } else {
    console.warn('no DeviceOrientationEvent detected')
    return Observable.return([0, 0, 0])
  }
}
