import React from 'react'
import { mount } from 'enzyme'
import Button from 'material-ui/Button'
import {Application} from './Application'
import TextField from 'material-ui/TextField';

//mock firebase
const firebase=(expectFn)=>({
    login:(loginObj)=>expectFn(loginObj)
})

it('shows error on amount when not number', ()=>{
    const App=mount(<Application/>)
    const amountField=App.find(TextField).findWhere(n => n.props().label==='Amount')
    amountField.setProps({value:'hello'})
    expect(amountField.props().error).toEqual(true)
})
it('shows error on amount when less than zero', ()=>{
    const App=mount(<Application/>)
    const amountField=App.find(TextField).findWhere(n => n.props().label==='Amount')
    amountField.setProps({value:-1})
    expect(amountField.props().error).toEqual(true)
})
it('shows error on term when not number', ()=>{
    const App=mount(<Application/>)
    const amountField=App.find(TextField).findWhere(n => n.props().label==='Term')
    amountField.setProps({value:'hello'})
    expect(amountField.props().error).toEqual(true)
})
it('shows error on term when less than zero', ()=>{
    const App=mount(<Application/>)
    const amountField=App.find(TextField).findWhere(n => n.props().label==='Term')
    amountField.setProps({value:-1})
    expect(amountField.props().error).toEqual(true)
})
it('shows error on rate when not number', ()=>{
    const App=mount(<Application/>)
    const amountField=App.find(TextField).findWhere(n => n.props().label==='Rate')
    amountField.setProps({value:'hello'})
    expect(amountField.props().error).toEqual(true)
})
it('shows error on term when less than zero', ()=>{
    const App=mount(<Application/>)
    const amountField=App.find(TextField).findWhere(n => n.props().label==='Rate')
    amountField.setProps({value:-1})
    expect(amountField.props().error).toEqual(true)
})
it('does not allow submission with any errors', ()=>{
    const App=mount(<Application/>)
    const amountField=App.find(TextField).findWhere(n => n.props().label==='Rate')
    amountField.setProps({value:-1})
    expect(App.find(Button).props().disabled).toEqual(true)
})

/*
it('selects google provider on first login press', ()=>{
    const expectFn=(loginObj)=>expect(loginObj).toEqual({
        provider:'google',
        type:'redirect'
    })
    const login=mount(<Login firebase={firebase(expectFn)}/>)
    login.find(Button).at(0).simulate('click')
})
it('selects twitter provider on second login press', ()=>{
    const expectFn=(loginObj)=>expect(loginObj).toEqual({
        provider:'twitter',
        type:'redirect'
    })
    const login=mount(<Login firebase={firebase(expectFn)}/>)
    login.find(Button).at(1).simulate('click')
})

*/