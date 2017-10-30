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
import {firebaseConnect} from 'react-redux-firebase'
import {connect} from 'react-redux'

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
export const isLate=(dueDate, paymentDate)=>{
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
}

export const Payments=withStyles(styles)(({firebase, classes})=>(
<Paper className={classes.root}>
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
            {firebase.data.payments.map(payment=>{
                const isPaymentLate=isLate(new Date(payment.dueDate), payment.paymentDate?new Date(payment.paymentDate):null)
                const isPaymentSmall=isTooSmall(payment.paymentRequired)
                const somethingWrong=isPaymentLate||isPaymentSmall
                return (
                <TableRow key={payment.id} className={somethingWrong?classes.somethingWrong:null}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell numeric>{payment.paymentRequired}</TableCell>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell numeric>{payment.payment}</TableCell>
                    {somethingWrong?<TableCell><Button>How will this impact me?</Button></TableCell>:null}
                </TableRow>
            )})}
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
            })).isRequired
        }).isRequired
    }).isRequired
}
const mapStateToProps=({firebase})=>({firebase})
export default connect(mapStateToProps)(Payments)