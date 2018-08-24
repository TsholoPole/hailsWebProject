
export class ProvideSectionsRequest
{
    private _chapterIdentifier: Number;
    
    get chapterIdentifier(): Number {
        return this._chapterIdentifier;
    }
    set chapterIdentifier(chapterIdentifier: Number) {
        this._chapterIdentifier = chapterIdentifier;
    }

}