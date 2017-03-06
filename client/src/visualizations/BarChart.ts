
import * as VegaEmbedder from "vega-embed";


export default class BarChart {
    constructor() {

    }
    renderInto(elt:HTMLElement,data:Object) {
        VegaEmbedder.embed('#vis', {}, (error:any,result:any) => {
            console.log("RENDER COMPLETE");
        });
    }
}