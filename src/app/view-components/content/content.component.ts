import { Component, OnInit } from '@angular/core';
import { ContentModel } from '../../models/content.models/content.model';
import { HeaderUsernameService } from '../../services/header-information-services/header-content.service';
import { ContentProviderService } from '../../services/content-services/content-provider.service';
import { ProvideContentRequest } from '../../models/request.models/provideContentRequest.model';
import { Response } from '@angular/http';
import { ChapterOneSectionOneContent } from './chapter-one-section-one-content';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {

  sectionContentList : ContentModel[] = [];
  subHeading:string = "";
  sectionContent : string = "";
  currentContent = new ContentModel();
  index: number = 0;

  chapterOneSectionOne = new ChapterOneSectionOneContent();

  viewContentFromServer : ContentModel[] = [];

  resultListLength = 0;

  constructor(private headerUsernameService:HeaderUsernameService,
     private contentProviderService: ContentProviderService) { }

  ngOnInit() {
    
    this.currentContent = this.chapterOneSectionOne.currentContent;
    this.populateContent();
  
  }


  getContentLength():number
  {
    return this.sectionContentList.length;
  }

  populateContent()
  {
    for(let index =0; index < 5; index++)
    {
      this.sectionContentList.push( this.currentContent );
    }

    this.displayCurrentContent(this.sectionContentList[0]);
  }

  displayCurrentContent(currentContentModel:ContentModel)
  {
    console.log(this.currentContent);
    //map current content to the view
    this.headerUsernameService.changeHeaderSection(currentContentModel.mainHeading);
    this.subHeading =  currentContentModel.subHeading;
    this.sectionContent = currentContentModel.description;
  }

  nextPage()
  {
  
    alert("Next");
    //always assume user starts at index 0
    if(this.index <= (this.sectionContentList.length -1))
    {
      this.index = this.index + 1;
      this.displayCurrentContent(this.sectionContentList[this.index]);
    }
    else
    {//add code to send new request to get next section content
      alert("End of list");
      this.displayCurrentContent(this.sectionContentList[this.index]);
    }
    
  }

  previousPage()
  {
    alert("Previous");
    //whatever index user is coming from
    if(!(this.index <= 0))
    {
      this.index = this.index - 1;
      this.displayCurrentContent(this.sectionContentList[this.index]);
    }
    else{
      alert("start of list");
      this.displayCurrentContent(this.sectionContentList[this.index]);
    }
    
  }

}
