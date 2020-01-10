import * as React from 'react';
import { MatrixBox, IRiskBoxData, IMatrixBoxProps } from './matrixBox';
import { IInputs } from './generated/ManifestTypes';
import { RiskList, IRiskListProps, IRiskListState } from './riskList';

export interface RiskItem {
	id: string;
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
}

export interface IMatrixFilterState {
	filterX?: number;
	filterY?: number;
}

export interface IMatrixState extends React.ComponentState {
	matrixBoxFilterState: IMatrixFilterState;
	boxFilterData: RiskItem[];
}

export class Matrix extends React.Component<IMatrixProps, IMatrixState> {
	private MIN_SIZE: number = 250;
	private MAX_SIZE: number = 500;

	constructor(props: IMatrixProps) {
		super(props);
		this.state = {
			boxFilterData: this.props.rawData,
			matrixBoxFilterState: {}
		};
	}

	public render(): JSX.Element {
		let width: number =
			this.props.context.mode.allocatedWidth == -1 || isNaN(this.props.context.mode.allocatedWidth)
				? this.MIN_SIZE
				: this.props.context.mode.allocatedWidth > this.MAX_SIZE
					? this.MAX_SIZE
					: this.props.context.mode.allocatedWidth;
		let height: number =
			this.props.context.mode.allocatedHeight == -1 || isNaN(this.props.context.mode.allocatedHeight)
				? this.MIN_SIZE
				: this.props.context.mode.allocatedHeight > this.MAX_SIZE
					? this.MAX_SIZE
					: this.props.context.mode.allocatedHeight;

		return (
			<div>
				<table style={{ paddingBottom: '100%', height: '100%', width: `${width}px` }}>
					<tbody>
						<tr>
							<td>
								<table>
									<tbody>
										<tr>
											<td>
												<table
													style={{
														height: `${width * 0.9}px`,
														width: `${width * 0.1}px`,
														tableLayout: 'fixed'
													}}
												>
													<tbody>
														<tr>
															<td
																style={{
																	verticalAlign: 'middle',
																	textAlign: 'center',
																	paddingTop: '75px'
																}}
															>
																<table
																	style={{
																		width: `${width / 20}px`,
																		tableLayout: 'fixed'
																	}}
																>
																	<tbody>
																		<tr>
																			<td
																				style={{
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
																	height: '100%',
																	verticalAlign: 'middle',
																	textAlign: 'center'
																}}
															>
																<table
																	style={{
																		height: '100%',
																		width: `${width / 20}px`,
																		tableLayout: 'fixed'
																	}}
																>
																	<tbody>
																		<tr>
																			<td
																				style={{
																					verticalAlign: 'middle',
																					textAlign: 'center'
																				}}
																			>
																				5
																			</td>
																		</tr>
																		<tr>
																			<td
																				style={{
																					verticalAlign: 'middle',
																					textAlign: 'center'
																				}}
																			>
																				4
																			</td>
																		</tr>
																		<tr>
																			<td
																				style={{
																					verticalAlign: 'middle',
																					textAlign: 'center'
																				}}
																			>
																				3
																			</td>
																		</tr>
																		<tr>
																			<td
																				style={{
																					verticalAlign: 'middle',
																					textAlign: 'center'
																				}}
																			>
																				2
																			</td>
																		</tr>
																		<tr>
																			<td
																				style={{
																					verticalAlign: 'middle',
																					textAlign: 'center'
																				}}
																			>
																				1
																			</td>
																		</tr>
																	</tbody>
																</table>
															</td>
														</tr>
													</tbody>
												</table>
											</td>

											<td>
												<tr>
													<td style={{ textAlign: 'center', width: `${width}px` }}>
														<h2>Risk Matrix</h2>
													</td>
												</tr>
												<div
													style={{
														display: 'grid',
														width: `${width * 0.9}px`,
														height: `${width * 0.9}px`,
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
											<td>
												<RiskList risks={this.state.boxFilterData} />
											</td>
										</tr>
										<tr>
											<td>&nbsp;</td>
											<td>
												<table style={{ width: `${width * 0.9}px` }}>
													<tbody>
														<tr>
															<td style={{ width: '20%', textAlign: 'center' }}>1</td>
															<td style={{ width: '20%', textAlign: 'center' }}>2</td>
															<td style={{ width: '20%', textAlign: 'center' }}>3</td>
															<td style={{ width: '20%', textAlign: 'center' }}>4</td>
															<td style={{ width: '20%', textAlign: 'center' }}>5</td>
														</tr>
													</tbody>
												</table>

												<div style={{ width: `${width * 0.9}px`, textAlign: 'center' }}>
													{this.props.xAxisTitle.toString()}
												</div>
											</td>
										</tr>
									</tbody>
								</table>
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
					/>
				);
			}

			itemsY.push(<div key={'y_' + y.toString()}>{itemsX}</div>);
		}

		return itemsY;
	}

	matrixBoxSelect = (matrixBoxFilter: IMatrixFilterState) => {
		this.setState({
			matrixBoxFilterState: matrixBoxFilter,
			boxFilterData: this.props.rawData.filter((risk) => {
				if ((typeof(matrixBoxFilter.filterX) != "undefined") && (typeof(matrixBoxFilter.filterY) != "undefined")) {
					return risk.probability == matrixBoxFilter.filterX && risk.impact == matrixBoxFilter.filterY;
				} 
				else {
					return risk;
				}
			})
		});
		// console.log('matrixBoxFilterState: X-' + matrixBoxFilter.filterX + ', Y-' + matrixBoxFilter.filterY);
	};
}
