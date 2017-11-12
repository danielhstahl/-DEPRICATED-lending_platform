export const updateText=(dispatch, text, propName)=>dispatch({
    type:"UPDATE_FORM",
    propName,
    text
})