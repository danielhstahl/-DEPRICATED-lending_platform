'use strict'
const functions = require('firebase-functions')
const origination=require('sequence_lending_app')
const am=require('./am')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)


/**ran when app decision is written to loan */
//when loan app decision comes through, generate the schedule
exports.generateSchedule=functions.database.ref('/loans/{loanId}').onWrite(event => {
    // Grab the current value of what was written to the Realtime Database.
    const {rate, term, amount} = event.data.val()
    console.log(event.data.val())
    const schedule=am.schedule(amount, rate, term)
    //console.log(schedule)
    console.log(event.params)
    return event.data.ref.parent.parent.child(`/payments/${event.params.loanId}`).push(schedule)
})
//fund
exports.fundLoan=functions.database.ref('/loans/{loanId}').onWrite(event=>{
    const {id, amount, wireId}=event.data.val()
    const {ledger, secret}=functions.config().sequence
    return origination.create(id, amount, wireId, ledger, secret)
})
/**end app decision is written to loan */

/**ran when app is submitted */
exports.appDecision=functions.database.ref('/apps/{appId}').onWrite(event=>{
    //add decisioning logic here
    const {rate, term, amount}=event.data.val()
    return event.data.ref.parent.parent.child('loans').push({rate, term, amount})
})
/**end when app is submitted */

/**Ran when loan is viewed by customer */
//TODO!  Figure out how to execute functions at a specific time interval
//exports.processLoan=functions.database.ref('/payments/')

//listen for when loan is written

//exports.payBill=functions.database.ref('/payments/{loanId}')

//for testing

//exports.