const sequence = require('sequence-sdk')
const {ledger, secret}=require('./credentials.json')
const lending_app = new sequence.Client({
    ledger,
    credential:secret
})

module.exports.create=(id, amount, wireId)=>{
    return lending_app.assets.create({
        alias:id,
        keys:[{alias:'underwriting'}],
        tags: {
            type: 'loan',
            loan_id: id,
            /*borrower_id: '123',
            currency: 'usd',
            principal: '10000',
            interest_rate: '0.1',
            total_interest: '1000',
            issue_date: '09/01/2017',
            schedule: 'monthly',
            maturity_date: '03/01/2018'*/
        }
    }).then((result)=>{
        //console.log(result)
        return lending_app.transactions.transact(builder => {
            return builder.issue({
                assetAlias: id,
                amount,
                destinationAccountAlias: 'lending',
                referenceData: {
                    system: 'wire',
                    wire_transaction_id: wireId
                }
            })
        })./*then(result=>console.log(result)).*/then(()=>'funded').catch(err=>console.log(err))
    })
}

module.exports.pay=(id, amount)=>{
    return lending_app.transactions.transact(builder => {
        builder.issue({
            assetAlias: 'usd',
            amount,
            destinationAccountAlias: 'processing',
            referenceData: {
                type: 'loan_payment'
            }
        })
    }).then(tx=>{
        return lending_app.transactions.transact(builder => {
            builder.transfer({
                assetAlias: 'usd',
                amount,
                sourceAccountAlias: 'processing',
                destinationAccountAlias: 'revenue',
                referenceData: {
                    type: 'loan_payment'
                }
            })
        })
    }).then(tx=>{
        return lending_app.transactions.transact(builder => {
            builder.retire({
                assetAlias: id,
                amount,
                sourceAccountAlias: 'lending', //since this is the holder of the actual asset, see the "create" function
                referenceData: {
                    type: 'loan_payment'
                }
            })
        })
    }).then(()=>'payment made').catch(err=>console.log(err))
}

  
