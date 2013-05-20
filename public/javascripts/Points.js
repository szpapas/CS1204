Function.prototype.getBindToFn = function(currentThis) {  
  var t = this;  
  return function() {  
      return t.apply(currentThis, arguments);  
  };  
}

function Point (x, y) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
}

Point.prototype = new OpenLayers.Geometry.Point(0,0);

Point.prototype.isValid = function() {
    if((this.x != null) && (this.y != null) && (this.x != NaN) && (this.y != NaN))
        return( true );
    else
        return( false );
}

Point.prototype.geoIsValid = function() {
    if( this.isValid() && (this.x >= -180) && (this.x <= 180) && (this.y >= -90) && (this.y <= 90)) 
        return( true );
    else
        return( false );
}

/**
 *    Geo Constants
 */
// Point.EARTH_RADIUS = 3958.75;    // in miles
Point.EARTH_RADIUS = 6370.856; // in km
Point.DEG2RAD =  0.01745329252;  // factor to convert degrees to radians (PI/180)
Point.RAD2DEG = 57.29577951308;

/**
 *    Method: geoDistanceTo
 *
 *    Parameters:
 *    point - {<Point>}
 *
 *    Returns:
 *    Great Circle distance (in miles) to Point. 
 *    Coordinates must be in decimal degrees.
 *    
 *    Reference:
 *    Williams, Ed, 2000, "Aviation Formulary V1.43" web page
 *    http://williams.best.vwh.net/avform.htm
 */
Point.prototype.geoDistanceTo = function( point ) {
var x = [];
var y = [];

    if( this.geoIsValid() && point.geoIsValid()) {
        x[0] = this.x * Point.DEG2RAD;    y[0] = this.y * Point.DEG2RAD;
        x[1] = point.x * Point.DEG2RAD;    y[1] = point.y * Point.DEG2RAD;
        
        var a = Math.pow( Math.sin(( y[1]-y[0] ) / 2.0 ), 2);
        var b = Math.pow( Math.sin(( x[1]-x[0] ) / 2.0 ), 2);
        var c = Math.pow(( a + Math.cos( y[1] ) * Math.cos( y[0] ) * b ), 0.5);
    
        return ( 2 * Math.asin( c ) * Point.EARTH_RADIUS );
    } else
        return null;
}


Point.prototype.geoBearingTo = function( point ) {
var x = new Array(2);
var y = new Array(2);
var bearing;
var adjust;

    if( this.geoIsValid() && point.geoIsValid()) {
        x[0] = this.x * Point.DEG2RAD;    y[0] = this.y * Point.DEG2RAD;
        x[1] = point.x * Point.DEG2RAD;    y[1] = point.y * Point.DEG2RAD;

         var a = Math.cos(y[1]) * Math.sin(x[1] - x[0]);
        var b = Math.cos(y[0]) * Math.sin(y[1]) - Math.sin(y[0]) 
            * Math.cos(y[1]) * Math.cos(x[1] - x[0]);
        
        if((a == 0) && (b == 0)) {
            bearing = 0;
            return bearing;
        }
        
        if( b == 0) {
            if( a < 0)  
                bearing = 270;
            else
                bearing = 90;
            return bearing;
        }
         
        if( b < 0) 
            adjust = Math.PI;
        else {
            if( a < 0) 
                adjust = 2 * Math.PI;
            else
                adjust = 0;
        }
        bearing = (Math.atan(a/b) + adjust) * Point.RAD2DEG;
        return bearing;
    } else
        return null;
}


/**
 *
 */
Point.prototype.geoWaypoint = function( distance, bearing ) {
var wp = new Point( 0, 0 );

    // Math.* trig functions require angles to be in radians
    var x = this.x * Point.DEG2RAD;
    var y = this.y * Point.DEG2RAD;
    var radBearing = bearing * Point.DEG2RAD;

    // Convert arc distance to radians
    var c = distance / Point.EARTH_RADIUS;

    wp.y = Math.asin( Math.sin(y) * Math.cos(c) + Math.cos(y) * Math.sin(c) * Math.cos(radBearing)) * Point.RAD2DEG;

    var a = Math.sin(c) * Math.sin(radBearing);
    var b = Math.cos(y) * Math.cos(c) - Math.sin(y) * Math.sin(c) * Math.cos(radBearing)

    if( b == 0 ) 
        wp.x = this.x;
    else
        wp.x = this.x + Math.atan(a/b) * Point.RAD2DEG;

    return wp;
}

// end of point function

/**
 * support geom: MultiLineString
 */
DynamicEffectLineVector = OpenLayers.Class(OpenLayers.Feature.Vector, {

    internal : 50, // 50ms
   
    speed : 5, // 5m/50ms, 100m/s
   
    vectorLayer : null,
   
    components : null,
   
    currentPointIndex : null,
   
    currentLineIndex : null,
   
    startPoint : null,
   
    stopPoint : null,
   
    currentTempPoint : null,
    
    ptFeature : null,
    
    ptStyle : null,
   
    timer : null,
    
    loopable  : null, 
   
    // event, fire when new point added
    pointAdded : null,
   
    // 'start', 'run', 'stop', 'end'
    dynamicState : 'start',
   
    // here state management
    orders : {
           
        start : {
            guardFn : function() {
                return this.dynamicState != 'start';
            },
            changeState : function() {
                this.dynamicState = 'run'; // start ---> run
            }
        },
       
        stop : {
            guardFn : function() {
                return this.dynamicState != 'run';
            },
            changeState : function() {
                this.dynamicState = 'stop'; // run ---> stop
            }
        },
       
        continueFn : {
            guardFn : function() {
                return this.dynamicState != 'stop';
            },
            changeState : function() {
                this.dynamicState = 'run'; // stop ---> run
            }
        },
       
        restart : {
            guardFn : function() {
                return this.dynamicState == 'start';
            },
            changeState : function() {
                this.dynamicState = 'run'; // * except start ---> run
            }
        }
    },
   
    initialize : function(geom, attributes) {
       
        if(geom instanceof OpenLayers.Geometry.LineString) {
            geom = new OpenLayers.Geometry.MultiLineString([geom]);
        }
       
        var style = this.getStyle();
        style.label = attributes.name;
        style.strokeColor  = attributes.color;
        style.fontColor = attributes.color;
       
        OpenLayers.Feature.Vector.prototype.initialize.apply(this, [geom, attributes, style]);
       
        this.components = this.geometry.components;
       
        this.initVariable();
        
        //init point feature
        ptStyle = this.getPtStyle();
        
    },
   
    // public
    setVectorLayer : function(vectorLayer) {
        this.vectorLayer = vectorLayer;
    },
   
    // public
    executeOrder : function(order) { // start, stop, continueFn, restart
       
        var guardFn = this.orders[order].guardFn.getBindToFn(this);
        var changeState = this.orders[order].changeState.getBindToFn(this);

        if(guardFn())
            return;

        this[order]();
       
        changeState();
    },
   
    /*-- private methods -------------------------------------------------------------------------------*/
   
    initVariable : function() {
        this.currentPointIndex = 0;
        this.currentLineIndex = 0;
        this.startPoint = this.components[0].components[0];
        this.stopPoint = this.components[0].components[1];
        this.currentTempPoint = this.startPoint;
        this.loopable = 1;
    },
   
    start : function() {
   
        var line1 = new OpenLayers.Geometry.LineString(this.startPoint, this.startPoint);
        this.geometry = new OpenLayers.Geometry.MultiLineString([line1]);
        this.vectorLayer.addFeatures([this]);
       
        this.timeFn();
    },
   
    stop : function() {
        clearTimeout(this.timer);
    },
   
    continueFn : function() {
        this.timeFn();
    },
   
    restart : function() {
       
        this.stop();
       
        this.vectorLayer.removeFeatures([this]);
        this.initVariable();
       
        this.start();
    },
    
    movePoint : function() {
      if (this.ptFeature != null) this.vectorLayer.removeFeatures(this.ptFeature);
      this.ptFeature = new OpenLayers.Feature.Vector(this.currentTempPoint, {fid: 0}, ptStyle );
      this.vectorLayer.addFeatures([this.ptFeature]);
    },
   
    timeFn : function() {
   
        this.currentTempPoint = this.getNextPoint(this.currentTempPoint, this.stopPoint);
        this.geometry.components[this.currentLineIndex].addPoint(this.currentTempPoint);
        this.vectorLayer.drawFeature(this);
        
        
        this.movePoint();
        
        if(this.currentTempPoint.equals(this.stopPoint)) {            
           
            var currentLine = this.components[this.currentLineIndex];
           
            // last point on current line
            if(this.currentTempPoint.equals(currentLine.components[currentLine.components.length - 1])) {
               
                // last line, end
                if(this.currentLineIndex == this.components.length - 1) {
                    this.dynamicState = 'end';
                    
                    if (this.loopable == 1) {  this.restart(); }
                    
                    return;
                }
               
                this.currentLineIndex++;
                this.currentPointIndex = 0;
               
                this.startPoint = this.components[this.currentLineIndex].components[0];
                this.stopPoint = this.components[this.currentLineIndex].components[1];
                this.currentTempPoint = this.startPoint;
               
                var newLine = new OpenLayers.Geometry.LineString(this.startPoint, this.startPoint);
                this.geometry.addComponent(newLine);
               
            } else {
               
                this.startPoint = this.stopPoint;
                this.currentPointIndex++;
                this.stopPoint = this.components[this.currentLineIndex].components[this.currentPointIndex + 1];
            }
            
        }
       
        this.timer = setTimeout(this.timeFn.getBindToFn(this), this.internal);

        if(this.pointAdded) {
            this.pointAdded(this.currentTempPoint); // fire event
        }

    },
   
    getNextPoint : function(currentTempPoint, stopPoint) {
       
        var nextPoint = this.getPointOnLineByDistance(currentTempPoint, stopPoint, this.speed);
       
        var x_current_stop = Math.abs(stopPoint.x - currentTempPoint.x);
        var x_current_next = Math.abs(nextPoint.x - currentTempPoint.x);
        var y_current_stop = Math.abs(stopPoint.y - currentTempPoint.y);
        var y_current_next = Math.abs(nextPoint.y - currentTempPoint.y);
       
        // deviation 0.000001 lonlat, about 0.01m
        var deviation = 1e-7;
        if(x_current_next - x_current_stop > deviation || y_current_next - y_current_stop > deviation) {
            return stopPoint;
        }
       
        return nextPoint;
    },
   
    getPointOnLineByDistance : function(p1, p2, distance) {
       
        var ppp1 = new Point(p1.x, p1.y);
        var ppp2 = new Point(p2.x, p2.y);
       
        var bearing = ppp1.geoBearingTo(ppp2);
        var ppp3 = ppp1.geoWaypoint(distance / 1000, bearing);
       
        return new OpenLayers.Geometry.Point(ppp3.x, ppp3.y);
    },
   
    getStyle : function() {
       
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
       
        style.strokeWidth = 3;
       
        style.fontSize = '15px';
        style.fontFamily = '楷体_GB2312';
        style.fontWeight = 'bold';
        style.labelAlign = 'rm';
       
        return style;
    },
    
    getPtStyle : function() {
       
        var style = new OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        
        style.externalGraphic = '/images/blue-ball-1.png?1234'; 
        //style.backgroundXOffset = 0;
        //style.backgroundYOffset = 0;
        style.graphicWidth = 12;
        style.graphicHeight = 12;
        style.graphicZIndex = MARKER_Z_INDEX;
        style.backgroundGraphicZIndex= SHADOW_Z_INDEX;
        style.fillOpacity = 0.8;
        //style.fillColor = "#ee4400";
        //style.graphicName = "star",
        //style.pointRadius = 8;
       
        return style;
    },
});

DynamicEffectLineVectorToolbar = Ext.extend(Ext.Toolbar, {
   
    dynamicVector : null,
   
    initComponent : function() {
       
        DynamicEffectLineVectorToolbar.superclass.initComponent.call(this);
       
        var t = this;
       
        var btnStart = new Ext.Button({
            text : '开始',
            handler : function() {
                t.dynamicVector.executeOrder('start');
            }
        });
       
        var btnStop = new Ext.Button({
            text : '停止',
            handler : function() {
                t.dynamicVector.executeOrder('stop');
            }
        });
       
        var btnContinue = new Ext.Button({
            text : '继续',
            handler : function() {
                t.dynamicVector.executeOrder('continueFn');
            }
        });
       
        var btnRestart = new Ext.Button({
            text : '重新开始',
            handler : function() {
                t.dynamicVector.executeOrder('restart');
            }
        });
       
        var btnDestroy = new Ext.Button({
            text : '清除',
            handler : function() {
                t.dynamicVector.destroy();
            }
        });
       
        this.add(btnStart);
        this.add(btnStop);
        this.add(btnContinue);
        this.add(btnRestart);
        this.add(btnDestroy);
    }
});
