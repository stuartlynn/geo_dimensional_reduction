import React from "react";
import Viewer from './Viewer.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tabs, Loading,Dropdown, Text } from  '@carto/airship';
import  PCAControlls from './PCAControlls'
import  TSNEControlls from './TSNEControlls'
import { getDimReductions, setSelection, setMethod } from '../../modules/DataReducer'
import  SimpleVariableChart  from './simpleVariablePlot'

class ViewerContainer extends React.Component{
  render(){
    return(
      <div>
        <Tabs selected={'PCA'} onChange={(state) => this.props.setMethod(["PCA","TSNE","MDS"][state.selected])} >
          <Tabs.Panel label='PCA'>

            <PCAControlls
              onRun={(params)=>{this.props.getDimReductions('PCA',params)}}
              dataLoaded={this.props.dataStatus.PCA ==='loaded'}
              columns = {this.props.avaliableVariables}
            />

            { this.props.dataStatus.PCA == 'pending' &&
               <Loading size={32}/>
            }
            { this.props.dataStatus.PCA == 'loaded' &&
              <Viewer
                data={this.props.results.PCA}
                perpexity={30.0}
                earlyExaggeration={4.0}
                learningRate={100.0}
                nIter={1000}
                metric={'euclidean'}
                className='tsne'
                onSelection = {this.props.setSelection}
                variable = {this.props.selectedVariable}
                background= 'black'
                style={{padding:'20px', boxSizing:'border-box'}}
              />
            }
          </Tabs.Panel>
          <Tabs.Panel label='TSNE'>
            <TSNEControlls
              onRun={(params)=>{this.props.getDimReductions('TSNE',params)}}
              dataLoaded={this.props.dataStatus.TSNE==='loaded'}
              columns = {this.props.avaliableVariables}
              perpexity={30.0}
              earlyExaggeration={4.0}
              learningRate={100.0}
              nIter={1000}
              metric={'euclidean'}
            />

            { this.props.dataStatus.TSNE == 'pending' &&
               <Loading size={32}/>
            }
            { this.props.dataStatus.TSNE == 'loaded' &&
              <Viewer
                data={this.props.results.TSNE}
                className='tsne'
                variable = {this.props.selectedVariable}
                background= 'black'
                onSelection = {this.props.setSelection}
              />
            }
          </Tabs.Panel>
        </Tabs>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators({
    getDimReductions,
    setSelection,
    setMethod
  },dispatch)
}

const mapStateToProps = (state)=>{
  return {
    dataStatus : state.data.dataStatus,
    results: state.data.results,
    selectedVariable: state.data.selectedVariable,
	  avaliableVariables: state.data.avaliableVariables,
    selection: (state.data.selection ? state.data.selection.points : [])
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(ViewerContainer)

