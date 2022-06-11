var mainOverlay = document.querySelector(".overlay");

// -----------------chart-----------------------

var root = am5.Root.new("chartdiv");

var colors = am5.ColorSet.new(root, {});

root.setThemes([
    am5themes_Animated.new(root)
]);



var chart = root.container.children.push(
    am5map.MapChart.new(root, {
        panX: "translateX",
        // projection: am5map.geoNaturalEarth1()
        projection: am5map.geoMercator()
    })
)
chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
chart.chartContainer.set("background", am5.Rectangle.new(root, {
    fill: am5.color(0x76b6c4),
    fillOpacity: 1
}));
// -------------------world-----------------------

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
    stroke: am5.color(0x1a6070),
    strokeWidth: 2,
    fillOpacity: 0.7,
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
    let dataItem = e.target.dataItem;
    let data = dataItem.dataContext;
    let zoomAnimation = worldSeries.zoomToDataItem(dataItem);

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
    stroke: am5.color(0x1a6070),
    strokeWidth: 2
});

countrySeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0xdaf15b),
    fillOpacity: 0.3
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
                    // fill: am5.color(0xf0faf8)
                    fillOpacity: 0.3
                }
            });
        }
    }
}

worldSeries.data.setAll(data);

// ------------------------ back to continents view button
var backContainer = chart.children.push(am5.Container.new(root, {
    x: am5.p100,
    centerX: am5.p100,
    dx: -10,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    y: 30,
    interactiveChildren: false,
    layout: root.horizontalLayout,
    cursorOverStyle: "pointer",
    visible: false
}));

// var backButton = backContainer.children.push(am5.Graphics.new(root, {
//     width: 32,
//     height: 32,
//     centerY: am5.p50,
//     fillGradient: am5.LinearGradient.new(root, {
//         stops: [{
//           color: am5.color(0x654ea3)
//         }, {
//           color: am5.color(0xeaafc8)
//         }],
//         rotation: 0
//     }),
//     stroke: am5.color(0xc6e4eb),
//     svgPath: "M44 40.8361C39.1069 34.8632 34.7617 31.4739 30.9644 30.6682C27.1671 29.8625 23.5517 29.7408 20.1182 30.303V41L4 23.5453L20.1182 7V17.167C26.4667 17.2172 31.8638 19.4948 36.3095 24C40.7553 28.5052 43.3187 34.1172 44 40.8361Z"
// }));
var backButton = backContainer.children.push(
    am5.Picture.new(root, {
        width: 50,
        height: 50,
        centerY: am5.p50,
        src: "world-map.png"
    })
)
backButton.set("tooltipText", "world view");

backContainer.events.on("click", function() {
    chart.goHome();
    worldSeries.show();
    countrySeries.hide();
    backContainer.hide();
});

// ----------------------journal--------------------------

var overlay = root.container.children.push(am5.Container.new(root, {
    background: am5.Rectangle.new(root, {
        fill: am5.color(0xffffff),
        fillOpacity: 0.3
    }),
    width: am5.p100,
    height: am5.p100,
    layer: 100,
    visible: false
}));
var journaldata = {
    subject: 'test',
    dateY: 2022,
    dateM: 6,
    dateD: 10,
    cntry: 'test',
    city: 'test',
    text: 'test'
};


var editor = overlay.children.push(am5.Container.new(root, {
    width: am5.p90,
    height: am5.p90,
    text: "hihihi",
    fill: am5.color(0xffff00),
    layout: root.gridLayout,
}))

function closeOverlay(e) {
    overlay.hide();
    mainOverlay.classList.add("hidden");
    journaldata = {
        subject: 'test',
        dateY: 2022,
        dateM: 6,
        dateD: 10,
        cntry: 'test',
        city: 'test',
        text: 'test'
    };
}

function addPin(id, name) {
    var pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
            polygonIdField: "Territory"
        })
    );
    pointSeries.data.setAll([{
        Territory: id,
        name: name
    }])

    pointSeries.bullets.push(function() {
        return am5.Bullet.new(root, {
            sprite: am5.Picture.new(root, {
                dx: -10,
                dy: -10,
                width: 20,
                height: 20,
                src: "pin.png"
            })
        })
    })
}

countrySeries.mapPolygons.template.events.on("click", (e) => {
    let dataItem = e.target.dataItem;
    let data = dataItem.dataContext;
    console.log(data);
    let countryName = data.CNTRY || data.CNTRYNAME;
    let cityName = data.name;

    // overlay - country, city
    let country = document.querySelector(".country");
    let city = document.querySelector(".city");
    country.textContent = countryName;
    city.textContent = cityName;
    journaldata.cntry = countryName;
    journaldata.city = cityName;
    overlay.show();
    mainOverlay.classList.remove("hidden");

    addPin(data.id, cityName);

    // button click event
    var submitBtn = document.querySelector(".submit");
    var cancelBtn = document.querySelector(".cancel");
    submitBtn.addEventListener("click", function() {
        let inputText = document.getElementById("journalMain").value;
        journaldata.text = inputText;
        console.log(journaldata);
    })
    cancelBtn.addEventListener("click", e => {closeOverlay(e)})
})

mainOverlay.addEventListener("click", e => {
    if (e.target.classList.contains("overlay")) closeOverlay(e);
});





