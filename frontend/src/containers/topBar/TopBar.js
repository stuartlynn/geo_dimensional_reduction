import React from "react";
import AppBar from "material-ui/AppBar"
import TextField from "material-ui/TextField"

const styles = {
  textfield:{
    flex:1
  },
  span:{
    flex:1
  }
}

const ToolBar = (props)=>{
  return(
    <AppBar onLeftIconButtonClick={props.onMenuToggle} >
      { props.loggingIn ? (<span style={styles.span}>Attempting login</span>) : (<span></span>) }
      { (props.loggedIn & !props.loggingIn)  ? (<span style={styles.span}>Logged In</span>) : (<span> Not Logged In</span>) }
    </AppBar>
  )
}

export default ToolBar;
