const checkNaNOrPositive=value=>isNaN(value)||value<0
const notPositiveNumber=value=>checkNaNOrPositive(parseFloat(value))

export default (state={}, action)=>{
    switch(action.type){
        case "UPDATE_FORM":
            return {
                ...state, 
                [action.propName]:{
                    error:notPositiveNumber(action.text),
                    value:action.text
                }
            }
        default:
            return state
    }
}