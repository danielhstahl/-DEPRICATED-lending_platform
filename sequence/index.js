//https://docs.seq.com/sdk/node/index.html
const sequence = require('sequence-sdk')
const {ledger, secret}=require('./credentials.json')
const lending_app = new sequence.Client({
    ledger,
    credential:secret
})

//https://dashboard.seq.com/docs/example-lending
/**setup baseline */
Promise.all([
    lending_app.keys.create({alias: 'underwriting'}),
    lending_app.keys.create({alias: 'processing'}),
    lending_app.keys.create({alias: 'sales'}),
    lending_app.assets.create({
        alias: 'usd',
        keys: [{alias: 'processing'}],
        tags: {
          type: 'currency'
        }
    })
]).catch(err=>console.log(err.message)).then(()=>{
    return Promise.all([
        lending_app.accounts.create({
            alias: 'processing',
            keys: [{alias: 'processing'}],
            tags: {type: 'company'}
        }),        
        lending_app.accounts.create({
            alias: 'lending',
            keys: [{alias: 'sales'}],
            tags: {type: 'company'}
        }),        
        lending_app.accounts.create({
            alias: 'revenue',
            keys: [{alias: 'sales'}],
            tags: {type: 'company'}
        })
    ])
}).catch(err=>console.log(err.message))

