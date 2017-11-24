const defaultState={
    loan:""
}
export default (state={}, action)=>{
    switch(action.type){
        case "SELECTED_LOAN":
            return {
                loan:action.loan
            }
        default:
            return state
    }
}