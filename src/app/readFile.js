
/// <reference path="../../node_modules/@types/node/index.d.ts"/>

window.onload(() => {

  class ReadFile
  {
   // Here we import the File System module of node
   fs = require('fs');

   constructor() { }

   openFile() {
    alert("Starting");

    this.fs.readFile('file:///C:/Users/Tpe/Documents/GazeRecorderResults/Result1/ScreenRecorderPath.dat',
      function (err, data) {
          if (err) {
              return console.error(err);
          }
          console.log("Asynchronous read: " + data.toString());
      });
    }

  }

  //usage

  var obj = new ReadFile();
  obj.openFile();

})

