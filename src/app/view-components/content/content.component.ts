import { Component, OnInit } from '@angular/core';
import { ContentModel } from '../../models/content.models/content.model';
import { HeaderUsernameService } from '../../services/header-information-services/header-content.service';
import { ContentProviderService } from '../../services/content-services/content-provider.service';
import { ProvideContentRequest } from '../../models/request.models/provideContentRequest.model';
import { Response } from '@angular/http';
import { ChapterOneSectionContentProviderService } from './chapter-one-section-provider.service';
import { Subscription } from 'rxjs';
import { ActiveSectionService } from '../side-panel-menu/services/active-section.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {

  chapterOneSectionOneContent: ContentModel[] = [];
  currentContent = new ContentModel();
  index = 0;
  subHeading = '';
  sectionContent  = '';

  // viewContentFromServer : ContentModel[];

  resultListLength = 0;

  constructor(private headerUsernameService: HeaderUsernameService,
    private chapterOneSectionContentProviderService: ChapterOneSectionContentProviderService,
    private activeSectionService: ActiveSectionService) { }

  ngOnInit() {

    this.chapterOneSectionContentProviderService.getChapterOneContent().subscribe(
      content => {
        this.chapterOneSectionOneContent = content;
      }
    );

    setTimeout(() => {
      this.populateContent();
    }, 2000);

  }


  createContentForDisplay(chap: number, section: number) {
    this.activeSectionService.determineActiveSection(section);

    console.log("Chap: ", chap, "Section: ",section);
   switch (chap) {
    case 1:
    console.log("\n\nChapter is 1\n\n")
      switch (section) {
        case 1:
        console.log("\n\nSection is 1\n\n")
        this.chapterOneSectionContentProviderService.getChapterOneContent().subscribe(
          content => {
            console.log("\n\nContent from chap 1, section 1", content,"\n\n")
            this.chapterOneSectionOneContent = content;
            console.log("\n\nContent after switch statement one",  this.chapterOneSectionOneContent,"\n\n")

          }
        );
        break;
        case 2:
        this.chapterOneSectionContentProviderService.getChapterOneSectionTwoContent().subscribe(
          content => {
            this.chapterOneSectionOneContent = content;
          }
        );
        break;
        case 3:
        this.chapterOneSectionContentProviderService.getChapterOneSectionThreeContent().subscribe(
          content => {
            this.chapterOneSectionOneContent = content;
          }
        );
      }

      break;
    case 2:
      switch (section) {
        case 1:
        break;

        case 2:
        break;

        case 3:
      }

      break;
    case 3:
      switch (section) {
        case 1:
        break;

        case 2:
        break;

        case 3:
      }

      default:
        this.chapterOneSectionContentProviderService.getChapterOneSectionTwoContent().subscribe(
          content => {
            this.chapterOneSectionOneContent = content;
          }
        );

   }
   console.log("\n\nContent after switch statement",  this.chapterOneSectionOneContent,"\n\n")

  }
  getContentLength(): number {
    return this.chapterOneSectionOneContent.length;
  }

  populateContent() {
    console.log("\n\nContent in display current content",this.chapterOneSectionOneContent,"\n\n");
    this.displayCurrentContent(this.chapterOneSectionOneContent[0]);
  }

  displayCurrentContent(currentContentModel: ContentModel) {
    this.activeSectionService.determineActiveSection(currentContentModel.sectionIdentifier);

    console.log("\n\nCurrent content",currentContentModel,"\n\n");
    // map current content to the view
    this.headerUsernameService.changeHeaderSection(currentContentModel.mainHeading);
    this.subHeading =  currentContentModel.subHeading;
    this.sectionContent = currentContentModel.description;
  }

  nextPage() {

    alert('Next');
    // always assume user starts at index 0
    if (this.index <= (this.chapterOneSectionOneContent.length - 1)) {
      this.index = this.index + 1;
      this.displayCurrentContent(this.chapterOneSectionOneContent[this.index]);
    } else {
      // add code to send new request to get next section content
      alert('End of list');
      this.chapterOneSectionOneContent = [];
      this.getChapterOneSectionTwoData();
      // this.displayCurrentContent(this.chapterOneSectionOneContent[this.index]);
    }
  }

  getChapterOneSectionTwoData() {
    this.chapterOneSectionContentProviderService.getChapterOneSectionTwoContent().subscribe(
      content => {
        // console.log("\n\nContent from db",content,"\n\n");
        this.chapterOneSectionOneContent = content;
        // console.log("\n\nContent from chapter one",this.chapterOneSectionOneContent,"\n\n");
      }
    );
    this.populateContent();
  }

  getChapterOneSectionThreeData() {
    this.chapterOneSectionContentProviderService.getChapterOneSectionThreeContent().subscribe(
      content => {
        // console.log("\n\nContent from db",content,"\n\n");
        this.chapterOneSectionOneContent = content;
        // console.log("\n\nContent from chapter one",this.chapterOneSectionOneContent,"\n\n");
      }
    );
    this.populateContent();
  }


  previousPage() {
    alert('Previous');
    // whatever index user is coming from
    if (!(this.index <= 0)) {
      this.index = this.index - 1;
      this.displayCurrentContent(this.chapterOneSectionOneContent[this.index]);
    } else {
      alert('start of list');
      this.displayCurrentContent(this.chapterOneSectionOneContent[this.index]);
    }

  }

}
