import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import makeDistroChart from './makeDistroChart/makeDistroChart'
import './makeDistroChart/distroChart.css'

class variableJitterrPlot extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    data : PropTypes.array
  };

  render() {
    return (
      <div className={styles.base}>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(variableJitterrPlot);
