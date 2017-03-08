export default {
  "width": 800,
  "height": 200,
  "padding": {"top": 10, "left": 30, "bottom": 30, "right": 10},
  "data": [{ "name": "table" }],
  "signals": [
    {
      "name": "hover", 
      "init": <any>null,
      "streams": [
        {"type": "@bar:mouseover", "expr": "datum"},
        {"type": "@bar:mouseout", "expr": "null"}
      ]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "range": "width",
      "domain": {"data": "table", "field": "time"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "domain": {"data": "table", "field": "value"},
      "nice": true
    }
  ],
  "axes": [
    {"type": "x", "scale": "x"},
    {"type": "y", "scale": "y"}
  ],
  "marks": [
    {
      "type": "rect",
      "name": "bar",
      "from": {"data": "table"},
      "properties": {
        "enter": {
          "x": {"scale": "x", "field": "time"},
          "width": {"scale": "x", "band": true, "offset": -15},
          "y": {"scale": "y", "field": "value"},
          "y2": {"scale": "y", "value": 0}
        },
        "update": {
          "fill": {"value": "steelblue"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    }
  ]
}