import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
// import * as fs from "file-system";
// import fs = require('fs');
// fs.readFileSync('file:///C:/Users/Tpe/Documents/GazeRecorderResults/Result1/ScreenRecorderPath.dat','utf8');
//<reference path="../../node_modules/@types/node/index.d.ts"/>
//<reference types="core-js" />
//<reference types="node" />
/// <reference types="require" />s

// declare var require: any;
// import jsonfile = require('jsonfile');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';
  fileData : any;

  // fs = require('fs');

  constructor(private http: Http){}

  ngOnInit(): void {
    alert("In ng oninit file");
    this.openFile();
  }

  openFile() {
    alert("Starting");

    // this.fs.readFile('file:///C:/Users/Tpe/Documents/GazeRecorderResults/Result1/ScreenRecorderPath.dat',
    //   function (err, data) {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     console.log("Asynchronous read: " + data.toString());
    // });

    // var txtFile = new XMLHttpRequest();
    // let  allText;
    // alert("created text variable " + txtFile);
    // txtFile.open("GET", "file:///C:/Users/Tpe/Documents/GazeRecorderResults/Result1/ScreenRecorderPath.dat", false);
    // alert("After sending the request");
    // allText =  txtFile.responseText;
    // alert(allText);
    // console.log("Data from the file: ", allText);

    // txtFile.onreadystatechange = function() {
    //   alert("on ready state change");
    //   if (txtFile.readyState === 4) {
    //     alert("REady state is 4");
    //     if(txtFile.status === 2000 || txtFile.status == 0)
    //     {
    //       allText =  txtFile.responseText;
    //       alert(allText);
    //       console.log("Data from the file: ", allText);
    //     }
    //     console.log("Data from the file: ", allText);

    //   }
    //   else{
    //     alert("Failed to get data from file!!!");
    //     console.log("\n\nFailed to get data\n");
    //   }
    //   console.log("Data from file after onreadyStateChange: ", allText);
    // }
    // alert("Skipped on ready state change");
    // txtFile.send();


    // alert("Using http to get data from file");
    this.http.get("file:///C:/Users/Tpe/Documents/GazeRecorderResults/Result1/ScreenRecorderPath.dat")
    // .map(res => { var data = res.json(); return data;});
    .subscribe(data => {
      alert("the data in the file " + data);
        this.fileData = data;
        console.log("Data from file: ", this.fileData);
    });



    // alert("Using jsonfile library");
    // const file = 'file:///C:/Users/Tpe/Documents/GazeRecorderResults/Result1/ScreenRecorderPath.dat';
    // jsonfile.readFile(file, function(err, obj) {
    //   if(err) console.log("Returned error", err);
    //   console.log(obj);
    // });

  }


}
