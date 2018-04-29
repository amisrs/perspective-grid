(function(window, document, undefined) {

window.onload = init;


// point properties
var rays = 72;
var selectSize = 12;

// line properties
var lineWidth = 1;

// canvas properties
var scale = 1;
var numPoints = 2;
var currentPoints = 2;
var controlWidth = 277;

var canvasWidth = 1920;
var canvasHeight = 1080;
var aspectRatio = 16/9;


var pointArray = [];
    function init() {
        var controlDiv = document.getElementById('controls');
        controlWidth = controlDiv.offsetWidth;

        var canvasDiv = document.getElementById('canvasDiv');
        var canvasWidth = canvasDiv.offsetWidth - controlWidth;
        console.log("canvasWidth " + canvasWidth);

        resX = document.getElementById('resX');
        resY = document.getElementById('resY');

        resX.setAttribute('value', window.innerWidth);
        resY.setAttribute('value', window.innerHeight);

        saveBtn = document.getElementById('save');
        saveBtn.addEventListener('click', saveSVG);

        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', 'canvas');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('style', 'overflow: hidden; position: relative; top: 0px;');

        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

        canvasDiv.appendChild(svg);
        var dummyCanvas = document.getElementById('dummyCanvas');
        dummyCanvas.setAttribute('width', window.innerWidth);
        dummyCanvas.setAttribute('height', window.innerHeight);
        aspectRatio = (window.innerWidth-controlWidth) / window.innerHeight;
        resizeCanvas();

        //var doc = Raphael(0, 0, window.innerWidth, window.innerHeight);


        var widthInput = document.getElementById('resX');
        var heightInput = document.getElementById('resY');

        //default start with 2 points:
        // x = 1/3 width, y = 1/2 height
        // x = 2/3 width, y = 1/2 height

        // but we dont want to bake it into the svg, just move the element
        for(k = 0; k < numPoints; k++) {
            addPoint( (((k+1) * (canvasWidth)) / 3), (window.innerHeight) / 2 );
            //addPoint(0 ,0);

        };
        for(i = 0; i < pointArray.length; i++) {
            //pointArray[i].setAttribute('left', (window.innerWidth/scale) /3);
            var point = pointArray[i]
            pointArray[i].element.setAttribute('transform', 'scale('+scale+') translate('+(point.x)+', '+point.y+')');
        }


        var ppSelector = document.getElementById('pp');
        pp.addEventListener('input', function(e) {

        })
        window.addEventListener('resize', resizeCanvas, false);
        svg.addEventListener('click', function(e) {
            //addPoint(e.clientX / scale, e.clientY / scale);

        });
        widthInput.addEventListener('input', function(e) {
            //canvasWidth =
        })


        console.log(pointArray);
        //canvasDiv.appendChild(doc);
        //context = canvas.getContext('2d');
        //resizeCanvas();
    }

    function getSuitableCanvasSize() {

    }

    function resizeCanvas() {


        var controlDiv = document.getElementById('controls');
        var canvasDiv = document.getElementById('canvasDiv');
        var svgCanvas = document.getElementById('canvas');
        //
        canvasDiv.setAttribute('left', controlWidth);
        // canvasDiv.setAttribute('width', window.innerWidth - controlWidth);
        canvasDiv.setAttribute('height', window.innerHeight);
        canvasDiv.setAttribute('style', 'height: '+window.innerHeight+'px; width:'+(parseFloat(window.innerWidth)-parseFloat(controlWidth))+'px; left:'+controlWidth+'px; float: right');

        svgCanvas.setAttribute('left', controlWidth);
        svgCanvas.setAttribute('width', '100%');
        svgCanvas.setAttribute('height', '100%');

        for(i = 0; i < pointArray.length; i++) {
            var point = pointArray[i];
            //pointArray[i].setAttribute('left', (window.innerWidth/scale) /3);
            console.log("window.innerWidth: " + window.innerWidth);
            var targetX = point.xpct * canvasDiv.offsetWidth;
            var targetY = point.ypct * canvasDiv.offsetHeight;
            point.element.setAttribute('transform', 'scale('+scale+') translate('+(targetX)+', '+(targetY)+')');
            console.log("Shifted point to target X: " + targetX);
        }


    }

    function addPoint(x, y) {
        console.log("Adding point at: " + x + ", " + y);

        var pointContainer = {};

        var canvas = document.getElementById('canvas');
        var canvasDiv = document.getElementById('canvasDiv');
        var starPath = "";
        rayAngleGap = (2 * Math.PI) / rays;


        for(i = 0; i < rays; i++) {
            // we're gonna move the whole element
            starPath += lineFromPoint(0, 0, i * rayAngleGap, starPath);
        }
        //console.log(starPath);
        //var point = doc.path(path);

        var point2 = createPath(starPath);
        point2.setAttribute('transform', 'scale('+scale+')');
        point2.addEventListener('click', function(e) {
            console.log(e);
        })
        canvas.appendChild(point2);
        console.log(x);
        console.log(canvasDiv.offsetWidth);

        pointContainer.x = x;
        pointContainer.xpct = x / canvasDiv.offsetWidth;
        pointContainer.y = y;
        pointContainer.ypct = y / canvasDiv.offsetHeight;

        pointContainer.element = point2;
        pointArray.push(pointContainer);
    }

    function createPath(d) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('style', '');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#000000');
        path.setAttribute('d', d);

        return path;
    }


    function lineFromPoint(x, y, angle, path) {
        //need to find max distance from point to viewport edge
        maxLength = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));

        destX = x  + maxLength * Math.cos(angle);
        destY = y + maxLength * Math.sin(angle);

        return ("M"+x+","+y+"L"+destX+","+destY);
        //ctx.moveTo(x, y);
        //ctx.lineTo(destX, destY);
        //ctx.stroke();

    }

    //https://stackoverflow.com/questions/15254659/a-generic-js-function-to-move-any-svg-element
    function moveSection(idStr, xOffset, yOffset) {
    var domElemnt = document.getElementById(idStr);
        if (domElemnt) {
            var transformAttr = ' translate(' + xOffset + ',' + yOffset + ')';
            domElemnt.setAttribute('transform', transformAttr);
        }
    }

    //https://gist.github.com/Caged/4649511
    //https://stackoverflow.com/questions/27230293/how-to-convert-svg-to-png-using-html5-canvas-javascript-jquery-and-save-on-serve/27232525
    function saveSVG() {
        console.log('Saving...');
        var svg = document.getElementById('canvas');
        var dummyCanvas = document.getElementById('dummyCanvas');
        var svgText = svg.outerHTML;
        var xml = new XMLSerializer().serializeToString(svg);
        var data = 'data:image/svg+xml;base64,' + btoa(xml);
        var img = new Image();

        var svgBlob = new Blob([svgText], {type:'image/svg+xml;charset=utf-8'});

        drawInDummyCanvas(dummyCanvas.getContext('2d'), svgBlob, function() {
            console.log(dummyCanvas.toDataURL());
        });

        //
        // console.log(data);
        //
        // img.setAttribute('src', data);
        //
        // var dummyLink = document.createElement('a');
        // dummyLink.setAttribute('href', data);
        // dummyLink.setAttribute('download', 'grid.png');
        // dummyLink.textContent = "download";
        //
        // document.body.appendChild(dummyLink);
        // dummyLink.click();
    }

    function drawInDummyCanvas(context, svgBlob, callback) {
        var domURL = self.URL || self.webkitURL || self; // this is url of the current dom
        var url = domURL.createObjectURL(svgBlob);
        var img = new Image();

        img.onload = function() {
            context.drawImage(this, 0, 0);
            domURL.revokeObjectURL(url);
            callback(this);
        }
        img.src = url;

    }


})(window, document, undefined);
