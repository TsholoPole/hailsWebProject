import { Injectable } from "../../../../node_modules/@angular/core";
import { Http } from '@angular/http';
import { ContentModel } from '../../models/content.models/content.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs';
import { Observable } from "rxjs";

@Injectable()
export class ChapterOneSectionContentProviderService
{
    private headers = new Headers({'Content-Type': 'application/json'});
    private contentUrl = 'api/chapterOneSectionOneContent';  // URL to web api
    private chapterOneSectiontwoUrl = 'api/chapterOneSectionTwoContent';
    private chapterOneSectionThreeUrl = 'api/chapterOneSectionThreeContent';
  
    constructor(private http: HttpClient) { }
    
    getChapterOneContent(): Observable<ContentModel[]>
    {
        return this.http.get<ContentModel[]>(this.contentUrl);
        
    }

    getChapterOneSectionTwoContent():Observable<ContentModel[]>
    {
        return this.http.get<ContentModel[]>(this.chapterOneSectiontwoUrl);
    }

    getChapterOneSectionThreeContent():Observable<ContentModel[]>
    {
        return this.http.get<ContentModel[]>(this.chapterOneSectionThreeUrl);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}