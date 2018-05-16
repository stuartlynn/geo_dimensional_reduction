import React, { Component } from 'react';
import logo from './logo.svg';
//import './App.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Theme
import { deepOrange500 } from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ToolBarContainer from './containers/topBar/TopBarContainer.js'
import SideBarContainer from './containers/SideBar/SideBarContainer.js'
import MapContainer from './containers/map/MapContainer.js'
import ViewerContainer from './containers/viewer/ViewerContainer.js'
import StatsBar from './containers/StatsBar/StatsBar.js'

import { PersistGate } from 'redux-persist/integration/react'

import { Provider } from 'react-redux'
import store, { history, persistor } from './store'
import "./App.css"

// Font
import 'typeface-roboto'

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <div className="App">
              <ToolBarContainer />
              <StatsBar />
                <SideBarContainer />
                <MapContainer  className="Map" / >
                <div className="tsneContainer">
                  <ViewerContainer style={{width:"30%", height:"100%"}}  />
                </div>
            </div>
          </MuiThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
