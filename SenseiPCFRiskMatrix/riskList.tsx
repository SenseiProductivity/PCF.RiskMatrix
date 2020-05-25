import * as React from 'react';
import { RiskItem } from './matrix';

export interface IRiskListProps {
	risks: RiskItem[];
}

export interface IRiskListState extends React.ComponentState {}

export class RiskList extends React.Component<IRiskListProps, IRiskListState> {
	constructor(props: IRiskListProps) {
		super(props);

		this.state = {};
	}

	public render(): JSX.Element {
		return (
			<ul
				className={'riskList'}
				style={{
					overflowY: 'auto',
					overflowX: 'auto',
					textAlign: 'left'
				}}
			>
				{this.buildList()}
			</ul>
		);
	}

	private buildList() {
		return this.props.risks.map((risk, riskIndex) => {
			return (
				<li key={risk.guid}>
					<h3 className={'RowText'}>
						<b>{risk.id}</b> - {risk.name}
					</h3>
				</li>
			);
		});
	}
}
