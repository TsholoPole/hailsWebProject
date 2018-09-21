import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentModel } from '../../models/content.models/content.model';
import { ContentProviderMapper } from '../../services/content-services/content-provider-apper.service';
import { ProvideContentRequest } from '../../models/request.models/provideContentRequest.model';
import { ContentComponent } from '../content/content.component';
import { ActiveSectionService } from './services/active-section.service';

@Component({
  selector: 'app-side-panel-menu',
  templateUrl: './side-panel-menu.component.html',
  styleUrls: ['./side-panel-menu.component.css']
})
export class SidePanelMenuComponentComponent implements OnInit {

  selectedIndex: number;
  chapterOne = 'Chapter 1: BASIC ELEMENTS OF C++';
  chapterTwo = 'Chapter 2: Data Types';
  chapterThree = 'Chapter 3: Arithmetic Operators and Operator Precedence';
  glossary = 'Glossary';

  chapterList = [{name: this.chapterOne},
    {name: this.chapterTwo}, {name: this.chapterThree},
    {name: this.glossary}];

chapterOneSections = [{name: 'A C++ Program', value: 1}, {name: 'The Basics of a C++ Program', value: 2}, {name: 'Identifiers', value: 3}];
chapterTwoSections = [{name: 'Introduction', value: 1}, {name: 'Simple Data Types', value: 2}, {name: 'Floating Point Data Types', value: 3} ];

chapterThreeSections = [{name: 'Arithmetic Operators'}, {name: 'Examples'}, {name: 'Order of Precedence'}];
activeSectionId : number;

  constructor(private router: Router, private contentComponent: ContentComponent,
    private activeSectionService: ActiveSectionService) { }

  ngOnInit() {
    this.activeSectionId = this.activeSectionService.returnActiveSection();
  }

  activeSection(selected: any) {

    const tempIndex = selected + 1;
    this.activeSectionId = this.activeSectionService.returnActiveSection();

    alert('Clicked: ' + selected);

    this.contentComponent.createContentForDisplay(1, (tempIndex));
    // setTimeout(() => {
      this.router.navigate(['/content']);
    // }, 1500);
    alert('Go to chapter 1');

  }

  activeSectionTwo(selected: any) {
    this.selectedIndex = selected;
    this.activeSectionId = this.activeSectionService.returnActiveSection();

    alert('Clikced: ' + selected+1);
    this.contentComponent.createContentForDisplay(1, (selected + 1));
    // setTimeout(() => {
      this.router.navigate(['/content']);
    // }, 1500);
    alert('Go to chapter 2');
  }

  activeSectionThree(selected: any)  {
    this.selectedIndex = selected;
    this.activeSectionId = this.activeSectionService.returnActiveSection();

    alert('Clikced: ' + selected);

    this.router.navigate(['/content']);
  }

}
