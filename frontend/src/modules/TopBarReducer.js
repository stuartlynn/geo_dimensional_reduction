
export const TOPBAR_TOGGLE    = 'topbar/TOPBAR_TOGGLE'
export const CLOSE_DRAWER     = 'topbar/CLOSE_DRAWER'

const initialState = {
  showDrawer: false
}

export default(state=initialState, action)=>{

  switch (action.type) {

    case CLOSE_DRAWER:
      return{
        ...state,
        showDrawer: false
      }
      break

    case TOPBAR_TOGGLE:
      return{
        ...state,
        showDrawer: !state.showDrawer
      }
      break;

    default:
      return state
  }

}

export const closeDrawer = ()=>{
  return dispatch =>{
    dispatch({
      type: CLOSE_DRAWER
    })
  }
}

export const toggleDrawer = ()=>{
  console.log('taggling topbar')
  return dispatch =>{
    dispatch({
      type: TOPBAR_TOGGLE
    })
  }
}
