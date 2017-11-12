import React from 'react'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import TextField from 'material-ui/TextField';
import { compose } from 'redux'
import {connect} from 'react-redux'
import {Link, Route} from 'react-router-dom'
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
export const Application=withStyles(styles)(({values, onChange, classes, firestore})=>{
    console.log(firestore)
    return (
<Paper >
    <TextField 
        className={classes.textField}
        label="Amount"
        {...getTextProps("amount", values, onChange)}
    />
    <TextField 
        className={classes.textField}
        label="Term"
        {...getTextProps("term", values, onChange)}
    />
    <TextField 
        className={classes.textField}
        label="Rate"
        {...getTextProps("rate", values, onChange)}
    />
    <Button 
        disabled={Object.keys(values).find(key=>values[key].error)}
        raised
        onClick={()=>firestore.add(Object.keys(values).reduce((aggr, key)=>({
            ...aggr,
            [key]:values[key].value
        }), {decision:true}))}
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
    values:state.application
})
const mapDispatchToProps=dispatch=>({
    onChange:(value, propName)=>updateText(dispatch, value, propName)
})
export default firestoreConnect()(connect(mapStateToProps, mapDispatchToProps)(Application))
