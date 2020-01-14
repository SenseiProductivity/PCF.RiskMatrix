import * as React from 'react'
import { RiskItem } from './matrix'

export interface IRiskListProps {
	risks: RiskItem[]
	//listUpdate: () => void
}

export interface IRiskListState extends React.ComponentState {}

export class RiskList extends React.Component<IRiskListProps, IRiskListState> {
	constructor(props: IRiskListProps) {
		super(props)

		this.state = {}
    }
    
    // public handleUpdate = () => {
    //     this.forceUpdate()
    //   }

	public render(): JSX.Element {
		return (
				<ul
					style={{
						overflowY: 'auto',
						overflowX: 'auto',
						textAlign: 'left'
					}}
				>
					{this.props.risks.map((risk, riskIndex) => {
							return (
								<li key={risk.guid}>
									<h3 className={'riskList'}>
										<b>{risk.id}</b> - {risk.name}
									</h3>
								</li>
							)
						})}
				</ul>
		)
	}
}
