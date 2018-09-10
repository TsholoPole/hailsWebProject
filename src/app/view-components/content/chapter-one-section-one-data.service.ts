
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
             ' which is introduced in this program. \n \n#include <iostream> using namespace std; \nint main() ' +
             '{ int num; num = 6; \ncout << \"My first C++ program.\" << endl; \ncout << \"The sum of 2 and 3 = \" << 5 << endl;' +
             ' \ncout << \"7 + 8 = \" << 7 + 8 << endl; \ncout << \"Num = \" << num << endl;\n return 0; } '
        },
        {
            sectionIdentifier: 1,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'C++ Program',
            // tslint:disable-next-line:max-line-length
            description : 'Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. ' +
            // tslint:disable-next-line:max-line-length
            'Anything in double quotes is a string. For example, \"My first C++ program.\" and \"7 + 8 = \" are strings. Typically, a string evaluates to itself. ' +
            // tslint:disable-next-line:max-line-length
            'Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, ' +
            // tslint:disable-next-line:max-line-length
            'we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. ' +
            // tslint:disable-next-line:max-line-length
            '(On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen. My first C++ program. Let us now consider the following statement. ' +
            // tslint:disable-next-line:max-line-length
            'cout << \"The sum of 2 and 3 = \" << 5 << endl; This output statement consists of two expressions. The first expression (after the first <<) is \"The sum of 2 and 3 = \" and the second expression (after the second <<) consists of the number 5. ' +
            // tslint:disable-next-line:max-line-length
            'The expression \"The sum of 2 and 3 = \" is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. Thus, the output of the preceding statement is: <strong>The sum of 2 and 3 = 5</strong>'
        },
        {
            sectionIdentifier: 1,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'C++ Program',
            // tslint:disable-next-line:max-line-length
            description : 'Let us now consider the following statement. cout << \"7 + 8 = \" << 7 + 8 << endl; In this output statement, the expression \"7 + 8 = \", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. ' +
            // tslint:disable-next-line:max-line-length
            'Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: 7 + 8 = 15 This statement consists of the string \"Num = \", which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. ' +
            // tslint:disable-next-line:max-line-length
            'Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, return 0; returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
        },

    ];
    const chapterOneSectionTwoContent  = [
        {
            sectionIdentifier: 2,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            // tslint:disable-next-line:max-line-length
            description : 'In this chapter, you will learn the basic elements and concepts of the C++ programming language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you need not be too concerned with the details of this program. You only need to know the effect of an output statement, which is introduced in this program. \n \n#include <iostream> using namespace std; \nint main() { int num; num = 6; \ncout << \"My first C++ program.\" << endl; \ncout << \"The sum of 2 and 3 = \" << 5 << endl; \ncout << \"7 + 8 = \" << 7 + 8 << endl; \ncout << \"Num = \" << num << endl;\n return 0; } '
        },
        {
            sectionIdentifier: 2,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            // tslint:disable-next-line:max-line-length
            description : 'Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. Anything in double quotes is a string. For example, \"My first C++ program.\" and \"7 + 8 = \" are strings. Typically, a string evaluates to itself. Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. (On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen. My first C++ program. Let us now consider the following statement. cout << \"The sum of 2 and 3 = \" << 5 << endl; This output statement consists of two expressions. The first expression (after the first <<) is \"The sum of 2 and 3 = \" and the second expression (after the second <<) consists of the number 5. The expression \"The sum of 2 and 3 = \" is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. Thus, the output of the preceding statement is: <strong>The sum of 2 and 3 = 5</strong>'
        },
        {
            sectionIdentifier: 2,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            // tslint:disable-next-line:max-line-length
            description : 'Let us now consider the following statement. cout << \"7 + 8 = \" << 7 + 8 << endl; In this output statement, the expression \"7 + 8 = \", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: 7 + 8 = 15 This statement consists of the string \"Num = \", which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, return 0; returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
        },

    ];

    const chapterOneSectionThreeContent  = [
        {
            sectionIdentifier: 3,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            // tslint:disable-next-line:max-line-length
            description : 'In this chapter, you will learn the basic elements and concepts of the C++ programming language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you need not be too concerned with the details of this program. You only need to know the effect of an output statement, which is introduced in this program. \n \n#include <iostream> using namespace std; \nint main() { int num; num = 6; \ncout << \"My first C++ program.\" << endl; \ncout << \"The sum of 2 and 3 = \" << 5 << endl; \ncout << \"7 + 8 = \" << 7 + 8 << endl; \ncout << \"Num = \" << num << endl;\n return 0; } '
        },
        {
            sectionIdentifier: 3,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            // tslint:disable-next-line:max-line-length
            description : 'Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. Anything in double quotes is a string. For example, \"My first C++ program.\" and \"7 + 8 = \" are strings. Typically, a string evaluates to itself. Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. (On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen. My first C++ program. Let us now consider the following statement. cout << \"The sum of 2 and 3 = \" << 5 << endl; This output statement consists of two expressions. The first expression (after the first <<) is \"The sum of 2 and 3 = \" and the second expression (after the second <<) consists of the number 5. The expression \"The sum of 2 and 3 = \" is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. Thus, the output of the preceding statement is: <strong>The sum of 2 and 3 = 5</strong>'
        },
        {
            sectionIdentifier: 3,
            chapterIdentifier: 1,
            mainHeading : 'BASIC ELEMENTS OF C++',
            subHeading : 'The Basics of a C++ Program',
            // tslint:disable-next-line:max-line-length
            description : 'Let us now consider the following statement. cout << \"7 + 8 = \" << 7 + 8 << endl; In this output statement, the expression \"7 + 8 = \", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: 7 + 8 = 15 This statement consists of the string \"Num = \", which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, return 0; returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
        },

    ];
        return {chapterOneSectionOneContent, chapterOneSectionTwoContent, chapterOneSectionThreeContent};
    }

}
