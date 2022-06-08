// // the central object of each chart
// // not new [ClassName], but new()(use class' static method in amChart 5)
// // parameter: an id of the div container we want to put our chart in
// var root = am5.Root.new("chartdiv");
// // new() method for all classes except root element will take root instance as the first parameter
// // object with key-value pairs
// var chart = root.container.children.push(
//     am5percent.PieChart.new(
//         root, {
//             valueField: "value",
//             categoryField: "category"
//         }
//     )
// );
// var series = chart.series.push(
//     am5percent.PieSeries.new(root, {})
// );
// series.data.setAll([{
//     category: "Research",
//     value: 30
//   }, {
//     category: "Marketing",
//     value: 40
//   }, {
//     category: "Sales",
//     value: 30
//   }]);


// class MyTheme extends am5.Theme {
// 	setupDefaultRules() {
//       this.rule("ColorSet").set("colors", [
//         am5.color(0x1e73be), /* 블루 */
//         am5.color(0xe05151), /* 레드 */
//         am5.color(0xa8a8a8) /* 그레이 */
//       ]);
//     }
// }
        
// let root = am5.Root.new("chartdiv");

// root.setThemes([
// 	am5themes_Animated.new(root), MyTheme.new(root)
// ]);

// let chart = root.container.children.push(
//     am5xy.XYChart.new(root, {
//         panY: false,
//         wheelY: "zoomX",
//         layout: root.verticalLayout
//     })
// );

// // Define data
// let data = [
//     {voteType: "찬성", count: 3},
//     {voteType: "반대", count: 7},
//     {voteType: "기권", count: 2}
// ];

// let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
//     maxDeviation: 1,
//     categoryField: "voteType",
//     renderer: am5xy.AxisRendererX.new(root, {
//     	/* 막대그래프의 폭 설정 */
//         cellStartLocation: 0.2, /* 왼쪽끝에서 0.2만큼 떨어져서 그림 */
//         cellEndLocation: 0.8 /* 오른쪽끝에서 0.8만큼 떨어져서 그림 */
//     }),
//     tooltip: am5.Tooltip.new(root, {})
// }));

// xAxis.data.setAll(data);

// let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
//     numberFormat: "#'표'",
//     maxPrecision: 0,
//     renderer: am5xy.AxisRendererY.new(root, {})
// }));

// let series = chart.series.push(
//     am5xy.ColumnSeries.new(root, {
//         name: "Series",
//         xAxis: xAxis,
//         yAxis: yAxis,
//         valueYField: "count",
//         categoryXField: "voteType",
//         tooltip: am5.Tooltip.new(root, {})
//     })
// );

// series.columns.template.setAll({
//     templateField: "settings",
//     tooltipText: "{categoryX}:{valueY}",
//     cornerRadiusTL: 5,
//     cornerRadiusTR: 5
// });

// series.columns.template.adapters.add("fill", (fill, target) => {
//     return chart.get("colors").getIndex(series.columns.indexOf(target));
// });

// series.columns.template.adapters.add("stroke", (stroke, target) => {
//     return chart.get("colors").getIndex(series.columns.indexOf(target));
// });

// series.data.setAll(data);

// series.appear();

// let legend = chart.children.push(am5.Legend.new(root, {
//     nameField: "categoryX",
//     centerX: am5.percent(50),
//     x: am5.percent(50)
// }));

// legend.data.setAll(series.dataItems);
// chart.appear(10, 1);


// -----------------chart-----------------------

var homeBtn = document.getElementById('homeBtn');
var root = am5.Root.new("chartdiv");

var chart = root.container.children.push(
    am5map.MapChart.new(root, {
        panX: "rotateX",
        projection: am5map.geoNaturalEarth1()
    })
)
homeBtn.addEventListener("click", () => chart.goHome());
chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
chart.chartContainer.set("background", am5.Rectangle.new(root, {
    fill: am5.color(0xdeeaf4),
    fillOpacity: 1
}));
// -------------------polygon-----------------------

var polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"],
      fill: am5.color(0xed963f),
    //   stroke: am5.color(0xffffff)
    })
  );
polygonSeries.mapPolygons.template.setAll({
    stroke: am5.color(0xe3e3e3),
    strokeWidth: 2,
    fillOpacity: 0.5
  });
polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    interactive: true
});

polygonSeries.mapPolygons.template.states.create("hover", {
fill: am5.color(0x034221)
});


