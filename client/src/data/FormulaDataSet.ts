import {DataQueryParameters, DataSet, 
	QueryDefinition, MultiSeriesResult, 
	SeriesResult, DataQueryResult} from "./DataSet";
import {DataSource} from "./DataSource";
import {DataManager} from "./DataManager"; 

export interface FormulaInput {
	name:string,
	valueField:string,
	dataSet:DataSet,
	includeInOutput?:boolean;
	color: string;
};

export interface FormulaExpression {
	name:string,	
	valueField:string,
	expression:string,
	color: string
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
			let result:MultiSeriesResult = {
				//TODO what should this ID be?
				id: "foo",
				series:[]				
			};
			let outputDataLength = 0;
			let mergedOutputData:any[] = [];
			let mergedInputData:any[];
			let mergedProps:string[] = [];
			let indexField = this.parameters.indexField;

			let hasFormulas = this.parameters.formulas && (this.parameters.formulas.length > 0);
			for(let anInput of this.parameters.inputs) {
				
				let inputData = anInput.dataSet.getData();
				let inputValues:any[] = inputData.values;

				if(hasFormulas)
				{

					let mergedIndex = 0,inputIndex = 0;
					mergedInputData = mergedOutputData;
					mergedOutputData = [];
					
					// if(true) // MONKEY CHAOS TIME!
					// {
					// 	inputValues = inputValues.concat();
					// 	let randomIndex = Math.floor(Math.random()*inputValues.length);
					// 	inputValues.splice(randomIndex,1);
					// 	let randomCount = Math.floor(Math.random()*Math.min(inputValues.length,4));
					// 	inputValues.splice(inputValues.length - randomCount,randomCount);
					// 	randomCount = Math.floor(Math.random()*Math.min(inputValues.length/2,5));
					// 	inputValues.splice(0,randomCount);
					// 	//console.log("input",anInput.name,"now has",JSON.stringify(inputValues.map(v => v.startTimeInMillis)));
					// 	inputData.values = inputValues;
					// }
	//				console.log("comparing",inputValues.length,mergedInputData.length);
					let inputLen = inputValues.length;
					let mergedLen = mergedInputData.length;
					while(inputValues[inputIndex] || mergedInputData[mergedIndex]) {					
						let inputSample = inputValues[inputIndex];
						let mergedSample = mergedInputData[mergedIndex];
						let result:any;
						
						if(inputSample === undefined) {
							//console.log("not enough inputs from",anInput.name)
							result = mergedSample;
							if(inputLen)
								result[anInput.name] = inputValues[inputLen-1][anInput.name];
							else
								result[anInput.name] = 0;
							mergedIndex++;
						} else if (mergedSample == undefined) {
							//console.log("too many inputs from",anInput.name)
							if(mergedLen) 
								result = (Object as any).assign({},mergedInputData[mergedLen-1]);
							else
								result = {};
							result[anInput.name] = inputSample[anInput.valueField];
							result[indexField] = inputSample[indexField];
							inputIndex++;						
						} else {
	//						console.log("i:",inputIndex,mergedIndex," : ",inputSample[indexField] - mergedSample[indexField]);
							// we have two, let's compare.
							if(inputSample[indexField] == mergedSample[indexField]) {
								//same time, easy.
								mergedSample[anInput.name] = inputSample[anInput.valueField];
								result = mergedSample;
								inputIndex++;
								mergedIndex++;
							} else if (mergedSample[indexField] < inputSample[indexField]) {
								mergedSample[anInput.name] = this.interpolate(inputSample,inputValues[inputIndex-1],anInput.valueField,indexField,mergedSample[indexField]);							
								result = mergedSample;
								mergedIndex++;
							} else { // inputSample must be newer
								result = {};
								result[anInput.name] = inputSample[anInput.valueField];
								result[indexField] = inputSample[indexField];
								mergedProps.forEach(aProp => {
									result[aProp] = this.interpolate(mergedSample,mergedInputData[mergedIndex-1],aProp,indexField,inputSample[indexField]);							
								});
								inputIndex++;							
							}
						}
						mergedOutputData.push(result);
					}
				mergedProps.push(anInput.name);
			}
			
				inputData.color = anInput.color;
				result.series.push(inputData);
			}

			for(let aFormula of this.parameters.formulas) {
				let values = (window as any).evaluator(aFormula.expression,mergedOutputData,aFormula.valueField,this.parameters.indexField);
				result.series.push( {
					id: aFormula.name,
					name: aFormula.name,
					values: values,
					color: aFormula.color,
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

	interpolate(endSample:any,startSample:any,valueField:string,indexField:string,indexTime:number):number {
		if(startSample === undefined) 
			return 0;
		let startTime = startSample[indexField];
		let endTime = endSample[indexField];
		let t = (indexTime-startTime)/(endTime-startTime);
		return startSample[valueField] + (endSample[valueField] - startSample[valueField]) * t;
	}

	getData():MultiSeriesResult {
		return this.data;
	}
}
