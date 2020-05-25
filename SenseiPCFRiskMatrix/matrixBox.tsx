import * as React from 'react';
import { IMatrixBoxFilter } from './matrix';

export interface IRiskBoxData {
	count: number;
	colour: string;
	hoverColour: string;
	pressColour: string;
	xVal: number;
	yVal: number;
}

export interface IMatrixBoxProps {
	riskData: IRiskBoxData;
	matrixFilter: any;
	selectedFilter: IMatrixBoxFilter;
}

export interface IMatrixBoxState extends React.ComponentState {
	boxFillColour: string;
	selected: boolean;
}

export class MatrixBox extends React.Component<IMatrixBoxProps, IMatrixBoxState> {
	constructor(props: IMatrixBoxProps) {
		super(props);

		this.state = {
			boxFillColour: this.props.riskData.colour,
			selected: false
		};
	}

	public render(): JSX.Element {
		return (
			<div
				className={'matrixBox'}
				style={{
					backgroundColor:
						this.props.selectedFilter.filterX == this.props.riskData.xVal &&
						this.props.selectedFilter.filterY == this.props.riskData.yVal
							? this.state.selected ? this.props.riskData.pressColour : this.props.riskData.hoverColour
							: this.state.boxFillColour
				}}
				onMouseDown={() => this.handleMouseDown()}
				onMouseOver={() => this.handleMouseOver()}
				onMouseLeave={() => this.handleMouseLeave()}
				onMouseUp={() => this.handleMouseLeave()}
			>
				<h2 style={{ color: this.props.riskData.count == 0 ? 'transparent' : 'white' }}>
					{this.props.riskData.count.toString()}
				</h2>
			</div>
		);
	}

	private handleMouseDown() {
		this.setState({ boxFillColour: this.props.riskData.pressColour, selected: true });
		this.applySubgridFilter(this.props.riskData.xVal, this.props.riskData.yVal);
	}

	private handleMouseOver() {
		this.setState({ boxFillColour: this.props.riskData.hoverColour });
	}

	private handleMouseLeave() {
		this.setState({ boxFillColour: this.props.riskData.colour, selected: false });
	}

	applySubgridFilter = (xFilterVal: number, yFilterVal: number) => {
		this.props.matrixFilter({
			filterX: xFilterVal,
			filterY: yFilterVal
		});
	};
}
