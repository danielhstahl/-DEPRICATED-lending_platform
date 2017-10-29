import React from 'react'
import { mount } from 'enzyme'
import Button from 'material-ui/Button'
import {Login} from './Login'

//mock firebase
const firebase=(expectFn)=>({
    login:(loginObj)=>expectFn(loginObj)
})

it('defaults to login screen with providers', ()=>{
    const login=mount(<Login firebase={firebase(()=>{})}/>)
    const providers=["Login with Google", "Login with Twitter"]
    const buttonTexts=login.find(Button).map(node=>node.text())
    expect(buttonTexts).toEqual(providers)
})

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

