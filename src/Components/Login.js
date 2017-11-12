import React from 'react'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'
import {firebaseConnect} from 'react-redux-firebase'
import {connect} from 'react-redux'
import { compose } from 'redux'

const google={
    provider: 'google',
    type: 'redirect'
}
const twitter={
    provider: 'twitter',
    type: 'redirect'
}

export const Login=({firebase})=>{
    console.log(firebase)
    return [
    <Button key={0} onClick={()=>firebase.login(google)}>Login with Google</Button>,
    <Button key={1} onClick={()=>firebase.login(twitter)}>Login with Twitter</Button>
]}
Login.propTypes={
    firebase:PropTypes.shape({
        login:PropTypes.func.isRequired
    }).isRequired
}
export default /*connect(mapStateToProps)*/firebaseConnect()(Login)//compose//(
    //firebaseConnect(),
    
//)