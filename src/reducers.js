import { combineReducers } from 'redux'
//import payments from './Payments/reducer'
import { firebaseStateReducer } from 'react-redux-firebase'

export default combineReducers({
    firebase:firebaseStateReducer
})