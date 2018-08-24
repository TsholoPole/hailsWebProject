import { Injectable } from "@angular/core";
import { ContentModel } from '../../models/content.models/content.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { SectionModel } from '../../models/section.models/section.model';
import { Subject } from 'rxjs';
import { ProvideSectionsRequest } from '../../models/request.models/provide-sections-request.model';
import { Response } from '@angular/http';
import { ProvideSectionsService } from './provide-sections.service';

@Injectable()
export class CreateContentService
{

    sectionsLength: number;
    subscriptionToSection: Subscription;

    sectionModels : SectionModel[] = [];
    sections = new Subject<JSON[]>();
    constructor(private provideSectionsService: ProvideSectionsService){}

    getChapterSections(provideSectionsRequest: ProvideSectionsRequest)
    {
        this.subscriptionToSection = this.provideSectionsService.getLearningSectionContent(provideSectionsRequest)
        .subscribe(
            (response: Response) : any => {
                const data = response.json();
                console.log("Response From server: " + response);

                //results returned
                if(data != undefined && data.contents != null)
                {
                    this.setListLength(data.sections.length);

                    if(this.getListLength() >= 1)
                    {
                        data.contents.forEach(content => {
                            let sectionModel = new SectionModel();
                            sectionModel.chapterIdentifier = content.chapterIdentifier;
                            sectionModel.description = content.description;

                            this.sectionModels.push(sectionModel);
                        
                        });
                    }
                }
            } ,
            (error: Response): any => {
                console.log("Error: " + error);   
            }
        );

    }
    getResultList()
    {
        return this.sectionModels;
    }

    getListLength()
    {
        return this.sectionsLength;
    }

    setListLength(len: number)
    {
        this.sectionsLength = len;
    }
    
}