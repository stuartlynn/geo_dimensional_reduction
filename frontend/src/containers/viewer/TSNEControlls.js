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

  render() {
    console.log('PROPS ARE ', this.props)
    return (
      <div class='controls'>
        <Text className='label' weight="medium">No Components</Text>
        <Range className='input'
               name='noComponents'
               />
       <Button
         onClick={this.props.onRun}
         className='run'
         large>
         RUN
       </Button>
       { this.props.dataLoaded &&
					<Dropdown as='div' action='click'>
						<Dropdown.Trigger> <Button>Click me</Button></Dropdown.Trigger>
						<Dropdown.Content>
							<Dropdown.Menu>
								{ this.props.columns.map((col)=> <Dropdown.Item key={col}>{col}</Dropdown.Item>)}
							</Dropdown.Menu>
						</Dropdown.Content>
					</Dropdown>
       }
      </div>
    );
  }
}

export default TSNEControlls;
