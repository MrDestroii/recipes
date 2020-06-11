import { createSelector } from 'reselect'

import * as R from 'ramda'

const getState = R.prop('auth')

export const getIsLogged = createSelector(getState, R.prop('isLogged'))

export const getProfile = createSelector(getState, R.prop('profile'))

export const profileIsNull = createSelector(getProfile, R.isNil)