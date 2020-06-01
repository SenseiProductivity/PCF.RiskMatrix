import * as React from 'react';
import { MatrixBox, IRiskBoxData, IMatrixBoxProps } from './matrixBox';
import { IInputs } from '../generated/ManifestTypes';
import { RiskList, IRiskListProps, IRiskListState } from './riskList';
import { ResetFilterButton } from './resetFilterButton';
import { Config } from '../models/config';

export interface RiskItem {
	guid: string;
	id: number;
	name: string;
	impact: number;
	probability: number;
}

export interface IMatrixProps {
	rawData: RiskItem[];
	boxData: IRiskBoxData[][];
	context: ComponentFramework.Context<IInputs>;
	xAxisTitle: string;
	yAxisTitle: string;
	config: Config;
}

export interface IMatrixBoxFilter {
	filterX?: number;
	filterY?: number;
}

export interface IMatrixState extends React.ComponentState {
	matrixBoxFilterState: IMatrixBoxFilter;
	boxFilterData: RiskItem[];
	filterResetButtonVisible: boolean;
	lastSelectedFilter: IMatrixBoxFilter;
}

export class Matrix extends React.Component<IMatrixProps, IMatrixState> {
	private MIN_SIZE: number = 250;
	private MAX_SIZE: number = 1300;
	private width: number;
	private height: number;
	private boxFilterData: RiskItem[];

	constructor(props: IMatrixProps) {
		super(props);
		this.state = {
			matrixBoxFilterState: {},
			lastSelectedFilter: {},
			boxFilterData: this.props.rawData,
			filterResetButtonVisible: false
		};
	}

	public render(): JSX.Element {
		this.boxFilterData = this.state.boxFilterData;
		this.width =
			this.props.context.mode.allocatedWidth == -1 || isNaN(this.props.context.mode.allocatedWidth)
				? this.MIN_SIZE
				: this.props.context.mode.allocatedWidth > this.MAX_SIZE
					? this.MAX_SIZE
					: this.props.context.mode.allocatedWidth;
		this.height =
			this.props.context.mode.allocatedHeight == -1 || isNaN(this.props.context.mode.allocatedHeight)
				? this.MIN_SIZE
				: this.props.context.mode.allocatedHeight > this.MAX_SIZE
					? this.MAX_SIZE
					: this.props.context.mode.allocatedHeight;

		const renderList = (): JSX.Element => {
			if (this.width > 799) {
				return <RiskList risks={this.boxFilterData} />;
			} else {
				return <div />;
			}
		};
		return (
			<div>
				<table>
					<tbody>
						<tr>
							<td>
								<table>
									<tbody>
										<tr>
											<td>
												<table>
													<tbody>
														<tr>
															<td
																style={{
																	verticalAlign: 'middle',
																	textAlign: 'center',
																	paddingTop: '80px'
																}}
															>
																<table
																	style={{
																		tableLayout: 'fixed',
																		paddingTop: '120px',
																		width: '40px'
																	}}
																>
																	<tbody>
																		<tr>
																			<td
																				style={{
																					width: '50px',
																					verticalAlign: 'middle',
																					textAlign: 'center',
																					transform: 'rotate(270deg)'
																				}}
																			>
																				{this.props.yAxisTitle.toString()}
																			</td>
																		</tr>
																	</tbody>
																</table>
															</td>
															<td
																style={{
																	verticalAlign: 'middle',
																	textAlign: 'center'
																}}
															>
																<table
																	style={{
																		height: '248px',
																		tableLayout: 'fixed',
																		marginTop: '44px'
																	}}
																>
																	<tbody>
																		<tr>
																			<td className={'yAxisLabel'}>5</td>
																		</tr>
																		<tr>
																			<td className={'yAxisLabel'}>4</td>
																		</tr>
																		<tr>
																			<td className={'yAxisLabel'}>3</td>
																		</tr>
																		<tr>
																			<td className={'yAxisLabel'}>2</td>
																		</tr>
																		<tr>
																			<td className={'yAxisLabel'}>1</td>
																		</tr>
																	</tbody>
																</table>
															</td>
														</tr>
													</tbody>
												</table>
											</td>

											<td>
												<div style={{ textAlign: 'center', height: '40px' }}>
													<h2>Risk Matrix</h2>
												</div>
												<div
													style={{
														display: 'grid',
														border: 'solid',
														borderWidth: '2px',
														borderColor: 'white'
													}}
												>
													{this.createGrid()}
												</div>
											</td>
											<td>
												<div style={{ width: '20px' }} />
											</td>
										</tr>
										<tr>
											<td>
												<ResetFilterButton
													visible={this.state.filterResetButtonVisible}
													hideClearFilterButton={this.hideClearFilterButton}
												/>
											</td>
											<td>
												<table style={{ width: '250px' }}>
													<tbody>
														<tr>
															<td className={'xAxisLabel'}>1</td>
															<td className={'xAxisLabel'}>2</td>
															<td className={'xAxisLabel'}>3</td>
															<td className={'xAxisLabel'}>4</td>
															<td className={'xAxisLabel'}>5</td>
														</tr>
													</tbody>
												</table>

												<div style={{ textAlign: 'center' }}>
													{this.props.xAxisTitle.toString()}
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
							<td style={{ width: `${this.width * 0.7}px` }}>
								<div style={{ height: '40px' }} />
								<div
									style={{
										height: `${this.height}px`,
										width: `${this.width * 0.7}px`,
										overflow: 'auto'
									}}
								>
									{renderList()}
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	private createGrid(): any[] {
		let itemsY = [];
		let itemsX = [];

		for (let y = 5; y > 0; y--) {
			itemsX = [];
			for (let x = 1; x <= 5; x++) {
				itemsX.push(
					<MatrixBox
						key={x.toString() + y.toString()}
						riskData={this.props.boxData[y - 1][x - 1]}
						matrixFilter={this.matrixBoxSelect}
						selectedFilter={this.state.matrixBoxFilterState}
					/>
				);
			}

			itemsY.push(
				<div
					key={'y_' + y.toString()}
					style={{
						height: '50px'
					}}
				>
					{itemsX}
				</div>
			);
		}

		return itemsY;
	}

	matrixBoxSelect = (matrixBoxFilter: IMatrixBoxFilter) => {
		if (
			this.state.lastSelectedFilter.filterX === matrixBoxFilter.filterX &&
			this.state.lastSelectedFilter.filterY === matrixBoxFilter.filterY
		) {
			this.setState({
				filterResetButtonVisible: false,
				matrixBoxFilterState: {},
				lastSelectedFilter: {},
				boxFilterData: this.props.rawData
			});
		} else {
			this.setState({
				filterResetButtonVisible: true,
				matrixBoxFilterState: matrixBoxFilter,
				lastSelectedFilter: matrixBoxFilter,
				boxFilterData: this.props.rawData.filter((risk) => {
					if (
						typeof matrixBoxFilter.filterX != 'undefined' &&
						typeof matrixBoxFilter.filterY != 'undefined'
					) {
						return risk.probability == matrixBoxFilter.filterX && risk.impact == matrixBoxFilter.filterY;
					} else {
						return risk;
					}
				})
			});
		}
	};

	hideClearFilterButton = () => {
		this.setState({
			filterResetButtonVisible: false,
			matrixBoxFilterState: {},
			lastSelectedFilter: {},
			boxFilterData: this.props.rawData
		});
	};
}
