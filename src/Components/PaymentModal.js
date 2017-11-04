import React from 'react'
import Button from 'material-ui/Button'
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const isObj=val=>val||{}
export const PaymentModal=({match, history, firebase, paymentKey})=>(
    <Dialog open={true} onRequestClose={history.goBack}>
        <DialogTitle>Explanation</DialogTitle>
        <p>
            {isObj(firebase.data.payments.find(({id})=>id===match.params.id)).impact}
        </p>
        <DialogActions>
            <Button onClick={history.goBack}>
                Ok
            </Button>
        </DialogActions>
    </Dialog>
)
PaymentModal.propTypes={
    firebase:PropTypes.shape({
        data:PropTypes.shape({
            payments:PropTypes.arrayOf(PropTypes.shape({
                id:PropTypes.string.isRequired,
                impact:PropTypes.string
            })).isRequired
        }).isRequired
    }).isRequired,
    history:PropTypes.shape({
        goBack:PropTypes.func.isRequired
    }).isRequired,
    match:PropTypes.shape({
        params:PropTypes.shape({
            id:PropTypes.string.isRequired
        }).isRequired
    }).isRequired
}

const mapStateToProps=({firebase})=>({
    firebase
})

export default connect(mapStateToProps)(PaymentModal)