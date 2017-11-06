const Finance = require('financejs')
const finance = new Finance()
const convertRawToPercent=rate=>rate*100
const convertAnnualToMonthlyRate=rate=>rate/12
const compareWithPrevPrincipal=(prinPay, prevPrincipal)=>{
    return prinPay>prevPrincipal?prevPrincipal:prinPay
}
module.exports.schedule=(balance, rate, paymentNumber)=>{
    if(balance<0||paymentNumber<0||rate<0){
        throw new Error("Inputs must be positive")
    }
    if(!Number.isInteger(paymentNumber)){
        throw new Error("Number of payments must be an integer")
    }
    const adjRate=convertRawToPercent(rate)//financejs expects it to be in percentages
    const monthlyRate=convertAnnualToMonthlyRate(rate)
    const amPerMonth=finance.AM(balance, adjRate, paymentNumber, 1)
    return Array(paymentNumber).fill(0).reduce((aggr, curr, index)=>{
        const prevPrincipal=index===0?balance:aggr[index-1].principalRemaining
        const interestPaid=monthlyRate*prevPrincipal
        //const principalPaid=compareWithPrevPrincipal(amPerMonth-interestPaid, prevPrincipal)
        const principalPaid=amPerMonth-interestPaid
        return [...aggr, {
            payment:amPerMonth,
            interestPaid,
            principalRemaining:index===paymentNumber-1?0:prevPrincipal-principalPaid,
            principalPaid,
            paymentNumber:index+1
        }]
    }, [])
}