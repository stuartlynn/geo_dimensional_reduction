import React from "react";
import TSNE from 'tsne-js';
import * as d3 from "d3";
import pack from 'ndarray-pack';

class Viewer extends React.Component{

  constructor(props){
    super(props)
    this.dispatchable = true
    this.state={
      width: 500,
      height:500
    }
  }

	updateSize(){
    const height = this.refs.divElement.clientHeight;
    const width = this.refs.divElement.clientWidth;
    this.setState({ height , width});
	}
  componentDidMount(){
		window.addEventListener("resize",this.setUpXYScale.bind(this))
		this.setUpXYScale(this.props.data)
		this.setUpColScale(this.props.data, this.props.variable)
		this.setUpData(this.props.data)
  }
	componentWillUnmount(){
		window.removeEventListener("resize",this.setUpXYScale.bind(this))
	}
  componentDidUpdate(){
    this.draw(this.points);
  }
	componentWillReceiveProps(nextProps){
		if(JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)){
			this.setUpData(nextProps.data)
			this.draw(this.points)
		}
		if(nextProps.variable !== this.props.variable){
			this.setUpColorScale(this.props.data,nextProps.variable)
			this.draw(this.points)
		}
	}
	setUpXYScale(data){

    const xMax  = d3.max(data,(d)=>+d.x)
    const yMax  = d3.max(data,(d)=>+d.y)

    const xMin  = d3.min(data,(d)=>+d.x)
    const yMin  = d3.min(data,(d)=>+d.y)

    this.xScale = d3.scaleLinear()
                      .domain([xMin,xMax])
                      .range([0, this.state.width]);

    this.yScale = d3.scaleLinear()
                      .domain([yMin,yMax])
                      .range([0, this.state.width]);

	}

	setUpColScale(data,variable){

    const colMin = d3.min(data,(d)=>+d[this.props.variable])
    const colMax = d3.max(data,(d)=>+d[this.props.variable])

		this.colScale  = d3.scaleLinear()
			.domain( data.map((p) => p[this.props.variable]))
      .range([
            "#f7feae",
            "#b7e6a5",
            "#7ccba2",
            "#46aea0",
            "#089099",
            "#00718b",
            "#045275"])
	}

	setUpData(data){
    this.points  = data.map((d) => {
      return {
        x: this.xScale(d.x),
        y: this.yScale(d.y),
				val: this.props.variable ? this.props.variable : 1,
        id: d.cartodb_id,
        color: this.props.variable ? this.colScale(d[this.props.variable]) : 'red'
      }
    })
	}

  draw(data,mouseLoc, pointWidth=1, pointHeight=1){
		window.requestAnimationFrame(()=>{
			const ctx = this.refs.canvas.getContext('2d');
			ctx.clearRect(0, 0, this.state.width, this.state.height);
			ctx.fillStyle = this.props.background ? this.props.background : 'white'
			ctx.fillRect(0,0, this.state.width, this.state.height);
			data.sort((a,b)=> a.val - b.val)
			let selectedPointIDS= []
			const r= 20
			for (let i = 0; i < data.length; ++i) {
						const point = data[i];
						if(mouseLoc){
							ctx.globalAlpha=0.02;
						}
						if(mouseLoc){
							if( Math.pow(point.x - mouseLoc.x,2) + Math.pow(point.y -mouseLoc.y,2) < r*r){
									ctx.globalAlpha = 1.0;
									selectedPointIDS.push(point.id)
							}
						}
						ctx.fillStyle = point.color;
						ctx.fillRect(point.x, point.y, pointWidth, pointWidth);
			}
			ctx.globalAlpha=1.0;
			ctx.restore()

      if(mouseLoc && this.props.onSelection){
        if(this.dispatchable){
          const dataLoc  = {
            x: this.xScale.invert(mouseLoc.x),
            y: this.yScale.invert(mouseLoc.y)
          }
          this.props.onSelection({loc:dataLoc, radius: this.xScale.invert(r)})
          this.dispatchable=false
          setTimeout(()=> this.dispatchable = true , 500)
        }
      }
		})
  }

	mouseMoved(e){
		const rect = this.refs.canvas.getBoundingClientRect()
		let x = e.pageX - rect.left;
    let y = e.pageY - rect.top;
		this.draw(this.points,{x,y})
	}

  render(){
    return(
      <div ref='divElement' style= {{width:'100%',height:'100%'}}>
        <canvas
					width={this.state.width}
					height={this.state.height}
					ref='canvas'
					onMouseMove={this.mouseMoved.bind(this)}
					onMouseOut={()=> this.draw(this.points)} />
        <div ref='tooltip'/>
      </div>
    )
  }
}

export default Viewer
