import React from 'react'
import { mount, shallow } from 'enzyme'
import Button from 'material-ui/Button'
import {PaymentModal} from './PaymentModal'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
import {Link, Route, MemoryRouter} from 'react-router-dom'
const firebase={
    data:{
        payments:[{
            id:'1',
            impact:'some impact'
        }]
    }
}
it('does not display modal on base route', ()=>{
    const modal=shallow(
        <MemoryRouter>
            <Route 
                path='/modal'
                render={({match, history})=>(
                    <PaymentModal firebase={firebase} match={match} history={history}/>
                )}
            />
        </MemoryRouter>)
    //expect(modal.find(Dialog).props('open')).toEqual(true)
    expect(modal.find(Dialog).exists()).toEqual(false)
})
it('displays modal when on right route', ()=>{
    const modal=shallow(
        <MemoryRouter initialEntries={[ '/modal/1' ]}>
            <Route 
                path='/modal/:id'
                render={({match, history})=>(
                    <PaymentModal firebase={firebase} match={match} history={history}/>
                )}
            />
        </MemoryRouter>)
    expect(modal.find(Dialog).exists()).toEqual(true)
    expect(modal.find(Dialog).props('open')).toEqual(true)
    //expect(modal.find(Dialog).exists()).toEqual(false)
})
it('closes modal', ()=>{
    const modal=shallow(
        <MemoryRouter initialEntries={[ '/modal/1' ]}>
            <Route 
                path='/modal/:id'
                render={({match, history})=>(
                    <PaymentModal firebase={firebase} match={match} history={history}/>
                )}
            />
        </MemoryRouter>)
    expect(modal.find(Dialog).props('open')).toEqual(true)
    modal.find(Button).simulate('click')
    expect(modal.find(Dialog).exists()).toEqual(false)
    //expect(modal.find(Dialog).exists()).toEqual(false)
})
it('displays modal with impact text', ()=>{
    const modal=shallow(
        <MemoryRouter initialEntries={[ '/modal/1' ]}>
            <Route 
                path='/modal/:id'
                render={({match, history})=>(
                    <PaymentModal firebase={firebase} match={match} history={history}/>
                )}
            />
        </MemoryRouter>)
    expect(modal.find(Dialog).props('open')).toEqual(true)
    expect(modal.find(Dialog).find('p').first().text()).toEqual('some impact')
})