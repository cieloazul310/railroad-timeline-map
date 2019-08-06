webpackJsonp([0],{237:function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d=c(238),e=c(240),f=c(80),g=c(82),h=c(67),i=c(66),j=c(65),k=c(131),l=c(241);b["default"]=(a)=>{const b=new d.a({projection:a.getMap().getView().getProjection()}),c=new e.a;c.setStyle([new f.a({image:new g.a({radius:12,fill:new h.a({color:"rgba(51, 181, 204, 0.4)"})})}),new f.a({image:new g.a({radius:6,fill:new h.a({color:"#3399CC"}),stroke:new i.a({color:"#fff",width:2})})})]);const m=document.querySelector(".menu-container ul.menus"),n=document.createElement("li");n.innerHTML="\u73FE\u5728\u5730\u3092\u8868\u793A",n.addEventListener("click",(c)=>{b.getTracking()?a.getMap().getView().setCenter(b.getPosition()):(b.setTracking(!0),c.target.classList.add("active"))}),m.appendChild(n),b.once("change:position",()=>{a.getMap().getView().setCenter(b.getPosition()),a.getMap().getView().setZoom(Math.max(12,a.getMap().getView().getZoom())),c.setGeometry(b.getPosition()?new j.a(b.getPosition()):null),new k.a({map:a.getMap(),source:new l.a({features:[c]})})}),b.on("change:position",()=>{c.setGeometry(b.getPosition()?new j.a(b.getPosition()):null)})}},238:function(a,b,c){"use strict";var d=c(0),e=c(239),f=c(15),g=c(127),h=c(5),i=c(6),j=c(64),k=c(18),l=c(4),m=c(13),n=c(128),o=function(a){f.a.call(this);var b=a||{};this.position_=null,this.transform_=m.a.identityTransform,this.sphere_=new g.a(n.a.RADIUS),this.watchId_=void 0,h.a.listen(this,f.a.getChangeEventType(e.a.PROJECTION),this.handleProjectionChanged_,this),h.a.listen(this,f.a.getChangeEventType(e.a.TRACKING),this.handleTrackingChanged_,this),b.projection!==void 0&&this.setProjection(b.projection),b.trackingOptions!==void 0&&this.setTrackingOptions(b.trackingOptions),this.setTracking(b.tracking!==void 0&&b.tracking)};d.a.inherits(o,f.a),o.prototype.disposeInternal=function(){this.setTracking(!1),f.a.prototype.disposeInternal.call(this)},o.prototype.handleProjectionChanged_=function(){var a=this.getProjection();a&&(this.transform_=m.a.getTransformFromProjections(m.a.get("EPSG:4326"),a),this.position_&&this.set(e.a.POSITION,this.transform_(this.position_)))},o.prototype.handleTrackingChanged_=function(){if(k.a.GEOLOCATION){var a=this.getTracking();a&&this.watchId_===void 0?this.watchId_=navigator.geolocation.watchPosition(this.positionChange_.bind(this),this.positionError_.bind(this),this.getTrackingOptions()):!a&&this.watchId_!==void 0&&(navigator.geolocation.clearWatch(this.watchId_),this.watchId_=void 0)}},o.prototype.positionChange_=function(a){var b=a.coords;this.set(e.a.ACCURACY,b.accuracy),this.set(e.a.ALTITUDE,null===b.altitude?void 0:b.altitude),this.set(e.a.ALTITUDE_ACCURACY,null===b.altitudeAccuracy?void 0:b.altitudeAccuracy),this.set(e.a.HEADING,null===b.heading?void 0:l.a.toRadians(b.heading)),this.position_?(this.position_[0]=b.longitude,this.position_[1]=b.latitude):this.position_=[b.longitude,b.latitude];var c=this.transform_(this.position_);this.set(e.a.POSITION,c),this.set(e.a.SPEED,null===b.speed?void 0:b.speed);var d=j.a.circular(this.sphere_,this.position_,b.accuracy);d.applyTransform(this.transform_),this.set(e.a.ACCURACY_GEOMETRY,d),this.changed()},o.prototype.positionError_=function(a){a.type=i.a.ERROR,this.setTracking(!1),this.dispatchEvent(a)},o.prototype.getAccuracy=function(){return this.get(e.a.ACCURACY)},o.prototype.getAccuracyGeometry=function(){return this.get(e.a.ACCURACY_GEOMETRY)||null},o.prototype.getAltitude=function(){return this.get(e.a.ALTITUDE)},o.prototype.getAltitudeAccuracy=function(){return this.get(e.a.ALTITUDE_ACCURACY)},o.prototype.getHeading=function(){return this.get(e.a.HEADING)},o.prototype.getPosition=function(){return this.get(e.a.POSITION)},o.prototype.getProjection=function(){return this.get(e.a.PROJECTION)},o.prototype.getSpeed=function(){return this.get(e.a.SPEED)},o.prototype.getTracking=function(){return this.get(e.a.TRACKING)},o.prototype.getTrackingOptions=function(){return this.get(e.a.TRACKING_OPTIONS)},o.prototype.setProjection=function(a){this.set(e.a.PROJECTION,m.a.get(a))},o.prototype.setTracking=function(a){this.set(e.a.TRACKING,a)},o.prototype.setTrackingOptions=function(a){this.set(e.a.TRACKING_OPTIONS,a)},b.a=o},239:function(a,b){"use strict";b.a={ACCURACY:"accuracy",ACCURACY_GEOMETRY:"accuracyGeometry",ALTITUDE:"altitude",ALTITUDE_ACCURACY:"altitudeAccuracy",HEADING:"heading",POSITION:"position",PROJECTION:"projection",SPEED:"speed",TRACKING:"tracking",TRACKING_OPTIONS:"trackingOptions"}},240:function(a,b,c){"use strict";var d=c(7),e=c(5),f=c(6),g=c(0),h=c(15),i=c(81),j=c(80),k=function(a){if(h.a.call(this),this.id_=void 0,this.geometryName_="geometry",this.style_=null,this.styleFunction_=void 0,this.geometryChangeKey_=null,e.a.listen(this,h.a.getChangeEventType(this.geometryName_),this.handleGeometryChanged_,this),void 0!==a)if(a instanceof i.a||!a){this.setGeometry(a)}else{this.setProperties(a)}};g.a.inherits(k,h.a),k.prototype.clone=function(){var a=new k(this.getProperties());a.setGeometryName(this.getGeometryName());var b=this.getGeometry();b&&a.setGeometry(b.clone());var c=this.getStyle();return c&&a.setStyle(c),a},k.prototype.getGeometry=function(){return this.get(this.geometryName_)},k.prototype.getId=function(){return this.id_},k.prototype.getGeometryName=function(){return this.geometryName_},k.prototype.getStyle=function(){return this.style_},k.prototype.getStyleFunction=function(){return this.styleFunction_},k.prototype.handleGeometryChange_=function(){this.changed()},k.prototype.handleGeometryChanged_=function(){this.geometryChangeKey_&&(e.a.unlistenByKey(this.geometryChangeKey_),this.geometryChangeKey_=null);var a=this.getGeometry();a&&(this.geometryChangeKey_=e.a.listen(a,f.a.CHANGE,this.handleGeometryChange_,this)),this.changed()},k.prototype.setGeometry=function(a){this.set(this.geometryName_,a)},k.prototype.setStyle=function(a){this.style_=a,this.styleFunction_=a?k.createStyleFunction(a):void 0,this.changed()},k.prototype.setId=function(a){this.id_=a,this.changed()},k.prototype.setGeometryName=function(a){e.a.unlisten(this,h.a.getChangeEventType(this.geometryName_),this.handleGeometryChanged_,this),this.geometryName_=a,e.a.listen(this,h.a.getChangeEventType(this.geometryName_),this.handleGeometryChanged_,this),this.handleGeometryChanged_()},k.createStyleFunction=function(a){var b;if("function"==typeof a)b=2==a.length?function(b){return a(this,b)}:a;else{var c;Array.isArray(a)?c=a:(d.a.assert(a instanceof j.a,41),c=[a]),b=function(){return c}}return b},b.a=k},241:function(a,b,c){"use strict";var d=c(0),e=c(46),f=c(62),g=c(63),h=c(3),i=c(7),j=c(5),k=c(17),l=c(6),m=c(1),n=c(132),o=c(12),p=c(242),q=c(2),r=c(130),s=c(29),t=c(243),u=c(129),v=function(a){var b=a||{};r.a.call(this,{attributions:b.attributions,logo:b.logo,projection:void 0,state:s.a.READY,wrapX:!(b.wrapX!==void 0)||b.wrapX}),this.loader_=d.a.nullFunction,this.format_=b.format,this.overlaps_=!(b.overlaps!=void 0)||b.overlaps,this.url_=b.url,b.loader===void 0?this.url_!==void 0&&(i.a.assert(this.format_,7),this.loader_=n.a.xhr(this.url_,this.format_)):this.loader_=b.loader,this.strategy_=b.strategy===void 0?p.a.all:b.strategy;var c=!(b.useSpatialIndex!==void 0)||b.useSpatialIndex;this.featuresRtree_=c?new u.a:null,this.loadedExtentsRtree_=new u.a,this.nullGeometryFeatures_={},this.idIndex_={},this.undefIdIndex_={},this.featureChangeKeys_={},this.featuresCollection_=null;var f,g;b.features instanceof e.a?(f=b.features,g=f.getArray()):Array.isArray(b.features)&&(g=b.features),c||f!==void 0||(f=new e.a(g)),g!==void 0&&this.addFeaturesInternal(g),f!==void 0&&this.bindFeaturesCollection_(f)};d.a.inherits(v,r.a),v.prototype.addFeature=function(a){this.addFeatureInternal(a),this.changed()},v.prototype.addFeatureInternal=function(a){var b=d.a.getUid(a).toString();if(this.addToIndex_(b,a)){this.setupChangeEvents_(b,a);var c=a.getGeometry();if(c){var e=c.getExtent();this.featuresRtree_&&this.featuresRtree_.insert(e,a)}else this.nullGeometryFeatures_[b]=a;this.dispatchEvent(new v.Event(t.a.ADDFEATURE,a))}},v.prototype.setupChangeEvents_=function(a,b){this.featureChangeKeys_[a]=[j.a.listen(b,l.a.CHANGE,this.handleFeatureChange_,this),j.a.listen(b,g.a.PROPERTYCHANGE,this.handleFeatureChange_,this)]},v.prototype.addToIndex_=function(a,b){var c=!0,d=b.getId();return void 0===d?(i.a.assert(!(a in this.undefIdIndex_),30),this.undefIdIndex_[a]=b):d.toString()in this.idIndex_?c=!1:this.idIndex_[d.toString()]=b,c},v.prototype.addFeatures=function(a){this.addFeaturesInternal(a),this.changed()},v.prototype.addFeaturesInternal=function(a){var b,c,e,f,g=[],h=[],i=[];for(c=0,e=a.length;c<e;c++)f=a[c],b=d.a.getUid(f).toString(),this.addToIndex_(b,f)&&h.push(f);for(c=0,e=h.length;c<e;c++){f=h[c],b=d.a.getUid(f).toString(),this.setupChangeEvents_(b,f);var j=f.getGeometry();if(j){var k=j.getExtent();g.push(k),i.push(f)}else this.nullGeometryFeatures_[b]=f}for(this.featuresRtree_&&this.featuresRtree_.load(g,i),c=0,e=h.length;c<e;c++)this.dispatchEvent(new v.Event(t.a.ADDFEATURE,h[c]))},v.prototype.bindFeaturesCollection_=function(a){var b=!1;j.a.listen(this,t.a.ADDFEATURE,function(c){b||(b=!0,a.push(c.feature),b=!1)}),j.a.listen(this,t.a.REMOVEFEATURE,function(c){b||(b=!0,a.remove(c.feature),b=!1)}),j.a.listen(a,f.a.ADD,function(a){b||(b=!0,this.addFeature(a.element),b=!1)},this),j.a.listen(a,f.a.REMOVE,function(a){b||(b=!0,this.removeFeature(a.element),b=!1)},this),this.featuresCollection_=a},v.prototype.clear=function(a){if(a){for(var b in this.featureChangeKeys_){var c=this.featureChangeKeys_[b];c.forEach(j.a.unlistenByKey)}this.featuresCollection_||(this.featureChangeKeys_={},this.idIndex_={},this.undefIdIndex_={})}else if(this.featuresRtree_)for(var d in this.featuresRtree_.forEach(this.removeFeatureInternal,this),this.nullGeometryFeatures_)this.removeFeatureInternal(this.nullGeometryFeatures_[d]);this.featuresCollection_&&this.featuresCollection_.clear(),this.featuresRtree_&&this.featuresRtree_.clear(),this.loadedExtentsRtree_.clear(),this.nullGeometryFeatures_={};var e=new v.Event(t.a.CLEAR);this.dispatchEvent(e),this.changed()},v.prototype.forEachFeature=function(a,b){if(this.featuresRtree_)return this.featuresRtree_.forEach(a,b);return this.featuresCollection_?this.featuresCollection_.forEach(a,b):void 0},v.prototype.forEachFeatureAtCoordinateDirect=function(a,b,c){var d=[a[0],a[1],a[0],a[1]];return this.forEachFeatureInExtent(d,function(d){var e=d.getGeometry();return e.intersectsCoordinate(a)?b.call(c,d):void 0})},v.prototype.forEachFeatureInExtent=function(a,b,c){if(this.featuresRtree_)return this.featuresRtree_.forEachInExtent(a,b,c);return this.featuresCollection_?this.featuresCollection_.forEach(b,c):void 0},v.prototype.forEachFeatureIntersectingExtent=function(a,b,c){return this.forEachFeatureInExtent(a,function(d){var e=d.getGeometry();if(e.intersectsExtent(a)){var f=b.call(c,d);if(f)return f}})},v.prototype.getFeaturesCollection=function(){return this.featuresCollection_},v.prototype.getFeatures=function(){var a;return this.featuresCollection_?a=this.featuresCollection_.getArray():this.featuresRtree_&&(a=this.featuresRtree_.getAll(),!q.a.isEmpty(this.nullGeometryFeatures_)&&h.a.extend(a,q.a.getValues(this.nullGeometryFeatures_))),a},v.prototype.getFeaturesAtCoordinate=function(a){var b=[];return this.forEachFeatureAtCoordinateDirect(a,function(a){b.push(a)}),b},v.prototype.getFeaturesInExtent=function(a){return this.featuresRtree_.getInExtent(a)},v.prototype.getClosestFeatureToCoordinate=function(a,b){var c=a[0],d=a[1],e=null,f=[NaN,NaN],g=Infinity,h=[-Infinity,-Infinity,Infinity,Infinity],i=b?b:o.a.TRUE;return this.featuresRtree_.forEachInExtent(h,function(a){if(i(a)){var b=a.getGeometry(),j=g;if(g=b.closestPointXY(c,d,f,g),g<j){e=a;var k=Math.sqrt(g);h[0]=c-k,h[1]=d-k,h[2]=c+k,h[3]=d+k}}}),e},v.prototype.getExtent=function(a){return this.featuresRtree_.getExtent(a)},v.prototype.getFeatureById=function(a){var b=this.idIndex_[a.toString()];return b===void 0?null:b},v.prototype.getFormat=function(){return this.format_},v.prototype.getOverlaps=function(){return this.overlaps_},v.prototype.getResolutions=function(){},v.prototype.getUrl=function(){return this.url_},v.prototype.handleFeatureChange_=function(a){var b=a.target,c=d.a.getUid(b).toString(),e=b.getGeometry();if(!e)c in this.nullGeometryFeatures_||(this.featuresRtree_&&this.featuresRtree_.remove(b),this.nullGeometryFeatures_[c]=b);else{var f=e.getExtent();c in this.nullGeometryFeatures_?(delete this.nullGeometryFeatures_[c],this.featuresRtree_&&this.featuresRtree_.insert(f,b)):this.featuresRtree_&&this.featuresRtree_.update(f,b)}var g=b.getId();if(g!==void 0){var h=g.toString();c in this.undefIdIndex_?(delete this.undefIdIndex_[c],this.idIndex_[h]=b):this.idIndex_[h]!==b&&(this.removeFromIdIndex_(b),this.idIndex_[h]=b)}else c in this.undefIdIndex_||(this.removeFromIdIndex_(b),this.undefIdIndex_[c]=b);this.changed(),this.dispatchEvent(new v.Event(t.a.CHANGEFEATURE,b))},v.prototype.isEmpty=function(){return this.featuresRtree_.isEmpty()&&q.a.isEmpty(this.nullGeometryFeatures_)},v.prototype.loadFeatures=function(a,b,c){var d,e,f=this.loadedExtentsRtree_,g=this.strategy_(a,b);for(d=0,e=g.length;d<e;++d){var h=g[d],i=f.forEachInExtent(h,function(a){return m.a.containsExtent(a.extent,h)});i||(this.loader_.call(this,h,b,c),f.insert(h,{extent:h.slice()}))}},v.prototype.removeFeature=function(a){var b=d.a.getUid(a).toString();b in this.nullGeometryFeatures_?delete this.nullGeometryFeatures_[b]:this.featuresRtree_&&this.featuresRtree_.remove(a),this.removeFeatureInternal(a),this.changed()},v.prototype.removeFeatureInternal=function(a){var b=d.a.getUid(a).toString();this.featureChangeKeys_[b].forEach(j.a.unlistenByKey),delete this.featureChangeKeys_[b];var c=a.getId();c===void 0?delete this.undefIdIndex_[b]:delete this.idIndex_[c.toString()],this.dispatchEvent(new v.Event(t.a.REMOVEFEATURE,a))},v.prototype.removeFromIdIndex_=function(a){var b=!1;for(var c in this.idIndex_)if(this.idIndex_[c]===a){delete this.idIndex_[c],b=!0;break}return b},v.Event=function(a,b){k.a.call(this,a),this.feature=b},d.a.inherits(v.Event,k.a),b.a=v},242:function(a,b){"use strict";var c={};c.all=function(){return[[-Infinity,-Infinity,Infinity,Infinity]]},c.bbox=function(a){return[a]},c.tile=function(a){return function(b,c){var d=a.getZForResolution(c),e=a.getTileRangeForExtentAndZ(b,d),f=[],g=[d,0,0];for(g[1]=e.minX;g[1]<=e.maxX;++g[1])for(g[2]=e.minY;g[2]<=e.maxY;++g[2])f.push(a.getTileCoordExtent(g));return f}},b.a=c},243:function(a,b){"use strict";b.a={ADDFEATURE:"addfeature",CHANGEFEATURE:"changefeature",CLEAR:"clear",REMOVEFEATURE:"removefeature"}}});
//# sourceMappingURL=0.bundle.js.map