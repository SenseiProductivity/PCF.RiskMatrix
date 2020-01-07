import * as React from 'react';
import { MatrixBox, IRiskBoxData, IMatrixBoxProps } from './matrixBox';
import { IInputs } from './generated/ManifestTypes';

export interface IMatrixProps {
	data: IRiskBoxData[][];
	context: ComponentFramework.Context<IInputs>;
	xAxisTitle: string;
	yAxisTitle: string;
}

export interface IMatrixState extends React.ComponentState {}

export class Matrix extends React.Component<IMatrixProps, IMatrixState> {
	private MIN_SIZE: number = 250;
	private MAX_SIZE: number = 500;

	constructor(props: IMatrixProps) {
		super(props);
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
							<td style={{ textAlign: 'center', paddingLeft: `${width * 0.1}px` }}>
								<h2>Risk Matrix</h2>
							</td>
						</tr>
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
																style={{ verticalAlign: 'middle', textAlign: 'center' }}
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
																					transform:
																						' translateY(50%) rotate(270deg)'
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
				itemsX.push(<MatrixBox 
					key={x.toString() + y.toString()} 
					riskData={this.props.data[y - 1][x - 1]}
					/>);
			}

			itemsY.push(<div key={'y_' + y.toString()}>{itemsX}</div>);
		}

		return itemsY;
	}

	

}
