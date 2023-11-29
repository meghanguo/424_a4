const fetchAllJSON = async () => {
  const data1_1 = await fetch('plot1_data1.json').then(response => response.json());
  const data1_2 = await fetch('plot1_data2.json').then(response => response.json());
  const data2 = await fetch('plot2_data.json').then(response => response.json());
  const data3_1 = await fetch('plot3_data1.json').then(response => response.json());
  const data3_2 = await fetch('plot3_data2.json').then(response => response.json());
  const data4_1 = await fetch('plot4_data1.json').then(response => response.json());
  const data4_2 = await fetch('plot4_data2.json').then(response => response.json());
  const data5 = await fetch('plot5_data.json').then(response => response.json());
  const data6 = await fetch('plot6_data.json').then(response => response.json());
  const data7 = await fetch('plot7_data.json').then(response => response.json());
  const data8  = await fetch('plot8_data.json').then(response => response.json());
  const geojson = await fetch('Boundaries - Neighborhoods.geojson').then(response => response.json());;

  const spec1 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    vconcat: [
      {
        selection: {
          click: {type: "single", fields: ["day name"]}
        },
        data: {
          values: data1_1
        },
        mark: "arc",
        encoding: {
          theta: {field: "VIOLATIONS", aggregate: "sum", type: "quantitative"},
          color: {field: "day name", sort: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], type: "nominal", stack: true}
        },
        title: {text: "Violations Across Days of the Week", fontSize: 14},
        width: 400
      },
      {
        transform: [
          {filter: {selection: "click"}},
          {aggregate: [{op: "sum", field: "VIOLATIONS", as: "sum_VIOLATIONS"}], groupby: ["community"]},
          {window: [{op: "rank", as: "rank"}], sort: [{field: "sum_VIOLATIONS", order: "descending"}]},
          {filter: "datum.rank <= 20"}
        ],
        mark: "bar",
        data: {
          values: data1_2
        },
        encoding: {
          x: {field: "community", title: "Community", sort: "-y", type: "nominal", axis: {labelFontSize: 12, titleFontSize: 14}},
          y: {field: "sum_VIOLATIONS", title: "Sum of Violations", type: "quantitative", axis: {labelFontSize: 12, titleFontSize: 14}},
          tooltip: {field: "sum_VIOLATIONS"},
          // color: {condition: {selection: "click", field: "day name", value: "gray"}}
        },
        title: {text: "Violations in Each Chicago Neighborhood (Top 20)", fontSize: 14},
        width: 400
      }
    ]
  };
  
  vegaEmbed("#vis1", spec1);

  const spec2 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: {values: data2},
    vconcat: [
      {
          mark: "circle",
          encoding: {
              x: {field: "LONGITUDE", type: "quantitative", scale: {domain: [-87.9, -87.5]}},
              y: {field: "LATITUDE", type: "quantitative",  scale: {domain: [41.6, 42.1]}},
              tooltip: {field: "community", type: "nominal"},
              color: {
                  condition: {selection: "boxSelection", value: "#43657B"},
                  value: "gray"
              },
          },
          title: {text: "Speed Cameras in Chicago", fontSize: 14},
          width: 300,
          height: 300,
          selection: {
              boxSelection: {
                  type: "interval",
                  encodings: ["x", "y"]
              }
          }
      }, {
          transform: [
              {filter: {selection: "boxSelection"}},
              {
                  aggregate: [{op: "sum", field: "VIOLATIONS", as: "sum_VIOLATIONS"}],
                  groupby: ["community"]
              },
              {window: [{op: "rank",as: "rank"}],sort: [{ field: "sum_VIOLATIONS", order: "descending" }]}, {filter: "datum.rank <= 20"},
          ],
          mark: "bar",
          encoding: {
              x: {field: "community", title: "Community", type: "nominal", sort: "-y", axis: {labelFontSize: 12, titleFontSize: 14, labelAngle: 315}},
              y: {field: "sum_VIOLATIONS", title: "Sum of violations", type: "quantitative", aggregate: "sum", axis: {labelFontSize: 12, titleFontSize: 14}},
              tooltip: {field: "sum_VIOLATIONS", aggregate: "sum"},
              color: {value: "#83C0E8"}
          },
          title: {text: "Speed Violations in Each Community (Top 20 Shown)", fontSize: 14},
          height: 300
      }
    ]
  };
  vegaEmbed("#vis2", spec2);


  const spec3 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    vconcat: [
      {
        selection: {
          locationFilter: {type: "single", fields: ["location"]},
          click: {type: "single", fields: ["community"]}
        },
        transform: [{filter: {selection: "locationFilter"}}],
        data: {values: data3_1},
        mark: {type: "bar", width: {band: 0.7}},
        encoding: {
          x: {field: "community", title: "Community", type: "nominal", sort: "-y", axis: {labelFontSize: 12, titleFontSize: 14}},
          y: {field: "VIOLATIONS", title: "Sum of Violations", type: "quantitative", aggregate: "sum", axis: {labelFontSize: 12, titleFontSize: 14}},
          color: {field: "location", title: "Zone Type", scale:{domain: ["school", "park"], range: ["#83C0E8", "#43657B"]}},
          legend: {title: "Legend", labelOrient: "right"},
          tooltip: {field: "VIOLATIONS", aggregate: "sum"},
        },
        title: {text: "Speed Violations by Neighborhood", fontSize: 14},
        width: 900
      },
      {
        transform: [{filter: {selection: "click"}}],
        mark: "line",
        data: {values: data3_2},
        encoding: {
            x: {field: "Year", title: "Year", type: "temporal", axis: {labelFontSize: 12, titleFontSize: 14}},
            y: {field: "VIOLATIONS", title: "Sum of Violations", type: "quantitative", aggregate: "sum", axis: {labelFontSize: 12, titleFontSize: 14}},
            color: {field: "location", title: "Zone Type", scale: {range: ["#83C0E8", "#43657B"]}},
            tooltip: {field: "VIOLATIONS", aggregate: "sum"}
        },
        title: {text: "Speed Violations over the Years", fontSize: 14},
        width: 900
      }
    ]
  };
  vegaEmbed("#vis3", spec3);


  const spec4 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    vconcat: [
      {
        selection: {
            click: {type: "single", fields: ["community"]}
        },
        data: {values: data4_1},
        mark: "point",
        encoding: {
            x: {field: "CAMERA ID", title: "Number of Cameras", type: "quantitative", axis: {labelFontSize: 12, titleFontSize: 14}},
            y: {field: "VIOLATIONS", title: "Sum of Violations", type: "quantitative", axis: {labelFontSize: 12, titleFontSize: 14}},
            size: {field: "VIOLATIONS", type: "quantitative"},
            tooltip:[{field: "VIOLATIONS", title: "Violations"}, {field: "community", title: "Community"}],
            color: {value: "#43657B"}
        },
        title:{"text": "# Violations and Cameras in Neighborhoods", fontSize: 14},
        height: 300,
        width: 300
      },
      {
        transform: [{filter: {selection: "click"}}, {window: [{op: "rank",as: "rank"}], sort: [{ field: "VIOLATIONS", order: "descending" }]}, {filter: "datum.rank <= 20"}],
        data: {values: data4_2},
        mark: "point",
        encoding: {
            x: {field: "CAMERA ID", title: "Camera ID", type: "nominal", axis: {labelFontSize: 12, titleFontSize: 14, labelAngle: 315}},
            y: {field: "VIOLATIONS", title: "Sum of Violations", type: "quantitative", axis: {labelFontSize: 12,titleFontSize: 14}},
            size: {field: "VIOLATIONS", type: "quantitative"},
            tooltip: [{field: "VIOLATIONS", title: "Violations"}, {field: "community", title: "Community"}],
            color: {value: "#43657B"}
        },
        title: {"text": "Top Speed Violation Cameras (Up to 20 Cameras)", fontSize: 14},
        height: 300
      }
    ],
  };
  vegaEmbed("#vis4", spec4);

  const spec6 = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.15.1.json',
    data: {values: data8},
    vconcat: [
        {
            width: 1000,
            mark: "area",
            encoding: {
                x: {
                    field: "MONTHYEAR",
                    type: "temporal",
                    scale: {domain: {selection: "brush", encoding: "x"}},
                    title: "TIME",
                    axis: {labelFontSize: 14, titleFontSize: 15}
                },
                y: {
                    field: 'VIOLATIONS',
                    type: 'quantitative',
                    axis: {labelFontSize: 14, titleFontSize: 15},
                    scale: {domain: {selection: "brush", encoding: "y"}},
                },  
                color: {value: "#83C0E8"},
                tooltip:[{field: "MONTHYEAR", type: "temporal", title: "Time"}, {field: "VIOLATIONS", title: "Violations"}],
            },
            title: {text: "Speed Camera Violations Over the Years", fontSize: 15},
        },
        {
            width: 1000,
            height: 50,
            mark: "area",
            selection: {brush: {type: "interval", encodings: ["x", "y"]}},
            encoding: {
                x: {field: "MONTHYEAR", 
                      type: "temporal",
                      title: "Time Strip",
                      axis: {grid: false, labelFontSize: 14, titleFontSize: 15}
                },
                y: {
                    field: "VIOLATIONS",
                    type: "quantitative",
                    title: "",
                    axis: {ticks: false, labels: false, grid: false}
                },
                color: {value: "#83C0E8"}
            }
        }
    ],
  }
  vegaEmbed("#vis6", spec6);


  // const updateElement = document.getElementById('updateTarget');
  
  const spec5 = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.15.1.json',
    config: {view: {continuousWidth: 300, continuousHeight: 300}},
    data: {values: [{total: "total", VIOLATIONS: 13744941}]}, 
    mark: {type: 'bar'},
    encoding: {x: {field: 'total', title: null, type: 'nominal', sort: '-y', axis:{labelFontSize: 14, titleFontSize: 18, labelAngle: 360}},
                 y: {field: 'VIOLATIONS', title: '# of Speed Violations', type: 'quantitative', axis:{labelFontSize: 14, titleFontSize: 18}},
                 color: {field: "total", legend: null, scale: {range: ["#83C0E8"]}},
                 tooltip: {field: 'VIOLATIONS', type: 'quantitative', title: "Total Violations"}
                },
    height: 300,
    width: 1000,
    title: {text: 'Total # of Speed Violations of all time', fontSize: 16},
  }
  vegaEmbed("#vis5", spec5);

  const updateSelectedOption = () => {
    const selectedOptionValue = document.getElementById('attributes').value;
    const selectedOption = {
      value: selectedOptionValue,
      text: document.getElementById('attributes').options[document.getElementById('attributes').selectedIndex].text
    };
    // updateElement.textContent = `Selected Option: ${selectedOption.text}`;

    if (selectedOption.text == "Community") {
      const spec5 = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.15.1.json',
        config: {view: {continuousWidth: 300, continuousHeight: 300}},
        data: {values: data5}, 
        mark: {type: 'bar'},
        encoding: {x: {field: 'COMMUNITY', title: 'Communities', type: 'nominal', sort: '-y', axis:{labelFontSize: 14, titleFontSize: 18, labelAngle: 315}}, 
                   y: {field: 'VIOLATIONS', title: 'Total # of Speed Violations', type: 'quantitative', axis:{labelFontSize: 14, titleFontSize: 18}},
                   color: {field: "COMMUNITY", legend: null, scale: {range: ["#83C0E8"]}},
                   tooltip: [{field: 'COMMUNITY', title: 'Community'}, {field: 'VIOLATIONS', type: 'quantitative'}],},
        height: 300,
        width: 1000,
        title: {text: 'Communities Ranked by # of Speed Violations', fontSize: 16},
        filter: "datum.rank <= 15"
      }
      vegaEmbed("#vis5", spec5);
    } else if (selectedOption.text == "Camera ID") {
      const spec5 = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.15.1.json',
        config: {view: {continuousWidth: 300, continuousHeight: 300}},
        data: {values: data6}, 
        mark: {type: 'bar'},
        encoding: {x: {field: 'CAMERA ID', title: 'Camera IDs', type: 'nominal', sort: '-y', axis:{labelFontSize: 14, titleFontSize: 18, labelAngle: 315}}, 
                   y: {field: 'VIOLATIONS', title: 'Total # of Speed Violations', type: 'quantitative', axis:{labelFontSize: 14, titleFontSize: 18}},
                   color: {field: "CAMERA ID", legend: null, scale: {range: ["#83C0E8"]}},
                   tooltip: [{field: 'CAMERA ID', title: 'Camera ID'}, {field: 'VIOLATIONS', type: 'quantitative'}]
                  },
        height: 300,
        width: 1000,
        title: {text: 'Top 50 Camera IDs w/ Highest # of Speed Violations', fontSize: 16},
      }
      vegaEmbed("#vis5", spec5);
    } else if (selectedOption.text == "Violation Day Name") {
      const spec5 = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.15.1.json',
        config: {view: {continuousWidth: 300, continuousHeight: 300}},
        data: {values: data7}, 
        mark: {type: 'bar'},
        encoding: {x: {field: 'DAY NAME', title: 'Days of the Week',  sort: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], type: 'nominal', axis:{labelFontSize: 14, titleFontSize: 18, labelAngle: 360}}, 
                   y: {field: 'VIOLATIONS', title: 'Total # of Speed Violations', type: 'quantitative', axis:{labelFontSize: 14, titleFontSize: 18}},
                   color: {
                    field: "DAY NAME",
                    type: "nominal",
                    scale: {
                      type: "nominal",
                      domain: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                      range: ["#FBA09D", "#FBC99D", "#FBDF9D", "#C8DDBB", "#B6E2DD", "#83C0E8", "#C4A0CE"]
                    }
                    },
                    tooltip: [{field: 'DAY NAME', title: 'Day Name'}, {field: 'VIOLATIONS', type: 'quantitative'}],
                  },
        height: 300,
        width: 1000,
        title: {text: 'Days of the Week w/ the Highest # of Speed Violations', fontSize: 16},
      }
      vegaEmbed("#vis5", spec5);
    } else {
      const spec5 = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.15.1.json',
        config: {view: {continuousWidth: 300, continuousHeight: 300}},
        data: {values: [{total: "total", VIOLATIONS: 13744941}]}, 
        mark: {type: 'bar'},
        encoding: {x: {field: 'total', title: null, type: 'nominal', sort: '-y', axis:{labelFontSize: 14, titleFontSize: 18, labelAngle: 360}},
                     y: {field: 'VIOLATIONS', title: '# of Speed Violations', type: 'quantitative', axis:{labelFontSize: 14, titleFontSize: 18}},
                     color: {field: "total", legend: null, scale: {range: ["#83C0E8"]}},
                     tooltip: {field: 'VIOLATIONS', type: 'quantitative', title: "Total Violations"}
                    },
        height: 300,
        width: 1000,
        title: {text: 'Total # of Speed Violations of all time', fontSize: 16},
      }
      vegaEmbed("#vis5", spec5);
    }
  };
document.getElementById('attributes').addEventListener('change', updateSelectedOption);

const spec7 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 700,
  "height": 500,
  "data": {"values": geojson, "format": {"property": "features"}},
  "projection": {"type": "mercator"},
  "mark": {"type":"geoshape", "stroke": "#757575", "strokeWidth": 0.5}, 
  "transform": [
      {
          "lookup": "properties.sec_neigh",
          "from": {
              "data": {"url": "violations_neigh.json"},
              "key": "sec_neigh",
              "fields": ["sec_neigh", "Violations"],
          }
      }
  ],
  "encoding": {
      "color": {
          "field": "Violations",
          "type": "quantitative",
          "scale": {"scheme": "Oranges"},
          "legend": {"title": "# violations"}
      },
      "tooltip": [
          {"field": "properties.sec_neigh", "type": "nominal", "title": "Neighborhood"},
          {"field": "Violations", "type": "quantitative", "title": "# Violations"}
      ]
  },
  title: {text: 'Violations by Neighborhood', fontSize: 16},
};

vegaEmbed("#vis7", spec7);

}
fetchAllJSON();
