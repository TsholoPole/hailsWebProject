
import { ContentModel } from '../../models/content.models/content.model';
import { InMemoryDbService } from 'angular-in-memory-web-api';


export class ChapterOneSectionOneService implements InMemoryDbService {
    createDb() {
        const chapterOneSectionOneContent  = [
        {
            sectionIdentifier: 1,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'C++ Program',
            description : 'In this chapter, you will learn the basic elements and concepts of the C++ programming ' +
            'language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also' +
             'show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you ' +
             'need not be too concerned with the details of this program. You only need to know the effect of an output statement,' +
             ' which is introduced in this program.<br/><br/>  <img class="exampleOne" src="../assets/images/content/exampleOne.PNG" alt="Main page image" height="300px" width="600px">'
        },
        {
            sectionIdentifier: 1,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'C++ Program',
            description : 'Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. ' +
            'Anything in double quotes is a string. For example, <b>\"My first C++ program.\"</b> and <b>\"7 + 8 = \"</b> are strings. Typically, a string evaluates to itself. ' +
            'Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, ' +
            'we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. ' +
            '(On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen. My first C++ program. Let us now consider the following statement. ' +
            '<br/><b>cout << \"The sum of 2 and 3 = \" << 5 << endl;</b><br/> This output statement consists of two expressions. The first expression (after the first <<) is <b>\"The sum of 2 and 3 = \"</b> and the second expression (after the second <<) consists of the number 5. ' +
            'The expression <b>\"The sum of 2 and 3 = \"</b> is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. Thus, the output of the preceding statement is: <b>The sum of 2 and 3 = 5</b>'
        },
        {
            sectionIdentifier: 1,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'C++ Program',
            description : 'Let us now consider the following statement. <b>cout << \"7 + 8 = \" << 7 + 8 << endl;</b>. In this output statement, the expression \"7 + 8 = \", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. ' +
            'Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: 7 + 8 = 15 This statement consists of the string \"Num = \", which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. ' +
            'Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, <b>return 0;</b> returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.' +
            '<br/><br/><br/>  <img class="exampleOne" src="../assets/images/content/example_two.PNG" alt="Main page image" height="150px" width="850px">'
        },

    ];
    const chapterOneSectionTwoContent  = [
        {
            sectionIdentifier: 2,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            description : 'In this chapter, you will learn the basic elements and concepts of the C++ programming language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you need not be too concerned with the details of this program. You only need to know the effect of an output statement, which is introduced in this program. \n \n#include <iostream> using namespace std; \nint main() { int num; num = 6; \ncout << \"My first C++ program.\" << endl; \ncout << \"The sum of 2 and 3 = \" << 5 << endl; \ncout << \"7 + 8 = \" << 7 + 8 << endl; \ncout << \"Num = \" << num << endl;\n return 0; } '
        },
        {
            sectionIdentifier: 2,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            description : 'Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. Anything in double quotes is a string. For example, <b>\"My first C++ program.\"</b> and <b>\"7 + 8 = \"</b> are strings.<br/> Typically, a string evaluates to itself. Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. (On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen.<br/><b> My first C++ program.</b> <br/>Let us now consider the following statement. <b>cout << \"The sum of 2 and 3 = \" << 5 << endl;</b> This output statement consists of two expressions. The first expression (after the first <<) is <b>\"The sum of 2 and 3 = \"</b> and the second expression (after the second <<) consists of the number 5. The expression <b>\"The sum of 2 and 3 = \"</b> is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. <br/>Thus, the output of the preceding statement is: <b>The sum of 2 and 3 = 5</b>'
        },
        {
            sectionIdentifier: 2,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            description : 'Let us now consider the following statement. <b>cout << \"7 + 8 = \" << 7 + 8 << endl;</b> In this output statement, the expression \"7 + 8 = \", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: <b>7 + 8 = 15</b>. This statement consists of the string <b>\"Num = \",</b> which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, <b>return 0;</b> returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
        },

    ];

    const chapterOneSectionThreeContent  = [
        {
            sectionIdentifier: 3,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            description : 'In this chapter, you will learn the basic elements and concepts of the C++ programming language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you need not be too concerned with the details of this program. You only need to know the effect of an output statement, which is introduced in this program. \n \n#include <iostream> using namespace std; \nint main() { int num; num = 6; \ncout << \"My first C++ program.\" << endl; \ncout << \"The sum of 2 and 3 = \" << 5 << endl; \ncout << \"7 + 8 = \" << 7 + 8 << endl; \ncout << \"Num = \" << num << endl;\n return 0; } '
        },
        {
            sectionIdentifier: 3,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            description : 'Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. Anything in double quotes is a string. For example, \"My first C++ program.\" and \"7 + 8 = \" are strings. Typically, a string evaluates to itself. Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. (On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen. My first C++ program. Let us now consider the following statement. cout << \"The sum of 2 and 3 = \" << 5 << endl; This output statement consists of two expressions. The first expression (after the first <<) is \"The sum of 2 and 3 = \" and the second expression (after the second <<) consists of the number 5. The expression \"The sum of 2 and 3 = \" is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. Thus, the output of the preceding statement is: <strong>The sum of 2 and 3 = 5</strong>'
        },
        {
            sectionIdentifier: 3,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            description : 'Let us now consider the following statement. cout << \"7 + 8 = \" << 7 + 8 << endl; In this output statement, the expression \"7 + 8 = \", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: 7 + 8 = 15 This statement consists of the string \"Num = \", which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, return 0; returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
        },

    ];
        return {chapterOneSectionOneContent, chapterOneSectionTwoContent, chapterOneSectionThreeContent};
    }

}
