import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Title,Text } from '@carto/airship'
import SimpleVariableChart from '../viewer/simpleVariablePlot'
import { bindActionCreators } from 'redux'

import {setSelectedVariable} from '../../modules/DataReducer'

class StatsBar extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }
  renderPlot(variableName){
    if(this.props.results[this.props.method]){
      const selection = (this.props.selection ?
        this.props.selection.points.map((f)=>f[variableName]) : [])
      const all = this.props.results[this.props.method].map((f)=>f[variableName])
      return(
        <div style={{marginBottom:'20px'}}>
          <Text onClick={()=>this.props.setSelectedVariable(variableName)} >{variableName}</Text>

              <SimpleVariableChart
                data= {all}
                subset = { selection }
                name={variableName}
                width= {100}
                heigth={10}
              />
        </div>
      )
    }
  }

  render() {
    return (
      <div className='statsBar'>
        <Title>
          Stats
        </Title>
        {this.props.avaliableVariables.map((variable)=>this.renderPlot(variable))}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators({
    setSelectedVariable
  },dispatch)
}
function mapStateToProps(state) {
  return {
    avaliableVariables: state.data.avaliableVariables,
    selection : state.data.selection,
    method : state.data.method,
    results: state.data.results
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(StatsBar);
