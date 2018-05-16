import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Button, Range, Input, Text } from '@carto/airship';

class TSNEControlls extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };
  state={
    iterations: 2000,
    perplexity: 35,
    learning_rate: 200
  }
  render() {
    console.log('PROPS ARE ', this.props)
    return (
      <div class='controls'>
        <Text className='label' weight="medium">Iterations</Text>
        <Range className='input'
               name='iterations'
               value={this.state.iterations}
               maxValue={1000}
               minValue={10}
               onChange={(val)=>this.setState({iterations: val})}
               />

        <Text className='label' weight="medium">Perplexity</Text>
        <Range className='input'
               name='Perplexity'
               value={this.state.perplexity}
               maxValue={1000}
               minValue={10}
               onChange={(val)=>this.setState({perplexity: val})}
               />

        <Text className='label' weight="medium">Learning Rate</Text>
        <Range className='input'
               name='Learning Rate'
               value={this.state.learning_rate}
               maxValue={1000}
               minValue={10}
               onChange={(val)=>this.setState({learning_rate: val})}
               />

       <Button
         onClick={()=>this.props.onRun(this.state)}
         className='run'
         large>
         RUN
       </Button>
      </div>
    );
  }
}

export default TSNEControlls;
