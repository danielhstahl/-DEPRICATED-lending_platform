import React from 'react'
import Login from './Components/Login'
import Payments from './Components/Payments'
import { CircularProgress } from 'material-ui/Progress'
import {connect} from 'react-redux'
import { isEmpty, isLoaded } from 'react-redux-firebase'

export const App=({auth, match})=>(
    isLoaded(auth)?(isEmpty(auth)?<Login/>:<Payments match={match}/>):<CircularProgress/>
)
const mapStateToProps=({firebase})=>({auth:firebase.auth})
export default connect(mapStateToProps)(App)