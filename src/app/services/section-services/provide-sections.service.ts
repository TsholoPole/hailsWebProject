import { Injectable } from "@angular/core";
import { SectionModel } from '../../models/section.models/section.model';
import { Http, Headers } from '@angular/http';
import { ProvideSectionsRequest } from '../../models/request.models/provide-sections-request.model';

@Injectable()
export class ProvideSectionsService
{
    constructor(private http: Http)  {}

    connection = "127.1.1.0:8280"
    
    private headers = new Headers ({
        'Content-Type': 'application/json'
    });

    getLearningSectionContent(provideSectionsRequest: ProvideSectionsRequest)
    {
        let jsonCriteria;
        let contentUri = 'http://'+this.connection+'/hails/api/org/hails/content/providecontent/providesectioncontent';

        jsonCriteria = {
	        "chapterIdentifier": provideSectionsRequest.chapterIdentifier
        };
        return this.http.post(contentUri, jsonCriteria, {headers : this.headers});
    }

}