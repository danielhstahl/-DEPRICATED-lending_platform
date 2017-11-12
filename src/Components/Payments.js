import React from 'react'
import Button from 'material-ui/Button'
import Table, {
    TableBody,
    TableCell,
    TableRow,
    TableHead
} from 'material-ui/Table'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
import PropTypes from 'prop-types'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import { compose } from 'redux'
import {connect} from 'react-redux'
import {Link, Route} from 'react-router-dom'
import { CircularProgress } from 'material-ui/Progress';
import PaymentModal from './PaymentModal'
const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
    somethingWrong:{backgroundColor:theme.palette.secondary.A100}
})
/**We may have to implement this logic client side...
 * it seems I can't execute a FaaS based solely on querying?? */
/**this logic, like all business logic, should be in the FaaS */
/*export const isLate=(dueDate, paymentDate)=>{
    if(!paymentDate){
        return dueDate<new Date()
    }
    if(dueDate<paymentDate){
        return true
    }
    return false
}
export const isTooSmall=(required, actual)=>{
    return actual<required
}*/

export const Payments=withStyles(styles)(({classes, match, payments})=>(
<Paper className={classes.root}>
    <Route path={`${match.url}/modal/:id`} component={PaymentModal}/> 
    <Table className={classes.table}>
        <TableHead>
            <TableRow>
                <TableCell>Transaction Number</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell numeric>Required Payment</TableCell>
                <TableCell >Payment Date</TableCell>
                <TableCell numeric>Payment Made</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {isLoaded(payments)?payments.map(({id, dueDate, paymentRequired, paymentDate, payment, issue, impact})=>(
                <TableRow key={id} className={issue?classes.somethingWrong:null}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{dueDate}</TableCell>
                    <TableCell numeric>{paymentRequired}</TableCell>
                    <TableCell>{paymentDate}</TableCell>
                    <TableCell numeric>{payment}</TableCell>
                    {issue?<TableCell>
                        <Link to={`${match.url}/modal/${id}`}>
                            <Button>
                                How will this impact me?
                            </Button>
                        </Link>
                    </TableCell>:null}
                </TableRow>
            )):<CircularProgress/>}
        </TableBody>
    </Table>
</Paper>
))
Payments.propTypes={
    firebase:PropTypes.shape({
        data:PropTypes.shape({
            payments:PropTypes.arrayOf(PropTypes.shape({
                id:PropTypes.string.isRequired,
                dueDate:PropTypes.string.isRequired, //potentially change this to JS date
                payment:PropTypes.number,
                paymentDate:PropTypes.string,//potentially change this to JS date
                paymentRequired:PropTypes.number.isRequired,
                issue:PropTypes.string,
                impact:PropTypes.string
            }))
        }).isRequired
    }).isRequired,
}
const Test=({payments})=>{
    console.log(payments)
    return (<div>Hello world</div>)
}

export default compose(
    firestoreConnect([
      'payments' //  \
    ]),
    connect(
      ({firestore}) => ({
        payments: firestore.data.payments,
        // profile: state.firebase.profile // load profile
      })
    )
  )(Payments)
