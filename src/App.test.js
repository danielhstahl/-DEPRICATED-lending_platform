import {App} from './App'
import { mount } from 'enzyme'
import Login from './Components/Login'
import Payments from './Components/Payments'
it('shows login when not logged in', ()=>{
    const app=mount(<App auth={false}/>)
    expect(app.find(Login).exists().toEqual(true)
})
it('shows payments when logged in', ()=>{
    const app=mount(<App auth={true}/>)
    expect(app.find(Payments).exists().toEqual(true)
})
