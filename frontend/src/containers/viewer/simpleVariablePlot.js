import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { Boxplot, computeBoxplotStats } from 'react-boxplot'
import {Subheading} from '@carto/airship'
import styled from 'styled-components'

const BoldSpan = styled.span`
  font-weight: bold
`

class SimpleVariableChart extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    data: PropTypes.array,
    subset: PropTypes.array,
    name: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number

  };
  render() {
    const allStats = computeBoxplotStats(this.props.data)
    const subsetStats = computeBoxplotStats(this.props.subset)
    const max = allStats.whiskerHigh
    const min = allStats.whiskerLow
    const mean = this.props.data.reduce((r,v)=> r+v ,0)/allStats.length
    const submean = this.props.subset.reduce((r,v)=> r+v, 0 )/this.props.subset.length


    console.log("BOX PLOT STATS ", allStats, min, max)
    return (
      <div>
        <div style={{display:'block'}}>
          <Boxplot
          width={200} height={ 15 } orientation="horizontal"
          min={ min } max={ max }
          stats={ allStats }
          style={{display:'block'}}/>
        </div>
        <div style={{display:'block'}}>
          <Boxplot
          width={ 200 } height={ 15 } orientation="horizontal"
          min={ min } max={ max }
        stats={ subsetStats} />
        </div>
        <div>
          <p style={{fontSize:'10px'}}>
            <BoldSpan>Min:</BoldSpan> {min.toFixed(2)}
            <BoldSpan>Max:</BoldSpan> {max.toFixed(2)}
            <BoldSpan>All Mean:</BoldSpan> {mean.toFixed(2)}
            <BoldSpan>Sub Mean:</BoldSpan>{submean.toFixed(2)}</p>
        </div>
      </div>
    );
  }
}

export default SimpleVariableChart;
