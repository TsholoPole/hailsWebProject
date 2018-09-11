import { Component, OnInit } from '@angular/core';
import { ContentComponent } from '../content/content.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-introduction-page-content',
  templateUrl: './introduction-page-content.component.html',
  styleUrls: ['./introduction-page-content.component.css']
})
export class IntroductionPageContentComponent implements OnInit {

  constructor(private contentComponent: ContentComponent,
    private router: Router) { }

  ngOnInit() {
  }

  goToChapterOne() {
    console.log("\n\nCalling function to load chapter one data\n\n");
    this.contentComponent.createContentForDisplay(1, 1);
    this.router.navigate(['/content']);
    // setTimeout(() => {

    // }, 1500);
    alert('Go to chapter 1');
  }

  goToChapterTwo() {
    console.log("\n\nCalling function to load chapter one data\n\n");
    this.contentComponent.createContentForDisplay(2, 1);
    this.router.navigate(['/content']);
    // setTimeout(() => {
    //   this.router.navigate(['/content']);
    // }, 1500);
    alert('Go to chapter 2');
  }

  goToChapterThree() {
    console.log("\n\nCalling function to load chapter one data\n\n");
    this.contentComponent.createContentForDisplay(3, 1);
    this.router.navigate(['/content']);
    // setTimeout(() => {
    //   this.router.navigate(['/content']);
    // }, 1500);
    alert('Go to chapter 3');
  }



}
