export const UPDATE_QUERY  = 'map/UPDATE_QUERY'
export const UPDATE_STYLE  = 'map/UPDATE_STYLE'
export const UPDATE_MAP    = 'map/UPDATE_MAP'

export const UPDATE_USERNAME  = 'map/UPDATE_USERNAME'
export const UPDATE_PASSWORD  = 'map/PASSWORD'
export const ATTEMPTING_LOGIN = 'map/ATTEMPTING_LOGIN'
export const LOGIN_FAILED     = 'map/LOGIN_FAILED'
export const LOGIN_SUCCEEDED  = 'map/LOGIN_SUCCEEDED'

export const MAP_MOVED        = 'map/MAP_MOVED'

const initialState = {
  query: "select 10",
  style: "dfsfdsfd",
  center: [-74.0060, 40.7128],
  mapboxtoken: "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw",
  basemap: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  zoom: 16
}


export default(state=initialState, action)=>{
  switch (action.type) {

    case MAP_MOVED:
      return{
        ...state,
        center : action.payload.center,
        zoom   : action.payload.zoom
      }
      break

    case UPDATE_QUERY:
      return{
        ...state,
        query: action.payload
      }
      break

    case UPDATE_STYLE:
      return{
        ...state,
        style: action.payload
      }
      break

    case UPDATE_USERNAME:
      return{
        ...state,
        username: action.payload
      }
      break;

    case UPDATE_PASSWORD:
      return{
        ...state,
        password: action.payload
      }
      break;

    case ATTEMPTING_LOGIN:
      return{
        ...state,
        validAccount: false,
        attemptingLogin: true
      }
      break;

    case LOGIN_FAILED:
      return{
        ...state,
        validAccount: false,
        attemptingLogin: false
      }
      break;

    case LOGIN_SUCCEEDED:
      return{
        ...state,
        validAccount: true,
        attemptingLogin: false
      }
      break;

    default:
      return state
  }
}


export const updateUsername = (username)=>{
  return dispatch => {
      dispatch({
        type: UPDATE_USERNAME,
        payload: username
      })

      dispatch({
        type: ATTEMPTING_LOGIN
      })

      return setTimeout(()=>{
          dispatch({
            type: LOGIN_FAILED
          })
        },3000)
  }
}

export const updateQuery = (query) =>{
  console.log('updaing query ', query)
  return dispatch =>{
    dispatch({
      type: UPDATE_QUERY,
      payload: query
    })
  }
}

export const updateStyle = (style) =>{
  console.log('updaing style ', style)
  return dispatch =>{
    dispatch({
      type: UPDATE_STYLE,
      payload: style
    })
  }
}

export const updatePassword = (password)=>{
  return dispatch => {
      dispatch({
        type: UPDATE_PASSWORD,
        payload: password
      })

      dispatch({
        type: ATTEMPTING_LOGIN
      })

      return setTimeout(()=>{
          dispatch({
            type: LOGIN_SUCCEEDED
          })
        },3000)
  }
}

export const mapMoved = (center,zoom)=>{
  return dispatch =>{
    dispatch({
      type: MAP_MOVED,
      payload: { center, zoom }
    })
  }
}
