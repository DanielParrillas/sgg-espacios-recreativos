//  MODO DESARROLLO
const SERVER = "";
// MODO PRODUCCION
// const SERVER = "";
const mapElement = document.getElementById("map");
const btnMapBase = document.getElementById("btn-base-map");
const btnOSM = document.getElementById("btn-osm");
const checkDepartamentos = document.getElementById("departamentos-check");
const checkMunicipios = document.getElementById("municipios-check");

btnMapBase.addEventListener("click", cambiarMapaBase);
btnOSM.addEventListener("click", setOpenStretMap);

const MAPABASES = {
  default: {
    url: SERVER + "/sgg-espacios-recreativos/assets/map/es2.tif",
    bgColor: "#ced3af",
    title: "Default",
  },
  satelite: {
    url: SERVER + "/sgg-espacios-recreativos/assets/map/es-satelital2.tif",
    bgColor: "#746848",
    title: "Satelite",
  },
};

// initalize leaflet map
var map = L.map("map").setView([-88.806307271, 13.786436881], 5);
let baseLayer;
let departamentosLayer;
let municipiosLayer;

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML =
    "<h4>Simbología</h4>" +
    (props
      ? "<b>" +
        props.name +
        "</b><br />" +
        props.density +
        " people / mi<sup>2</sup>"
      : `
      <div class="simbologia recreativo"><div></div><p>Espacio recreativo</p></div><br/>
      <div class="simbologia aprovechar"><div></div><p>Espacios para aprovechar</p></div><br/>
      <div class="simbologia acuatico"><div></div><p>Parques acuaticos</p></div><br/>
      <div class="simbologia cancha"><div></div><p>Canchas</p></div>
      `);
};

info.addTo(map);

function main() {
  mapElement.style.backgroundColor = MAPABASES.default.bgColor;
  setBaseMap(MAPABASES.default);
  inicializarCapas();
  checkDepartamentos.addEventListener("change", toggleDepartamentos);
  checkMunicipios.addEventListener("change", toggleMunicipios);
}

function inicializarCapas() {
  axios(`/sgg-espacios-recreativos/assets/map/Espacios recreativos.geojson`)
    .then((response) => {
      // console.log(response);
      L.geoJSON(response.data, {
        style: { color: "#059669" },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.Nombre);
          // console.log(feature);
          layer.bindPopup(`
          <div>
            <h1>Espacio recreativo</h1>
            <p class="nombre">Nombre: ${feature.properties.Nombre}</p>
            <p class="municipio">Municipio: ${feature.properties.Municipio}</p>
          </div>
          `);
        },
      }).addTo(map);
    })
    .catch((error) => console.error(error));

  axios(`/sgg-espacios-recreativos/assets/map/Espacios para aprovechar.geojson`)
    .then((response) => {
      // console.log(response);
      L.geoJSON(response.data, {
        style: { color: "#ea580c" },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.NOMBRE);
          // console.log(feature);
          layer.bindPopup(`
          <div>
            <h1>Espacio para aprovechar</h1>
            <p class="nombre">Nombre: ${feature.properties.NOMBRE}</p>
            <p class="municipio">Municipio: ${feature.properties.MUNICIPIO}</p>
          </div>
          `);
        },
      }).addTo(map);
    })
    .catch((error) => console.error(error));

  axios(`/sgg-espacios-recreativos/assets/map/Canchas.geojson`)
    .then((response) => {
      // console.log(response);
      L.geoJSON(response.data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 4,
            fillColor: "#cbd5e1",
            color: "#64748b",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
          });
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.Nombre);
          // console.log(feature);
          layer.bindPopup(`
          <div>
            <h1>Cancha</h1>
            <p class="nombre">Nombre: ${feature.properties.Nombre}</p>
          </div>
          `);
        },
      }).addTo(map);
    })
    .catch((error) => console.error(error));

  axios(`/sgg-espacios-recreativos/assets/map/Parques acuaticos.geojson`)
    .then((response) => {
      // console.log(response);
      L.geoJSON(response.data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 4,
            fillColor: "#06b6d4",
            color: "#0369a1",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
          });
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.Nombre);
          // console.log(feature);
          layer.bindPopup(`
          <div>
            <h1>Parque acuatico</h1>
            <p class="nombre">Nombre: ${feature.properties.Nombre}</p>
          </div>
          `);
        },
      }).addTo(map);
    })
    .catch((error) => console.error(error));
}

function toggleDepartamentos() {
  // console.log(checkDepartamentos.checked);
  if (checkDepartamentos.checked) {
    axios(`/sgg-espacios-recreativos/assets/map/Departamentos.geojson`)
      .then((response) => {
        console.log(response);
        departamentosLayer = L.geoJSON(response.data, {
          style: {
            color: "#fff",
            weight: 2,
            opacity: 0.65,
          },
        }).addTo(map);
      })
      .catch((error) => console.error(error));
  } else {
    map.removeLayer(departamentosLayer);
  }
}

function toggleMunicipios() {
  console.log(checkMunicipios.checked);
  if (checkMunicipios.checked) {
    axios(`/sgg-espacios-recreativos/assets/map/Municipios.geojson`)
      .then((response) => {
        console.log(response);
        municipiosLayer = L.geoJSON(response.data, {
          style: {
            color: "#fff",
            weight: 1,
            opacity: 0.2,
          },
        }).addTo(map);
      })
      .catch((error) => console.error(error));
  } else {
    map.removeLayer(municipiosLayer);
  }
}

function cambiarMapaBase() {
  // newBaseLayer.removeFrom(map);
  if (baseLayer.options.attribution === "OpenStreetMap") {
    map.removeLayer(baseLayer);
    baseLayer = MAPABASES.default;
  } else if (baseLayer.options.attribution === "Default") {
    map.removeLayer(baseLayer);
    baseLayer = MAPABASES.satelite;
  } else {
    map.removeLayer(baseLayer);
    baseLayer = MAPABASES.default;
  }
  setBaseMap(baseLayer);
  btnMapBase.textContent = baseLayer.title;
  mapElement.style.backgroundColor = baseLayer.bgColor;
  // console.log(map);
}

function setBaseMap(mapaBase) {
  parseGeoraster(mapaBase.url).then((georaster) => {
    // console.log("georaster:", georaster);
    baseLayer = new GeoRasterLayer({
      attribution: mapaBase.title,
      georaster: georaster,
      resolution: 128,
    });
    baseLayer.addTo(map);
    map.fitBounds(baseLayer.getBounds());
  });
}

function setOpenStretMap() {
  mapElement.style.backgroundColor = "white";
  map.removeLayer(baseLayer);
  baseLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "OpenStreetMap",
  });
  map.addLayer(baseLayer);
}

// Intaractividad
function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.popupContent) {
    layer.bindPopup(feature.properties.popupContent);
  }
}

window.addEventListener("load", main);
