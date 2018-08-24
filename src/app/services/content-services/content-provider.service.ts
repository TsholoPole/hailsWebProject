import { Injectable } from "@angular/core";
import { Http, Headers } from '@angular/http';
import { ContentModel } from '../../models/content.models/content.model';
import { ProvideContentRequest } from '../../models/request.models/provideContentRequest.model';


@Injectable()
export class ContentProviderService
{
    constructor(private http: Http)  {}

    connection = "127.1.1.0:8280"
    
    private headers = new Headers ({
        'Content-Type': 'application/json'
    });

    getLearningSectionContent(provideContentRequest: ProvideContentRequest)
    {
        let jsonCriteria;
        let contentUri = 'http://'+this.connection+'/hails/api/org/hails/content/providecontent/providesectioncontent';

        jsonCriteria = {
            "sectionIdentifier": provideContentRequest.sectionIdentifier,
	        "chapterIdentifier": provideContentRequest.chapterIdentifier
        }
        
        return this.http.post(contentUri, jsonCriteria, {headers : this.headers});

    }
}