import { ContentModel } from "../../models/content.models/content.model";
import { InMemoryDbService } from "angular-in-memory-web-api";

export class ChapterOneSectionOneService implements InMemoryDbService {
  createDb() {
    const chapterOneSectionOneContent = [
      {
        sectionIdentifier: 1,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "C++ Program",
        description:
          "In this chapter, you will learn the basic elements and concepts of the C++ programming " +
          "language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also" +
          "show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you " +
          "need not be too concerned with the details of this program. You only need to know the effect of an output statement," +
          ' which is introduced in this program.<br/><br/>  <img class="exampleOne" src="../assets/images/content/exampleOne.PNG" alt="Main page image" height="300px" width="600px">'
      },
      {
        sectionIdentifier: 1,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "C++ Program",
        description:
          "Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. " +
          'Anything in double quotes is a string. For example, <b>"My first C++ program."</b> and <b>"7 + 8 = "</b> are strings. Typically, a string evaluates to itself. ' +
          "Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, " +
          "we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. " +
          "(On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen. My first C++ program. Let us now consider the following statement. " +
          '<br/><b>cout << "The sum of 2 and 3 = " << 5 << endl;</b><br/> This output statement consists of two expressions. The first expression (after the first <<) is <b>"The sum of 2 and 3 = "</b> and the second expression (after the second <<) consists of the number 5. ' +
          'The expression <b>"The sum of 2 and 3 = "</b> is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. Thus, the output of the preceding statement is: <b>The sum of 2 and 3 = 5</b>'
      },
      {
        sectionIdentifier: 1,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "C++ Program",
        description:
          'Let us now consider the following statement. <b>cout << "7 + 8 = " << 7 + 8 << endl;</b>. In this output statement, the expression "7 + 8 = ", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. ' +
          'Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: 7 + 8 = 15 This statement consists of the string "Num = ", which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. ' +
          'Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, <b>return 0;</b> returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.' +
          '<br/><br/><br/>  <img class="exampleOne" src="../assets/images/content/example_two.PNG" alt="Main page image" height="150px" width="850px">'
      }
    ];
    const chapterOneSectionTwoContent = [
      {
        sectionIdentifier: 2,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "The Basics of a C++ Program",
        description:
          'A C++ program is a collection of one or more subprograms, called functions. Some ' +
          'functions, called <b>predefined</b> or <b>standard</b> functions, are already written and are provided ' +
          'as part of the system. But to accomplish most tasks, programmers must learn to write their ' +
          'own functions. ' +
          'Every C++ program has a function called main. Thus, if a C++ program has only one ' +
          'function, it must be the function main. Until Chapter 6, other than using some of the ' +
          'predefined functions, you will mainly deal with the function main. By the end of this ' +
          'chapter, you will have learned how to write the function main.'
      },
      {
        sectionIdentifier: 2,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "The Basics of a C++ Program",
        description:
          'If you have never seen a program written in a programming language, the C++ program in ' +
          'Example 2-1 may look like a foreign language. To make meaningful sentences in a foreign ' +
          'language, you must learn its alphabet, words, and grammar. The same is true of a programming ' +
          'language. To write meaningful programs, you must learn the programming language’s ' +
          'special symbols, words, and syntax rules. The syntax rules tell you which statements ' +
          '(instructions) are legal, or accepted by the programming language, and which are not. ' +
          'You must also learn semantic rules, which determine the meaning of the instructions. ' +
          'The programming language’s rules, symbols, and special words enable you to write programs ' +
          'to solve problems. The syntax rules determine which instructions are valid. ' +
          '<br/><b>Programming language:</b> A set of rules, symbols, and special words.'
      },
      {
        sectionIdentifier: 2,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "Comments",
        description:
          'The program that you write should be clear not only to you, but also to the reader of '+
          'your program. Part of good programming is the inclusion of comments in the program. '+
          'Typically, comments can be used to identify the authors of the program, give the date '+
          'when the program is written or modified, give a brief explanation of the program, and '+
          'explain the meaning of key statements in a program. In the programming examples, for '+
          'the programs that we write, we will not include the date when the program is written, '+
          'consistent with the standard convention for writing such books.'
      },
      {
        sectionIdentifier: 2,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "Comments",
        description:
          'There are two common types of comments in a C++ program—single-line comments '+
          'and multiple-line comments.'+
          'Single-line comments begin with // and can be placed anywhere in the line. Everything '+
          'encountered in that line after // is ignored by the compiler. For example, consider the '+
          'following statement: '+
          '<br/>cout << "7 + 8 = " << 7 + 8 << endl;'+
          '<br/>You can put comments at the end of this line as follows:'+
          '<br/>cout << "7 + 8 = " << 7 + 8 << endl; //prints: 7 + 8 = 15'+
          'This comment could be meaningful for a beginning programmer.'+
          'Multiple-line comments are enclosed between <b>/*</b> and <b>*/</b>. The compiler ignores anything '+
          'that appears between <b>/*</b> and <b>*/</b>. For example, the following is an example of a multiple-line '+
          'comment:'
          // '/*
          //   You can include comments that can
          //   occupy several lines. */'
      },
      {
        sectionIdentifier: 2,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "The Basics of a C++ Program",
        description:
          'Let us now consider the following statement. <b>cout << "7 + 8 = " << 7 + 8 << endl;</b> In this output statement, the expression "7 + 8 = ", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: <b>7 + 8 = 15</b>. This statement consists of the string <b>"Num = ",</b> which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, <b>return 0;</b> returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
      },
      {
        sectionIdentifier: 2,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "The Basics of a C++ Program",
        description:
          'Let us now consider the following statement. <b>cout << "7 + 8 = " << 7 + 8 << endl;</b> In this output statement, the expression "7 + 8 = ", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: <b>7 + 8 = 15</b>. This statement consists of the string <b>"Num = ",</b> which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, <b>return 0;</b> returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
      },
      {
        sectionIdentifier: 2,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "The Basics of a C++ Program",
        description:
          'Let us now consider the following statement. <b>cout << "7 + 8 = " << 7 + 8 << endl;</b> In this output statement, the expression "7 + 8 = ", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: <b>7 + 8 = 15</b>. This statement consists of the string <b>"Num = ",</b> which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, <b>return 0;</b> returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
      }
    ];

    const chapterOneSectionThreeContent = [
      {
        sectionIdentifier: 3,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "The Basics of a C++ Program",
        description:
          'In this chapter, you will learn the basic elements and concepts of the C++ programming language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you need not be too concerned with the details of this program. You only need to know the effect of an output statement, which is introduced in this program. \n \n#include <iostream> using namespace std; \nint main() { int num; num = 6; \ncout << "My first C++ program." << endl; \ncout << "The sum of 2 and 3 = " << 5 << endl; \ncout << "7 + 8 = " << 7 + 8 << endl; \ncout << "Num = " << num << endl;\n return 0; } '
      },
      {
        sectionIdentifier: 3,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "The Basics of a C++ Program",
        description:
          'Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. Anything in double quotes is a string. For example, "My first C++ program." and "7 + 8 = " are strings. Typically, a string evaluates to itself. Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. (On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen. My first C++ program. Let us now consider the following statement. cout << "The sum of 2 and 3 = " << 5 << endl; This output statement consists of two expressions. The first expression (after the first <<) is "The sum of 2 and 3 = " and the second expression (after the second <<) consists of the number 5. The expression "The sum of 2 and 3 = " is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. Thus, the output of the preceding statement is: <strong>The sum of 2 and 3 = 5</strong>'
      },
      {
        sectionIdentifier: 3,
        chapterIdentifier: 1,
        mainHeading: "BASIC ELEMENTS OF C++",
        subHeading: "The Basics of a C++ Program",
        description:
          'Let us now consider the following statement. cout << "7 + 8 = " << 7 + 8 << endl; In this output statement, the expression "7 + 8 = ", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: 7 + 8 = 15 This statement consists of the string "Num = ", which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, return 0; returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
      }
    ];
    return {
      chapterOneSectionOneContent,
      chapterOneSectionTwoContent,
      chapterOneSectionThreeContent
    };
  }
}
