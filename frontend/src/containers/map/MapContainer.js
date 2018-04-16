import React from "react";
import Map from './Map.js'
import CartoVLLayer from './CartoVLLayer.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { mapMoved } from '../../modules/MapReducer.js'
const cartoVLInstance = require('@carto/carto-vl');

class MapContainer extends React.Component{

  mapStyle(){
    if(this.props.selectedVariable){
      //const colStyle =  `color: ramp(linear($${this.props.selectedVariable}, 2,5) ,Geyser)`
      const colStyle = `color: ramp(linear($${this.props.selectedVariable}, 0,1) , BluYl)`
      return colStyle
    }
    else{
      return 'color: white'
    }
  }

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
          name='poly'
          query = {this.props.query}
          style = {this.mapStyle()}
          carto = {cartoVLInstance}
        />
      </Map>
    )
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
  mapMoved
}, dispatch)



const mapStateToProps = state => ({
  query: state.data.query,
  mapStyle: state.map.style,
  username: state.data.username,
  apiKey : state.data.apiKey,
  center: state.map.center,
  zoom: state.map.zoom,
  mapboxtoken: state.map.mapboxtoken,
  selectedVariable: state.data.selectedVariable,
  basemap: state.map.basemap
})


export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
