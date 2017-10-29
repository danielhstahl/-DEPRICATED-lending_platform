const origination=require('./origination')
const uuidv4 = require('uuid/v4')
//integration tests
jasmine.DEFAULT_TIMEOUT_INTERVAL=10000
it('creates loan', ()=>{
    const id=uuidv4() //unique Id
    const amount=100000 //1000 dollars
    const wireId='6'

    return origination.create(id, amount, wireId).then(result=>expect(result).toEqual("funded"))
})
it('makes payments on loan', ()=>{
    const id=uuidv4() //unique Id
    const amount=100000 //1000 dollars
    const wireId='6'
    const payAmount=500 //5 dollars
    return origination.create(id, amount, wireId).then(result=>expect(result).toEqual("funded")).then(()=>{
        return origination.pay(id, payAmount)
    }).then(result=>expect(result).toEqual("payment made"))
    
})
