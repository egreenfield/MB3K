import {DataQueryParameters, DataSet, 
	QueryDefinition, CompoundSeriesResult, 
	SeriesResult, DataQueryResult} from "./DataSet";
import {DataSource} from "./DataSource";
import {DataManager} from "./DataManager"; 

export interface FormulaInput {
	name:string,
	field:string,
	dataSet:DataSet,
	includeInOutput?:boolean;
};

export interface FormulaExpression {
	name:string,	
	expression:string
};

export interface FormulaParameters{
	inputs:FormulaInput[];
	indexField:string,
	formulas: FormulaExpression[];	
};

export class FormulaDataSet extends DataSet {		
	parameters:FormulaParameters;
	data:any;

	constructor(parameters:FormulaParameters) {
		super();
		this.parameters = parameters;
		for(let aParam of parameters.inputs) {
			aParam.dataSet.on("stateChange",() =>{
				this.update();
			})
		}
	}
	load() {
		this.parameters.inputs.forEach(input => {
			input.dataSet.load();
		})
	}

	update() {
		let loading = false;
		let loaded = true;
		this.parameters.inputs.forEach(input => {
			let inputState = input.dataSet.getState();
			loading = loading || inputState == "loading";
			loaded = loaded && inputState == "loaded";
		});
		if(loaded) {
			// compute expressions.
			let result:CompoundSeriesResult = {
				//TODO what should this ID be?
				id: "foo",
				series:[]				
			};
			let outputDataLength = 0;
			let mergedOutputData = [] as any[];
			for(let anInput of this.parameters.inputs) {
				let inputData = anInput.dataSet.getData();
				outputDataLength = Math.max(inputData.values.length,outputDataLength);
				for(let i=0;i<outputDataLength;i++) {
					let mergedSample = mergedOutputData[i];
					let inputValue = inputData.values[i];
					if(mergedSample == null) {
						mergedOutputData[i] = mergedSample = {};
						mergedSample[this.parameters.indexField] = inputValue[this.parameters.indexField];
					}
					mergedSample[anInput.name] = inputValue[anInput.field];
				}
				result.series.push(inputData);
			}
			for(let aFormula of this.parameters.formulas) {
				let evaluator:Function = eval("(inputs) => { with(inputs) { return " + aFormula.expression + "} }");
				for(let i=0;i<outputDataLength;i++) {
					let mergedSample = mergedOutputData[i];
					mergedSample[aFormula.name] = evaluator(mergedSample);
				}
				result.series.push( {
					name: aFormula.name,
					values: mergedOutputData	
				});
			}

			this.data = result;
			this.setState("loaded");			
		}
		else if (loading) {
			this.setState("loading");			
		} else {
			this.setState("unloaded");
		}
	}
	getData():SeriesResult {
		return this.data;
	}
}
