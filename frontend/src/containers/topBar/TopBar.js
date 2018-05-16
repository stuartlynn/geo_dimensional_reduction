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
    </AppBar>
  )
}

export default ToolBar;
