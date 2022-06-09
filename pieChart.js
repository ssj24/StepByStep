var pieRoot = am5.Root.new("chartdiv2");
var pieChart = pieRoot.container.children.push(
    am5percent.PieChart.new(
        pieRoot, {}
    )
);
var series = pieChart.series.push(
    am5percent.PieSeries.new(pieRoot, {
        valueField: "value",
        categoryField: "category"
    })
);
series.data.setAll([{
    category: "Research",
    value: 1000
  }, {
    category: "Marketing",
    value: 1200
  }, {
    category: "Sales",
    value: 30
  }]);