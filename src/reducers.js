import { combineReducers } from 'redux'
import payments from './Payments/reducer'
import application from './Application/reducer'
import { firebaseStateReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'
export default combineReducers({
    firebase:firebaseStateReducer,
    firestore:firestoreReducer,
    application,
    payments
})