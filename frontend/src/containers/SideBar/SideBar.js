import React from "react"
import Drawer from 'material-ui/Drawer'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import AceEditor from 'react-ace';
import brace from 'brace';

import 'brace/mode/javascript';
import 'brace/mode/mysql';
import 'brace/theme/solarized_dark';

const styles = {
  drawer:{
    paddingLeft: "20px",
    paddingRight: "20px",
    width: '200px'
  }
}

const SideBar = (props)=>{
    return(
      <Drawer containerStyle={styles.drawer}
              open={props.open}
              onRequestChange={props.onCloseDrawer}
              docked={false}
              width={1000}
              containerStyle={{height: 'calc(100% - 64px)', top: 64, width:400}} >


        <TextField style={styles.textfield} id='username'
                   onChange={props.onUsernameChange}
                   floatingLabelText='username'
                   value = {props.username}
                   style={{width:'90%'}}
        />

        <TextField style={styles.textfield} id='api_key'
                   onChange={props.onAPIKeyChange}
                   value = {props.password}
                   floatingLabelText='APIKey'
                   style={{width:'90%'}}
        />


        <AceEditor
          mode="mysql"
          theme="solarized_dark"
          onChange={props.updateQuery}
          name="queryEditor"
          value= {props.query}
          editorProps={{$blockScrolling: true}}
          style={{height:'39%', width:'100%', marginTop:'8px'}}
        />



        <RaisedButton label='submit'
                      onClick={props.updateDataset}
                      primary={true}
                      fullWidth={true}
                      style={{marginTop:'0px'}}/>
      </Drawer>
    )
}

export default SideBar
