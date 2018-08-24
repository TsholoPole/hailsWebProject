import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderUsernameService } from '../../services/header-information-services/header-content.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username = "";
  currentMainHeading = "";
  constructor(private router: Router, private headerService: HeaderUsernameService) { }

  ngOnInit() {
    this.headerService.currentheaderSection.subscribe(header => this.currentMainHeading = header);
    this.headerService.currentUser.subscribe(theName => this.username = theName);
  }
  onLogout()
  {
    this.router.navigate(['/login']);

  }

}
