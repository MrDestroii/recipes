
import * as R from 'ramda'
import { createSelector } from 'reselect'

const getState = R.prop("router")

export const getLocation = createSelector(getState, R.prop('location'))

export const getPathname = createSelector(getLocation, R.prop('pathname'))

export const compareLocations = (path) => createSelector(getPathname, R.equals(path))