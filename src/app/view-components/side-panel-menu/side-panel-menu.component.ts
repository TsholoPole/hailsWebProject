import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentModel } from '../../models/content.models/content.model';
import { ContentProviderMapper } from '../../services/content-services/content-provider-apper.service';
import { ProvideContentRequest } from '../../models/request.models/provideContentRequest.model';

@Component({
  selector: 'app-side-panel-menu',
  templateUrl: './side-panel-menu.component.html',
  styleUrls: ['./side-panel-menu.component.css']
})
export class SidePanelMenuComponentComponent implements OnInit {

  selectedIndex : number;
  chapterOne = "Chapter 1";
  chapterTwo = "Chapter 2";
  chapterThree = "Chapter 3";
  glossary = "Glossary";

  chapterList = [{name: "Chapter 1"},
{name: "Chapter 2"}, {name: "Chapter 3"},
{name: "Glossary"}];

selected = false;


chapterOneSections = [{name: "Introduction", value:1},{name:"Variables", value:2},{name: "Examples", value:3}]
chapterTwoSections = [{name: "Continuation", value:1},{name:"What we have learned so far", value:2},{name: "Functions", value:3}]

chapterThreeSections = [{name: "Classes"},{name:"Composition"},{name: "Aggregation"}]

  constructor(private router: Router, private contentProviderMapper:ContentProviderMapper) { }

  ngOnInit() {
  }

  activeSection(selected: any)
  {
    this.selectedIndex = selected;

    alert("Clicked: " + selected+1);
    this.selected = true;


//create request model to send request to get related content

    let provideContentRequest = new ProvideContentRequest();
    provideContentRequest.sectionIdentifier = selected+1;
    // provideContentRequest.chapterIdentifier = 

    this.contentProviderMapper.onUpdateContentList(provideContentRequest);
    //compare three arrays content to get which chapter the section belongs to
    // let ContentModel = new ContentModel();

    // ContentModel.sectionIdentifier = selected;

    // description : string;
    // sectionIdentifier: Number;
    // chapterIdentifier: Number;
    // mainHeading: string;
    // subHeading: string;

    this.router.navigate(['/content']);
  }
  activeSectionTwo(selected: any)
  {
    this.selectedIndex = selected;

    alert("Clikced: " + selected);
    this.selected = true;

    this.router.navigate(['/content']);
  }
  activeSectionThree(selected: any)
  {
    this.selectedIndex = selected;

    alert("Clikced: " + selected);
    this.selected = true;

    this.router.navigate(['/content']);
  }

  activeChapter()
  {

  }

}
