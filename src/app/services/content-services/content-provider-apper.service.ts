import { Injectable } from "@angular/core";
import { Subscription } from "rxjs/internal/Subscription";
import { Subject } from "rxjs";
import { Response } from '@angular/http';
import { ProvideContentRequest } from '../../models/request.models/provideContentRequest.model';
import { ResponseOptions } from "@angular/http";
import { ContentModel } from '../../models/content.models/content.model';
import { ContentProviderService } from './content-provider.service';

@Injectable()
export class ContentProviderMapper{
    
    contentLength: number;
    subscriptionToContent: Subscription;

    SectionContent : ContentModel[] = [];
    content = new Subject<JSON[]>();

    constructor(private contentProviderService: ContentProviderService){

    }

    onUpdateContentList(criteria: ProvideContentRequest)
    {
        this.subscriptionToContent = this.contentProviderService.getLearningSectionContent(criteria)
        .subscribe(
            (response: Response) : any => {
                const data = response.json();
                console.log("Response From server: " + response);

                //results returned
                if(data != undefined && data.contents != null)
                {
                    this.setListLength(data.contents.length);

                    if(this.getListLength() >= 1)
                    {
                        data.contents.forEach(content => {
                            let contentModel = new ContentModel();
                            contentModel.chapterIdentifier = content.chapterIdentifier;
                            contentModel.sectionIdentifier = content.sectionIdentifier;
                            contentModel.mainHeading = content.mainHeading;
                            contentModel.subHeading = content.subHeading;
                            contentModel.description = content.description;

                            this.SectionContent.push(contentModel);
                            
                        });
                    }
                }
            } ,
            (error: Response): any => {
                console.log("Error: " + error);   
            }
        );

    }

    getContentList()
    {
        return this.SectionContent;
    }

    getListLength()
    {
        return this.contentLength;
    }

    setListLength(len: number)
    {
        this.contentLength = len;
    }
}