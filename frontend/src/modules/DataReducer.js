import uuidv1 from 'uuid/v1'

export const UPDATEQUERY  = 'map/UPDATE_QUERY'
export const UPDATESTYLE  = 'map/UPDATE_STYLE'
export const GOT_RESULTS_FOR_METHOD = 'data/GOT_RESULTS_FOR_METHOD'
export const REQUESTED_RESULTS_FOR_METHOD = 'data/REQUESTED_RESULTS_FOR_METHOD'
export const SET_SELECTION = 'data/SET_SELECTION'
export const SET_METHOD = 'data/SET_METHOD'
export const UPDATE_QUERY = 'data/UPDATE_QUERY'
export const UPDATE_USERNAME = 'data/UPDATE_USERNAME'
export const UPDATE_PASSWORD = 'data/UPDATE_PASSWORD'
export const SET_SELECTED_VARIABLE = 'data/SET_SELECTED_VARIABLE'

const initalState= {
  query : `select cartodb_id, the_geom, the_geom_webmercator,
          asian_pop/total_pop as pc_asian,
          black_pop/total_pop as pc_black,
          white_pop/total_pop as pc_white,

          bachelors_degree/total_pop as pc_bachelors,
          associates_degree/total_pop as pc_associates,
          median_income/ (select max(median_income) from dr_block_groups_demo) as median_income
          from dr_block_groups_demo_ny
  `,

	//query: `select cartodb_id, the_geom, the_geom_webmercator, white_pop/total_pop as white_pc,black_pop/total_pop as black_pc,asian_pop/total_pop as asian_pc from dr_block_groups_demo`,
  //query: 'select * from signatures_per_capita_99pc',
  server : 'http://localhost:5000',
  results: {},
  dataStatus: {},
  //selectedVariable: 'make_british_sign_language_part_of_the_national_curriculum',
  selectedVariable: 'pc_white',
  avaliableVariables: [
    'pc_bachelors',
    'pc_associates',
    'pc_black',
    'pc_white',
    'pc_asian',
    'median_income'
  ],
  username: 'observatory',
  apiKey: '893a45cc8505dfffe26d94b3c160a6fc1b1da459',
  //selection : null,
  selection: null, //{ loc: { x: 10, y:10}, radius:10},
  joinTable:{},
  method:'PCA'
	//username: 'stuartlynn',
	//apiKey: 'cbbc4efb5201efb60996d645f264ef4e7b14495b'
}

export default (state=initalState, action)=>{
  switch (action.type) {
    case GOT_RESULTS_FOR_METHOD:
      return {
        ...state,
        results: {...state.results, ...{[action.method] : action.data}},
        dataStatus: {...state.dataStatus, ...{[action.method] : 'loaded'}},
        joinTable: {...state.joinTable , ...{[action.method]:action.target_table}}
      }
      break;
    case SET_METHOD:
      return{
        ...state,
        method: action.method
      }
    case SET_SELECTION:
      return{
        ...state,
        selection: action.selection
      }
    case SET_SELECTED_VARIABLE:
      return{
        ...state,
       selectedVariable: action.variable
      }
    case REQUESTED_RESULTS_FOR_METHOD:
      return{
        ...state,
        dataStatus: {...state.dataStatus, ...{[action.method]:'pending'}}
      }
    case UPDATE_QUERY:
      return{
        ...state,
        query: action.query
      }
    default:
     return state
  }

}

const getDataURL = (query, method,methodParams, target_table, username, apiKey, host)=>{
  const params = {
    'query': query ,
    'api_key': apiKey,
    'user': username,
    'format': 'json',
    'target_table':target_table,
    ...methodParams
  }
  const components = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  return `${host}/${method}?${components}`
}

export const setSelectedVariable = (variable)=>{
  return(dispatch)=>{
    dispatch({
      type: SET_SELECTED_VARIABLE,
      variable: variable
    })
  }
}
export const updateQuery = (query)=>{
  return (dispatch)=>{
    dispatch({
      type: UPDATE_QUERY,
      query
    })
  }
}

export const updateUsername = (username)=>{
  return (dispatch)=>{
    dispatch({
      type: UPDATE_USERNAME,
      username
    })
  }
}

export const updatePassword = (apiKey)=>{
  return (dispatch)=>{
    dispatch({
      type: UPDATE_PASSWORD,
      apiKey
     })
  }
}

export const setSelection = (selection)=>{
  console.log(selection)
  return (dispatch) => {
    dispatch({
      type: SET_SELECTION,
      selection
    })
  }
}

export const setMethod =(method)=>{
  return (dispatch) =>{
    dispatch({
      type: SET_METHOD,
      method
    })
  }
}

export const getDimReductions = (method,params,target_table)=>{
  if(target_table === undefined){
    target_table  = method+'_' +  uuidv1().replace(/\-/g,'_')
  }
  return (dispatch,getState)=>{
    const { server,query } = getState().data
    const { username, apiKey } = getState().data

    dispatch({
      type: REQUESTED_RESULTS_FOR_METHOD,
      method : method
    })
    const url = getDataURL(query,method,params,target_table,username,apiKey,server)
    fetch( url ).then(r =>r.json()).then(data=>{

      console.log(data)
      dispatch({
        type: GOT_RESULTS_FOR_METHOD,
        data : data,
        method: method,
        target_table: target_table
      })
    })
  }
}
