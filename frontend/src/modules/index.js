import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import TopBarReducer from './TopBarReducer.js'
import MapReducer from './MapReducer.js'
import DataReducer from './DataReducer.js'

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const routingConfig={
  key: 'routing',
  storage: storage,
  stateReconciler: autoMergeLevel2
}

const topBarConfig={
  key: 'topBar',
  storage: storage,
  stateReconciler: autoMergeLevel2
}

const mapConfig={
  key: 'map',
  storage: storage,
  stateReconciler: autoMergeLevel2
}

export default combineReducers({
  routing: persistReducer(routingConfig, routerReducer),
  topbar:  persistReducer(topBarConfig, TopBarReducer),
  map :    persistReducer(mapConfig, MapReducer),
  data: DataReducer
})
