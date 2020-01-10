import {
	IInputs,
	IOutputs
} from "./generated/ManifestTypes"
import * as React from "react"
import * as ReactDOM from "react-dom"
import {
	Matrix,
	IMatrixProps
} from "./matrix"
import {
	IRiskBoxData
} from "./matrixBox"


type DataSet = ComponentFramework.PropertyTypes.DataSet


export class SenseiPCFRiskMatrix implements ComponentFramework.StandardControl < IInputs, IOutputs > {

	private context: ComponentFramework.Context < IInputs >
	private notifyOutputChanged: () => void
	private matrixProps: IMatrixProps
	private containerElement: HTMLDivElement
	private matrixElement: HTMLDivElement
	private dataSetElements: any[]
	private containerHeight: number
	private containerWidth: number
	private lowThreshold: number
	private mediumThreshold: number
	private matrixSize: number


	/**
	 * Empty constructor.
	 */
	constructor() {
		
		this.dataSetElements = []
		this.matrixProps = {
			rawData: [],
			boxData: [],
			context: this.context,
			xAxisTitle: "X",
			yAxisTitle: "Y"
		}
		this.lowThreshold = 4
		this.mediumThreshold = 14
		this.matrixSize = 5
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context < IInputs > , notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		context.mode.trackContainerResize(true)
		this.notifyOutputChanged = notifyOutputChanged
		this.containerElement = document.createElement("div")
		this.matrixElement = document.createElement("div")
		this.containerElement.appendChild(this.matrixElement)
		this.containerWidth = context.mode.allocatedWidth || 250
		container.appendChild(this.containerElement)
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context < IInputs > ): void {
		this.context = context
		this.containerHeight = context.mode.allocatedHeight
		this.containerWidth = context.mode.allocatedWidth

		if (!context.parameters.Risks.loading) {
			if (context.parameters.Risks.paging != null && context.parameters.Risks.paging.hasNextPage == true) {
				context.parameters.Risks.paging.setPageSize(5000);
				context.parameters.Risks.paging.loadNextPage();
			}

			this.getRecords(context.parameters.Risks)
			this.matrixProps = {
				rawData: this.dataSetElements,
				boxData: this.initRiskArray(this.matrixSize, this.matrixSize),
				context: this.context,
				xAxisTitle: "Likelihood",
				yAxisTitle: "Consequence"
			}

			ReactDOM.render(
				React.createElement(
					Matrix,
					this.matrixProps
				),
				this.matrixElement
			)
		}

	}


	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {}
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this.containerElement)
	}

	private getRecords(gridParam: DataSet): void {
		this.dataSetElements = []
		for (let currentRecordId of gridParam.sortedRecordIds) {
			let probability = gridParam.records[currentRecordId].getFormattedValue("xAxisTitle")
			let impact = gridParam.records[currentRecordId].getFormattedValue("yAxisTitle")
			let name = gridParam.records[currentRecordId].getFormattedValue("riskName")
			this.dataSetElements.push({
				id: currentRecordId,
				name: name,
				impact: impact,
				probability: probability,
			})
		}
		this.matrixProps.boxData = this.dataSetElements
	}

	private countRisks(x: number, y: number) {
		let count = this.dataSetElements.filter((e) => {
			return e.impact == x && e.probability == y
		}).length
		return count
	}

	private initRiskArray(x: number, y: number): IRiskBoxData[][] {
		let arr: IRiskBoxData[][] = []
		for (let i = 0; i < y; i++) {
			arr[i] = []
			for (let j = 0; j < x; j++) {
				let col: string = this.calcRiskCategoryColour(i + 1, j + 1, this.lowThreshold, this.mediumThreshold)
				let hoverCol: string = this.calcRiskCategoryHoverColour(i + 1, j + 1, this.lowThreshold, this.mediumThreshold)
				let pressCol: string = this.calcRiskCategoryPressColour(i + 1, j + 1, this.lowThreshold, this.mediumThreshold)
				arr[i][j] = {
					colour: col,
					hoverColour: hoverCol,
					pressColour: pressCol,
					count: this.countRisks(i + 1, j + 1),
					xVal: j + 1,
					yVal: i + 1
				}
			}
		}
		return arr
	}

	private calcRiskCategoryColour(x: number, y: number, lowThreshold: number, mediumThreshold: number): string {
		let risk: number = Math.round(x * y)
		switch (true) {
			case risk > mediumThreshold:
				return "#D11D26"
			case risk > lowThreshold && risk <= mediumThreshold:
				return "#FFBF00"
			case risk <= lowThreshold:
				return "#238823"
			default:
				return "white"
		}
	}

	private calcRiskCategoryHoverColour(x: number, y: number, lowThreshold: number, mediumThreshold: number): string {
		let risk: number = Math.round(x * y)
		switch (true) {
			case risk > mediumThreshold:
				return "#A7171F"
			case risk > lowThreshold && risk <= mediumThreshold:
				return "#D49F00"
			case risk <= lowThreshold:
				return "#1D6E1D"
			default:
				return "white"
		}
	}

	private calcRiskCategoryPressColour(x: number, y: number, lowThreshold: number, mediumThreshold: number): string {
		let risk: number = Math.round(x * y)
		switch (true) {
			case risk > mediumThreshold:
				return "#520B0F"
			case risk > lowThreshold && risk <= mediumThreshold:
				return "#806000"
			case risk <= lowThreshold:
				return "#185C18"
			default:
				return "white"
		}
	}


}