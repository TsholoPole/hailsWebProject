/** WebGazer.js: Scalable Webcam EyeTracking Using User Interactions 
 * 
 * Copyright (c) 2016-2018, Brown HCI Group 

* Licensed under GPLv3. Companies with a valuation of less than $10M can use WebGazer.js under LGPLv3. 
*/

(function(window) {
    'use strict';
    
    window.webgazer = window.webgazer || {};

    const defaultWindowSize = 8;
    const equalizeStep = 5;
    const threshold = 80;
    const minCorrelation = 0.78;
    const maxCorrelation = 0.85;

    /**
     * Constructor for BlinkDetector
     * @param blinkWindow
     * @constructor
     */
    webgazer.BlinkDetector = function(blinkWindow) {
        //determines number of previous eyeObj to hold onto
        this.blinkWindow = blinkWindow || defaultWindowSize;
        this.blinkData = new webgazer.util.DataWindow(this.blinkWindow);
    };

    webgazer.BlinkDetector.prototype.extractBlinkData = function(eyesObj) {
        const eye = eyesObj.right;
        const grayscaled = webgazer.util.grayscale(eye.patch.data, eye.width, eye.height);
        const equalized = webgazer.util.equalizeHistogram(grayscaled, equalizeStep, grayscaled);
        const thresholded = webgazer.util.threshold(equalized, threshold);
        return {
            data: thresholded,
            width: eye.width,
            height: eye.height,
        };
    }

    webgazer.BlinkDetector.prototype.isSameEye = function(oldEye, newEye) {
        return (oldEye.width === newEye.width) && (oldEye.height === newEye.height);
    }

    webgazer.BlinkDetector.prototype.isBlink = function(oldEye, newEye) {
        let correlation = 0;
        for (let i = 0; i < this.blinkWindow; i++) {
            const data = this.blinkData.get(i);
            const nextData = this.blinkData.get(i + 1);
            if (!this.isSameEye(data, nextData)) {
                return false;
            }
            correlation += webgazer.util.correlation(data.data, nextData.data);
        }
        correlation /= this.blinkWindow;
        return correlation > minCorrelation && correlation < maxCorrelation;
    }

    /**
     *
     * @param eyesObj
     * @returns {*}
     */
    webgazer.BlinkDetector.prototype.detectBlink = function(eyesObj) {
        if (!eyesObj || !webgazer.params.blinkDetectionOn) {
            return eyesObj;
        }

        const data = this.extractBlinkData(eyesObj);
        this.blinkData.push(data);

        eyesObj.left.blink = false;
        eyesObj.right.blink = false;

        if (this.blinkData.length < this.blinkWindow) {
            return eyesObj;
        }

        if (this.isBlink()) {
            eyesObj.left.blink = true;
            eyesObj.right.blink = true;
        }

        return eyesObj;
    };

    /**
     *
     * @param value
     * @returns {webgazer.BlinkDetector}
     */
    webgazer.BlinkDetector.prototype.setBlinkWindow = function(value) {
        if (webgazer.utils.isInt(value) && value > 0) {
            this.blinkWindow = value;
        }
        return this;
    }

}(window));


(function(window) {
    'use strict';

    window.webgazer = window.webgazer || {};
    webgazer.tracker = webgazer.tracker || {};
    webgazer.util = webgazer.util || {};
    webgazer.params = webgazer.params || {};

    /**
     * Constructor of ClmGaze,
     * initialize ClmTrackr object
     * @constructor
     */
    var ClmGaze = function() {
        this.clm = new clm.tracker(webgazer.params.camConstraints);
        this.clm.init(pModel);
        var F = [ [1, 0, 0, 0, 1, 0],
                  [0, 1, 0, 0, 0, 1],
                  [0, 0, 1, 0, 1, 0],
                  [0, 0, 0, 1, 0, 1],
                  [0, 0, 0, 0, 1, 0],
                  [0, 0, 0, 0, 0, 1]];
        //Parameters Q and R may require some fine tuning
        var Q = [ [1/4,  0, 0, 0,  1/2,   0],
                  [0, 1/4,  0, 0,    0, 1/2],
                  [0, 0,   1/4, 0, 1/2,   0],
                  [0, 0,   0,  1/4,  0, 1/2],
                  [1/2, 0, 1/2, 0,    1,  0],
                  [0, 1/2,  0,  1/2,  0,  1]];// * delta_t
        var delta_t = 1/10; // The amount of time between frames
        Q = numeric.mul(Q, delta_t);
        var H = [ [1, 0, 0, 0, 0, 0],
                  [0, 1, 0, 0, 0, 0],
                  [0, 0, 1, 0, 0, 0],
                  [0, 0, 0, 1, 0, 0]];
        var pixel_error = 6.5; //We will need to fine tune this value
        //This matrix represents the expected measurement error
        var R = numeric.mul(numeric.identity(4), pixel_error);

        var P_initial = numeric.mul(numeric.identity(6), 0.0001); //Initial covariance matrix
        var x_initial = [[200], [150], [250], [180], [0], [0]]; // Initial measurement matrix

        this.leftKalman = new self.webgazer.util.KalmanFilter(F, H, Q, R, P_initial, x_initial);
        this.rightKalman = new self.webgazer.util.KalmanFilter(F, H, Q, R, P_initial, x_initial);
    };

    webgazer.tracker.ClmGaze = ClmGaze;

    /**
     * Isolates the two patches that correspond to the user's eyes
     * @param  {Canvas} imageCanvas - canvas corresponding to the webcam stream
     * @param  {Number} width - of imageCanvas
     * @param  {Number} height - of imageCanvas
     * @return {Object} the two eye-patches, first left, then right eye
     */
    ClmGaze.prototype.getEyePatches = function(imageCanvas, width, height) {

        if (imageCanvas.width === 0) {
            return null;
        }

        var positions = this.clm.track(imageCanvas);
        var score = this.clm.getScore();

        if (!positions) {
            return false;
        }

        //Fit the detected eye in a rectangle
        var leftOriginX = (positions[23][0]);
        var leftOriginY = (positions[24][1]);
        var leftWidth = (positions[25][0] - positions[23][0]);
        var leftHeight = (positions[26][1] - positions[24][1]);
        var rightOriginX = (positions[30][0]);
        var rightOriginY = (positions[29][1]);
        var rightWidth = (positions[28][0] - positions[30][0]);
        var rightHeight = (positions[31][1] - positions[29][1]);

        //Apply Kalman Filtering
        var leftBox = [leftOriginX, leftOriginY, leftOriginX + leftWidth, leftOriginY + leftHeight];
        if (webgazer.params.smoothEyeBB){
          leftBox = this.leftKalman.update(leftBox);
        }
        leftOriginX = Math.round(leftBox[0]);
        leftOriginY = Math.round(leftBox[1]);
        leftWidth = Math.round(leftBox[2] - leftBox[0]);
        leftHeight = Math.round(leftBox[3] - leftBox[1]);

        //Apply Kalman Filtering
        var rightBox = [rightOriginX, rightOriginY, rightOriginX + rightWidth, rightOriginY + rightHeight];
        if (webgazer.params.smoothEyeBB){
          rightBox = this.rightKalman.update(rightBox);
        }
        rightOriginX = Math.round(rightBox[0]);
        rightOriginY = Math.round(rightBox[1]);
        rightWidth = Math.round(rightBox[2] - rightBox[0]);
        rightHeight = Math.round(rightBox[3] - rightBox[1]);

        if (leftWidth === 0 || rightWidth === 0){
          console.log('an eye patch had zero width');
          return null;
        }

        if (leftHeight === 0 || rightHeight === 0){
          console.log('an eye patch had zero height');
          return null;
        }

        var eyeObjs = {};
        eyeObjs.positions = positions;

        var leftImageData = imageCanvas.getContext('2d').getImageData(leftOriginX, leftOriginY, leftWidth, leftHeight);
        eyeObjs.left = {
            patch: leftImageData,
            imagex: leftOriginX,
            imagey: leftOriginY,
            width: leftWidth,
            height: leftHeight
        };

        var rightImageData = imageCanvas.getContext('2d').getImageData(rightOriginX, rightOriginY, rightWidth, rightHeight);
        eyeObjs.right = {
            patch: rightImageData,
            imagex: rightOriginX,
            imagey: rightOriginY,
            width: rightWidth,
            height: rightHeight
        };

        return eyeObjs;
    };

    /**
     * Reset the tracker to default values
     */
    ClmGaze.prototype.reset = function(){
        this.clm.reset();
    }

    /**
     * The Js_objectdetectGaze object name
     * @type {string}
     */
    ClmGaze.prototype.name = 'clmtrackr';

}(window));

(function(window) {
    'use strict';

    window.webgazer = window.webgazer || {};
    webgazer.tracker = webgazer.tracker || {};

    /**
     * Constructor of TrackingjsGaze object
     * @constructor
     */
    var TrackingjsGaze = function() {};

    webgazer.tracker.TrackingjsGaze = TrackingjsGaze;

    /**
     * Isolates the two patches that correspond to the user's eyes
     * @param  {Canvas} imageCanvas - canvas corresponding to the webcam stream
     * @param  {Number} width - of imageCanvas
     * @param  {Number} height - of imageCanvas
     * @return {Object} the two eye-patches, first left, then right eye
     */
    TrackingjsGaze.prototype.getEyePatches = function(imageCanvas, width, height) {

        if (imageCanvas.width === 0) {
            return null;
        }

        //current ImageData that correspond to the working image. 
        //It can be the whole canvas if the face detection failed or only the upper half of the face to avoid unnecessary computations
        var workingImage = imageCanvas.getContext('2d').getImageData(0,0,width,height);

        var face = this.detectFace(workingImage, width, height);

        //offsets of the working image from the top left corner of the video canvas
        var offsetX = 0;
        var offsetY = 0;

        //if face has been detected
        if (face.length > 0 && !isNaN(face[0]) && !isNaN(face[1]) && !isNaN(face[2]) && !isNaN(face[3])){
            //working image is restricted on upper half of detected face
            workingImage = imageCanvas.getContext('2d').getImageData(Math.floor(face[0]), Math.floor(face[1]), Math.floor(face[2]), Math.floor(face[3]/2));
            width = Math.floor(face[2]);
            height = Math.floor(face[3] / 2);
            //offset from detected face
            offsetX = Math.floor(face[0]);
            offsetY = Math.floor(face[1]);  
        }

        var eyes = this.detectEyes(workingImage, width, height);
        console.log(eyes);
        if (eyes === null){
            return null;
        }

        var eyeObjs = {};
        var leftImageData = imageCanvas.getContext('2d').getImageData(Math.floor(eyes[0][0])+offsetX, Math.floor(eyes[0][1])+offsetY, Math.floor(eyes[0][2]), Math.floor(eyes[0][3]));
        eyeObjs.left = {
            patch: leftImageData,
            imagex: eyes[0][0] + offsetX,
            imagey: eyes[0][1] + offsetY,
            width: eyes[0][2],
            height: eyes[0][3]
        };
 
        var rightImageData = imageCanvas.getContext('2d').getImageData(Math.floor(eyes[1][0])+offsetX, Math.floor(eyes[1][1])+offsetY, Math.floor(eyes[1][2]), Math.floor(eyes[1][3]));
        eyeObjs.right = {
            patch: rightImageData,
            imagex: eyes[1][0]+offsetX,
            imagey: eyes[1][1]+offsetY,
            width: eyes[1][2],
            height: eyes[1][3]        
        };
      
        if (leftImageData.width === 0 || rightImageData.width === 0) {
            console.log('an eye patch had zero width');
            return null;
        }

        return eyeObjs;
    };

    /**
     * Performs eye detection on the passed working image
     * @param {ImageData} workingImage - either the whole canvas or the upper half of the head
     * @param {Number} width - width of working image
     * @param {Number} height - height of working image
     * @return {Array} eyes - array of rectangle information. 
     */
    TrackingjsGaze.prototype.detectEyes = function(workingImage, width, height){         
        var eyes = [];
        var intermediateEyes = [];
        var pixels = workingImage.data;
        tracking.ViolaJones.detect(pixels, width, height, 0.5, 2, 1.7, 0.1, tracking.ViolaJones.classifiers['eye']).forEach(function(rect){
                var intermediateEye = [rect.x, rect.y, rect.width, rect.height];
                intermediateEyes.push(intermediateEye);
        });
        if (intermediateEyes.length>1){
            //find the two eyes with the shortest y distance
            var minimumYDistance = 1000;
            var eyes = [];

            for(var i=0; i < intermediateEyes.length; i++){
                for(var j = i+1; j < intermediateEyes.length; j++){
                    var YDistance = Math.abs(Math.floor(intermediateEyes[i][1]) - Math.floor(intermediateEyes[j][1]));
                    if(YDistance <= minimumYDistance){
                        minimumYDistance = YDistance;
                        eyes[0] = intermediateEyes[i];
                        eyes[1] = intermediateEyes[j];
                    }                       
                }
            }

            eyes.sort(function(a,b) {
              return a[0]-b[0]
            });
            return eyes;
        }
        else{
            console.log('tracking.js could not detect two eyes in the video');
            return null;
        }
    };

    /**
     * Performs face detection on the passed canvas
     * @param {ImageData} workingImage - whole video canvas
     * @param {Number} width - width of imageCanvas
     * @param {Number} height - height of imageCanvas
     * @return {Array} face - array of rectangle information
     */
    TrackingjsGaze.prototype.detectFace = function(workingImage, width, height){
        var intermediateFaces = [];
        var face = [];

        // Detect faces in the image
        var pixels = workingImage.data;
        tracking.ViolaJones.detect(pixels, width, height, 2, 1.25, 2, 0.1, tracking.ViolaJones.classifiers['face']).forEach(function(rect){
                var intermediateFace = [rect.x, rect.y, rect.width, rect.height];
                intermediateFaces.push(intermediateFace);
        });
        face = this.findLargestRectangle(intermediateFaces);
        return face;
    };

    /**
     * Goes through an array of rectangles and returns the one with the largest area
     * @param {Array.<Array.<Number>>} rectangles - array of arrays of format [xCoordinate, yCoordinate, width, height]
     * @return {Array} largestRectangle = [xCoordinate, yCoordinate, width, height]
     */
    TrackingjsGaze.prototype.findLargestRectangle = function(rectangles){
        var largestArea = 0;
        var area = 0;
        var largestRectangle = [];
        for (var i = 0; i < rectangles.length; ++i){
            area = rectangles[i][2] * rectangles[i][3];
            if (area > largestArea){
                largestArea = area;
                largestRectangle = rectangles[i];
            }
        }
        return largestRectangle;
    };

    /**
     * Reset the tracker to default values
     */
    TrackingjsGaze.prototype.reset = function(){
        console.log( "Unimplemented; Tracking.js has no obvious reset function" );
    }

    /**
     * The TrackingjsGaze object name
     * @type {string}
     */
    TrackingjsGaze.prototype.name = 'trackingjs';
    
}(window));

(function(window) {
    'use strict';

    window.webgazer = window.webgazer || {};
    webgazer.tracker = webgazer.tracker || {};

    /**
     * Constructor of Js_objectdetectGaze
     * @constructor
     */
    var Js_objectdetectGaze = function() {};

    webgazer.tracker.Js_objectdetectGaze = Js_objectdetectGaze;

    /**
     * Isolates the two patches that correspond to the user's eyes
     * @param  {Canvas} imageCanvas - canvas corresponding to the webcam stream
     * @param  {Number} width - of imageCanvas
     * @param  {Number} height - of imageCanvas
     * @return {Object} the two eye-patches, first left, then right eye
     */
    Js_objectdetectGaze.prototype.getEyePatches = function(imageCanvas, width, height) {

        if (imageCanvas.width === 0) {
            return null;
        }

        //current ImageData that correspond to the working image. 
        //It can be the whole canvas if the face detection failed or only the upper half of the face to avoid unnecessary computations
        var workingImage = imageCanvas.getContext('2d').getImageData(0,0,width,height);

        var face = this.detectFace(imageCanvas, width, height);

        //offsets of the working image from the top left corner of the video canvas
        var offsetX = 0;
        var offsetY = 0;

        //if face has been detected
        if (face.length > 0 && !isNaN(face[0]) && !isNaN(face[1]) && !isNaN(face[2]) && !isNaN(face[3])){
            //working image is restricted on upper half of detected face
            workingImage = imageCanvas.getContext('2d').getImageData(Math.floor(face[0]), Math.floor(face[1]), Math.floor(face[2]), Math.floor(face[3]/2));
            width = Math.floor(face[2]);
            height = Math.floor(face[3]/2);
            //offset from detected face
            offsetX = Math.floor(face[0]);
            offsetY = Math.floor(face[1]);  
        }

        var eyes = this.detectEyes(workingImage, width, height);
        if (eyes === null){
            return null;
        }

        var eyeObjs = {};
        var leftImageData = imageCanvas.getContext('2d').getImageData(Math.floor(eyes[0][0])+offsetX, Math.floor(eyes[0][1])+offsetY, Math.floor(eyes[0][2]), Math.floor(eyes[0][3]));
        eyeObjs.left = {
            patch: leftImageData,
            imagex: eyes[0][0] + offsetX,
            imagey: eyes[0][1] + offsetY,
            width: eyes[0][2],
            height: eyes[0][3]
        };
 
        var rightImageData = imageCanvas.getContext('2d').getImageData(Math.floor(eyes[1][0])+offsetX, Math.floor(eyes[1][1])+offsetY, Math.floor(eyes[1][2]), Math.floor(eyes[1][3]));
        eyeObjs.right = {
            patch: rightImageData,
            imagex: eyes[1][0]+offsetX,
            imagey: eyes[1][1]+offsetY,
            width: eyes[1][2],
            height: eyes[1][3]        
        };
      
        if (leftImageData.width === 0 || rightImageData.width === 0) {
            console.log('an eye patch had zero width');
            return null;
        }

        return eyeObjs;
    };

    /**
     * Performs eye detection on the passed workingImage
     * @param {ImageData} workingImage - either the whole canvas or the upper half of the head
     * @param {Number} workingImageWidth - width of working image
     * @param {Number} workingImageHeight - height of working image
     * @return {Array} eyes - array of rectangle information.
     */
    Js_objectdetectGaze.prototype.detectEyes = function(workingImage, workingImageWidth, workingImageHeight){    

        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = workingImageWidth;
        tempCanvas.height = workingImageHeight;
        tempCanvas.getContext('2d').putImageData(workingImage,0,0);
        
        //Following js_objectdetect conventions resize workingImage
        var eyes = [];
        var intermediateEyes = [];
        var width = ~~(60 * workingImageWidth / workingImageHeight);
        var height = 60;
        var detector = new objectdetect.detector(width, height, 1.1, objectdetect.eye);
        intermediateEyes = detector.detect(tempCanvas, 0);
        eyes = this.mergeRectangles(intermediateEyes);
        if (typeof eyes !== 'undefined'){
            for(var i=0; i< eyes.length; i++){
                // Rescale coordinates from detector to video coordinate space:
                eyes[i][0] *= workingImageWidth / detector.canvas.width;
                eyes[i][1] *= workingImageHeight / detector.canvas.height;
                eyes[i][2] *= workingImageWidth / detector.canvas.width;
                eyes[i][3] *= workingImageHeight / detector.canvas.height;
            }

            eyes.sort(function(a,b) {
              return a[0]-b[0]
            });
            return eyes;    
        }       
        else{
            console.log('js_objectdetect could not detect two eyes in the video');
            return null;
        }
    };

    /**
     * Performs face detection on the passed canvas
     * @param {Canvas} imageCanvas - whole video canvas
     * @param {Number} workingImageWidth - width of imageCanvas
     * @param {Number} workingImageHeight - height of imageCanvas
     * @return {Array.<Array.<Number>>} face - array of rectangle information
     */
    Js_objectdetectGaze.prototype.detectFace = function(imageCanvas, workingImageWidth, workingImageHeight){
        var intermediateFaces = [];
        var face = [];
        var width = ~~(60 * workingImageWidth / workingImageHeight);
        var height = 60;
        var detector = new objectdetect.detector(width, height, 1.1, objectdetect.frontalface_alt);
        intermediateFaces = detector.detect(imageCanvas, 1);
        face = this.findLargestRectangle(intermediateFaces);
        // Rescale coordinates from detector to video coordinate space:
        face[0] *= workingImageWidth / detector.canvas.width;
        face[1] *= workingImageHeight / detector.canvas.height;
        face[2] *= workingImageWidth / detector.canvas.width;
        face[3] *= workingImageHeight / detector.canvas.height;
        return face;
    };

    /**
     * Goes through an array of rectangles and returns the one with the largest area
     * @param {Array.<Array.<Number>>} rectangles - array of arrays of format [xCoordinate, yCoordinate, width, height]
     * @return {Array} largestRectangle = [xCoordinate, yCoordinate, width, height]
     */
    Js_objectdetectGaze.prototype.findLargestRectangle = function(rectangles){
        var largestArea = 0;
        var area = 0;
        var largestRectangle = [];
        for (var i = 0; i < rectangles.length; ++i){
            area = rectangles[i][2] * rectangles[i][3];
            if (area > largestArea){
                largestArea = area;
                largestRectangle = rectangles[i];
            }
        }
        return largestRectangle;
    };

    /**
     * Merges detected rectangles in clusters
     * Taken from trackingjs and modified slightly to reflect that rectangles are arrays and not objects
     * @param  {Array.<Array.<Number>>} rects - rectangles to me clustered
     * @return {Array.<Array.<Number>>} result merged rectangles
     */
    Js_objectdetectGaze.prototype.mergeRectangles = function(rects){
        var disjointSet = new tracking.DisjointSet(rects.length);

        for (var i = 0; i < rects.length; i++){
          var r1 = rects[i];
          for (var j = 0; j < rects.length; j++){
            var r2 = rects[j];
            if (tracking.Math.intersectRect(r1[0], r1[1], r1[0] + r1[2], r1[1] + r1[3], r2[0], r2[1], r2[0] + r2[2], r2[1] + r2[3])){
              var x1 = Math.max(r1[0], r2[0]);
              var y1 = Math.max(r1[1], r2[1]);
              var x2 = Math.min(r1[0] + r1[2], r2[0] + r2[2]);
              var y2 = Math.min(r1[1] + r1[3], r2[1] + r2[3]);
              var overlap = (x1 - x2) * (y1 - y2);
              var area1 = (r1[2] * r1[3]);
              var area2 = (r2[2] * r2[3]);

              if ((overlap / (area1 * (area1 / area2)) >= 0.5) &&
                (overlap / (area2 * (area1 / area2)) >= 0.5)){
                disjointSet.union(i, j);
              }
            }
          }
        }

        var map = {};
        for (var k = 0; k < disjointSet.length; k++){
          var rep = disjointSet.find(k);
          if (!map[rep]){
            map[rep] ={
              total: 1,
              width: rects[k][2],
              height: rects[k][3],
              x: rects[k][0],
              y: rects[k][1]
            };
            continue;
          }
          map[rep].total++;
          map[rep].width += rects[k][2];
          map[rep].height += rects[k][3];
          map[rep].x += rects[k][0];
          map[rep].y += rects[k][1];
        }

        var result = [];
        Object.keys(map).forEach(function(key){
          var rect = map[key];
          result.push([((rect.x / rect.total + 0.5) | 0), ((rect.y / rect.total + 0.5) | 0), ((rect.width / rect.total + 0.5) | 0), ((rect.height / rect.total + 0.5) | 0)]);
        });
        return result;
    };
    
    /**
     * Reset the tracker to default values
     */
    Js_objectdetectGaze.prototype.reset = function(){
        console.log( "Unimplemented; js_objectdetect.js has no obvious reset function" );
    }

    /**
     * The Js_objectdetectGaze object name
     * @type {string}
     */
    Js_objectdetectGaze.prototype.name = 'js_objectdetect';

}(window));

'use strict';
(function(window) {
    
    window.webgazer = window.webgazer || {};
    webgazer.reg = webgazer.reg || {};
    webgazer.pupil = webgazer.pupil || {};

    /**
     * Constructor of LinearReg,
     * initialize array data
     * @constructor
     */
    webgazer.reg.LinearReg = function() {
        this.leftDatasetX = [];
        this.leftDatasetY = [];
        this.rightDatasetX = [];
        this.rightDatasetY = [];
        this.data = [];
    };

    /**
     * Add given data from eyes
     * @param {Object} eyes - eyes where extract data to add
     * @param {Object} screenPos - The current screen point
     * @param {Object} type - The type of performed action
     */
    webgazer.reg.LinearReg.prototype.addData = function(eyes, screenPos, type) {
        if (!eyes) {
            return;
        }
        webgazer.pupil.getPupils(eyes);
        if (!eyes.left.blink) {
            this.leftDatasetX.push([eyes.left.pupil[0][0], screenPos[0]]);
            this.leftDatasetY.push([eyes.left.pupil[0][1], screenPos[1]]);
        }

        if (!eyes.right.blink) {
            this.rightDatasetX.push([eyes.right.pupil[0][0], screenPos[0]]);
            this.rightDatasetY.push([eyes.right.pupil[0][1], screenPos[1]]);
        }
        this.data.push({'eyes': eyes, 'screenPos': screenPos, 'type': type});
    };

    /**
     * Add given data to current data set then,
     * replace current data member with given data
     * @param {Array.<Object>} data - The data to set
     */
    webgazer.reg.LinearReg.prototype.setData = function(data) {
        for (var i = 0; i < data.length; i++) {
            this.addData(data[i].eyes, data[i].screenPos, data[i].type);
        }
        this.data = data;
    };

    /**
     * Return the data
     * @returns {Array.<Object>|*}
     */
    webgazer.reg.LinearReg.prototype.getData = function() {
        return this.data;
    };

    /**
     * Try to predict coordinates from pupil data
     * after apply linear regression on data set
     * @param {Object} eyesObj - The current user eyes object
     * @returns {Object}
     */
    webgazer.reg.LinearReg.prototype.predict = function(eyesObj) {
        if (!eyesObj) {
            return null;
        }
        var result = regression('linear', this.leftDatasetX);
        var leftSlopeX = result.equation[0];
        var leftIntersceptX = result.equation[1];

        result = regression('linear', this.leftDatasetY);
        var leftSlopeY = result.equation[0];
        var leftIntersceptY = result.equation[1];

        result = regression('linear', this.rightDatasetX);
        var rightSlopeX = result.equation[0];
        var rightIntersceptX = result.equation[1];

        result = regression('linear', this.rightDatasetY);
        var rightSlopeY = result.equation[0];
        var rightIntersceptY = result.equation[1];
        
        webgazer.pupil.getPupils(eyesObj);

        var leftPupilX = eyesObj.left.pupil[0][0];
        var leftPupilY = eyesObj.left.pupil[0][1];

        var rightPupilX = eyesObj.right.pupil[0][0];
        var rightPupilY = eyesObj.right.pupil[0][1];

        var predictedX = Math.floor((((leftSlopeX * leftPupilX) + leftIntersceptX) + ((rightSlopeX * rightPupilX) + rightIntersceptX))/2);
        var predictedY = Math.floor((((leftSlopeY * leftPupilY) + leftIntersceptY) + ((rightSlopeY * rightPupilY) + rightIntersceptY))/2);
        return {
            x: predictedX,
            y: predictedY
        };
    };

    /**
     * The LinearReg object name
     * @type {string}
     */
    webgazer.reg.LinearReg.prototype.name = 'simple';
    
}(window));

(function() {
    'use strict';

    self.webgazer = self.webgazer || {};
    self.webgazer.mat = self.webgazer.mat || {};

    /**
     * Transposes an mxn array
     * @param {Array.<Array.<Number>>} matrix - of 'M x N' dimensionality
     * @return {Array.<Array.<Number>>} transposed matrix
     */
    self.webgazer.mat.transpose = function(matrix){
        var m = matrix.length;
        var n = matrix[0].length;
        var transposedMatrix = new Array(n);

        for (var i = 0; i < m; i++){
            for (var j = 0; j < n; j++){
                if (i === 0) transposedMatrix[j] = new Array(m);
                transposedMatrix[j][i] = matrix[i][j];
            }
        }

        return transposedMatrix;
    };

    /**
     * Get a sub-matrix of matrix
     * @param {Array.<Array.<Number>>} matrix - original matrix
     * @param {Array.<Number>} r - Array of row indices
     * @param {Number} j0 - Initial column index
     * @param {Number} j1 - Final column index
     * @returns {Array} The sub-matrix matrix(r(:),j0:j1)
     */
    self.webgazer.mat.getMatrix = function(matrix, r, j0, j1){
        var X = new Array(r.length),
            m = j1-j0+1;

        for (var i = 0; i < r.length; i++){
            X[i] = new Array(m);
            for (var j = j0; j <= j1; j++){
                X[i][j-j0] = matrix[r[i]][j];
            }
        }
        return X;
    };

    /**
     * Get a submatrix of matrix
     * @param {Array.<Array.<Number>>} matrix - original matrix
     * @param {Number} i0 - Initial row index
     * @param {Number} i1 - Final row index
     * @param {Number} j0 - Initial column index
     * @param {Number} j1 - Final column index
     * @return {Array} The sub-matrix matrix(i0:i1,j0:j1)
     */
    self.webgazer.mat.getSubMatrix = function(matrix, i0, i1, j0, j1){
        var size = j1 - j0 + 1,
            X = new Array(i1-i0+1);

        for (var i = i0; i <= i1; i++){
            var subI = i-i0;

            X[subI] = new Array(size);

            for (var j = j0; j <= j1; j++){
                X[subI][j-j0] = matrix[i][j];
            }
        }
        return X;
    };

    /**
     * Linear algebraic matrix multiplication, matrix1 * matrix2
     * @param {Array.<Array.<Number>>} matrix1
     * @param {Array.<Array.<Number>>} matrix2
     * @return {Array.<Array.<Number>>} Matrix product, matrix1 * matrix2
     */
    self.webgazer.mat.mult = function(matrix1, matrix2){

        if (matrix2.length != matrix1[0].length){
            console.log('Matrix inner dimensions must agree.');
        }

        var X = new Array(matrix1.length),
            Bcolj = new Array(matrix1[0].length);

        for (var j = 0; j < matrix2[0].length; j++){
            for (var k = 0; k < matrix1[0].length; k++){
                Bcolj[k] = matrix2[k][j];
            }
            for (var i = 0; i < matrix1.length; i++){

                if (j === 0)
                    X[i] = new Array(matrix2[0].length);

                var Arowi = matrix1[i];
                var s = 0;
                for (var k = 0; k < matrix1[0].length; k++){
                    s += Arowi[k]*Bcolj[k];
                }
                X[i][j] = s;
            }
        }
        return X;
    };


    /**
     * LUDecomposition to solve A*X = B, based on WEKA code
     * @param {Array.<Array.<Number>>} A - left matrix of equation to be solved
     * @param {Array.<Array.<Number>>} B - right matrix of equation to be solved
     * @return {Array.<Array.<Number>>} X so that L*U*X = B(piv,:)
     */
    self.webgazer.mat.LUDecomposition = function(A,B){
        var LU = new Array(A.length);

        for (var i = 0; i < A.length; i++){
          LU[i] = new Array(A[0].length);
            for (var j = 0; j < A[0].length; j++){
                LU[i][j] = A[i][j];
            }
        }

        var m = A.length;
        var n = A[0].length;
        var piv = new Array(m);
        for (var i = 0; i < m; i++){
            piv[i] = i;
        }
        var pivsign = 1;
        var LUrowi = new Array();
        var LUcolj = new Array(m);
        // Outer loop.
        for (var j = 0; j < n; j++){
            // Make a copy of the j-th column to localize references.
            for (var i = 0; i < m; i++){
                LUcolj[i] = LU[i][j];
            }
            // Apply previous transformations.
            for (var i = 0; i < m; i++){
                LUrowi = LU[i];
                // Most of the time is spent in the following dot product.
                var kmax = Math.min(i,j);
                var s = 0;
                for (var k = 0; k < kmax; k++){
                    s += LUrowi[k]*LUcolj[k];
                }
                LUrowi[j] = LUcolj[i] -= s;
            }
            // Find pivot and exchange if necessary.
            var p = j;
            for (var i = j+1; i < m; i++){
                if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])){
                    p = i;
                }
            }
            if (p != j){
                for (var k = 0; k < n; k++){
                    var t = LU[p][k];
                    LU[p][k] = LU[j][k];
                    LU[j][k] = t;
                }
                var k = piv[p];
                piv[p] = piv[j];
                piv[j] = k;
                pivsign = -pivsign;
            }
            // Compute multipliers.
            if (j < m & LU[j][j] != 0){
                for (var i = j+1; i < m; i++){
                    LU[i][j] /= LU[j][j];
                }
            }
        }
        if (B.length != m){
            console.log('Matrix row dimensions must agree.');
        }
        for (var j = 0; j < n; j++){
            if (LU[j][j] === 0){
                console.log('Matrix is singular.')
            }
        }
        var nx = B[0].length;
        var X = self.webgazer.mat.getMatrix(B,piv,0,nx-1);
        // Solve L*Y = B(piv,:)
        for (var k = 0; k < n; k++){
            for (var i = k+1; i < n; i++){
                for (var j = 0; j < nx; j++){
                    X[i][j] -= X[k][j]*LU[i][k];
                }
            }
        }
        // Solve U*X = Y;
        for (var k = n-1; k >= 0; k--){
            for (var j = 0; j < nx; j++){
                X[k][j] /= LU[k][k];
            }
            for (var i = 0; i < k; i++){
                for (var j = 0; j < nx; j++){
                    X[i][j] -= X[k][j]*LU[i][k];
                }
            }
        }
        return X;
    };

    /**
     * Least squares solution of A*X = B, based on WEKA code
     * @param {Array.<Array.<Number>>} A - left side matrix to be solved
     * @param {Array.<Array.<Number>>} B - a matrix with as many rows as A and any number of columns.
     * @return {Array.<Array.<Number>>} X - that minimizes the two norms of QR*X-B.
     */
    self.webgazer.mat.QRDecomposition = function(A, B){
        // Initialize.
        var QR = new Array(A.length);

        for (var i = 0; i < A.length; i++){
            QR[i] = new Array(A[0].length);
            for (var j = 0; j < A[0].length; j++){
                QR[i][j] = A[i][j];
            }
        }
        var m = A.length;
        var n = A[0].length;
        var Rdiag = new Array(n);
        var nrm;

        // Main loop.
        for (var k = 0; k < n; k++){
            // Compute 2-norm of k-th column without under/overflow.
            nrm = 0;
            for (var i = k; i < m; i++){
                nrm = Math.hypot(nrm,QR[i][k]);
            }
            if (nrm != 0){
                // Form k-th Householder vector.
                if (QR[k][k] < 0){
                    nrm = -nrm;
                }
                for (var i = k; i < m; i++){
                    QR[i][k] /= nrm;
                }
                QR[k][k] += 1;

                // Apply transformation to remaining columns.
                for (var j = k+1; j < n; j++){
                    var s = 0;
                    for (var i = k; i < m; i++){
                        s += QR[i][k]*QR[i][j];
                    }
                    s = -s/QR[k][k];
                    for (var i = k; i < m; i++){
                        QR[i][j] += s*QR[i][k];
                    }
                }
            }
            Rdiag[k] = -nrm;
        }
        if (B.length != m){
            console.log('Matrix row dimensions must agree.');
        }
        for (var j = 0; j < n; j++){
            if (Rdiag[j] === 0)
                console.log('Matrix is rank deficient');
        }
        // Copy right hand side
        var nx = B[0].length;
        var X = new Array(B.length);
        for(var i=0; i<B.length; i++){
            X[i] = new Array(B[0].length);
        }
        for (var i = 0; i < B.length; i++){
            for (var j = 0; j < B[0].length; j++){
                X[i][j] = B[i][j];
            }
        }
        // Compute Y = transpose(Q)*B
        for (var k = 0; k < n; k++){
            for (var j = 0; j < nx; j++){
                var s = 0.0;
                for (var i = k; i < m; i++){
                    s += QR[i][k]*X[i][j];
                }
                s = -s/QR[k][k];
                for (var i = k; i < m; i++){
                    X[i][j] += s*QR[i][k];
                }
            }
        }
        // Solve R*X = Y;
        for (var k = n-1; k >= 0; k--){
            for (var j = 0; j < nx; j++){
                X[k][j] /= Rdiag[k];
            }
            for (var i = 0; i < k; i++){
                for (var j = 0; j < nx; j++){
                    X[i][j] -= X[k][j]*QR[i][k];
                }
            }
        }
        return self.webgazer.mat.getSubMatrix(X,0,n-1,0,nx-1);
    }
    
}());

'use strict';
(function(window) {

    window.webgazer = window.webgazer || {};
    webgazer.pupil = webgazer.pupil || {};

    /**
     * Returns intensity value at x,y position of a pixels image
     * @param {Array} pixels - array of size width*height
     * @param {Number} x -  input x value
     * @param {Number} y - input y value
     * @param {Number} width - width of pixels image
     * @returns {Number} - intensity value in [0,255]
     */
    var getValue = function (pixels, x, y, width){
        return pixels[y * width + x];
    };

    /**
     * Computes summation area table/integral image of a pixel matrix
     * @param {Array} pixels value of eye area
     * @param {Number} width - of image in 'pixels'
     * @param {Number} height - of image in 'pixels'
     * @returns {Array} - integral image
     */
    var getSumTable = function (pixels, width, height){
        var integralImage = new Array(width);
        var sumx = 0;
        var sumy = 0;

        for (var i = 0; i < width; i++){
            integralImage[i] = new Array(height);
            sumx += getValue(pixels, i, 0, width);
            integralImage[i][0] = sumx;
        }

        for (var i = 0; i < height; i++){
            sumy += getValue(pixels, 0, i, width);
            integralImage[0][i] = sumy;
        }

        for (var x = 1; x < width; x++){
            for (var y = 1; y < height; y++){
                integralImage[x][y] = getValue(pixels, x, y, width) + integralImage[x - 1][y] + integralImage[x][y - 1] - integralImage[x - 1][y - 1];
            }
        }
        return integralImage;
    };

    /**
     * Detects a pupil in a set of pixels
     * @param  {Array} pixels - patch of pixels to look for pupil into
     * @param  {Number} width  - of pixel patch
     * @param  {Number} height - of pixel patch
     * @return {Array} coordinate of the bottom right corner and width of the best fitted pupil
     */
    var getSinglePupil = function (pixels, width, height){
        var summedAreaTable = getSumTable(pixels, width, height);
        var bestAvgScore = 999999; //want to minimize this score
        var bestPoint = [0, 0]; //bottom right corner of best fitted pupil
        var bestHalfWidth = 0; //corresponding half width of the best fitted pupil
        var offset = Math.floor(width / 10.0); //padding
        //halfWidth could also start at 1, but this makes it faster
        for (var halfWidth = Math.floor(height / 10.0); halfWidth < width / 2; halfWidth++){
            //think of a sliding rectangular window of width halfWidth*2 that goes through the whole eye pixel matrix and does the following:
            //1) computes the irisArea, which is the total intensity of the iris
            //2) computes the scleraIrisArea, which is multiple rows of pixels including the sclera and iris.
            //3) computes avg, which is the intensity of the area divided by the number of pixels.
            //start at the bottom right of the rectangle!not top left
            for (var x = halfWidth; x < width - offset; x++){
                for (var y = halfWidth; y < height - offset; y++){
                    //evaluate area by the formula found on wikipedia about the summed area table: I(D)+I(A)-I(B)-I(C)
                    var irisArea = summedAreaTable[x + offset][y + offset] + summedAreaTable[x + offset - halfWidth][y + offset - halfWidth] - summedAreaTable[x + offset][y + offset - halfWidth] - summedAreaTable[x + offset - halfWidth][y + offset];
                    var avgScore = 1.0 * irisArea / ((halfWidth + 1) * (halfWidth + 1)) + 1;
                    //summation area table again
                    var scleraIrisArea = ((1.0 * summedAreaTable[width - 1 - offset][y + offset] + summedAreaTable[0 + offset][y + offset - halfWidth] - summedAreaTable[0 + offset][y + offset] - summedAreaTable[width - 1 - offset][y + offset - halfWidth]) - irisArea);
                    //minimize avgScore/scleraIrisArea. 150 is too high, might have to change since it's closer to white
                    if ((avgScore) / scleraIrisArea < bestAvgScore && avgScore < 150){
                        bestAvgScore = (avgScore) / scleraIrisArea;
                        bestPoint = [x + offset, y + offset];
                        bestHalfWidth = halfWidth;
                    }
                }
            }
        }
        return [bestPoint, bestHalfWidth];
    };

    /**
     * Given an object with two eye patches it finds the location of the detected pupils
     * @param  {Object} eyesObj - left and right detected eye patches
     * @return {Object} eyesObj - updated eye patches with information about pupils' locations
     */
    webgazer.pupil.getPupils = function(eyesObj) {
        if (!eyesObj) {
            return eyesObj;
        }
        if (!eyesObj.left.blink) {
            eyesObj.left.pupil = getSinglePupil(Array.prototype.slice.call(webgazer.util.grayscale(eyesObj.left.patch.data, eyesObj.left.width, eyesObj.left.height)), eyesObj.left.width, eyesObj.left.height);
            eyesObj.left.pupil[0][0] -= eyesObj.left.pupil[1];
            eyesObj.left.pupil[0][1] -= eyesObj.left.pupil[1];
        }
        if (!eyesObj.right.blink) {
            eyesObj.right.pupil = getSinglePupil(Array.prototype.slice.call(webgazer.util.grayscale(eyesObj.right.patch.data, eyesObj.right.width, eyesObj.right.height)), eyesObj.right.width, eyesObj.right.height);
            eyesObj.right.pupil[0][0] -= eyesObj.right.pupil[1];
            eyesObj.right.pupil[0][1] -= eyesObj.right.pupil[1];
        }
        return eyesObj;
    }

}(window));

/**
* @license
*
* Regression.JS - Regression functions for javascript
* http://tom-alexander.github.com/regression-js/
*
* copyright(c) 2013 Tom Alexander
* Licensed under the MIT license.
*
**/

;(function() {
    'use strict';

    var gaussianElimination = function(a, o) {
           var i = 0, j = 0, k = 0, maxrow = 0, tmp = 0, n = a.length - 1, x = new Array(o);
           for (i = 0; i < n; i++) {
              maxrow = i;
              for (j = i + 1; j < n; j++) {
                 if (Math.abs(a[i][j]) > Math.abs(a[i][maxrow]))
                    maxrow = j;
              }
              for (k = i; k < n + 1; k++) {
                 tmp = a[k][i];
                 a[k][i] = a[k][maxrow];
                 a[k][maxrow] = tmp;
              }
              for (j = i + 1; j < n; j++) {
                 for (k = n; k >= i; k--) {
                    a[k][j] -= a[k][i] * a[i][j] / a[i][i];
                 }
              }
           }
           for (j = n - 1; j >= 0; j--) {
              tmp = 0;
              for (k = j + 1; k < n; k++)
                 tmp += a[k][j] * x[k];
              x[j] = (a[n][j] - tmp) / a[j][j];
           }
           return (x);
    };

    var methods = {
            linear: function(data) {
                var sum = [0, 0, 0, 0, 0], n = 0, results = [];

                for (; n < data.length; n++) {
                  if (data[n][1] != null) {
                    sum[0] += data[n][0];
                    sum[1] += data[n][1];
                    sum[2] += data[n][0] * data[n][0];
                    sum[3] += data[n][0] * data[n][1];
                    sum[4] += data[n][1] * data[n][1];
                  }
                }

                var gradient = (n * sum[3] - sum[0] * sum[1]) / (n * sum[2] - sum[0] * sum[0]);
                var intercept = (sum[1] / n) - (gradient * sum[0]) / n;
              //  var correlation = (n * sum[3] - sum[0] * sum[1]) / Math.sqrt((n * sum[2] - sum[0] * sum[0]) * (n * sum[4] - sum[1] * sum[1]));

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], data[i][0] * gradient + intercept];
                    results.push(coordinate);
                }

                var string = 'y = ' + Math.round(gradient*100) / 100 + 'x + ' + Math.round(intercept*100) / 100;

                return {equation: [gradient, intercept], points: results, string: string};
            },

            linearThroughOrigin: function(data) {
                var sum = [0, 0], n = 0, results = [];

                for (; n < data.length; n++) {
                    if (data[n][1] != null) {
                        sum[0] += data[n][0] * data[n][0]; //sumSqX
                        sum[1] += data[n][0] * data[n][1]; //sumXY
                    }
                }

                var gradient = sum[1] / sum[0];

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], data[i][0] * gradient];
                    results.push(coordinate);
                }

                var string = 'y = ' + Math.round(gradient*100) / 100 + 'x';

                return {equation: [gradient], points: results, string: string};
            },

            exponential: function(data) {
                var sum = [0, 0, 0, 0, 0, 0], n = 0, results = [];

                for (len = data.length; n < len; n++) {
                  if (data[n][1] != null) {
                    sum[0] += data[n][0];
                    sum[1] += data[n][1];
                    sum[2] += data[n][0] * data[n][0] * data[n][1];
                    sum[3] += data[n][1] * Math.log(data[n][1]);
                    sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
                    sum[5] += data[n][0] * data[n][1];
                  }
                }

                var denominator = (sum[1] * sum[2] - sum[5] * sum[5]);
                var A = Math.pow(Math.E, (sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
                var B = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], A * Math.pow(Math.E, B * data[i][0])];
                    results.push(coordinate);
                }

                var string = 'y = ' + Math.round(A*100) / 100 + 'e^(' + Math.round(B*100) / 100 + 'x)';

                return {equation: [A, B], points: results, string: string};
            },

            logarithmic: function(data) {
                var sum = [0, 0, 0, 0], n = 0, results = [];

                for (len = data.length; n < len; n++) {
                  if (data[n][1] != null) {
                    sum[0] += Math.log(data[n][0]);
                    sum[1] += data[n][1] * Math.log(data[n][0]);
                    sum[2] += data[n][1];
                    sum[3] += Math.pow(Math.log(data[n][0]), 2);
                  }
                }

                var B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0]);
                var A = (sum[2] - B * sum[0]) / n;

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], A + B * Math.log(data[i][0])];
                    results.push(coordinate);
                }

                var string = 'y = ' + Math.round(A*100) / 100 + ' + ' + Math.round(B*100) / 100 + ' ln(x)';

                return {equation: [A, B], points: results, string: string};
            },

            power: function(data) {
                var sum = [0, 0, 0, 0], n = 0, results = [];

                for (len = data.length; n < len; n++) {
                  if (data[n][1] != null) {
                    sum[0] += Math.log(data[n][0]);
                    sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
                    sum[2] += Math.log(data[n][1]);
                    sum[3] += Math.pow(Math.log(data[n][0]), 2);
                  }
                }

                var B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0]);
                var A = Math.pow(Math.E, (sum[2] - B * sum[0]) / n);

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], A * Math.pow(data[i][0] , B)];
                    results.push(coordinate);
                }

                 var string = 'y = ' + Math.round(A*100) / 100 + 'x^' + Math.round(B*100) / 100;

                return {equation: [A, B], points: results, string: string};
            },
            
            polynomial: function(data, order) {
                if(typeof order === 'undefined'){
                    order = 2;
                }
                 var lhs = [], rhs = [], results = [], a = 0, b = 0, i = 0, k = order + 1;

                        for (; i < k; i++) {
                           for (var l = 0, len = data.length; l < len; l++) {
                              if (data[l][1] != null) {
                               a += Math.pow(data[l][0], i) * data[l][1];
                              }
                            }
                            lhs.push(a), a = 0;
                            var c = [];
                            for (var j = 0; j < k; j++) {
                               for (var l = 0, len = data.length; l < len; l++) {
                                  if (data[l][1] != null) {
                                   b += Math.pow(data[l][0], i + j);
                                  }
                                }
                                c.push(b), b = 0;
                            }
                            rhs.push(c);
                        }
                rhs.push(lhs);

               var equation = gaussianElimination(rhs, k);

                    for (var i = 0, len = data.length; i < len; i++) {
                        var answer = 0;
                        for (var w = 0; w < equation.length; w++) {
                            answer += equation[w] * Math.pow(data[i][0], w);
                        }
                        results.push([data[i][0], answer]);
                    }

                    var string = 'y = ';

                    for(var i = equation.length-1; i >= 0; i--){
                      if(i > 1) string += Math.round(equation[i] * Math.pow(10, i)) / Math.pow(10, i)  + 'x^' + i + ' + ';
                      else if (i === 1) string += Math.round(equation[i]*100) / 100 + 'x' + ' + ';
                      else string += Math.round(equation[i]*100) / 100;
                    }

                return {equation: equation, points: results, string: string};
            },

            lastvalue: function(data) {
              var results = [];
              var lastvalue = null;
              for (var i = 0; i < data.length; i++) {
                if (data[i][1]) {
                  lastvalue = data[i][1];
                  results.push([data[i][0], data[i][1]]);
                }
                else {
                  results.push([data[i][0], lastvalue]);
                }
              }

              return {equation: [lastvalue], points: results, string: "" + lastvalue};
            }
        };

    var regression = (function(method, data, order) {

           if (typeof method === 'string') {
               return methods[method](data, order);
           }
        });

    if (typeof exports !== 'undefined') {
        module.exports = regression;
    } else {
        window.regression = regression;
    }

}());

'use strict';
(function(window) {

    window.webgazer = window.webgazer || {};
    webgazer.reg = webgazer.reg || {};
    webgazer.mat = webgazer.mat || {};
    webgazer.util = webgazer.util || {};
    webgazer.params = webgazer.params || {};

    var ridgeParameter = Math.pow(10,-5);
    var resizeWidth = 10;
    var resizeHeight = 6;
    var dataWindow = 700;
    var trailDataWindow = 10;

    /**
     * Performs ridge regression, according to the Weka code.
     * @param {Array} y - corresponds to screen coordinates (either x or y) for each of n click events
     * @param {Array.<Array.<Number>>} X - corresponds to gray pixel features (120 pixels for both eyes) for each of n clicks
     * @param {Array} k - ridge parameter
     * @return{Array} regression coefficients
     */
    function ridge(y, X, k){
        var nc = X[0].length;
        var m_Coefficients = new Array(nc);
        var xt = webgazer.mat.transpose(X);
        var solution = new Array();
        var success = true;
        do{
            var ss = webgazer.mat.mult(xt,X);
            // Set ridge regression adjustment
            for (var i = 0; i < nc; i++) {
                ss[i][i] = ss[i][i] + k;
            }

            // Carry out the regression
            var bb = webgazer.mat.mult(xt,y);
            for(var i = 0; i < nc; i++) {
                m_Coefficients[i] = bb[i][0];
            }
            try{
                var n = (m_Coefficients.length !== 0 ? m_Coefficients.length/m_Coefficients.length: 0);
                if (m_Coefficients.length*n !== m_Coefficients.length){
                    console.log('Array length must be a multiple of m')
                }
                solution = (ss.length === ss[0].length ? (numeric.LUsolve(numeric.LU(ss,true),bb)) : (webgazer.mat.QRDecomposition(ss,bb)));

                for (var i = 0; i < nc; i++){
                    m_Coefficients[i] = solution[i];
                }
                success = true;
            }
            catch (ex){
                k *= 10;
                console.log(ex);
                success = false;
            }
        } while (!success);
        return m_Coefficients;
    }
    
    /**
     * Compute eyes size as gray histogram
     * @param {Object} eyes - The eyes where looking for gray histogram
     * @returns {Array.<T>} The eyes gray level histogram
     */
    function getEyeFeats(eyes) {
        var resizedLeft = webgazer.util.resizeEye(eyes.left, resizeWidth, resizeHeight);
        var resizedright = webgazer.util.resizeEye(eyes.right, resizeWidth, resizeHeight);

        var leftGray = webgazer.util.grayscale(resizedLeft.data, resizedLeft.width, resizedLeft.height);
        var rightGray = webgazer.util.grayscale(resizedright.data, resizedright.width, resizedright.height);

        var histLeft = [];
        webgazer.util.equalizeHistogram(leftGray, 5, histLeft);
        var histRight = [];
        webgazer.util.equalizeHistogram(rightGray, 5, histRight);

        var leftGrayArray = Array.prototype.slice.call(histLeft);
        var rightGrayArray = Array.prototype.slice.call(histRight);

        return leftGrayArray.concat(rightGrayArray);
    }

    //TODO: still usefull ???
    /**
     *
     * @returns {Number}
     */
    function getCurrentFixationIndex() {
        var index = 0;
        var recentX = this.screenXTrailArray.get(0);
        var recentY = this.screenYTrailArray.get(0);
        for (var i = this.screenXTrailArray.length - 1; i >= 0; i--) {
            var currX = this.screenXTrailArray.get(i);
            var currY = this.screenYTrailArray.get(i);
            var euclideanDistance = Math.sqrt(Math.pow((currX-recentX),2)+Math.pow((currY-recentY),2));
            if (euclideanDistance > 72){
                return i+1;
            }
        }
        return i;
    }

    /**
     * Constructor of RidgeReg object,
     * this object allow to perform ridge regression
     * @constructor
     */
    webgazer.reg.RidgeReg = function() {
        this.screenXClicksArray = new webgazer.util.DataWindow(dataWindow);
        this.screenYClicksArray = new webgazer.util.DataWindow(dataWindow);
        this.eyeFeaturesClicks = new webgazer.util.DataWindow(dataWindow);

        //sets to one second worth of cursor trail
        this.trailTime = 1000;
        this.trailDataWindow = this.trailTime / webgazer.params.moveTickSize;
        this.screenXTrailArray = new webgazer.util.DataWindow(trailDataWindow);
        this.screenYTrailArray = new webgazer.util.DataWindow(trailDataWindow);
        this.eyeFeaturesTrail = new webgazer.util.DataWindow(trailDataWindow);
        this.trailTimes = new webgazer.util.DataWindow(trailDataWindow);

        this.dataClicks = new webgazer.util.DataWindow(dataWindow);
        this.dataTrail = new webgazer.util.DataWindow(dataWindow);
    };

    /**
     * Add given data from eyes
     * @param {Object} eyes - eyes where extract data to add
     * @param {Object} screenPos - The current screen point
     * @param {Object} type - The type of performed action
     */
    webgazer.reg.RidgeReg.prototype.addData = function(eyes, screenPos, type) {
        if (!eyes) {
            return;
        }
        if (eyes.left.blink || eyes.right.blink) {
            return;
        }
        if (type === 'click') {
            this.screenXClicksArray.push([screenPos[0]]);
            this.screenYClicksArray.push([screenPos[1]]);

            this.eyeFeaturesClicks.push(getEyeFeats(eyes));
            this.dataClicks.push({'eyes':eyes, 'screenPos':screenPos, 'type':type});
        } else if (type === 'move') {
            this.screenXTrailArray.push([screenPos[0]]);
            this.screenYTrailArray.push([screenPos[1]]);

            this.eyeFeaturesTrail.push(getEyeFeats(eyes));
            this.trailTimes.push(performance.now());
            this.dataTrail.push({'eyes':eyes, 'screenPos':screenPos, 'type':type});
        }

        // [20180730 JT] Why do we do this? It doesn't return anything...
        // But as JS is pass by reference, it still affects it.
        //
        // Causes problems for when we want to call 'addData' twice in a row on the same object, but perhaps with different screenPos or types (think multiple interactions within one video frame)
        //eyes.left.patch = Array.from(eyes.left.patch.data);
        //eyes.right.patch = Array.from(eyes.right.patch.data);
    }

    /**
     * Try to predict coordinates from pupil data
     * after apply linear regression on data set
     * @param {Object} eyesObj - The current user eyes object
     * @returns {Object}
     */
    webgazer.reg.RidgeReg.prototype.predict = function(eyesObj) {
        if (!eyesObj || this.eyeFeaturesClicks.length === 0) {
            return null;
        }
        var acceptTime = performance.now() - this.trailTime;
        var trailX = [];
        var trailY = [];
        var trailFeat = [];
        for (var i = 0; i < this.trailDataWindow; i++) {
            if (this.trailTimes.get(i) > acceptTime) {
                trailX.push(this.screenXTrailArray.get(i));
                trailY.push(this.screenYTrailArray.get(i));
                trailFeat.push(this.eyeFeaturesTrail.get(i));
            }
        }

        var screenXArray = this.screenXClicksArray.data.concat(trailX);
        var screenYArray = this.screenYClicksArray.data.concat(trailY);
        var eyeFeatures = this.eyeFeaturesClicks.data.concat(trailFeat);

        var coefficientsX = ridge(screenXArray, eyeFeatures, ridgeParameter);
        var coefficientsY = ridge(screenYArray, eyeFeatures, ridgeParameter);

        var eyeFeats = getEyeFeats(eyesObj);
        var predictedX = 0;
        for(var i=0; i< eyeFeats.length; i++){
            predictedX += eyeFeats[i] * coefficientsX[i];
        }
        var predictedY = 0;
        for(var i=0; i< eyeFeats.length; i++){
            predictedY += eyeFeats[i] * coefficientsY[i];
        }

        predictedX = Math.floor(predictedX);
        predictedY = Math.floor(predictedY);

        return {
            x: predictedX,
            y: predictedY
        };
    };

    /**
     * Add given data to current data set then,
     * replace current data member with given data
     * @param {Array.<Object>} data - The data to set
     */
    webgazer.reg.RidgeReg.prototype.setData = function(data) {
        for (var i = 0; i < data.length; i++) {
            //TODO this is a kludge, needs to be fixed
            data[i].eyes.left.patch = new ImageData(new Uint8ClampedArray(data[i].eyes.left.patch), data[i].eyes.left.width, data[i].eyes.left.height);
            data[i].eyes.right.patch = new ImageData(new Uint8ClampedArray(data[i].eyes.right.patch), data[i].eyes.right.width, data[i].eyes.right.height);
            this.addData(data[i].eyes, data[i].screenPos, data[i].type);
        }
    };

    /**
     * Return the data
     * @returns {Array.<Object>|*}
     */
    webgazer.reg.RidgeReg.prototype.getData = function() {
        return this.dataClicks.data.concat(this.dataTrail.data);
    }
    
    /**
     * The RidgeReg object name
     * @type {string}
     */
    webgazer.reg.RidgeReg.prototype.name = 'ridge';
    
}(window));

'use strict';
(function(window) {

    window.webgazer = window.webgazer || {};
    webgazer.reg = webgazer.reg || {};
    webgazer.mat = webgazer.mat || {};
    webgazer.util = webgazer.util || {};
    webgazer.params = webgazer.params || {};

    var ridgeParameter = Math.pow(10,-5);
    var resizeWidth = 10;
    var resizeHeight = 6;
    var dataWindow = 700;
    var trailDataWindow = 10;

    /**
     * Performs ridge regression, according to the Weka code.
     * @param {Array} y - corresponds to screen coordinates (either x or y) for each of n click events
     * @param {Array.<Array.<Number>>} X - corresponds to gray pixel features (120 pixels for both eyes) for each of n clicks
     * @param {Array} k - ridge parameter
     * @return{Array} regression coefficients
     */
    function ridge(y, X, k){
        var nc = X[0].length;
        var m_Coefficients = new Array(nc);
        var xt = webgazer.mat.transpose(X);
        var solution = new Array();
        var success = true;
        do{
            var ss = webgazer.mat.mult(xt,X);
            // Set ridge regression adjustment
            for (var i = 0; i < nc; i++) {
                ss[i][i] = ss[i][i] + k;
            }

            // Carry out the regression
            var bb = webgazer.mat.mult(xt,y);
            for(var i = 0; i < nc; i++) {
                m_Coefficients[i] = bb[i][0];
            }
            try{
                var n = (m_Coefficients.length !== 0 ? m_Coefficients.length/m_Coefficients.length: 0);
                if (m_Coefficients.length*n !== m_Coefficients.length){
                    console.log('Array length must be a multiple of m')
                }
                solution = (ss.length === ss[0].length ? (numeric.LUsolve(numeric.LU(ss,true),bb)) : (webgazer.mat.QRDecomposition(ss,bb)));

                for (var i = 0; i < nc; i++){
                    m_Coefficients[i] = solution[i];
                }
                success = true;
            }
            catch (ex){
                k *= 10;
                console.log(ex);
                success = false;
            }
        } while (!success);
        return m_Coefficients;
    }

    /**
     * Compute eyes size as gray histogram
     * @param {Object} eyes - The eyes where looking for gray histogram
     * @returns {Array.<T>} The eyes gray level histogram
     */
    function getEyeFeats(eyes) {
        var resizedLeft = webgazer.util.resizeEye(eyes.left, resizeWidth, resizeHeight);
        var resizedright = webgazer.util.resizeEye(eyes.right, resizeWidth, resizeHeight);

        var leftGray = webgazer.util.grayscale(resizedLeft.data, resizedLeft.width, resizedLeft.height);
        var rightGray = webgazer.util.grayscale(resizedright.data, resizedright.width, resizedright.height);

        var histLeft = [];
        webgazer.util.equalizeHistogram(leftGray, 5, histLeft);
        var histRight = [];
        webgazer.util.equalizeHistogram(rightGray, 5, histRight);

        var leftGrayArray = Array.prototype.slice.call(histLeft);
        var rightGrayArray = Array.prototype.slice.call(histRight);

        return leftGrayArray.concat(rightGrayArray);
    }

    //TODO: still usefull ???
    /**
     *
     * @returns {Number}
     */
    function getCurrentFixationIndex() {
        var index = 0;
        var recentX = this.screenXTrailArray.get(0);
        var recentY = this.screenYTrailArray.get(0);
        for (var i = this.screenXTrailArray.length - 1; i >= 0; i--) {
            var currX = this.screenXTrailArray.get(i);
            var currY = this.screenYTrailArray.get(i);
            var euclideanDistance = Math.sqrt(Math.pow((currX-recentX),2)+Math.pow((currY-recentY),2));
            if (euclideanDistance > 72){
                return i+1;
            }
        }
        return i;
    }

    /**
     * Constructor of RidgeWeightedReg object
     * @constructor
     */
    webgazer.reg.RidgeWeightedReg = function() {
        this.screenXClicksArray = new webgazer.util.DataWindow(dataWindow);
        this.screenYClicksArray = new webgazer.util.DataWindow(dataWindow);
        this.eyeFeaturesClicks = new webgazer.util.DataWindow(dataWindow);

        //sets to one second worth of cursor trail
        this.trailTime = 1000;
        this.trailDataWindow = this.trailTime / webgazer.params.moveTickSize;
        this.screenXTrailArray = new webgazer.util.DataWindow(trailDataWindow);
        this.screenYTrailArray = new webgazer.util.DataWindow(trailDataWindow);
        this.eyeFeaturesTrail = new webgazer.util.DataWindow(trailDataWindow);
        this.trailTimes = new webgazer.util.DataWindow(trailDataWindow);

        this.dataClicks = new webgazer.util.DataWindow(dataWindow);
        this.dataTrail = new webgazer.util.DataWindow(dataWindow);
    };

    /**
     * Add given data from eyes
     * @param {Object} eyes - eyes where extract data to add
     * @param {Object} screenPos - The current screen point
     * @param {Object} type - The type of performed action
     */
    webgazer.reg.RidgeWeightedReg.prototype.addData = function(eyes, screenPos, type) {
        if (!eyes) {
            return;
        }
        if (eyes.left.blink || eyes.right.blink) {
            return;
        }
        if (type === 'click') {
            this.screenXClicksArray.push([screenPos[0]]);
            this.screenYClicksArray.push([screenPos[1]]);

            this.eyeFeaturesClicks.push(getEyeFeats(eyes));
            this.dataClicks.push({'eyes':eyes, 'screenPos':screenPos, 'type':type});
        } else if (type === 'move') {
            this.screenXTrailArray.push([screenPos[0]]);
            this.screenYTrailArray.push([screenPos[1]]);

            this.eyeFeaturesTrail.push(getEyeFeats(eyes));
            this.trailTimes.push(performance.now());
            this.dataTrail.push({'eyes':eyes, 'screenPos':screenPos, 'type':type});
        }

        // [20180730 JT] Why do we do this? It doesn't return anything...
        // But as JS is pass by reference, it still affects it.
        //
        // Causes problems for when we want to call 'addData' twice in a row on the same object, but perhaps with different screenPos or types (think multiple interactions within one video frame)
        //eyes.left.patch = Array.from(eyes.left.patch.data);
        //eyes.right.patch = Array.from(eyes.right.patch.data);
    };

    /**
     * Try to predict coordinates from pupil data
     * after apply linear regression on data set
     * @param {Object} eyesObj - The current user eyes object
     * @returns {Object}
     */
    webgazer.reg.RidgeWeightedReg.prototype.predict = function(eyesObj) {
        if (!eyesObj || this.eyeFeaturesClicks.length === 0) {
            return null;
        }
        var acceptTime = performance.now() - this.trailTime;
        var trailX = [];
        var trailY = [];
        var trailFeat = [];
        for (var i = 0; i < this.trailDataWindow; i++) {
            if (this.trailTimes.get(i) > acceptTime) {
                trailX.push(this.screenXTrailArray.get(i));
                trailY.push(this.screenYTrailArray.get(i));
                trailFeat.push(this.eyeFeaturesTrail.get(i));
            }
        }

        var len = this.eyeFeaturesClicks.data.length;
        var weightedEyeFeats = Array(len);
        var weightedXArray = Array(len);
        var weightedYArray = Array(len);
        for (var i = 0; i < len; i++) {
            var weight = Math.sqrt( 1 / (len - i) ); // access from oldest to newest so should start with low weight and increase steadily
            //abstraction is leaking...
            var trueIndex = this.eyeFeaturesClicks.getTrueIndex(i);
            for (var j = 0; j < this.eyeFeaturesClicks.data[trueIndex].length; j++) {
                var val = this.eyeFeaturesClicks.data[trueIndex][j] * weight;
                if (weightedEyeFeats[trueIndex] !== undefined){
                    weightedEyeFeats[trueIndex].push(val);
                } else {
                    weightedEyeFeats[trueIndex] = [val];
                }
            }
            weightedXArray[trueIndex] = this.screenXClicksArray.get(i).slice(0, this.screenXClicksArray.get(i).length);
            weightedYArray[trueIndex] = this.screenYClicksArray.get(i).slice(0, this.screenYClicksArray.get(i).length);
            weightedXArray[i][0] = weightedXArray[i][0] * weight;
            weightedYArray[i][0] = weightedYArray[i][0] * weight;
        }

        var screenXArray = weightedXArray.concat(trailX);
        var screenYArray = weightedYArray.concat(trailY);
        var eyeFeatures = weightedEyeFeats.concat(trailFeat);



        var coefficientsX = ridge(screenXArray, eyeFeatures, ridgeParameter);
        var coefficientsY = ridge(screenYArray, eyeFeatures, ridgeParameter);

        var eyeFeats = getEyeFeats(eyesObj);
        var predictedX = 0;
        for(var i=0; i< eyeFeats.length; i++){
            predictedX += eyeFeats[i] * coefficientsX[i];
        }
        var predictedY = 0;
        for(var i=0; i< eyeFeats.length; i++){
            predictedY += eyeFeats[i] * coefficientsY[i];
        }

        predictedX = Math.floor(predictedX);
        predictedY = Math.floor(predictedY);

        return {
            x: predictedX,
            y: predictedY
        };
    };

    /**
     * Add given data to current data set then,
     * replace current data member with given data
     * @param {Array.<Object>} data - The data to set
     */
    webgazer.reg.RidgeWeightedReg.prototype.setData = function(data) {
        for (var i = 0; i < data.length; i++) {
            //TODO this is a kludge, needs to be fixed
            data[i].eyes.left.patch = new ImageData(new Uint8ClampedArray(data[i].eyes.left.patch), data[i].eyes.left.width, data[i].eyes.left.height);
            data[i].eyes.right.patch = new ImageData(new Uint8ClampedArray(data[i].eyes.right.patch), data[i].eyes.right.width, data[i].eyes.right.height);
            this.addData(data[i].eyes, data[i].screenPos, data[i].type);
        }
    };

    /**
     * Return the data
     * @returns {Array.<Object>|*}
     */
    webgazer.reg.RidgeWeightedReg.prototype.getData = function() {
        return this.dataClicks.data.concat(this.dataTrail.data);
    };

    /**
     * The RidgeWeightedReg object name
     * @type {string}
     */
    webgazer.reg.RidgeWeightedReg.prototype.name = 'ridge';
    
}(window));

'use strict';
(function(window) {

    window.webgazer = window.webgazer || {};
    webgazer.reg = webgazer.reg || {};
    webgazer.mat = webgazer.mat || {};
    webgazer.util = webgazer.util || {};

    var ridgeParameter = Math.pow(10,-5);
    var resizeWidth = 10;
    var resizeHeight = 6;
    var dataWindow = 700;
    var weights = {'X':[0],'Y':[0]};
    var trailDataWindow = 10;

    /**
     * Compute eyes size as gray histogram
     * @param {Object} eyes - The eyes where looking for gray histogram
     * @returns {Array.<T>} The eyes gray level histogram
     */
    function getEyeFeats(eyes) {
        var resizedLeft = webgazer.util.resizeEye(eyes.left, resizeWidth, resizeHeight);
        var resizedright = webgazer.util.resizeEye(eyes.right, resizeWidth, resizeHeight);

        var leftGray = webgazer.util.grayscale(resizedLeft.data, resizedLeft.width, resizedLeft.height);
        var rightGray = webgazer.util.grayscale(resizedright.data, resizedright.width, resizedright.height);

        var histLeft = [];
        webgazer.util.equalizeHistogram(leftGray, 5, histLeft);
        var histRight = [];
        webgazer.util.equalizeHistogram(rightGray, 5, histRight);

        var leftGrayArray = Array.prototype.slice.call(histLeft);
        var rightGrayArray = Array.prototype.slice.call(histRight);

        return leftGrayArray.concat(rightGrayArray);
    }

    /**
     * Constructor of RidgeRegThreaded object,
     * it retrieve data window, and prepare a worker,
     * this object allow to perform threaded ridge regression
     * @constructor
     */
    webgazer.reg.RidgeRegThreaded = function() {
        this.screenXClicksArray = new webgazer.util.DataWindow(dataWindow);
        this.screenYClicksArray = new webgazer.util.DataWindow(dataWindow);
        this.eyeFeaturesClicks = new webgazer.util.DataWindow(dataWindow);

        this.screenXTrailArray = new webgazer.util.DataWindow(trailDataWindow);
        this.screenYTrailArray = new webgazer.util.DataWindow(trailDataWindow);
        this.eyeFeaturesTrail = new webgazer.util.DataWindow(trailDataWindow);

        this.dataClicks = new webgazer.util.DataWindow(dataWindow);
        this.dataTrail = new webgazer.util.DataWindow(dataWindow);

        this.worker = new Worker('ridgeWorker.js');
        this.worker.onerror = function(err) { console.log(err.message); };
        this.worker.onmessage = function(evt){
          weights.X = evt.data.X;
          weights.Y = evt.data.Y;
        };
    };

    /**
     * Add given data from eyes
     * @param {Object} eyes - eyes where extract data to add
     * @param {Object} screenPos - The current screen point
     * @param {Object} type - The type of performed action
     */
    webgazer.reg.RidgeRegThreaded.prototype.addData = function(eyes, screenPos, type) {
        if (!eyes) {
            return;
        }
        if (eyes.left.blink || eyes.right.blink) {
            return;
        }
        this.worker.postMessage({'eyes':getEyeFeats(eyes), 'screenPos':screenPos, 'type':type});
    };

    /**
     * Try to predict coordinates from pupil data
     * after apply linear regression on data set
     * @param {Object} eyesObj - The current user eyes object
     * @returns {Object}
     */
    webgazer.reg.RidgeRegThreaded.prototype.predict = function(eyesObj) {
        console.log('LOGGING..');
        if (!eyesObj) {
            return null;
        }
        var coefficientsX = weights.X;
        var coefficientsY = weights.Y;

        var eyeFeats = getEyeFeats(eyesObj);
        var predictedX = 0, predictedY = 0;
        for(var i=0; i< eyeFeats.length; i++){
            predictedX += eyeFeats[i] * coefficientsX[i];
            predictedY += eyeFeats[i] * coefficientsY[i];
        }

        predictedX = Math.floor(predictedX);
        predictedY = Math.floor(predictedY);

        console.log('PredicedX');
        console.log(predictedX);
        console.log(predictedY);

        return {
            x: predictedX,
            y: predictedY
        };
    };

    /**
     * Add given data to current data set then,
     * replace current data member with given data
     * @param {Array.<Object>} data - The data to set
     */
    webgazer.reg.RidgeRegThreaded.prototype.setData = function(data) {
        for (var i = 0; i < data.length; i++) {
            //TODO this is a kludge, needs to be fixed
            data[i].eyes.left.patch = new ImageData(new Uint8ClampedArray(data[i].eyes.left.patch), data[i].eyes.left.width, data[i].eyes.left.height);
            data[i].eyes.right.patch = new ImageData(new Uint8ClampedArray(data[i].eyes.right.patch), data[i].eyes.right.width, data[i].eyes.right.height);
            this.addData(data[i].eyes, data[i].screenPos, data[i].type);
        }
    };

    /**
     * Return the data
     * @returns {Array.<Object>|*}
     */
    webgazer.reg.RidgeRegThreaded.prototype.getData = function() {
        return this.dataClicks.data.concat(this.dataTrail.data);
    };

    /**
     * The RidgeRegThreaded object name
     * @type {string}
     */
    webgazer.reg.RidgeRegThreaded.prototype.name = 'ridge';
    
}(window));

'use strict';
(function() {

    self.webgazer = self.webgazer || {};
    self.webgazer.util = self.webgazer.util || {};
    self.webgazer.mat = self.webgazer.mat || {};

    /**
     * Eye class, represents an eye patch detected in the video stream
     * @param {ImageData} patch - the image data corresponding to an eye
     * @param {Number} imagex - x-axis offset from the top-left corner of the video canvas
     * @param {Number} imagey - y-axis offset from the top-left corner of the video canvas
     * @param {Number} width  - width of the eye patch
     * @param {Number} height - height of the eye patch
     */
    self.webgazer.util.Eye = function(patch, imagex, imagey, width, height) {
        this.patch = patch;
        this.imagex = imagex;
        this.imagey = imagey;
        this.width = width;
        this.height = height;
    };


    //Data Window class
    //operates like an array but 'wraps' data around to keep the array at a fixed windowSize
    /**
     * DataWindow class - Operates like an array, but 'wraps' data around to keep the array at a fixed windowSize
     * @param {Number} windowSize - defines the maximum size of the window
     * @param {Array} data - optional data to seed the DataWindow with
     **/
    self.webgazer.util.DataWindow = function(windowSize, data) {
        this.data = [];
        this.windowSize = windowSize;
        this.index = 0;
        this.length = 0;
        if(data){
            this.data = data.slice(data.length-windowSize,data.length);
            this.length = this.data.length;
        }
    };

    /**
     * [push description]
     * @param  {*} entry - item to be inserted. It either grows the DataWindow or replaces the oldest item
     * @return {DataWindow} this
     */
    self.webgazer.util.DataWindow.prototype.push = function(entry) {
        if (this.data.length < this.windowSize) {
            this.data.push(entry);
            this.length = this.data.length;
            return this;
        }

        //replace oldest entry by wrapping around the DataWindow
        this.data[this.index] = entry;
        this.index = (this.index + 1) % this.windowSize;
        return this;
    };

    /**
     * Get the element at the ind position by wrapping around the DataWindow
     * @param  {Number} ind index of desired entry
     * @return {*}
     */
    self.webgazer.util.DataWindow.prototype.get = function(ind) {
        return this.data[this.getTrueIndex(ind)];
    };

    /**
     * Gets the true this.data array index given an index for a desired element
     * @param {Number} ind - index of desired entry
     * @return {Number} index of desired entry in this.data
     */
    self.webgazer.util.DataWindow.prototype.getTrueIndex = function(ind) {
        if (this.data.length < this.windowSize) {
            return ind;
        } else {
            //wrap around ind so that we can traverse from oldest to newest
            return (ind + this.index) % this.windowSize;
        }
    };

    /**
     * Append all the contents of data
     * @param {Array} data - to be inserted
     */
    self.webgazer.util.DataWindow.prototype.addAll = function(data) {
        for (var i = 0; i < data.length; i++) {
            this.push(data[i]);
        }
    };


    //Helper functions
    /**
     * Grayscales an image patch. Can be used for the whole canvas, detected face, detected eye, etc.
     * @param  {Array} imageData - image data to be grayscaled
     * @param  {Number} imageWidth  - width of image data to be grayscaled
     * @param  {Number} imageHeight - height of image data to be grayscaled
     * @return {Array} grayscaledImage
     */
    self.webgazer.util.grayscale = function(imageData, imageWidth, imageHeight){
        //TODO implement ourselves to remove dependency
        return tracking.Image.grayscale(imageData, imageWidth, imageHeight, false);
    };

    /**
     * Increase contrast of an image
     * @param {Array} grayscaleImageSrc - grayscale integer array
     * @param {Number} step - sampling rate, control performance
     * @param {Array} destinationImage - array to hold the resulting image
     */
    self.webgazer.util.equalizeHistogram = function(grayscaleImageSrc, step, destinationImage) {
        //TODO implement ourselves to remove dependency
        return objectdetect.equalizeHistogram(grayscaleImageSrc, step, destinationImage);
    };

    self.webgazer.util.threshold = function(data, threshold) {
      for (let i = 0; i < data.length; i++) {
        data[i] = (data[i] > threshold) ? 255 : 0;
      }
      return data;
    };

    self.webgazer.util.correlation = function(data1, data2) {
      const length = Math.min(data1.length, data2.length);
      let count = 0;
      for (let i = 0; i < length; i++) {
        if (data1[i] === data2[i]) {
          count++;
        }
      }
      return count / Math.max(data1.length, data2.length);
    };

    /**
     * Gets an Eye object and resizes it to the desired resolution
     * @param  {webgazer.util.Eye} eye - patch to be resized
     * @param  {Number} resizeWidth - desired width
     * @param  {Number} resizeHeight - desired height
     * @return {webgazer.util.Eye} resized eye patch
     */
    self.webgazer.util.resizeEye = function(eye, resizeWidth, resizeHeight) {

        var canvas = document.createElement('canvas');
        canvas.width = eye.width;
        canvas.height = eye.height;

        canvas.getContext('2d').putImageData(eye.patch,0,0);

        var tempCanvas = document.createElement('canvas');

        tempCanvas.width = resizeWidth;
        tempCanvas.height = resizeHeight;

        // save the canvas into temp canvas
        tempCanvas.getContext('2d').drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, resizeWidth, resizeHeight);

        return tempCanvas.getContext('2d').getImageData(0, 0, resizeWidth, resizeHeight);
    };

    /**
     * Checks if the prediction is within the boundaries of the viewport and constrains it
     * @param  {Array} prediction [x,y] - predicted gaze coordinates
     * @return {Array} constrained coordinates
     */
    self.webgazer.util.bound = function(prediction){
        if(prediction.x < 0)
            prediction.x = 0;
        if(prediction.y < 0)
            prediction.y = 0;
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if(prediction.x > w){
            prediction.x = w;
        }

        if(prediction.y > h)
        {
            prediction.y = h;
        }
        return prediction;
    };

    /**
     * Write statistics in debug paragraph panel
     * @param {HTMLElement} para - The <p> tag where write data
     * @param {Object} stats - The stats data to output
     */
    function debugBoxWrite(para, stats) {
        var str = '';
        for (var key in stats) {
            str += key + ': ' + stats[key] + '\n';
        }
        para.innerText = str;
    }

    /**
     * Constructor of DebugBox object,
     * it insert an paragraph inside a div to the body, in view to display debug data
     * @param {Number} interval - The log interval
     * @constructor
     */
    self.webgazer.util.DebugBox = function(interval) {
        this.para = document.createElement('p');
        this.div = document.createElement('div');
        this.div.appendChild(this.para);
        document.body.appendChild(this.div);

        this.buttons = {};
        this.canvas = {};
        this.stats = {};
        var updateInterval = interval || 300;
        (function(localThis) {
            setInterval(function() {
                debugBoxWrite(localThis.para, localThis.stats);
            }, updateInterval);
        }(this));
    };

    /**
     * Add stat data for log
     * @param {String} key - The data key
     * @param {*} value - The value
     */
    self.webgazer.util.DebugBox.prototype.set = function(key, value) {
        this.stats[key] = value;
    };

    /**
     * Initialize stats in case where key does not exist, else
     * increment value for key
     * @param {String} key - The key to process
     * @param {Number} incBy - Value to increment for given key (default: 1)
     * @param {Number} init - Initial value in case where key does not exist (default: 0)
     */
    self.webgazer.util.DebugBox.prototype.inc = function(key, incBy, init) {
        if (!this.stats[key]) {
            this.stats[key] = init || 0;
        }
        this.stats[key] += incBy || 1;
    };

    /**
     * Create a button and register the given function to the button click event
     * @param {String} name - The button name to link
     * @param {Function} func - The onClick callback
     */
    self.webgazer.util.DebugBox.prototype.addButton = function(name, func) {
        if (!this.buttons[name]) {
            this.buttons[name] = document.createElement('button');
            this.div.appendChild(this.buttons[name]);
        }
        var button = this.buttons[name];
        this.buttons[name] = button;
        button.addEventListener('click', func);
        button.innerText = name;
    };

    /**
     * Search for a canvas elemenet with name, or create on if not exist.
     * Then send the canvas element as callback parameter.
     * @param {String} name - The canvas name to send/create
     * @param {Function} func - The callback function where send canvas
     */
    self.webgazer.util.DebugBox.prototype.show = function(name, func) {
        if (!this.canvas[name]) {
            this.canvas[name] = document.createElement('canvas');
            this.div.appendChild(this.canvas[name]);
        }
        var canvas = this.canvas[name];
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);
        func(canvas);
    };

    /**
     * Kalman Filter constructor
     * Kalman filters work by reducing the amount of noise in a models.
     * https://blog.cordiner.net/2011/05/03/object-tracking-using-a-kalman-filter-matlab/
     *
     * @param {Array.<Array.<Number>>} F - transition matrix
     * @param {Array.<Array.<Number>>} Q - process noise matrix
     * @param {Array.<Array.<Number>>} H - maps between measurement vector and noise matrix
     * @param {Array.<Array.<Number>>} R - defines measurement error of the device
     * @param {Array} P_initial - the initial state
     * @param {Array} X_initial - the initial state of the device
     */
    self.webgazer.util.KalmanFilter = function(F, H, Q, R, P_initial, X_initial) {
        this.F = F; // State transition matrix
        this.Q = Q; // Process noise matrix
        this.H = H; // Transformation matrix
        this.R = R; // Measurement Noise
        this.P = P_initial; //Initial covariance matrix
        this.X = X_initial; //Initial guess of measurement
    };

    /**
     * Get Kalman next filtered value and update the internal state
     * @param {Array} z - the new measurement
     * @return {Array}
     */
    self.webgazer.util.KalmanFilter.prototype.update = function(z) {

      // Here, we define all the different matrix operations we will need
      var add = numeric.add, sub = numeric.sub, inv = numeric.inv, identity = numeric.identity;
      var mult = webgazer.mat.mult, transpose = webgazer.mat.transpose;
      //TODO cache variables like the transpose of H

      // prediction: X = F * X  |  P = F * P * F' + Q
      var X_p = mult(this.F, this.X); //Update state vector
      var P_p = add(mult(mult(this.F,this.P), transpose(this.F)), this.Q); //Predicted covaraince

      //Calculate the update values
      var y = sub(z, mult(this.H, X_p)); // This is the measurement error (between what we expect and the actual value)
      var S = add(mult(mult(this.H, P_p), transpose(this.H)), this.R); //This is the residual covariance (the error in the covariance)

      // kalman multiplier: K = P * H' * (H * P * H' + R)^-1
      var K = mult(P_p, mult(transpose(this.H), inv(S))); //This is the Optimal Kalman Gain

      //We need to change Y into it's column vector form
      for(var i = 0; i < y.length; i++){
        y[i] = [y[i]];
      }

      //Now we correct the internal values of the model
      // correction: X = X + K * (m - H * X)  |  P = (I - K * H) * P
      this.X = add(X_p, mult(K, y));
      this.P = mult(sub(identity(K.length), mult(K,this.H)), P_p);
      return transpose(mult(this.H, this.X))[0]; //Transforms the predicted state back into it's measurement form
    };

}());

/*
 * Initialises variables used to store accuracy eigenValues
 * This is used by the calibration example file
 */
var store_points_var = false;
var xPast50 = new Array(50);
var yPast50 = new Array(50);

/*
 * Stores the position of the fifty most recent tracker preditions
 */
function store_points(x, y, k) {
  xPast50[k] = x;
  yPast50[k] = y;
}

(function(window, undefined) {
  console.log('initializing webgazer');
  //strict mode for type safety
  'use strict';

  //auto invoke function to bind our own copy of window and undefined

  //set up namespaces for modules
  window.webgazer = window.webgazer || {};
  webgazer = webgazer || {};
  webgazer.tracker = webgazer.tracker || {};
  webgazer.reg = webgazer.reg || {};
  webgazer.params = webgazer.params || {};

  //PRIVATE VARIABLES

  //video elements
  webgazer.params.videoScale = 1;
  var videoElement = null;
  var videoStream = null;
  var videoElementCanvas = null;
  webgazer.params.videoElementId = 'webgazerVideoFeed';
  webgazer.params.videoElementCanvasId = 'webgazerVideoCanvas';
  webgazer.params.imgWidth = 1280;
  webgazer.params.imgHeight = 720;

  //Params to clmtrackr and getUserMedia constraints
  webgazer.params.clmParams = webgazer.params.clmParams || {useWebGL : true};
  webgazer.params.camConstraints = webgazer.params.camConstraints || { video: true };

  webgazer.params.smoothEyeBB = webgazer.params.smoothEyeBB || true;

  //DEBUG variables
  //debug control boolean
  var showGazeDot = false;
  //debug element (starts offscreen)
  var gazeDot = document.createElement('div');
  gazeDot.style.position = 'fixed';
  gazeDot.style.zIndex = 99999;
  gazeDot.style.left = '-5px'; //'-999em';
  gazeDot.style.top  = '-5px';
  gazeDot.style.width = '10px';
  gazeDot.style.height = '10px';
  gazeDot.style.background = 'red';
  gazeDot.style.display = 'none';
  gazeDot.style.borderRadius = '100%';
  gazeDot.style.opacity = '0.7';

  var debugVideoLoc = '';

  // loop parameters
  var clockStart = performance.now();
  webgazer.params.dataTimestep = 50;
  var paused = false;
  //registered callback for loop
  var nopCallback = function(data, time) {};
  var callback = nopCallback;

  //Types that regression systems should handle
  //Describes the source of data so that regression systems may ignore or handle differently the various generating events
  var eventTypes = ['click', 'move'];

  //movelistener timeout clock parameters
  var moveClock = performance.now();
  webgazer.params.moveTickSize = 50; //milliseconds

  //currently used tracker and regression models, defaults to clmtrackr and linear regression
  var curTracker = new webgazer.tracker.ClmGaze();
  var regs = [new webgazer.reg.RidgeReg()];
  var blinkDetector = new webgazer.BlinkDetector();

  //lookup tables
  var curTrackerMap = {
      'clmtrackr': function() { return new webgazer.tracker.ClmGaze(); },
      'trackingjs': function() { return new webgazer.tracker.TrackingjsGaze(); },
      'js_objectdetect': function() { return new webgazer.tracker.Js_objectdetectGaze(); }
  };
  var regressionMap = {
      'ridge': function() { return new webgazer.reg.RidgeReg(); },
      'weightedRidge': function() { return new webgazer.reg.RidgeWeightedReg(); },
      'threadedRidge': function() { return new webgazer.reg.RidgeRegThreaded(); },
      'linear': function() { return new webgazer.reg.LinearReg(); }
  };

  //localstorage name
  var localstorageLabel = 'webgazerGlobalData';
  //settings object for future storage of settings
  var settings = {};
  var data = [];
  var defaults = {
      'data': [],
      'settings': {}
  };

  //PRIVATE FUNCTIONS

  /**
  * Checks if the pupils are in the position box on the video
  */
  function checkEyesInValidationBox() {
      var eyesObjs = curTracker.getEyePatches(videoElementCanvas,webgazer.params.imgWidth,webgazer.params.imgHeight);

      var validationBox = document.getElementById('faceOverlay');

      var xPositions = false;
      var yPositions = false;

      if (validationBox != null && eyesObjs) {
          //get the boundaries of the face overlay validation box
          leftBound = 107;
           topBound = 59;
           rightBound = leftBound + 117;
           bottomBound = topBound + 117;

          //get the x and y positions of the left and right eyes
           var eyeLX = eyesObjs.left.imagex;
          var eyeLY = eyesObjs.left.imagey;
           var eyeRX = eyesObjs.right.imagex;
           var eyeRY = eyesObjs.right.imagey;

          //check if the x values for the left and right eye are within the
          //validation box
          if (eyeLX > leftBound && eyeLX < rightBound) {
             if (eyeRX > leftBound && eyeRX < rightBound) {
                 xPositions = true;
             }
          }

          //check if the y values for the left and right eye are within the
          //validation box
          if (eyeLY > topBound && eyeLY < bottomBound) {
              if (eyeRY > topBound && eyeRY < bottomBound) {
                  yPositions = true;
              }
          }

          //if the x and y values for both the left and right eye are within
          //the validation box then the box border turns green, otherwise if
          //the eyes are outside of the box the colour is red
          if (xPositions && yPositions){
              validationBox.style.border = 'solid green';
          } else {
              validationBox.style.border = 'solid red';
          }
      }
  }

  /**
  * Alerts the user of the cursor position, used for debugging & testing
  */
  function checkCursor(){ //used to test
    alert("Cursor at: " + cursorX + ", " + cursorY);
  }

  /**
  * This draws the point (x,y) onto the canvas in the HTML
  * @param {colour} colour - The colour of the circle to plot
  * @param {x} x - The x co-ordinate of the desired point to plot
  * @param {y} y - The y co-ordinate of the desired point to plot
  */
  function drawCoordinates(colour,x,y){
      var ctx = document.getElementById("plotting_canvas").getContext('2d');
      ctx.fillStyle = colour; // Red color
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2, true);
      ctx.fill();
  }

  /**
   * Gets the pupil features by following the pipeline which threads an eyes object through each call:
   * curTracker gets eye patches -> blink detector -> pupil detection
   * @param {Canvas} canvas - a canvas which will have the video drawn onto it
   * @param {Number} width - the width of canvas
   * @param {Number} height - the height of canvas
   */
  function getPupilFeatures(canvas, width, height) {
      if (!canvas) {
          return;
      }
      paintCurrentFrame(canvas, width, height);
      try {
          return blinkDetector.detectBlink(curTracker.getEyePatches(canvas, width, height));
      } catch(err) {
          console.log(err);
          return null;
      }
  }

  /**
   * Gets the most current frame of video and paints it to a resized version of the canvas with width and height
   * @param {Canvas} canvas - the canvas to paint the video on to
   * @param {Number} width - the new width of the canvas
   * @param {Number} height - the new height of the canvas
   */
  function paintCurrentFrame(canvas, width, height) {
      //imgWidth = videoElement.videoWidth * videoScale;
      //imgHeight = videoElement.videoHeight * videoScale;
      if (canvas.width != width) {
          canvas.width = width;
      }
      if (canvas.height != height) {
          canvas.height = height;
      }

      var ctx = canvas.getContext('2d');
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  }

  /**
   * Paints the video to a canvas and runs the prediction pipeline to get a prediction
   * @param {Number|undefined} regModelIndex - The prediction index we're looking for
   * @returns {*}
   */
  function getPrediction(regModelIndex) {
      var predictions = [];
      var features = getPupilFeatures(videoElementCanvas, webgazer.params.imgWidth, webgazer.params.imgHeight);
      if (regs.length === 0) {
          console.log('regression not set, call setRegression()');
          return null;
      }
      for (var reg in regs) {
          predictions.push(regs[reg].predict(features));
      }
      if (regModelIndex !== undefined) {
          return predictions[regModelIndex] === null ? null : {
              'x' : predictions[regModelIndex].x,
              'y' : predictions[regModelIndex].y
          };
      } else {
          return predictions.length === 0 || predictions[0] === null ? null : {
              'x' : predictions[0].x,
              'y' : predictions[0].y,
              'all' : predictions
          };
      }
  }

  /**
   * Runs every available animation frame if webgazer is not paused
   */
  var smoothingVals = new webgazer.util.DataWindow(4);
  var k = 0;

  function loop() {
      var gazeData = getPrediction();
      var elapsedTime = performance.now() - clockStart;

      callback(gazeData, elapsedTime);

      if (gazeData && showGazeDot) {

          smoothingVals.push(gazeData);
          var x = 0;
          var y = 0;
          var len = smoothingVals.length;
          for (var d in smoothingVals.data) {
              x += smoothingVals.get(d).x;
              y += smoothingVals.get(d).y;
          }
          var pred = webgazer.util.bound({'x':x/len, 'y':y/len});

          if (store_points_var) {
            drawCoordinates('blue',pred.x,pred.y); //draws the previous predictions
            //store the position of the past fifty occuring tracker preditions
            store_points(pred.x, pred.y, k);
            k++;
            if (k == 50) {
              k = 0;
            }
          }
          gazeDot.style.transform = 'translate3d(' + pred.x + 'px,' + pred.y + 'px,0)';

          //Check that the eyes are inside of the validation box
          checkEyesInValidationBox();
      }

      if (!paused) {
          //setTimeout(loop, webgazer.params.dataTimestep);
          requestAnimationFrame(loop);
      }
  }

  /**
   * Records screen position data based on current pupil feature and passes it
   * to the regression model.
   * @param {Number} x - The x screen position
   * @param {Number} y - The y screen position
   * @param {String} eventType - The event type to store
   * @returns {null}
   */
  var recordScreenPosition = function(x, y, eventType) {
      if (paused) {
          return;
      }
      var features = getPupilFeatures(videoElementCanvas, webgazer.params.imgWidth, webgazer.params.imgHeight);
      if (regs.length === 0) {
          console.log('regression not set, call setRegression()');
          return null;
      }
      for (var reg in regs) {
          regs[reg].addData(features, [x, y], eventType);
      }
  };

  /**
   * Records click data and passes it to the regression model
   * @param {Event} event - The listened event
   */
  var clickListener = function(event) {
      recordScreenPosition(event.clientX, event.clientY, eventTypes[0]); // eventType[0] === 'click'
  };

  /**
   * Records mouse movement data and passes it to the regression model
   * @param {Event} event - The listened event
   */
  var moveListener = function(event) {
      if (paused) {
          return;
      }

      var now = performance.now();
      if (now < moveClock + webgazer.params.moveTickSize) {
          return;
      } else {
          moveClock = now;
      }
      recordScreenPosition(event.clientX, event.clientY, eventTypes[1]); //eventType[1] === 'move'
  };

  /**
   * Add event listeners for mouse click and move.
   */
  var addMouseEventListeners = function() {
      //third argument set to true so that we get event on 'capture' instead of 'bubbling'
      //this prevents a client using event.stopPropagation() preventing our access to the click
      document.addEventListener('click', clickListener, true);
      document.addEventListener('mousemove', moveListener, true);
  };

  /**
   * Remove event listeners for mouse click and move.
   */
  var removeMouseEventListeners = function() {
      // must set third argument to same value used in addMouseEventListeners
      // for this to work.
      document.removeEventListener('click', clickListener, true);
      document.removeEventListener('mousemove', moveListener, true);
  };

  /**
   * Loads the global data and passes it to the regression model
   */
  function loadGlobalData() {
      var storage = JSON.parse(window.localStorage.getItem(localstorageLabel)) || defaults;
      settings = storage.settings;
      data = storage.data;
      for (var reg in regs) {
          regs[reg].setData(storage.data);
      }
  }

 /**
  * Constructs the global storage object and adds it to local storage
  */
  function setGlobalData() {
      var storage = {
          'settings': settings,
          'data': regs[0].getData() || data
      };
      window.localStorage.setItem(localstorageLabel, JSON.stringify(storage));
      //TODO data should probably be stored in webgazer object instead of each regression model
      //     -> requires duplication of data, but is likely easier on regression model implementors
  }

  /**
   * Clears data from model and global storage
   */
  function clearData() {
      window.localStorage.set(localstorageLabel, undefined);
      for (var reg in regs) {
          regs[reg].setData([]);
      }
  }

  /**
   * Initializ es all needed dom elements and begins the loop
   * @param {URL} videoStream - The video stream to use
   */
  function init(videoStream) {
      videoElement = document.createElement('video');
      videoElement.id = webgazer.params.videoElementId;
      videoElement.autoplay = true;
      console.log(videoElement);
      videoElement.style.display = 'none';

      // set the video source as the stream
      if ("srcObject" in videoElement) {
        videoElement.srcObject = videoStream;
      } else {
        throw "Browser not supported by getUserMedia";
      }

      document.body.appendChild(videoElement);

      videoElementCanvas = document.createElement('canvas');
      videoElementCanvas.id = webgazer.params.videoElementCanvasId;
      videoElementCanvas.style.display = 'none';
      document.body.appendChild(videoElementCanvas);

      addMouseEventListeners();

      document.body.appendChild(gazeDot);

      //BEGIN CALLBACK LOOP
      paused = false;

      clockStart = performance.now();

      loop();
  }

  /**
   * Initializes navigator.mediaDevices.getUserMedia
   * depending on the browser capabilities
   */
  function setUserMediaVariable(){

    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {

        // gets the alternative old getUserMedia is possible
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // set an error message if browser doesn't support getUserMedia
        if (!getUserMedia) {
          return Promise.reject(new Error("Unfortunately, your browser does not support access to the webcam through the getUserMedia API. Try to use Google Chrome, Mozilla Firefox, Opera, or Microsoft Edge instead."));
        }

        // uses navigator.getUserMedia for older browsers
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, options, resolve, reject);
        });
      }
    }
  }

  //PUBLIC FUNCTIONS - CONTROL

  /**
   * Starts all state related to webgazer -> dataLoop, video collection, click listener
   * If starting fails, call `onFail` param function.
   * @param {Function} onFail - Callback to call in case it is impossible to find user camera
   * @returns {*}
   */
  webgazer.begin = function(onFail) {
      loadGlobalData();

      onFail = onFail || function() {console.log('No stream')};

      if (debugVideoLoc) {
          init(debugVideoLoc);
          return webgazer;
      }

      //SETUP VIDEO ELEMENTS
      var options = webgazer.params.camConstraints;

      // sets .mediaDevices.getUserMedia depending on browser
      setUserMediaVariable();

      // request webcam access
      navigator.mediaDevices.getUserMedia(options)
      .then(function(stream){ // set the stream
        console.log('Video stream created');
        videoStream = stream;
        init(stream);
      })
      .catch(function(err) { // error handling
        onFail();
        videoElement = null;
        videoStream = null;
      });

      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.chrome){
          alert("WebGazer works only over https. If you are doing local development you need to run a local server.");
      }

      return webgazer;
  };

  /**
   * Checks if webgazer has finished initializing after calling begin()
   * @returns {boolean} if webgazer is ready
   */
  webgazer.isReady = function() {
      if (videoElementCanvas === null) {
          return false;
      }
      paintCurrentFrame(videoElementCanvas, webgazer.params.imgWidth, webgazer.params.imgHeight);
      return videoElementCanvas.width > 0;
  };

  /**
   * Stops collection of data and predictions
   * @returns {webgazer} this
   */
  webgazer.pause = function() {
      paused = true;
      return webgazer;
  };

  /**
   * Resumes collection of data and predictions if paused
   * @returns {webgazer} this
   */
  webgazer.resume = function() {
      if (!paused) {
          return webgazer;
      }
      paused = false;
      loop();
      return webgazer;
  };

  /**
   * stops collection of data and removes dom modifications, must call begin() to reset up
   * @return {webgazer} this
   */
  webgazer.end = function() {
      //loop may run an extra time and fail due to removed elements
      paused = true;

      //webgazer.stopVideo(); // uncomment if you want to stop the video from streaming

      //remove video element and canvas
      document.body.removeChild(videoElement);
      document.body.removeChild(videoElementCanvas);

      setGlobalData();
      return webgazer;
  };

  /**
  * Stops the video camera from streaming and removes the video outlines
  * @return {webgazer} this
  */
  webgazer.stopVideo = function() {
    // stops the video from streaming
    videoStream.getTracks()[0].stop();

    //removes the box around the face
    var faceBox = document.getElementById('faceOverlay');
    document.body.removeChild(faceBox);

    //removes the outline of the face
    var overlay = document.getElementById('overlay');
    document.body.removeChild(overlay);

    return webgazer;
  }


  //PUBLIC FUNCTIONS - DEBUG

  /**
   * Returns if the browser is compatible with webgazer
   * @return {boolean} if browser is compatible
   */
  webgazer.detectCompatibility = function() {

    var getUserMedia = navigator.mediaDevices.getUserMedia ||
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    return getUserMedia !== undefined;
  };

  /**
   * Displays the calibration point for debugging
   * @return {webgazer} this
   */
  webgazer.showPredictionPoints = function(bool) {
      showGazeDot = bool;
      gazeDot.style.left = '-5px';
      gazeDot.style.display = bool ? 'block' : 'none';
      return webgazer;
  };

  /**
   *  Set a static video file to be used instead of webcam video
   *  @param {String} videoLoc - video file location
   *  @return {webgazer} this
   */
  webgazer.setStaticVideo = function(videoLoc) {
     debugVideoLoc = videoLoc;
     return webgazer;
  };

  /**
   *  Add the mouse click and move listeners that add training data.
   *  @return {webgazer} this
   */
  webgazer.addMouseEventListeners = function() {
      addMouseEventListeners();
      return webgazer;
  };

  /**
   *  Remove the mouse click and move listeners that add training data.
   *  @return {webgazer} this
   */
  webgazer.removeMouseEventListeners = function() {
      removeMouseEventListeners();
      return webgazer;
  };

  /**
   *  Records current screen position for current pupil features.
   *  @param {String} x - position on screen in the x axis
   *  @param {String} y - position on screen in the y axis
   *  @return {webgazer} this
   */
  webgazer.recordScreenPosition = function(x, y) {
      // give this the same weight that a click gets.
      recordScreenPosition(x, y, eventTypes[0]);
      return webgazer;
  };


  //SETTERS
  /**
   * Sets the tracking module
   * @param {String} name - The name of the tracking module to use
   * @return {webgazer} this
   */
  webgazer.setTracker = function(name) {
      if (curTrackerMap[name] === undefined) {
          console.log('Invalid tracker selection');
          console.log('Options are: ');
          for (var t in curTrackerMap) {
              console.log(t);
          }
          return webgazer;
      }
      curTracker = curTrackerMap[name]();
      return webgazer;
  };

  /**
   * Sets the regression module and clears any other regression modules
   * @param {String} name - The name of the regression module to use
   * @return {webgazer} this
   */
  webgazer.setRegression = function(name) {
      if (regressionMap[name] === undefined) {
          console.log('Invalid regression selection');
          console.log('Options are: ');
          for (var reg in regressionMap) {
              console.log(reg);
          }
          return webgazer;
      }
      data = regs[0].getData();
      regs = [regressionMap[name]()];
      regs[0].setData(data);
      return webgazer;
  };

  /**
   * Adds a new tracker module so that it can be used by setTracker()
   * @param {String} name - the new name of the tracker
   * @param {Function} constructor - the constructor of the curTracker object
   * @return {webgazer} this
   */
  webgazer.addTrackerModule = function(name, constructor) {
      curTrackerMap[name] = function() {
          return new constructor();
      };
  };

  /**
   * Adds a new regression module so that it can be used by setRegression() and addRegression()
   * @param {String} name - the new name of the regression
   * @param {Function} constructor - the constructor of the regression object
   */
  webgazer.addRegressionModule = function(name, constructor) {
      regressionMap[name] = function() {
          return new constructor();
      };
  };

  /**
   * Adds a new regression module to the list of regression modules, seeding its data from the first regression module
   * @param {string} name - the string name of the regression module to add
   * @return {webgazer} this
   */
  webgazer.addRegression = function(name) {
      var newReg = regressionMap[name]();
      data = regs[0].getData();
      newReg.setData(data);
      regs.push(newReg);
      return webgazer;
  };

  /**
   * Sets a callback to be executed on every gaze event (currently all time steps)
   * @param {function} listener - The callback function to call (it must be like function(data, elapsedTime))
   * @return {webgazer} this
   */
  webgazer.setGazeListener = function(listener) {
      callback = listener;
      return webgazer;
  };

  /**
   * Removes the callback set by setGazeListener
   * @return {webgazer} this
   */
  webgazer.clearGazeListener = function() {
      callback = nopCallback;
      return webgazer;
  };


  //GETTERS
  /**
   * Returns the tracker currently in use
   * @return {tracker} an object following the tracker interface
   */
  webgazer.getTracker = function() {
      return curTracker;
  };

  /**
   * Returns the regression currently in use
   * @return {Array.<Object>} an array of regression objects following the regression interface
   */
  webgazer.getRegression = function() {
      return regs;
  };

  /**
   * Requests an immediate prediction
   * @return {object} prediction data object
   */
  webgazer.getCurrentPrediction = function() {
      return getPrediction();
  };

  /**
   * returns the different event types that may be passed to regressions when calling regression.addData()
   * @return {Array} array of strings where each string is an event type
   */
  webgazer.params.getEventTypes = function() {
      return eventTypes.slice();
  }

}(window));
