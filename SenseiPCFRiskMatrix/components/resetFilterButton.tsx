import * as React from 'react';

export interface IResetFilterButtonProps {
	visible: boolean;
	hideClearFilterButton: any;
}

export interface IResetFilterButtonState extends React.ComponentState {}

export class ResetFilterButton extends React.Component<IResetFilterButtonProps, IResetFilterButtonState> {
	constructor(props: IResetFilterButtonProps) {
		super(props);
		this.state = {};
	}

	public render(): JSX.Element {
		return (
			<div
				style={{ backgroundColor: 'lightGrey', visibility: this.props.visible ? 'visible' : 'hidden' }}
				onMouseDown={() => this.handleMouseDown()}
			>
				Clear filter
			</div>
		);
	}

	private handleMouseDown() {
		this.props.hideClearFilterButton();
	}
}
