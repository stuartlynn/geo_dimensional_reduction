import uuidv1 from 'uuid/v1'

export const UPDATEQUERY  = 'map/UPDATE_QUERY'
export const UPDATESTYLE  = 'map/UPDATE_STYLE'
export const GOT_RESULTS_FOR_METHOD = 'data/GOT_RESULTS_FOR_METHOD'
export const REQUESTED_RESULTS_FOR_METHOD = 'data/REQUESTED_RESULTS_FOR_METHOD'
export const SET_SELECTION = 'data/SET_SELECTION'

const initalState= {
  query : `select cartodb_id, the_geom, the_geom_webmercator,
          asian_pop/total_pop as pc_asian,
          black_pop/total_pop as pc_black,
          white_pop/total_pop as pc_white,
          bachelors_degree/total_pop as pc_bachelors,
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
    'bachelors_pc',
    'associates_pc',
    'black_pc',
    'white_pc',
    'asian_pc',
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
    case SET_SELECTION:
      return{
        ...state,
        selection: action.selection
      }
    case REQUESTED_RESULTS_FOR_METHOD:
      return{
        ...state,
        dataStatus: {...state.dataStatus, ...{[action.method]:'pending'}}
      }
    default:
     return state
  }

}

const getDataURL = (query, method, target_table, username, apiKey, host)=>{
  const params = {
    'query': query ,
    'api_key': apiKey,
    'user': username,
    'format': 'json',
    'target_table':target_table
  }
  const components = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  return `${host}/${method}?${components}`
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

export const getDimReductions = (method,target_table)=>{
  if(target_table === undefined){
    target_table  = 'PCA_' +  uuidv1().replace(/\-/g,'_')
  }
  return (dispatch,getState)=>{
    const { server,query } = getState().data
    const { username, apiKey } = getState().data

    dispatch({
      type: REQUESTED_RESULTS_FOR_METHOD,
      method : method
    })
    const url = getDataURL(query,method,target_table,username,apiKey,server)
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
