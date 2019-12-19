import * as React from 'react';

export interface IRiskBoxData {
	count: number;
	colour: string;
	xVal: number;
	yVal: number;
}

export interface IMatrixBoxProps {
	riskData: IRiskBoxData;

	countChanged?: (newCount: number) => void;
}

export interface IMatrixBoxState extends React.ComponentState {}

export class MatrixBox extends React.Component<IMatrixBoxProps, IMatrixBoxState> {
	constructor(props: IMatrixBoxProps) {
		super(props);

		this.state = {};
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
					alignItems: 'center',
					position: 'relative',
					top: '50%',
					transform: 'translateY(-50%)',
					border: 'solid',
					boxSizing: 'border-box',
					borderWidth: '1px',
					borderColor: 'white',
					color: 'white'
				}}
			>
				<h3 style={{ color: 'white' }}>{this.props.riskData.count.toString()}</h3>
			</div>
		);
	}
}
