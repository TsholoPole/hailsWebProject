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
    this.contentComponent.createContentForDisplay(1, 1);
    setTimeout(() => {
      this.router.navigate(['/content']);
    }, 1500);
    alert('Go to chapter 1');
  }

  goToChapterTwo() {
    this.contentComponent.createContentForDisplay(2, 1);
    setTimeout(() => {
      this.router.navigate(['/content']);
    }, 1500);
    alert('Go to chapter 2');
  }

  goToChapterThree() {
    this.contentComponent.createContentForDisplay(3, 1);
    setTimeout(() => {
      this.router.navigate(['/content']);
    }, 1500);
    alert('Go to chapter 3');
  }



}
