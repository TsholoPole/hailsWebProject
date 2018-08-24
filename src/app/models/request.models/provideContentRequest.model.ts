export class ProvideContentRequest
{
    private _sectionIdentifier: Number;
    private _chapterIdentifier: Number;
    
   get sectionIdentifier(): Number {
        return this._sectionIdentifier;
    }
    set sectionIdentifier(sectionIdentifier: Number) {
        this._sectionIdentifier = sectionIdentifier;
    }
    
     get chapterIdentifier(): Number {
        return this._chapterIdentifier;
    }
    set chapterIdentifier(chapterIdentifier: Number) {
        this._chapterIdentifier = chapterIdentifier;
    }
}