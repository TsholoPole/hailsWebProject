import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { SuggestionService } from './services/suggestion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'app';
  fileData : any;

  showSuggestions = true;
  hideSuggestions = false;
  dataExists = false;
  // fs = require('fs');

  constructor(private http: Http,
    private suggestionService: SuggestionService){
      // setTimeout(() => {
      //   this.showSuggestions = false;
      //   this.hideSuggestions = true;
      // }, 5000);
    }

  ngOnInit(): void {

    // setTimeout(() => {
    //   this.showSuggestions = false;
    //   this.hideSuggestions = true;
    // }, 5000);

    setInterval(() => {
      this.checkGazeData();
      console.log('\n\n',this.fileData,'\n\n');
    }, 5000);


  }

  checkGazeData()
  {
    this.suggestionService.checkIfDataExists()
    .subscribe(res => {

       this.dataExists = res.json();
       console.log("\n\n Gaze data: ", this.dataExists);
       if(this.dataExists == true)
       {
         this. gazeDataExists();
       }
       else{
        //hide suggestions
       }
    });
  }


  gazeDataExists(){
    this.suggestionService.getSuggestions()
    .subscribe(res => {
      console.log("\n\n\nResponse: ", res, '\n\n\n')
      // this.fileData = [];
      this.fileData = res.json();

      // for(let temp in res.json())
      // {
      //   if(temp == null)
      //   {
      //     temp = {name:"No mapped data"}.name;
      //     this.fileData.push(temp)
      //   }
      //   else{
      //     this.fileData.push(temp)
      //   }
      // }

      // setTimeout(() => {
      //   for(let item in this.fileData)
      //   {
      //     item = {name:"No mapped data"}.name;
      //   }
      //   // this.fileData = null;
      // }, 10000);
    });

  }


}
