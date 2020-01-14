import * as React from 'react'
import { IMatrixFilterState } from "./matrix";

export interface IRiskBoxData {
	count: number
	colour: string
	hoverColour: string
	pressColour: string
	xVal: number
	yVal: number
}

export interface IMatrixBoxProps {
	riskData: IRiskBoxData,
	matrixFilter: any
}

export interface IMatrixBoxState extends React.ComponentState {
	boxFillColour: string
	
}

export class MatrixBox extends React.Component<IMatrixBoxProps, IMatrixBoxState> {

	constructor(props: IMatrixBoxProps) {
		
		super(props)

		this.state = {
			boxFillColour: this.props.riskData.colour,
		}
	}

	public render(): JSX.Element {
		return (
			<div
				style={{
					minHeight: '100%',
					maxHeight: '100%',
					height: '100%',
					width: '20%',
					display: 'inline-flex',
					justifyContent: 'center',
					position: 'relative',
					alignItems: 'center',
					top: '50%',
					transform: 'translateY(-50%)',
					border: 'solid',
					boxSizing: 'border-box',
					borderWidth: '1px',
					borderColor: 'white',
					color: 'white',
					backgroundColor: this.state.boxFillColour
				}}
				onMouseDown = {() => this.handleMouseDown()}
				onMouseOver = {() => this.handleMouseOver()}
				onMouseLeave = {() => this.handleMouseLeave()}
				onMouseUp = {() => this.handleMouseLeave()}
			>
				<h2 style={{ color: this.props.riskData.count == 0 ? 'transparent' : 'white' }}>{this.props.riskData.count.toString()}</h2>
			</div>
		)
	}
	
	private handleMouseDown()  {
		this.setState({boxFillColour: this.props.riskData.pressColour})
		this.applySubgridFilter(this.props.riskData.xVal,this.props.riskData.yVal)
	}
	
	private handleMouseOver() {
		this.setState({boxFillColour: this.props.riskData.hoverColour})
	}

	private handleMouseLeave() {
		this.setState({boxFillColour: this.props.riskData.colour})
	}

	applySubgridFilter = (xFilterVal: number, yFilterVal: number) => {
		this.props.matrixFilter({
			filterX: xFilterVal,
			filterY: yFilterVal
		});
   }

	}


