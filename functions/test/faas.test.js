const myFunctions = require('../index')

beforeAll(() => {
    // Since index.js makes calls to functions.config and admin.initializeApp at the top of the file,
    // we need to stub both of these functions before requiring index.js. This is because the
    // functions will be executed as a part of the require process.
    // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
    
    jest.mock('firebase-admin')
    const admin=require('firebase-admin')

    // Next we stub functions.config(). Normally config values are loaded from Cloud Runtime Config;
    // here we'll just provide some fake values for firebase.databaseURL and firebase.storageBucket
    // so that an error is not thrown during admin.initializeApp's parameter check
    jest.mock('firebase-functions')
    const functions = require('firebase-functions')
    functions.config.mockImplementation(() =>({
        firebase: {
          databaseURL: 'https://not-a-project.firebaseio.com',
          storageBucket: 'not-a-project.appspot.com',
        }
        // You can stub any other config values needed by your functions here, for example:
        // foo: 'bar'
    }))
    myFunctions = require('../index')
})
  


describe('generateSchedule', ()=>{
    const data={
        rate:.01,
        term:50,//months
        amount:5000
    }
    const fakeEvent={
        data:new functions.database.DeltaSnapshot(null, null, null, data, '/loans/4')
    }
    it('writes schedule to payments', ()=>{
        myFunctions.generateSchedule(fakeEvent).then(result=>{
            console.log(result)
        })
    })
})