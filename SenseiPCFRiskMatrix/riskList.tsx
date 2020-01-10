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
			<div
				style={{
					height: '100%',
					width: '400px',
					marginTop: '100px'
				}}
			>
				<ul
					style={{
						height: '400px',
						overflowY: 'auto',
						overflowX: 'hidden',
						textAlign: 'left'
					}}
				>
					{this.props.risks.map((risk, riskIndex) => {
							return (
								<li key={risk.id}>
									<h3 className={'riskList'}>
										<b>{risk.id.substring(2)}</b> - {risk.name}
									</h3>
								</li>
							)
						})}
				</ul>
			</div>
		)
	}
}
