import React from "react";
import SideBar from "./SideBar"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { closeDrawer } from '../../modules/TopBarReducer.js'
import { updateUsername, updatePassword } from '../../modules/MapReducer.js'
import { updateStyle, updateQuery } from '../../modules/MapReducer.js'


class SideBarContainer extends React.Component{


  render(){
    return(
      < SideBar open={this.props.open}
                updateQuery={ this.props.updateQuery}
                updateStyleString={ this.props.updateStyle}
                onUsernameChange= {this.props.updateUsername}
                onAPIKeyChange= {this.props.updatePassword}
                onCloseDrawer= {this.props.closeDrawer}
                query = {this.props.query}
                mapStyle = {this.props.mapStyle}
                onUsernameChange = {(e,val) => this.props.updateUsername(val)}
                onAPIKeyChange = {(e,val) => this.props.updatePassword(val)}
                username={this.props.username}
                password={this.props.password}
      />
    )
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
  closeDrawer,
  updateUsername,
  updatePassword,
  updateStyle,
  updateQuery
}, dispatch)



const mapStateToProps = state => ({
  open : state.topbar.showDrawer,
  query: state.map.query,
  mapStyle: state.map.style,
  username: state.map.username,
  password: state.map.password
})


export default connect(mapStateToProps, mapDispatchToProps)(SideBarContainer)
