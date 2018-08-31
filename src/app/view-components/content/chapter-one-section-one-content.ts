
import { ContentModel } from './../../models/content.models/content.model';

export class ChapterOneSectionOneContent
{
    chapterOneSectionOne : ContentModel[] = [];
    currentContent = new ContentModel();

    constructor(){}
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.loadContent();
    }

    loadContent()
    {
        this.chapterOneSectionOne = [];
        this.currentContent = new ContentModel();

        this.currentContent.mainHeading = "BASIC ELEMENTS OF C++";
        this.currentContent.subHeading = "A C++ Program";
        this.currentContent.description = "In this chapter, you will learn the basic elements and concepts of the C++ programming language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you need not be too concerned with the details of this program. You only need to know the effect of an output statement, which is introduced in this program. <p style=\"text-align:left;\"><code> #include <iostream> using namespace std; int main() { int num; num = 6; cout << \"My first C++ program.\" << endl; cout << \"The sum of 2 and 3 = \" << 5 << endl; cout << \"7 + 8 = \" << 7 + 8 << endl; cout << \"Num = \" << num << endl; return 0; }</code></p> ";   

       this.chapterOneSectionOne.push(this.currentContent);
       console.log("In content creator: " , this.currentContent);
    }
}