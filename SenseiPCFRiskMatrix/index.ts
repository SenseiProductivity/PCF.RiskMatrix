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

	private _context: ComponentFramework.Context < IInputs > 
	private _notifyOutputChanged: () => void
	//private _refreshData: EventListenerOrEventListenerObject
	private _matrixProps: IMatrixProps

	private _containerHeight: number
	private _containerWidth: number


	private _containerElement: HTMLDivElement

	private _matrixElement: HTMLDivElement

	private _xAxisElement: HTMLDivElement
	private _yAxisElement: HTMLDivElement
	private _headerElement: HTMLDivElement
	private _dataSet: IRiskBoxData[][]
	private _dataSetElements: any[]

	private lowThreshold: number
	private mediumThreshold: number
	private matrixSize: number


	/**
	 * Empty constructor.
	 */
	constructor() {
		this._dataSetElements = []
		this._matrixProps = {
			data: [],
			context: this._context,
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
		console.warn("_init")
		context.mode.trackContainerResize(true)
		this._notifyOutputChanged = notifyOutputChanged

		this._containerElement = document.createElement("div")
		this._matrixElement = document.createElement("div")

		this._containerElement.appendChild(this._matrixElement)
		this._containerWidth = context.mode.allocatedWidth || 250
		container.appendChild(this._containerElement)
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context < IInputs > ): void {
		this._context = context
		console.warn("_updateView")
		console.log(context)
		this._containerHeight = context.mode.allocatedHeight
		this._containerWidth = context.mode.allocatedWidth
		console.log("__containerHeight")
		console.log(this._containerHeight)
		console.log("__containerWidth")
		console.log(this._containerWidth)

		if (!context.parameters.Risks.loading) {

			this.getRecords(context.parameters.Risks)
			this._matrixProps = {
				data: this.initRiskArray(this.matrixSize, this.matrixSize),
				context: this._context,
				xAxisTitle: "Likelihood",
				yAxisTitle: "Consequence"
			}

			ReactDOM.render(
				React.createElement(
					Matrix,
					this._matrixProps
				),
				this._matrixElement
			)
		}

	}

	private dataChanged(newDataset: []) {
		console.warn("_dataChanged")
		this._notifyOutputChanged()
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		console.warn("_getOutputs")
		return {}
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this._containerElement)
	}

	private getRecords(gridParam: DataSet): void {
		console.warn("_getRecords")
		this._dataSetElements = []
		for (let currentRecordId of gridParam.sortedRecordIds) {
			let probability = gridParam.records[currentRecordId].getFormattedValue("xAxisTitle")
			let impact = gridParam.records[currentRecordId].getFormattedValue("yAxisTitle")
			let name = gridParam.records[currentRecordId].getFormattedValue("riskName")
			this._dataSetElements.push({
				id: currentRecordId,
				name: name,
				impact: impact,
				probability: probability,
			})
		}

		this._matrixProps.data = this._dataSetElements


	}

	private countRisks(x: number, y: number) {
		let count = this._dataSetElements.filter((e) => {
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
				arr[i][j] = {
					colour: col,
					hoverColour: "black",
					count: this.countRisks(i + 1, j + 1),
					xVal: j + 1,
					yVal: i + 1
				}
			}
		}
		console.warn("_initRiskArray")
		console.warn(arr)
		return arr
	}

	private calcRiskCategoryColour(x: number, y: number, lowThreshold: number, mediumThreshold: number): string {
		let risk: number = Math.round(x * y)
		switch (true) {
			case risk > mediumThreshold:
				return "red"
			case risk > lowThreshold && risk <= mediumThreshold:
				return "orange"
			case risk <= lowThreshold:
				return "green"
			default:
				return "white"
		}
	}


}