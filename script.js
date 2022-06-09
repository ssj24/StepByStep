// -----------------chart-----------------------

var root = am5.Root.new("chartdiv");

var colors = am5.ColorSet.new(root, {});

root.setThemes([
    am5themes_Animated.new(root)
]);



var chart = root.container.children.push(
    am5map.MapChart.new(root, {
        panX: "rotateX",
        // projection: am5map.geoNaturalEarth1()
        projection: am5map.geoMercator()
    })
)
chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
chart.chartContainer.set("background", am5.Rectangle.new(root, {
    fill: am5.color(0xdeeaf4),
    fillOpacity: 1
}));
// -------------------polygon-----------------------

var worldSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"],
    //   fill: am5.color(0xed963f),
    //   stroke: am5.color(0xffffff)
    })
  );
worldSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    interactive: true,
    stroke: am5.color(0xe3e3e3),
    strokeWidth: 2,
    fillOpacity: 0.5,
    templateField: "polygonSettings"
  });


worldSeries.mapPolygons.template.states.create("hover", {
// fill: am5.color(0x034221)
fill: colors.getIndex(9)
});

//----------------------country----------------------

var continents = {
    "AF": 0,
    "AN": 1,
    "AS": 2,
    "EU": 3,
    "NA": 4,
    "OC": 5,
    "SA": 6
}

worldSeries.mapPolygons.template.events.on("click", (e) => {
    var dataItem = e.target.dataItem;
    var data = dataItem.dataContext;
    var zoomAnimation = worldSeries.zoomToDataItem(dataItem);

    Promise.all([
        zoomAnimation.waitForStop(),
        am5.net.load("https://cdn.amcharts.com/lib/5/geodata/json/"+ data.map + ".json", chart)
    ]).then((results) => {
        var geodata = am5.JSONParser.parse(results[1].response);
        countrySeries.setAll({
            geoJSON: geodata,
            fill: data.polygonSettings.fill
        });
        countrySeries.show()
        worldSeries.hide(100);
        backContainer.show();
    });
});

var countrySeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
    visible: false
}));

countrySeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    interactive: true,
    fill: am5.color(0xaaaaaa)
});

countrySeries.mapPolygons.template.states.create("hover", {
    fill: colors.getIndex(9)
});

var data = [];
for (var id in am5geodata_data_countries2) {
    if (am5geodata_data_countries2.hasOwnProperty(id)) {
        var country = am5geodata_data_countries2[id];
        if (country.maps.length) {
            data.push({
                id: id,
                map: country.maps[0],
                polygonSettings: {
                    fill: colors.getIndex(continents[country.continent_code]),
                }
            });
        }
    }
}

worldSeries.data.setAll(data);

// back to continents view button
var backContainer = chart.children.push(am5.Container.new(root, {
    x: am5.p100,
    centerX: am5.p100,
    dx: -10,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    y: 30,
    interactiveChildren: false,
    layout: root.horizontalLayout,
    cursorOverStyle: "pointer",
    background: am5.RoundedRectangle.new(root, {
        fill: am5.color(0xffffff),
        fillOpacity: 0.2
    }),
    visible: false
}));

// var backLabel = backContainer.children.push(am5.Label.new(root, {
//     text: "world map",
//     centerY: am5.p50
// }));

var backButton = backContainer.children.push(am5.Graphics.new(root, {
    width: 32,
    height: 32,
    centerY: am5.p50,
    fillGradient: am5.LinearGradient.new(root, {
        stops: [{
          color: am5.color(0x654ea3)
        }, {
          color: am5.color(0xeaafc8)
        }],
        rotation: 0
    }),
    svgPath: "M44 40.8361C39.1069 34.8632 34.7617 31.4739 30.9644 30.6682C27.1671 29.8625 23.5517 29.7408 20.1182 30.303V41L4 23.5453L20.1182 7V17.167C26.4667 17.2172 31.8638 19.4948 36.3095 24C40.7553 28.5052 43.3187 34.1172 44 40.8361Z"
}));

backContainer.events.on("click", function() {
    chart.goHome();
    worldSeries.show();
    countrySeries.hide();
    backContainer.hide();
});