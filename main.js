const fetchAllJSON = async () => {
  const data1_1 = await fetch('plot1_data1.json').then(response => response.json());
  const data1_2 = await fetch('plot1_data2.json').then(response => response.json());
  const data2 = await fetch('plot2_data.json').then(response => response.json());
  const data3_1 = await fetch('plot3_data1.json').then(response => response.json());
  const data3_2 = await fetch('plot3_data2.json').then(response => response.json());
  const data4_1 = await fetch('plot4_data1.json').then(response => response.json());
  const data4_2 = await fetch('plot4_data2.json').then(response => response.json());

  const spec1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    vconcat: [
      {
        selection: {
          click: {type: "single", fields: ["day name"]}
        },
        data: {
          values: data1_1
        },
        mark: "bar",
        encoding: {
          x: {
            field: "day name",
            type: "nominal",
            sort: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            axis: {labelFontSize: 12, titleFontSize: 14}
          },
          y: {
            field: "VIOLATIONS",
            title: "Sum of Violations",
            type: "quantitative",
            aggregate: "sum",
            axis: {labelFontSize: 12, titleFontSize: 14}
          },
          color: {condition: {selection: "click", value: "lightblue"}, value: "gray"}
        },
        title: {text: "Violations Across Days of the Week", fontSize: 14},
        width: 100,
        height: 100
      },
      {
        transform: [
          {filter: {selection: "click"}},
          {
            aggregate: [{op: "sum", field: "VIOLATIONS", as: "sum_VIOLATIONS"}],
            groupby: ["community"]
          },
          {window: [{op: "rank", as: "rank"}], sort: [{ field: "sum_VIOLATIONS", order: "descending" }]}, {filter: "datum.rank <= 20"}
        ],
        mark: "bar",
        data: {
          values: data1_2
        },
        encoding: {
          x: {field: "community", title: "Community", sort: "-y", type: "nominal", axis: {labelFontSize: 12, titleFontSize: 14}},
          y: {field: "sum_VIOLATIONS", title: "Sum of Violations", type: "quantitative", axis: {labelFontSize: 12, titleFontSize: 14}},
          tooltip: {field: "sum_VIOLATIONS"},
          color: {value: "darkblue"}
        },
        title: {text: "Violations in Each Chicago Neighborhood (Top 20)", fontSize: 14},
        width: 100,
        height: 100
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
                  condition: {selection: "boxSelection", value: "blue"},
                  value: "gray"
              },
          },
          title: {text: "Speed Cameras in Chicago", fontSize: 14},
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
              x: {field: "community", title: "Community", type: "nominal", sort: "-y", axis: {labelFontSize: 12, titleFontSize: 14}},
              y: {field: "sum_VIOLATIONS", title: "Sum of violations", type: "quantitative", aggregate: "sum",axis: {labelFontSize: 12, titleFontSize: 14}},
              tooltip: {field: "sum_VIOLATIONS", aggregate: "sum"}
          },
          title: {text: "Speed Violations in Each Community (Top 20 Shown)", fontSize: 14},
      }
    ]
  };
  vegaEmbed("#vis2", spec2);


  var spec3 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    vconcat: [
      {
        selection: {
          locationFilter: {type: "single", fields: ["location"]},
          click: {type: "single", fields: ["community"]}
        },
        transform: [{filter: {selection: "locationFilter"}}],
        data: {values: data3_1},
        mark: "bar",
        encoding: {
          x: {field: "community", title: "Community", type: "nominal", sort: "-y", axis: {labelFontSize: 12, titleFontSize: 14}},
          y: {field: "VIOLATIONS", title: "Sum of Violations", type: "quantitative", aggregate: "sum", axis: {labelFontSize: 12, titleFontSize: 14}},
          color: {field: "location", title: "Zone Type", scale:{domain: ["school", "park"], range: ["orange", "blue"]}},
          legend: {title: "Legend", labelOrient: "right"},
          tooltip: {field: "VIOLATIONS", aggregate: "sum"},
        },
        title: {text: "Speed Violations by Neighborhood", fontSize: 14},
        width: 300
      },
      {
        transform: [{filter: {selection: "click"}}],
        mark: "line",
        data: {values: data3_2},
        encoding: {
            x: {field: "Year", title: "Year", type: "temporal", axis: {labelFontSize: 12, titleFontSize: 14}},
            y: {field: "VIOLATIONS", title: "Sum of Violations", type: "quantitative", aggregate: "sum", axis: {labelFontSize: 12, titleFontSize: 14}},
            color: {field: "location", title: "Zone Type"},
            tooltip: {field: "VIOLATIONS", aggregate: "sum"}
        },
        title: {text: "Speed Violations over the Years", fontSize: 14},
        width: 300
      }
    ]
  };
  vegaEmbed("#vis3", spec3);


  const spec4 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "HELLO",
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
        },
        title:{"text": "# Violations and Cameras in Neighborhoods", fontSize: 14},
      },
      {
        transform: [{filter: {selection: "click"}}, {window: [{op: "rank",as: "rank"}], sort: [{ field: "VIOLATIONS", order: "descending" }]}, {filter: "datum.rank <= 20"}],
        data: {values: data4_2},
        mark: "point",
        encoding: {
            x: {field: "CAMERA ID", title: "Camera ID", type: "nominal", axis: {labelFontSize: 12, titleFontSize: 14}},
            y: {field: "VIOLATIONS", title: "Sum of Violations", type: "quantitative", axis: {labelFontSize: 12,titleFontSize: 14}},
            size: {field: "VIOLATIONS", type: "quantitative"},
            "tooltip": [{field: "VIOLATIONS", title: "Violations"}, {field: "community", title: "Community"}]
        },
        title: {"text": "Top Speed Violation Cameras (Up to 20 Cameras)", fontSize: 14},
      }
    ],
  };
  vegaEmbed("#vis4", spec4);

}
fetchAllJSON();