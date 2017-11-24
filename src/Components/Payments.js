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
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
import PropTypes from 'prop-types'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import {selectLoan} from '../Payments/actions'
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

const internalSelect=(loans, loan, onSelect)=>(
<Select key="select" value={loan||"def"} onChange={onSelect}>
    <MenuItem value="def">Select a Loan</MenuItem>
    {Object.keys(loans).map(val=>(
        <MenuItem key={val} value={val}>{val}</MenuItem>
    ))}
</Select>
)

const internalTable=(classes, loans, loan, match)=>(
<Table key="table" className={classes.table}>
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
        {loans[loan]?loans[loan].schedule.map(({paymentNumber, dueDate, payment, paymentDate, issue, impact})=>(
            <TableRow key={paymentNumber} className={issue?classes.somethingWrong:null}>
                <TableCell>{paymentNumber}</TableCell>
                <TableCell>{dueDate}</TableCell>
                <TableCell numeric>{payment}</TableCell>
                <TableCell>{paymentDate}</TableCell>
                <TableCell numeric>{payment}</TableCell>
                {issue?<TableCell>
                    <Link to={`${match.url}/modal/${paymentNumber}`}>
                        <Button>
                            How will this impact me?
                        </Button>
                    </Link>
                </TableCell>:null}
            </TableRow>
        )):null}
    </TableBody>
</Table>
)

export const Payments=withStyles(styles)(({classes, match, loans, loan, onSelect})=>(
<Paper className={classes.root}>
    <Route path={`${match.url}/modal/:id`} component={PaymentModal}/> 
    {isLoaded(loans)?[
        internalSelect(loans, loan, onSelect),
        internalTable(classes, loans, loan, match)
    ]
    :<CircularProgress/>}
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

const mapStateToProps=({firestore, payments})=>({
    loans: firestore.data.loans,
    loan:payments.loan
})
const mapDispatchToProps=dispatch=>({
    onSelect:e=>selectLoan(dispatch, e.target.value)
})
export default firestoreConnect((props, store)=>[
        { 
            collection: `loans`, 
            where: ['uid', '==', store.getState().firebase.auth.uid] 
        }
    ])(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Payments))
