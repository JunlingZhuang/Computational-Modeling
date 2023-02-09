mapboxgl.accessToken =
  "pk.eyJ1IjoianVubGluZ3podWFuZzA2MTIiLCJhIjoiY2w2ZWM0bWJ2MDB6aTNubXhsdG8zZTJ3dSJ9.Eeqn1X7BTGldAw2_yNGbsw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/junlingzhuang0612/cl6faj43y001315qk9lz1aa65",
  zoom: 12,
  center: [-74, 40.725],
});

map.on("load", function () {
  //    let mapLayers = map.getStyle().layers;
  //     for (let i = 0; i < mapLayers.length; i++) {
  //         console.log(mapLayers[i].id);

  //     }

  map.addLayer(
    {
      id: "citibikeData",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/citiGeo.geojson",
      },
      paint: {
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "difference"],
          0,
          "#ff4400",
          50,
          "#ffba31",
          100,
          "#ffffff",
        ],
        "circle-stroke-color": "#4d4d4d",
        "circle-stroke-width": 0.5,
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10.5,
          ["interpolate", ["linear"], ["get", "difference"], 0, 1, 100, 4],
          15,
          ["interpolate", ["linear"], ["get", "difference"], 0, 4, 100, 50],
        ],
      },
    },
    "road-label-simple"
  );
  map.addLayer(
    {
      id: "mhhi",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/medianIncome.geojson",
      },
      paint: {
        "fill-color": [
          "step",
          ["get", "MHHI"],
          "#ffffff",
          20000,
          "#ccedf5",
          50000,
          "#99daea",
          75000,
          "#66c7e0",
          100000,
          "#33b5d5",
          150000,
          "#00a2ca",
        ],
        "fill-opacity": ["case", ["==", ["get", "MHHI"], null], 0, 0.65],
      },
    },
    "citibikeData"
  );
});

map.on("click", "citibikeData", function (e) {
  let stationID = e.features[0].properties["start station id"];
  let countweek1 = e.features[0].properties["countWeek1"];
  let countweek4 = e.features[0].properties["countWeek4"];
  let difference = e.features[0].properties["difference"];

  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      "Station No. " +
        stationID +
        "<hr><br>1st week of March 2020: " +
        countweek1 +
        "<br>4th week of March 2020: " +
        countweek4 +
        "<br>Change: " +
        difference +
        "%"
    )
    .addTo(map);
});

map.on("mouseenter", "citibikeData", function () {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "citibikeData", function () {
  map.getCanvas().style.cursor = "";
});
