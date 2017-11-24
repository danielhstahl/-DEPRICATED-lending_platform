import React from 'react'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import { firestoreConnect } from 'react-redux-firebase'
import TextField from 'material-ui/TextField';
import {connect} from 'react-redux'
import {updateText} from '../Application/actions'

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    menu: {
      width: 200,
    },
})

const getTextProps=(propName, values, onChange)=>({
    error:values[propName]&&values[propName].error,
    value:values[propName]&&values[propName].value,
    onChange:value=>onChange(value.target.value, propName)
})
const getValuesForApp=(keys, values, uid)=>{
    return keys.reduce((aggr, key)=>({
        ...aggr,
        [key]:parseFloat(values[key].value)
    }), {uid})
}
export const Application=withStyles(styles)(({values, onChange, classes, firestore, auth})=>{
    console.log(firestore)
    const keys=Object.keys(values)
    console.log(values)
    const curryTextProps=name=>getTextProps(name, values, onChange)
    return (
<Paper >
    <TextField 
        className={classes.textField}
        label="Amount"
        {...curryTextProps("amount")}
    />
    <TextField 
        className={classes.textField}
        label="Term"
        {...curryTextProps("term")}
    />
    <TextField 
        className={classes.textField}
        label="Rate"
        {...curryTextProps("rate")}
    />
    <Button 
        disabled={keys.find(key=>values[key].error)?true:false}
        raised
        onClick={()=>firestore.add('apps', getValuesForApp(keys, values, auth.uid))}
    >
        Submit
    </Button>
</Paper>
)})
const formType=PropTypes.shape({
    error:PropTypes.bool,
    values:PropTypes.oneOf([PropTypes.number, PropTypes.string])
})
Application.propTypes={
    values:PropTypes.shape({
        amount:formType,
        rate:formType,
        term:formType
    }),
    onChange:PropTypes.func,
    firestore:PropTypes.shape({
        //login:PropTypes.func.isRequired
    }).isRequired
}
const mapStateToProps=state=>({
    values:state.application,
    auth:state.firebase.auth
})
const mapDispatchToProps=dispatch=>({
    onChange:(value, propName)=>updateText(dispatch, value, propName)
})
export default firestoreConnect()(connect(mapStateToProps, mapDispatchToProps)(Application))
