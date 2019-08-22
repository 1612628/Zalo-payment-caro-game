export const updateCell = (x,y, isChecked,typePattern)=>{
    return {
        type:"UPDATE_CELL",
        payload:{
            cell:{
                x:x,
                y:y,
                isChecked:isChecked,
                typePattern:typePattern
            }
        }
    }
}