;
(() => {
  "use strict";

  // デフォルトのmapStateを定義

  const defaultState = {
    view: {
      zoom: 9,
      center: [139.8241, 35.7080],
      rotation: 0
    },
    layers: {/*
      base: ["allblacks"],
      overlays: ["rails"],
      yokyo: []*/
    },
    year: {
      current: new Date().getFullYear(),
      years: [],
      extent: {min: 1950}
    },
    selected: {
      cue: "N05_006"
    },
    geolocation: true
  };

  class State {
    constructor(map, defaults) {
      this.map = map;
      this.config = Object.assign({}, defaults);
      this.config.urlstrings = {layers: {}};

      map.getLayers().forEach((lyg, i) => {
        this.setLayersConfigFromMap(lyg);
      });

      this.config.shouldUpdate = true;
      this.config.selected.clicked = false;
      this.config.selected.mustupinfo = false;

      this.config.year.years.push(this.config.year.current);
      this.config.year.extent.max = this.config.year.current;

      this.tributeLayersStrings(defaults.layers);

      this.config.urlstrings.view = this.viewStrings(this.config.view);
      this.config.urlstrings.year = this.config.year.current;

      return this;
    }

    setView(config) {
      this.config.view = config;
      return this;
    }

    setViewFromMap() {
      const neu = {
        zoom: this.map.getView().getZoom(),
        center: ol.proj.toLonLat(this.map.getView().getCenter()),
        rotation: this.map.getView().getRotation()
      };
      this.setView(neu)
          .setViewURL();
      return this;
    }

    setViewURL() {
      this.config.urlstrings.view = [this.config.view.zoom, this.config.view.center[0], this.config.view.center[1], this.config.view.rotation].map(d => d.toFixed(6)).join("/");
      return this;
    }

    viewURLtoConfig(str) {
      this.config.urlstrings.view = str;
      const values = str.split("/").map(d => parseFloat(d));
      const neu = {
        zoom: values[0],
        center: [values[1], values[2]],
        rotation: values[3]
      };
      this.config.view = neu;
      return this;
    }

    viewStrings(viewState) {
      return [viewState.zoom, viewState.center[0], viewState.center[1], viewState.rotation].map(d => d.toFixed(6)).join("/");
    }
    getViewStrings() {
      return this.config.urlstrings.view;
    }

    setLayers(config) {
      this.config.layers = config;
      return this;
    }

    setLayersConfigFromMap(lyg) {
      const currentLayers = [];
      lyg.getLayers().forEach((lyr, i) => {
        if (!lyr.getVisible()) return;
        currentLayers.push(lyr.get("permalink"));
      });
      this.config.layers[lyg.get("permalink")] = currentLayers;
      this.config.urlstrings.layers[lyg.get("permalink")] = this.layersStringsFromGroup(lyg);
      return this;
    }

    layersStringsFromGroup(lyg) {
      return lyg.get("permalink") + "=" + this.config.layers[lyg.get("permalink")].join("/");
    }

    getLayers(permalink) {
      if (permalink) return this.config.layers[permalink];
      return this.config.layers;
    }

    tributeLayersStrings(layers) {
      // distributes each layer congig to url strings
      for (let prop in layers) {
        this.config.urlstrings.layers[prop] = prop + "=" + layers[prop].join("/");
      }
      return;
    }

    getLayersURLStrings() {
      // return a joined url strings
      const arr = [];
      for (let prop in this.config.urlstrings.layers) {
        arr.push(this.config.urlstrings.layers[prop]);
      }
      return arr.join("&");
    }

    getCurrentYear() {
      return this.config.year.current;
    }

    setYearConfig(config) {
      this.config.year = config;
      return this;
    }

    setYear(year) {
      this.config.year.current = parseInt(year, 10);
      this.config.year.years.push(year);
      this.config.urlstrings.year = year;
      return this;
    }

    getYearsExtent() {
      return this.config.year.extent;
    }

    setYearsExtent(arr) {
      if (arr.length !== 2) throw error;
      this.config.year.extent = {min: parseInt(Math.min(arr[0], arr[1]), 10), max: parseInt(Math.max(arr[0], arr[1]), 10)};
      return this;
    }

    getVisibleInYear(feature) {
      return (parseInt(feature.get("N05_005b"), 10) <= this.config.year.current && parseInt(feature.get("N05_005e"), 10) >= this.config.year.current);
    }

    parseURLString(str) {
      const parts = str.split('&');
      if (parts.length > 0) {
        this.viewURLtoConfig(parts[0]);
      }
      if (parts.length > 1) {
        this.setYear(parseInt(parts[1], 10));
      }
      if (parts.length > 2) {
        this.layersURLtoConfig(parts.slice(2));
      }
    }

    // distribute urlstrings
    setLayerURLStrings(prop, str) {
      this.config.urlstrings.layers[prop] = str;
      return this;
    }

    // url to config(inclueding urlstrings)
    layerURLtoConfig(str, lyg) {
      const lyGroups = lyg || this.map.getLayers().getArray();
      const layerStrings = str.split("=");
      this.setLayerURLStrings(layerStrings[0], str);
      const lygtype = lyGroups[lyGroups.map(d => d.get("permalink")).indexOf(layerStrings[0])].get("type");
      this.config.layers[layerStrings[0]] = layerStrings[1] === "" ? [] : layerStrings[1].split("/");
      return this;
    }

    // array of urls to config
    layersURLtoConfig(arr) {
      console.log(this.config.layers);
      const lyg = this.map.getLayers().getArray();
      for (let i = 0; i < arr.length; i++) {
        this.layerURLtoConfig(arr[i], lyg);
      }
      console.log(arr.length + " layers were set to Config");
      console.log(this.config.layers);
      return this;
    }

    layersConfigtoMap(config) {
      const lygs = this.map.getLayers();
      lygs.forEach((lyg, i) => {
        const permalink = lyg.get("permalink");
        const visibleLayers = config[permalink];
        lyg.getLayers().forEach((lyr, j) => {
          lyr.setVisible(visibleLayers.indexOf(lyr.get("permalink")) >= 0);
        });
      });
      console.log("set layers to map from config");
    }

    getAllUrlString() {
      const arr = [this.config.urlstrings.view, this.config.urlstrings.year];
      for (let prop in this.config.urlstrings.layers) {
        arr.push(this.config.urlstrings.layers[prop]);
      }
      return arr.join("&");
    }

    getShouldUpdate() {
      return this.config.shouldUpdate;
    }

    setShouldUpdate(bool) {
      this.config.shouldUpdate = bool;
      return this;
    }

    getSelectedCue() {
      return this.config.selected.cue;
    }

    setSelectedFeature(feature) {
        this.config.selected.current = feature;
        if (this.config.selected.current !== undefined) {
          this.config.selected.value = feature.get(this.getSelectedCue());
        }
        return this;
    }

    getSelectedValue() {
      return this.config.selected.value;
    }

    getSelectedFeature() {
      return this.config.selected.current;
    }

    getSelectedStatus() {
      return this.config.selected.current !== undefined;
    }

    getEqualtoCurrentCue(feature) {
      if (this.getSelectedStatus()) {
        return feature.get(this.getSelectedCue()) === this.getSelectedValue();
      } else {
        return false;
      }
    }

    getSelectedClicked() {
      return this.config.selected.clicked;
    }

    setSelectedClicked(bool) {
      this.config.selected.clicked = bool;
      return this;
    }

    setMustUpdateInfo(bool) {
      this.config.selected.mustupinfo = bool;
      return this;
    }

    getMustUpdateInfo() {
      return this.config.selected.mustupinfo;
    }

    getGeolocation() {
      return true;
    }

    // take config

    getStatus() {
      return this.config;
    }

    setStatusfromPopstate(state) {
      this.config = state;
      return this;
    }

    // update map from config

    updateView() {
      this.map.getView().setCenter(ol.proj.fromLonLat(this.config.view.center));
      this.map.getView().setZoom(this.config.view.zoom);
      this.map.getView().setRotation(this.config.view.rotation);
      console.log("update view!");
      return this;
    }

    updateYear(layer, style) {
      document.getElementById("year").innerHTML = this.getCurrentYear();
      document.getElementById("slider").value = this.getCurrentYear();

      if (layer && style) {
        layer.setStyle(style);
      }
      console.log("update year!");
      return this;
    }

    // layer config to the Map
    updateLayers() {
      this.map.getLayers().forEach((lyg, i) => {
        const permalink = lyg.get("permalink");
        const visibleLayers = this.config.layers[permalink];
        lyg.getLayers().forEach((lyr, j) => {
          lyr.setVisible(visibleLayers.indexOf(lyr.get("permalink")) >= 0);
        });
      });
      this.tributeLayersStrings(this.config.layers);
      console.log("update layers!");
      return this;
    }

    // use only when popstate
    updateLayerMenu() {
      this.map.getLayers().forEach((lyg, i) => {
        const permalink = lyg.get("permalink");
        const visibleLayers = this.config.layers[permalink];
        lyg.getLayers().forEach((lyr, j) => {
          const li = document.getElementById("layer-" + lyr.get("permalink"));
          if (visibleLayers.indexOf(lyr.get("permalink")) >= 0) {
            li.classList.add("active");
          } else {
            li.classList.remove("active");
          }
        });
      });
      console.log("update layer menu!");
      return this;
    }

    updateMap(layer, style) {
      this.updateView()
          .updateYear(layer, style)
          .updateLayers();

      return this;
    }

    updatePermalink() {
      if (!this.getShouldUpdate()) {
        this.setShouldUpdate(true);
        return;
      }
      const hash = "#" + this.getAllUrlString();
      window.history.pushState(this.getStatus(), 'map', hash);
    }

  }

  // mvtレイヤの属性別のスタイルを設定

  const styles = {
    shinkansen: {
      width: 4,
      color: "rgba(0, 148, 255, 1)",
      zIndex: 10,
      title: "新幹線"
    },
    jr: {
      width: 2.5,
      color: "rgba(3, 212, 212, 1)",
      zIndex: 8,
      title: "JR・国鉄"
    },
    priway: {
      width: 2,
      color: "rgba(207, 0, 64, 1)",
      zIndex: 6,
      title: "私鉄"
    },
    pubway: {
      width: 2,
      color: "rgba(240, 154, 76, 1)",
      zIndex: 4,
      title: "公営"
    },
    third: {
      width: 2,
      color: "rgba(215, 195, 4, 1)",
      zIndex: 2,
      title: "第三セクター"
    }
  };

  // ベースマップの設定

  const attributions = {
    gsi: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
    ksj: '<a href="http://nlftp.mlit.go.jp/ksj/" target="_blank">国土数値情報</a>',
  };

  const osm = new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: "OpenStreetMap",
    permalink: "osm",
    type: "layer",
    visible: false
  });

  const ort = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "//cyberjapandata.gsi.go.jp/xyz/seamlessphoto/" + "{z}/{x}/{y}.jpg",
      attributions: new ol.Attribution({
        html: attributions.gsi
      })
    }),
    title: "写真",
    permalink: "ort",
    crossOrigin: 'Anonymous',
    type: "layer",
    visible: false
  });

  const relief = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "//cyberjapandata.gsi.go.jp/xyz/relief/" + "{z}/{x}/{y}.png",
      attributions: new ol.Attribution({
        html: attributions.gsi
      })
    }),
    title: "色別標高図",
    permalink: "relief",
    crossOrigin: 'Anonymous',
    type: "layer",
    visible: false
  });

  const slope = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "//cyberjapandata.gsi.go.jp/xyz/slopemap/" + "{z}/{x}/{y}.png",
      attributions: new ol.Attribution({
        html: attributions.gsi
      })
    }),
    title: "傾斜量図",
    permalink: "slope",
    crossOrigin: 'Anonymous',
    type: "layer",
    visible: false
  });

  const cjpale = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "//cyberjapandata.gsi.go.jp/xyz/pale/" + "{z}/{x}/{y}.png",
      attributions: new ol.Attribution({
        html: attributions.gsi
      })
    }),
    title: "地理院地図",
    permalink: "cjpale",
    crossOrigin: 'Anonymous',
    type: "layer",
    visible: false
  });

  const cjblank = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "//cyberjapandata.gsi.go.jp/xyz/blank/" + "{z}/{x}/{y}.png",
      attributions: new ol.Attribution({
        html: attributions.gsi
      })
    }),
    title: "白地図",
    permalink: "cjblank",
    crossOrigin: 'Anonymous',
    type: "layer",
    visible: false
  });

  const allblacks = new ol.layer.Group({
    title: "黒",
    permalink: "allblacks",
    opacity: 0,
    type: "layer",
    visible: true
  });

  const basemaps = new ol.layer.Group({
    layers: [osm, cjpale, ort, relief, slope, cjblank, allblacks],
    title: "Basemap",
    type: "basemaps",
    permalink: "base"
  });

  // mvtレイヤの設定

  const rails = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      format: new ol.format.MVT(),
      url: "//cieloazul310.github.io/mvt-tiles/tile/rails/" + "{z}/{x}/{y}.mvt",
      attributions: new ol.Attribution({
        html: attributions.ksj
      })
    }),
    title: "鉄道時系列",
    permalink: "rails",
    type: "layer",
    style: mvtStyle,
    visible: true
  });

  const overlays = new ol.layer.Group({
    layers: [rails],
    title: "Overlays",
    type: "overlays",
    permalink: "overlays"
  });

/*
  const debugLayer = new ol.layer.Tile({
      source: new ol.source.TileDebug({
        projection: 'EPSG:3857',
        tileGrid: rails.getSource().getTileGrid()
      }),
      title: "tileGrid",
      permalink: "tilegrid",
      type: "layer",
      visible: false
  });

  const jleague = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: "./data/jleague2016.geojson",
      attributions: new ol.Attribution({
        html: "水戸地図"
      })
    }),
    title: "Jリーグ",
    permalink: "jleague",
    type: "layer",
    visible: false,
    maxResolution: 1000,
    style: new ol.style.Style({
      image: new ol.style.RegularShape({
        fill: new ol.style.Fill({color: "white"}),
        stroke: new ol.style.Stroke({color: "blue", width: 4}),
        points: 100,
        radius: 5
      })
    })
  });

  const yokyo = new ol.layer.Group({
    layers: [debugLayer, jleague],
    title: "余興",
    type: "overlays",
    permalink: "yokyo"
  });
*/
  // mapオブジェクト

  const map = new ol.Map({
    target: "map",
    controls: ol.control.defaults({
      attribution: false
    }).extend([new ol.control.Attribution({
      collapsible: false
    }), new ol.control.ScaleLine()]),
    view: new ol.View({
      maxZoom: 16,
      minZoom: 4
    }),
    layers: [basemaps, overlays/*, yokyo*/]
  });

  const mapState = new State(map, defaultState);

  // permalinkの解析し、上記クラスのconfigに反映

  if (window.location.hash !== '') {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('&');
    if (parts.length > 0) {
      mapState.viewURLtoConfig(parts[0]);
    }
    if (parts.length > 1) {
      mapState.setYear(parseInt(parts[1], 10));
    }
    if (parts.length > 2) {
      mapState.layersURLtoConfig(parts.slice(2));
    }
  }

  const slider = document.getElementById("slider");
  slider.setAttribute("min", mapState.getYearsExtent().min);
  slider.setAttribute("max", mapState.getYearsExtent().max);

  // マップのの初期設定を完了する

  mapState.updateMap(rails, mvtStyle);

  // geolocationの設定

  if (mapState.getGeolocation()) {

    const geolocation = new ol.Geolocation({
      projection: map.getView().getProjection()
    });

    const positionFeature = new ol.Feature();
    positionFeature.setStyle([
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 12,
          fill: new ol.style.Fill({
            color: 'rgba(51, 181, 204, 0.4)'
          })
        })
      }),
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: '#3399CC'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
          })
        })
      })
    ]);

    document.getElementById("geolocation")
            .addEventListener("click", (evt) => {
              if (!geolocation.getTracking()) {
                geolocation.setTracking(true);
                evt.target.classList.add("active");
              } else {
                map.getView().setCenter(geolocation.getPosition());
              }
            });

    geolocation.once("change:position", () => {
      map.getView().setCenter(geolocation.getPosition());
      map.getView().setZoom(Math.max(12, map.getView().getZoom()));
      positionFeature.setGeometry(geolocation.getPosition() ?
        new ol.geom.Point(geolocation.getPosition()) : null);
      new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
          features: [positionFeature]
        })
      });
    });

    geolocation.on('change:position', () => {
      positionFeature.setGeometry(geolocation.getPosition() ?
        new ol.geom.Point(geolocation.getPosition()) : null);
    });

  }

  map.on("singleclick", (evt) => {
    const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => {
      return feature.get("layer") === "section" ? feature : undefined;
    }, {
      layerFilter: (layer) => {
        return layer.get("permalink") === "rails";
      },
      hitTolerance: 3
    });
    if (feature) {

      mapState.setSelectedFeature(feature)
          .setSelectedClicked(true);

      document.getElementById("info-title").innerHTML = "<ul><li>" + feature.get("N05_003") + "</li><li><strong>" + feature.get("N05_002") + "</strong></li>";
      document.getElementById("info-detail").innerHTML = createStyle(feature).title;

    } else {

      if (!mapState.getSelectedStatus()) return;

      mapState.setSelectedFeature(undefined)
          .setSelectedClicked(false);

      document.getElementById("info-title").innerHTML = "<ul><li>路線を選択してください</li></ul>";
      document.getElementById("info-detail").innerHTML = "事業者区分";
    }

    rails.setStyle(mvtStyle);

  });

  map.on("pointermove", (evt) => {
    if (evt.dragging) return;

    const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => {
      return feature;
    }, {
      layerFilter: (layer) => {
        return layer.get("permalink") === "rails";
      },
      hitTolerance: 3
    });
    if (feature) {/*
      mapState.setSelectedFeature(feature);*/

      document.getElementById(map.getTarget()).style.cursor = "pointer";
      if (mapState.getSelectedClicked()) return;
      document.getElementById("info-title").innerHTML = "<ul><li>" + feature.get("N05_003") + "</li><li><strong>" + feature.get("N05_002") + "</strong></li>";
      document.getElementById("info-detail").innerHTML = createStyle(feature).title;
    } else {/*
      mapState.setSelectedFeature(undefined);*/

      document.getElementById(map.getTarget()).style.cursor = "";
      if (mapState.getSelectedClicked()) return;
      document.getElementById("info-title").innerHTML = "<ul><li>路線を選択してください</li></ul>";
      document.getElementById("info-detail").innerHTML = "事業者区分";
    }
  });

  map.on("moveend", () => {
    mapState.setViewFromMap()
        .updateView()
        .updatePermalink();
  });

  window.addEventListener('popstate', (event) => {
    if (event.state === null) {
      return;
    }
    mapState.setStatusfromPopstate(event.state)
        .updateMap(rails, mvtStyle)
        .updateLayerMenu()
        .setShouldUpdate(false);
  });

  // スライダーのイベントの設定

  slider.addEventListener("change", (evt) => {
    const neu = parseInt(evt.target.value, 10);

    mapState.setYear(neu)
        .updateYear(rails, mvtStyle)
        .updatePermalink();
  });

  //スライダーボタンの設定

;
(() => {
  const sliderButtons = document.querySelectorAll(".slider-button");
  for (let i = 0; i < sliderButtons.length; i++) {
    sliderButtons[i].addEventListener("click", (evt) => {
      const neu = mapState.getCurrentYear() + parseInt(evt.target.dataset.year, 10);
      if (neu <= mapState.getYearsExtent().min) {
        mapState.setYear(mapState.getYearsExtent().min);
      } else if (neu >= mapState.getYearsExtent().max) {
        mapState.setYear(mapState.getYearsExtent().max);
      } else {
        mapState.setYear(neu);
      }
      mapState.updateYear(rails, mvtStyle)
          .updatePermalink();
    });
  }
})();

  // レイヤメニューの設定

  ;
  ((map) => {

    const layerContainer = document.querySelector(".layer-container");

    map.getLayers().forEach((lyg, i) => {
      if (lyg.get("type") === "basemaps" || lyg.get("type") === "overlays") {

        const groupContainer = document.createElement("div");
        groupContainer.classList.add("menu-container");
        groupContainer.id = lyg.get("permalink").toLowerCase();

        const groupTitle = document.createElement("h3");
        groupTitle.innerHTML = lyg.get("title");

        groupContainer.appendChild(groupTitle);

        const groupUL = document.createElement("ul");

        lyg.getLayers().forEach((lyr, j) => {
          if (lyr.get("type") === "layer") {

            lyr.setVisible(mapState.getLayers()[lyg.get("permalink")].indexOf(lyr.get("permalink")) >= 0);

            const botan = document.createElement("li");
            botan.classList.add("layer-menu");
            botan.classList.add("layer-" + lyg.get("permalink"));
            botan.id = "layer-" + lyr.get("permalink");

            if (lyr.getVisible()){
              botan.classList.add("active");
            }
            botan.innerHTML = lyr.get("title");

            groupUL.appendChild(botan);

            botan.addEventListener("click", (evt) => {
              if (lyg.get("type") === "basemaps") {

                const botans = document.querySelectorAll(".layer-" + lyg.get("permalink"));

                for (let k = 0; k < botans.length; k++) {
                  botans[k].classList.remove("active");
                }

                evt.target.classList.add("active");

                lyg.getLayers().forEach((d, i) => {
                  d.setVisible(false);
                });
                lyr.setVisible(true);

              } else if (lyg.get("type") === "overlays") {

                if (lyr.getVisible()) {
                  evt.target.classList.remove("active");
                } else {
                  evt.target.classList.add("active");
                }

                lyr.setVisible(!lyr.getVisible());

              }

            mapState.setLayersConfigFromMap(lyg)
                .updatePermalink();
            });

          }
        });

        groupContainer.appendChild(groupUL);
        layerContainer.appendChild(groupContainer);

      }

    });

  })(map);

  // メニューの設定

  ;(() => {
    /*
    <div class="ol-control toggle-menu">
      <button id="toggle-menu" title="メニューを開く">&equiv;</button>
    </div>
*/
    const viewport = document.querySelector("#map .ol-overlaycontainer-stopevent");

    const menuContainer = document.createElement("div");
    menuContainer.setAttribute("class", "ol-control toggle-menu");

    const menuButton = document.createElement("button");
    menuButton.setAttribute("alt", "メニューを開く");
    menuButton.innerHTML = "i";
    menuButton.addEventListener("click", () => {
      document.getElementById("menu").style.display = "inline-block";
    });
/*
    document.getElementById("toggle-menu")
            .addEventListener("click", () => {
              document.getElementById("menu").style.display = "inline-block";
            });
*/
    menuContainer.appendChild(menuButton);
    viewport.appendChild(menuContainer);

    for (let i = 0; i < document.querySelectorAll(".menu-closer").length; i++){
      document.querySelectorAll(".menu-closer")[i]
              .addEventListener("click", () => {
                document.getElementById('menu').style.display = "none";
              });
    }

  })();

  // 画像を保存
/*
  document.getElementById('map-export').addEventListener('click', function() {
    const previewer = document.getElementById("export-preview");
    const preimg = document.createElement("img");
    const prelink = document.createElement("a");

    map.once('postcompose', function(event) {
      const can = event.context.canvas;
      prelink.target = "_blank";
      let imageURL;

      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(can.msToBlob(), 'map.png');
      } else {

        can.toBlob(function (blob) {
          // BlobオブジェクトにアクセスできるURLを生成
          imageURL = URL.createObjectURL(blob);

          // 要素にURLを適用
          preimg.src = imageURL;
          prelink.href = imageURL;
        });
      }
    });
    map.renderSync();
    prelink.appendChild(preimg);
    previewer.appendChild(prelink);
  });
*/
  // スタイルの設定

  function mvtStyle(feature, resolution) {

    if (mapState.getEqualtoCurrentCue(feature) && !mapState.getVisibleInYear(mapState.getSelectedFeature())) {
      mapState.setMustUpdateInfo(true);
    }
    // remove invisible features
    if (!mapState.getVisibleInYear(feature)) return new ol.style.Style();
    if (mapState.getEqualtoCurrentCue(feature) && mapState.getMustUpdateInfo()) {
      console.log("info updated!");

      mapState.setSelectedFeature(feature);
      document.getElementById("info-title").innerHTML = "<ul><li>" + feature.get("N05_003") + "</li><li><strong>" + feature.get("N05_002") + "</strong></li>";
      document.getElementById("info-detail").innerHTML = createStyle(feature).title;
      mapState.setMustUpdateInfo(false);
    }
    if (feature.get("layer") === "section") return sectionStyleFunction(feature, resolution);
    if (feature.get("layer") === "station") return stationStyleFunction(feature, resolution);
  }

  function sectionStyleFunction(feature, resolution) {
    const sty = [
      new ol.style.Style({
        zIndex: 1,
        stroke: new ol.style.Stroke({
          width: Math.min(12, createStyle(feature).width * baiBain(resolution)) + 2,
          color: "rgba(0, 0, 0, 0.8)"
        })
      }),
      new ol.style.Style({
        zIndex: createStyle(feature).zIndex,
        stroke: new ol.style.Stroke({
          width: Math.min(12, createStyle(feature).width * baiBain(resolution)),
          color: createStyle(feature).color
        })
      })
    ];
    // feature is selected
    if (mapState.getEqualtoCurrentCue(feature)) {
      sty[0].setZIndex(20);
      sty[0].getStroke().setWidth(resolution < 19.11 ? Math.min(12, createStyle(feature).width * baiBain(resolution)) + 4 : 10);
      sty[1].setZIndex(25);
      sty[1].getStroke().setWidth(resolution < 19.11 ? Math.min(12, createStyle(feature).width * baiBain(resolution)) : 4);

      return [
        new ol.style.Style({
          zIndex: 15,
          stroke: new ol.style.Stroke({
            width: resolution < 19.11 ? Math.min(12, createStyle(feature).width * baiBain(resolution)) + 8 : 13,
            color: "white"
          })
        }), sty[0], sty[1]
      ];
    }
    if (resolution > 4890) {
      sty[0].getStroke().setWidth(2);
      sty[1].getStroke().setWidth(1.5);
    } else if (resolution < 9.56) {
      sty[1].getStroke().setColor(createStyle(feature).color.slice(0, -2) + " 0.6)");
      return sty[1];
    }
    return sty;
  }

  function stationStyleFunction(feature, resolution) {
    const sty = [new ol.style.Style()];
    const status = mapState.getSelectedStatus();

    if (resolution > 20 && (!status || (status && feature.get("N05_006").slice(5, 10) !== mapState.getSelectedValue().slice(5)))) return sty[0];

    sty[0].setZIndex(0);
    sty[0].setImage(new ol.style.Circle({
      radius: 2.5,
      fill: new ol.style.Fill({
        color: "white"
      }),
      stroke: new ol.style.Stroke({
        width: 1,
        color: "black"
      })
    }));

    if (resolution > 4.78 && (!status || (status && feature.get("N05_006").slice(5, 10) !== mapState.getSelectedValue().slice(5)))) return sty;

    sty.push(new ol.style.Style({
      zIndex: 10,
      text: new ol.style.Text({
        offsetX: 8,
        font: '12px -apple-system,BlinkMacSystemFont,"Helvetica Neue","Original Yu Gothic","Yu Gothic",YuGothic,Verdana,Meiryo,"M+ 1p",sans-serif',
        textAlign: "left",
        textBaseline: "middle",
        text: feature.get("N05_011"),
        fill: new ol.style.Fill({
          color: "white"
        }),
        stroke: new ol.style.Stroke({
          color: "black",
          width: 4
        })
      })
    }));

    if (status && feature.get("N05_006").slice(5, 10) === mapState.getSelectedValue().slice(5)) {
      sty[0].setZIndex(15);
      sty[0].getImage().setRadius(4);
      sty[1].getText().setFont('14px -apple-system,BlinkMacSystemFont,"Helvetica Neue","Original Yu Gothic","Yu Gothic",YuGothic,Verdana,Meiryo,"M+ 1p",sans-serif');
      sty[1].setZIndex(20);
    }

    return sty;
  }

  function createStyle(feature) {
    return feature.get("N05_001") === "1" ? styles.shinkansen :
      feature.get("N05_001") === "2" ? styles.jr :
      feature.get("N05_001") === "3" ? styles.pubway :
      feature.get("N05_001") === "4" ? styles.priway : styles.third;
  }

  function baiBain(resolution) {
    return resolution < 38.22 ? 38.22 / resolution : 1;
  }


})();
