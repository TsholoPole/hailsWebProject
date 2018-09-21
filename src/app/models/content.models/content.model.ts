export class ContentModel
{
    description : string;
    sectionIdentifier: number;
    chapterIdentifier: number;
    mainHeading: string;
    subHeading: string;

    set setChapterId(_chapId: number)
    {
        this.chapterIdentifier = _chapId;
    }

    get getChapterId()
    {
        return this.chapterIdentifier;
    }

    set setMainHeading(_mainHeading: string)
    {
        this.mainHeading = _mainHeading;
    }

    get getMainHeading()
    {
        return this.mainHeading;
    }

    set setSubHeading(_subHeading: string)
    {
        this.subHeading = _subHeading;
    }

    get getSubHeading()
    {
        return this.subHeading;
    }

    set setDescription(_description: string)
    {
        this.description = _description;
    }

    get getDescription(): string
    {
        return this.description;
    }

    set setSectionIdentifier(_id: number)
    {
        this.sectionIdentifier = _id;
    }

    get getSectionIdentifier(): Number{
        return this.sectionIdentifier;
    }
}
