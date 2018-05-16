import React from "react";
import SideBar from "./SideBar"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { closeDrawer } from '../../modules/TopBarReducer.js'
import { updateUsername, updatePassword, updateQuery } from '../../modules/DataReducer.js'


class SideBarContainer extends React.Component{


  render(){
    return(
      < SideBar open={this.props.open}
                updateQuery={ this.props.updateQuery}
                onUsernameChange= {this.props.updateUsername}
                onAPIKeyChange= {this.props.updatePassword}
                onCloseDrawer= {this.props.closeDrawer}
                query = {this.props.query}
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
  updateQuery
}, dispatch)



const mapStateToProps = state => ({
  open : state.topbar.showDrawer,
  query: state.data.query,
  username: state.data.username,
  password: state.data.apiKey
})


export default connect(mapStateToProps, mapDispatchToProps)(SideBarContainer)
