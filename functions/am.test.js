const am=require('./am')
describe('edge cases', ()=>{
    it('returns empty array if number of payments is zero', ()=>{
        const expected=[]
        const balance=1000
        const rate=.04
        const paymentNumber=0
        expect(am.schedule(balance, rate, paymentNumber)).toEqual(expected)
    })
    it('returns array of principal + 1 month interest if payment number is 1', ()=>{
        const expected=[{payment:1010, interestPaid:10, principalPaid:1000, paymentNumber:1, principalRemaining:0}]
        const balance=1000
        const rate=.12
        const paymentNumber=1
        expect(am.schedule(balance, rate, paymentNumber)).toEqual(expected)
    })
    it('throws error if interest rate is under 0', ()=>{
        const balance=1000
        const rate=-.04
        const paymentNumber=0
        expect(()=>am.schedule(balance, rate, paymentNumber)).toThrow()
    })
    it('throws error if balance is negative', ()=>{
        const balance=-1000
        const rate=.04
        const paymentNumber=0
        expect(()=>am.schedule(balance, rate, paymentNumber)).toThrow()
    })
    it('throws error if paymentNumber is negative', ()=>{
        const balance=1000
        const rate=.04
        const paymentNumber=-1
        expect(()=>am.schedule(balance, rate, paymentNumber)).toThrow()
    })
    it('throws error if paymentNumber is not an integer', ()=>{
        const balance=1000
        const rate=.04
        const paymentNumber=5.5
        expect(()=>am.schedule(balance, rate, paymentNumber)).toThrow()
    })
})
describe('normal cases', ()=>{
    it('returns correctly without error', ()=>{
        const balance=1000
        const rate=.04
        const paymentNumber=10
        expect(am.schedule(balance, rate, paymentNumber)).toBeDefined()
    })
    it('returns has zero principal at end', ()=>{
        const balance=1000
        const rate=.04
        const paymentNumber=10
        const schedule=am.schedule(balance, rate, paymentNumber)
        //console.log(schedule)
        expect(schedule.pop().principalRemaining).toEqual(0)
    })
})