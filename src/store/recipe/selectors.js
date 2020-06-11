import { createSelector } from 'reselect'

import * as R from 'ramda'

const getState = R.prop('recipe')

export const getItems = createSelector(getState, R.prop('items'))