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
import {Link, Route} from 'react-router-dom'

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

const Modal=({match, history, impact})=>(
    <Dialog open={true} onRequestClose={history.goBack}>
        <DialogTitle>Explanation</DialogTitle>
        <p>
        {impact}
        </p>
    </Dialog>
)

export const Payments=withStyles(styles)(({firebase, classes, match})=>(
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
            {firebase.data.payments.map(({id, dueDate, paymentRequired, paymentDate, payment, issue, impact})=>{
                const url=`${match.url}/modal/${id}`
                return (
                <TableRow key={id} className={issue?classes.somethingWrong:null}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{dueDate}</TableCell>
                    <TableCell numeric>{paymentRequired}</TableCell>
                    <TableCell>{paymentDate}</TableCell>
                    <TableCell numeric>{payment}</TableCell>
                    {issue?<TableCell><Link to={url}><Button>How will this impact me?</Button></Link></TableCell>:null}
                    <Route path={url} render={({match, history})=><Modal match={match} history={history} impact={impact}/>}/>
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