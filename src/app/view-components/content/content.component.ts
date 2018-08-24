import { Component, OnInit } from '@angular/core';
import { ContentModel } from '../../models/content.models/content.model';
import { HeaderUsernameService } from '../../services/header-information-services/header-content.service';
import { ContentProviderService } from '../../services/content-services/content-provider.service';
import { ProvideContentRequest } from '../../models/request.models/provideContentRequest.model';
import { Response } from '@angular/http';

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

  viewContentFromServer : ContentModel[] = [];

  resultListLength = 0;

  constructor(private headerUsernameService:HeaderUsernameService,
     private contentProviderService: ContentProviderService) { }

  ngOnInit() {
    this.currentContent.mainHeading = "Testing main heading";
    this.currentContent.subHeading = "Introduction to C++";
    this.currentContent.description = "In this chapter, you will learn the basic elements and concepts of the C++" +
    " programming language to create C++ programs. In addition to giving examples to illustrate various"+
    " concepts, we will also show C++ programs to clarify them. In this section, we provide an" +
    " example of a C++ program. At this point, you need not be too concerned with the " +
    " details of this program. You only need to know the effect of an output statement, which is " +
   " introduced in this program.";

   this.populateContent();
  
  }

  mapContent()
  {
   let provideContentRequest : ProvideContentRequest = new ProvideContentRequest();


    this.contentProviderService.getLearningSectionContent(provideContentRequest)
    .subscribe(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        
        //map content from server to the content being displayed on the view
        if(data != undefined && data.content != null)
        {
          this.resultListLength = data.content.length;

          if(this.resultListLength >= 1)
          {
            data.content.forEach(content => {
              let contentModel = new ContentModel();
              contentModel.chapterIdentifier = content.chapterIdentifier;
              contentModel.description = content.description;
              contentModel.mainHeading = content.mainHeading;
              contentModel.sectionIdentifier = content.sectionIdentifier;
              contentModel.subHeading = content.subHeading;

              this.viewContentFromServer.push(contentModel);

            });
           
          }
        }

      },
      (error)=> {
        //handle errors form server
      }
    )
  }

  getContentLength():number
  {
    return this.sectionContentList.length;
  }

  populateContent()
  {
    for(let index =0; index < 5; index++)
    {
      this.sectionContentList.push(this.currentContent);
    }

    this.displayCurrentContent(this.sectionContentList[0]);
  }

  displayCurrentContent(currentContentModel:ContentModel)
  {
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
