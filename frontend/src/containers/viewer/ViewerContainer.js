import React from "react";
import Viewer from './Viewer.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tabs, Loading } from  '@carto/airship';
import  PCAControlls from './PCAControlls'
import  TSNEControlls from './TSNEControlls'
import { getDimReductions, setSelection } from '../../modules/DataReducer'

class ViewerContainer extends React.Component{
  render(){
    return(
      <Tabs selected={'PCA'} >
        <Tabs.Panel label='PCA'>

          <PCAControlls
            onRun={()=>{this.props.getDimReductions('PCA')}}
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
              onSelection = {this.props.updateSelection}
              variable = {this.props.selectedVariable}
              background= 'black'
							style={{padding:'20px', boxSizing:'border-box'}}
            />
          }

        </Tabs.Panel>
        <Tabs.Panel label='TSNE'>
          <TSNEControlls
            onRun={()=>{this.props.getDimReductions('TSNE')}}
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
						/>
					}
        </Tabs.Panel>
        <Tabs.Panel label='MDS'>

          <Viewer
            data={this.props.results.PCA}
            perpexity={30.0}
            earlyExaggeration={4.0}
            learningRate={100.0}
            nIter={1000}
            metric={'euclidean'}
            className='tsne'
            variable = {this.props.selectedVariable}
            background= 'black'
          />

        </Tabs.Panel>
      </Tabs>
    )
  }
}

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators({
    getDimReductions,
    setSelection
  },dispatch)
}

const mapStateToProps = (state)=>{
  return {
    dataStatus : state.data.dataStatus,
    results: state.data.results,
    selectedVariable: state.data.selectedVariable,
	  avaliableVariables: state.data.avaliableVariables
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(ViewerContainer)

