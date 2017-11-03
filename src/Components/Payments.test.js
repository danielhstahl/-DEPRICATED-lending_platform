import React from 'react'
import { mount } from 'enzyme'
import Button from 'material-ui/Button'
import {Payments} from './Payments'
import {Link, Route, MemoryRouter} from 'react-router-dom'
import { createMuiTheme } from 'material-ui/styles'
import Table, {
    TableBody,
    TableCell,
    TableRow,
} from 'material-ui/Table'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
const theme=createMuiTheme() //TODO!! we need to change this if we do a custom theme anywhere

//mock firebase
const firebase=payments=>({
    data:{
        payments
    }
})

it('displays table of payments', ()=>{
    const payments=[{
        id:'1',
        dueDate:'2015-05-05',
        paymentDate:'2015-05-05',
        payment:500,
        paymentRequired:500
    }]
    const payment=mount(<MemoryRouter><Route path='/' render={({match})=><Payments firebase={firebase(payments)} match={match}/>}/></MemoryRouter>)
    const cellValues=payment.find(TableBody).find(TableRow).first().find(TableCell).map(cell=>cell.text())
    expect(cellValues).toEqual(['1', '2015-05-05', '500', '2015-05-05', '500'])
})
describe('issue with impact', ()=>{
    const payments=[{
        id:'1',
        dueDate:'2015-05-05',
        paymentDate:'2015-05-06',
        payment:500,
        paymentRequired:500,
        issue:'Late Full Payment',
        impact:'A late payment causes additional interest to be accrued.  This will need to be payed off by making an additional payment.'
    }]
    it('highlights row', ()=>{
    const payment=mount(<MemoryRouter><Route path='/' render={({match})=><Payments firebase={firebase(payments)} match={match}/>}/></MemoryRouter>)
        const rowProps=payment.find(TableBody).find(TableRow).first().prop('style')
        expect(rowProps).toEqual({
            backgroundColor: theme.palette.secondary.A100
        })
    })
    it('provides button with explanation', ()=>{
        const payment=mount(<MemoryRouter><Route path='/' render={({match})=><Payments firebase={firebase(payments)} match={match}/>}/></MemoryRouter>)
        const buttonText=payment.find(TableBody).find(TableRow).find(Button).text()
        expect(buttonText).toEqual('How will this impact me?') 
    })
    it('reveals modal on button click', ()=>{
        const payment=mount(<MemoryRouter><Route path='/' render={({match})=><Payments firebase={firebase(payments)} match={match}/>}/></MemoryRouter>)
        payment.find(TableBody).find(TableRow).find(Link).simulate('click')
        expect(payment.find(Dialog).props('open')).toEqual(true)
    })
    it('provides correct explanation in modal', ()=>{
        const payment=mount(<MemoryRouter><Route path='/' render={({match})=><Payments firebase={firebase(payments)} match={match}/>}/></MemoryRouter>)
        payment.find(TableBody).find(TableRow).find(Link).simulate('click')
        expect(payment.find(Dialog).find('p').first().text()).toEqual('A late payment causes additional interest to be accrued.  This will need to be payed off by making an additional payment.')
    })

})