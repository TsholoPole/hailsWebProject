
import { ContentModel } from '../content.models/content.model';


export class SectionModel 
{
    identifier: Number;
    rank : Number;
    description : string;
    chapterIdentifier: Number;
    sectionContent : ContentModel[] = [];

    //idenfier for section
    set setIdentifier(_id: Number)
    {
        this.identifier = _id;
    }

    get getIdentifer(): Number
    {
        return this.identifier;
    }

    //Rank of chapter
    set setRank(_rank: Number)
    {
        this.rank = _rank;
    }

    get getRank(): Number
    {
        return this.rank;
    }

    //description of section
    set setDescription(_description: string)
    {
        this.description = _description;
    }

    get getDescription(): string
    {
        return this.description;
    }

    //identifer of chapter of section
    set setChapterIdentifier(_chapId: Number)
    {
        this.chapterIdentifier = _chapId;
    }

    get getChapterIdentifier(): Number
    {
        return this.chapterIdentifier;
    }

    //content linked to section
    set setContent(_sectionContent: ContentModel[])
    {
        this.sectionContent = _sectionContent;
    }

    get getContent(): ContentModel[]
    {
        return this.sectionContent;
    }
  
}