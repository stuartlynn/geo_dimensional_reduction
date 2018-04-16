import React, { Component} from 'react';
import PropTypes from 'prop-types';

class CartoVLLayer extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.apiKey !== this.props.apiKey ||
       nextProps.username !== this.props.username ||
       nextProps.query !== this.props.query){
       this.removeLayer()
       this.setUpSource(nextProps)
       this.addLayer()
    }
    else if(nextProps.style !== this.props.style){
      this.updateStyle(this.props.style)
    }
  }

  updateStyle(style=this.props.style){
    this.layer.blendToStyle(new this.props.carto.Style(style))
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('map is', this.props.map)
    console.log('compomnent mounting')
    if(this.props.map){
      if(this.props.map.loaded()){
        console.log("HERE IS ",this.props.map)
        this.setUpSource(this.props)
        this.addLayer()
      }
      this.props.map.on('load',()=>{
        console.log('adding layer on callback')
        this.setUpSource()
        this.addLayer()
        //this.updateVisibility()
      })
    }
  }

  addLayer(){
    this.layer = new this.props.carto.Layer(this.props.name, this.source, new this.props.carto.Style(this.props.style));
    window.layer = this.layer
    console.log('THIS LAYER ', this.layer)
    if (this.props.after){
       this.layer.addTo(this.props.map, this.props.after )
    }
    else{
      console.log('map in add layer',this.props.map, this.props.map.loaded)
      const layers = this.props.map.getStyle().layers;
      const lastLayer = layers[layers.length-1].id
      this.layer.addTo(this.props.map, lastLayer)
    }
  }

  removeLayer(){
    console.log(this.props.map)
    console.log(this.layer)
    this.props.map.removeLayer(this.props.name)
  }
  componentWillUnmount() {
    console.log('component unmounting')
    this.removeLayer()
  }

  setUpSource(props=this.props){
    console.log(props.query)
    this.source = new props.carto.source.SQL(
      props.query,
      {
        user: props.username,
        apiKey: props.apiKey
      },
      {
        serverURL: 'https://{user}.carto.com'
      });
  }

  render() {
    return (
      <span />
    );
  }
}


export default CartoVLLayer;
