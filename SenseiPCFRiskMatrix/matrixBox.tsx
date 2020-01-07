import * as React from 'react'

export interface IRiskBoxData {
	count: number
	colour: string
	hoverColour: string
	xVal: number
	yVal: number
}

export interface IMatrixBoxProps {
	riskData: IRiskBoxData
}

export interface IMatrixBoxState extends React.ComponentState {}

export class MatrixBox extends React.Component<IMatrixBoxProps, IMatrixBoxState> {
	constructor(props: IMatrixBoxProps) {
		super(props)

		this.state = {}
	}

	public render(): JSX.Element {
		return (
			<div
				style={{
					height: '100%',
					width: '20%',
					backgroundColor: this.props.riskData.colour,
					display: 'inline-flex',
					justifyContent: 'center',
					position: 'relative',
					top: '50%',
					transform: 'translateY(-50%)',
					border: 'solid',
					boxSizing: 'border-box',
					borderWidth: '1px',
					borderColor: 'white',
					color: 'white'
				}}
				onMouseDown = {() => this.handleClick(this.props.riskData.xVal, this.props.riskData.yVal)}
			>
				<h2 style={{ color: this.props.riskData.count == 0 ? 'transparent' : 'white' }}>{this.props.riskData.count.toString()}</h2>
			</div>
		)
	}
	handleClick(xVal: number, yVal: number)  {
		console.log("X: " + this.props.riskData.xVal.toString() + ", Y: " + this.props.riskData.yVal.toString())
	}

	
	
}
