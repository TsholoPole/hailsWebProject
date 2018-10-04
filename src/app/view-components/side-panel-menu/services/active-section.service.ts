import { Injectable } from "@angular/core";

@Injectable()
export class ActiveSectionService {

  activeSection : number = null;
  determineActiveSection(section:number){
    console.log("\n\nActive Section: ", section,"\n\n")
    this.activeSection = section;
    // return section-1;
  }

  returnActiveSection()
  {
    return this.activeSection;

  }

}
