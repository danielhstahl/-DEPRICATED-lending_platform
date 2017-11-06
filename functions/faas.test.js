const admin = require('firebase-admin')

admin.initializeApp = jest.fn()

const functions = require('firebase-functions')

functions.config = jest.fn(() => ({
  firebase: {
    databaseURL: 'https://not-a-project.firebaseio.com',
    storageBucket: 'not-a-project.appspot.com'
  }
}))

const myFunctions = require('./index')
const am=require('./am')



describe('generateSchedule', ()=>{
    const data={
        rate:.01,
        term:50,//months
        amount:5000
    }
    const fakeEvent={
        data:new functions.database.DeltaSnapshot(null, null, null, data, '/loans/4')
    }

    const refStub = jest.fn(() => ({
        parent: {
            parent:{
                child: jest.fn(childName => ({
                    push: jest.fn(val => Promise.resolve({ ref: childName, val }))
                }))
            }
          
        }
    }))
    const expected=am.schedule(data.amount, data.rate, data.term)
    Object.defineProperty(fakeEvent.data, 'ref', { get: refStub })
    it('writes schedule to payments', ()=>{
        let result
        return myFunctions.generateSchedule(fakeEvent).then(result_=>{
            result=result_
            //expect(result.ref).toEqual('payments/4')
            return expect(result.val).toEqual(expected)
        }).then(()=>expect(result.ref).toEqual('payments/4'))
    })
})