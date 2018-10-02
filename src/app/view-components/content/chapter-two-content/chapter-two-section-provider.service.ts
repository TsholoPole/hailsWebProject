import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs';
import { Observable } from "rxjs";
import { ContentModel } from "../../../models/content.models/content.model";
import { Injectable } from '@angular/core';

@Injectable()
export class ChapterTwoSectionContentProviderService
{
    private headers = new Headers({'Content-Type': 'application/json'});
    private contentUrl = 'api/chapterTwoSectionOneContent';  // URL to web api
    private chapterTwoSectiontwoUrl = 'api/chapterTwoSectionTwoContent';
    private chapterTwoSectionThreeUrl = 'api/chapterOneTwoSectionThreeContent';

    constructor(private http: HttpClient) { }

    getChapterTwoContent(): Observable<ContentModel[]>
    {
        return this.http.get<ContentModel[]>(this.contentUrl);

    }

    getChapterTwoSectionTwoContent(): Observable<ContentModel[]>
    {
        return this.http.get<ContentModel[]>(this.chapterTwoSectiontwoUrl);
    }

    getChapterTwoSectionThreeContent():Observable<ContentModel[]>
    {
        return this.http.get<ContentModel[]>(this.chapterTwoSectionThreeUrl);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
