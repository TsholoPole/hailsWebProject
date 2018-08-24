import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class HeaderUsernameService
{
  
    private userName = new BehaviorSubject<string>('');
    currentUser = this.userName.asObservable();

    constructor(){ }
     // change user name based on user input or action
    changeUserName(setUser: string) {
        this.userName.next(setUser);
    }

    private headerSection = new BehaviorSubject<string>('');
    currentheaderSection = this.headerSection.asObservable();

    //change current header section based on section viewer is currently viewing/studying
    changeHeaderSection(newSection: string)
    {
        this.headerSection.next(newSection);
    }

}