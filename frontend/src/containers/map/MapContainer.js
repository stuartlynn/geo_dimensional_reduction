import React from "react";
import Map from './Map.js'
import CartoVLLayer from './CartoVLLayer.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { mapMoved } from '../../modules/MapReducer.js'
//const cartoVLInstance = require('@carto/carto-vl');

class MapContainer extends React.Component{


  render(){
    console.log("query is ", this.props.query)
    return (
      <Map
        zoom={this.props.zoom}
        center={this.props.center}
        basemap = {this.props.basemap}
        mapboxtoken= {this.props.maoboxtoken}
        extent = {this.props.extent}
      >

        <CartoVLLayer
          username= {this.props.username}
          apiKey = {this.props.apiKey}
          host='carto'
          name='poly'
          query = {this.props.query}
          style = {this.props.mapStyle}
          carto = {window.carto}
          onHover= {(features)=>{console.log(features)}}
          visibility= {true}
        />
      </Map>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  mapMoved
}, dispatch)

const getQuery = (state)=>{
  console.log("STATE DATA METHOD", state.data.method)
  console.log(state)
  if(state.data.joinTable[state.data.method] ===undefined){
    console.log('RETURNING REGULAR QUERY')
    return state.data.query
  }
  else{
    console.log('RETURNING MODIFIED QUERY')
    return ` select orig.*, j.x, j.y from (${state.data.query}) as orig,
    ${state.data.joinTable[state.data.method]} as j
    where j.orig_id::NUMERIC = orig.cartodb_id::NUMERIC
    `
  }
}

const mapStyle = (state)=>{
  const selectedVariable = state.data.selectedVariable
  const selection = state.data.selection
  if(selectedVariable){
    //const colStyle =  `color: ramp(linear($${this.props.selectedVariable}, 2,5) ,Geyser)`
    console.log("SELECTION IS ", selection)
    //const selection = `in($fid, )`
    let   colStyle = `
    color: ramp(linear($${selectedVariable}, 0,1) , BluYl)
    strokeWidth:0
    `


    if(selection !== undefined && selection!== null){
      const x = selection.loc.x
      const y = selection.loc.y
      const r = selection.radius

      console.log("ADDING SELECTION STYLE")
      colStyle  =  '@x : $x \n' + colStyle
      colStyle  = '@y : $y \n' + colStyle

      colStyle += `\nfilter: (pow(sub($x,${x}),2) + pow(sub($y,${y}),2)) < ${r*r} `
    }
    console.log(colStyle)
    return colStyle
  }
  else{
    return 'color: white'
  }
}

const mapStateToProps = state => ({
  query: getQuery(state),
  mapStyle: state.map.style,
  username: state.data.username,
  apiKey : state.data.apiKey,
  center: state.map.center,
  zoom: state.map.zoom,
  mapboxtoken: state.map.mapboxtoken,
  selectedVariable: state.data.selectedVariable,
  basemap: state.map.basemap,
  selection: state.data.selection,
  mapStyle: mapStyle(state)
})


export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
