const admin = require('firebase-admin')
const uuidv4 = require('uuid/v4')
admin.initializeApp = jest.fn()
admin.firestore=()=>{
    return {
        collection:{
            loans:{
                push:jest.fn(val=>Promise.resolve(val))
            },
            payments:{
                push:jest.fn(val=>Promise.resolve(val))
            }
        }
    }
}

const functions = require('firebase-functions')

functions.config = jest.fn(() => ({
  firebase: {
    databaseURL: 'https://not-a-project.firebaseio.com',
    storageBucket: 'not-a-project.appspot.com'
  },
  sequence:require('../sequence/credentials.json')
}))

const myFunctions = require('./index')
const am=require('./am')



describe('generateSchedule', ()=>{
    const data={
        rate:.01,
        term:50,//months
        amount:5000
    }
    const loanId=uuidv4()
    const fakeEvent={
        data:new functions.firestore.DocumentDeltaSnapshot()
            //null, null, null, data, 'loans'),
        params:{
            loanId
        }
    }

    /*const refStub = jest.fn(() => ({
        parent: {
            parent:{
                child: jest.fn(childName => ({
                    push: jest.fn(val => Promise.resolve({ ref: childName, val }))
                }))
            }
          
        }
    }))*/
    const expected=am.schedule(data.amount, data.rate, data.term)
    //Object.defineProperty(fakeEvent.data, 'ref', { get: refStub })
    it('writes schedule to payments', ()=>{
        let result
        return myFunctions.generateSchedule(fakeEvent).then(result_=>{
            result=result_
            //expect(result.ref).toEqual('payments/4')
            return expect(result.val.schedule).toEqual(expected)
        }).then(()=>expect(result.ref).toEqual(`/payments/${loanId}`))
    })
})

describe('fundLoan', ()=>{
    const data={
        wireId:'5',
        amount:5000
    }
    const loanId=uuidv4()
    const fakeEvent={
        data:new functions.firestore.DocumentDeltaSnapshot(null, null, {amount:50000}, data, '4'),
        params:{
            loanId
        }
    }
    //Object.defineProperty(fakeEvent.data, 'ref', { get: refStub })
    it('funds loan', ()=>{
        return myFunctions.fundLoan(fakeEvent).then(result=>expect(result).toEqual('funded'))
    })
})

describe('appDecision', ()=>{
    const data={
        rate:.01,
        term:50,//months
        amount:5000
    }
    const appId=uuidv4()

    const refStub = jest.fn(() => ({
        parent: {
            parent:{
                child: jest.fn(childName => ({
                    push: jest.fn(val => Promise.resolve({ ref: childName, val }))
                }))
            }
        },
        set:jest.fn(val=>Promise.resolve(val))
    }))
    
    it('creates loan if approved', ()=>{
        const expected=data
        const fakeEvent={
            data:new functions.firestore.DocumentDeltaSnapshot(null, null, null, Object.assign({}, data, {decision:true}), '4'),
            params:{
                appId
            }
        }
        Object.defineProperty(fakeEvent.data, 'ref', { get: refStub })
        return myFunctions.appDecision(fakeEvent).then(result=>{
            //expect(result.ref).toEqual('payments/4')
            return expect(result.val).toEqual(expected)
        })
    })
    it('does not create loan if not approved', ()=>{
        const expected=false

        const fakeEvent={
            data:new functions.firestore.DocumentDeltaSnapshot(null, null, null, Object.assign({}, data, {decision:false}), '4'),
            params:{
                appId
            }
        }
        Object.defineProperty(fakeEvent.data, 'ref', { get: refStub })
        return myFunctions.appDecision(fakeEvent).then(result=>{
            return expect(result.decision).toEqual(expected)
        })
    })
})