
import { SectionModel } from '../section.models/section.model';

export class ChapterModel
{
    description: string;
    identifier: Number;
    rank : Number;
    sections : SectionModel[] = [];

    //description of chapter
    set setDescription(_description: string)
    {
        this.description = _description;
    }

    get getDescription() : string {
        return this.description;
    }

    //rank of chapter
    set setRank(_rank: Number)
    {
        this.rank = _rank;
    }

    get getRank() : Number {
        return this.rank;
    }

    //identifier for chapter
    set setIdentifier(_id: Number)
    {
        this.identifier = _id;
    }

    get getIdentifier() : Number {
        return this.identifier;
    }
    //sections linked to chapter
    set setSections(_sections: SectionModel[])
    {
        this.sections = _sections;
    }

    get getSections() : SectionModel[]
    {
        return this.sections;
    }

}