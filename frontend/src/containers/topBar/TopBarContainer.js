import React from "react";
import TopBar from "./TopBar"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toggleDrawer } from '../../modules/TopBarReducer.js'

class TopBarContainer extends React.Component{

  render(){
    return (
      <TopBar
        loggingIn = {this.props.logginIn}
        loggedIn = {this.props.loggedIn}
        onMenuToggle = {this.props.toggleDrawer}
      />
    )
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleDrawer
}, dispatch)


const mapStateToProps = state => ({
  loggingIn : state.map.attemptingLogin,
  loggedIn : state.map.validAccount,
})
export default connect(mapStateToProps, mapDispatchToProps)(TopBarContainer)
