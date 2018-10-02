
import { ContentModel } from '../../../models/content.models/content.model';
import { InMemoryDbService } from 'angular-in-memory-web-api';


export class ChapterTwoSectionOneService implements InMemoryDbService {
    createDb() {
        const chapterTwoSectionOneContent  = [
        {
          sectionIdentifier: 1,
          chapterIdentifier: 2,
          mainHeading : 'Data Types',
          subHeading : 'Introduction',
          description : 'The objective of a C++ program is to manipulate data. Different programs manipulate ' +
          'different data. A program designed to calculate an employee’s paycheck will add, subtract,'+
          'multiply, and divide numbers, and some of the numbers might represent hours worked and '+
          'pay rate. Similarly, a program designed to alphabetize a class list will manipulate names. You '+
          'wouldn’t expect a cherry pie recipe to help you bake cookies. Similarly, you wouldn’t use a '+
          'program designed to perform arithmetic calculations to manipulate alphabetic characters. '

        },
        {
          sectionIdentifier: 1,
          chapterIdentifier: 2,
          mainHeading : 'Data Types',
          subHeading : 'Introduction',
          description : 'Furthermore, you wouldn’t multiply or subtract names.Reflecting these kinds of underlying '+
          'differences, C++ categorizes data into different types, and only certain operations can be '+
          'performed on particular types of data. Although at first it may seem confusing, by being so '+
          'type conscious, C++ has built-in checks to guard against errors.'+
          '<br/><b>Data type:</b> A set of values together with a set of operations. '+
          '<br/>C++ data types fall into the following three categories and are illustrated in Figure 2-1:'+
          '<br/><ol><li>1. Simple data type</li>'+
          '<li>2. Structured data type</li>'+
          '<li>3. Pointers</li></ol> <br/><br/>  <img class="data_ytypes" src="../assets/images/content/data_types.PNG" alt="Main page image" height="150px" width="600px">'
        }

    ];
    const chapterTwoSectionTwoContent  = [
        {
          sectionIdentifier: 2,
          chapterIdentifier: 2,
          mainHeading : 'Data Types',
          subHeading : 'Simple Data Types',
          description : 'The simple data type is the fundamental data type in C++ because it becomes a building ' +
          'block for the structured data type, which you start learning about in Chapter 9. There are ' +
          'three categories of simple data:'+
          '<br/><ol><li><b>1. Integral</b>, which is a data type that deals with integers, or numbers ' +
          'without a decimal part</li> '+
          '<li><b>2. Floating-point</b>, which is a data type that deals with decimal numbers</li>'+
          '<li><b>3. Enumeration,</b> which is a user-defined data type</li></ol><br/> Integral data types are further classified into the following nine categories: <b>char, short, '+
          'int, long, bool, unsigned char, unsigned short, unsigned int,</b> and '+
          '<b>unsigned long.</b>'
        },
        {
          sectionIdentifier: 2,
          chapterIdentifier: 2,
          mainHeading : 'Data Types',
          subHeading : 'Simple Data Types',
          description : 'Why are there so many categories of the same data type? Every data type has a different set ' +
          'of values associated with it. For example, the char data type is used to represent integers ' +
          'between –128 and 127. The <b>int</b> data type is used to represent integers between ' +
          '–2147483648 and 2147483647, and the data type <b>short</b> is used to represent integers ' +
          'between –32768 and 32767.' +
          '<br/>Note that the identifier num in Example 2-1 can be assigned any value belonging to the int data type.' +
          '<br/>Which data type you use depends on how big a number your program needs to deal with. '+
          'In the early days of programming, computers and main memory were very expensive. '+
          'Only a small amount of memory was available to execute programs and manipulate the '+
          'data. As a result, programmers had to optimize the use of memory. Because writing a '+
          'program and making it work is already a complicated process, not having to worry about '+
          'the size of the memory makes for one less thing to think about. Thus, to effectively use '+
          'memory, a programmer can look at the type of data used in a program and figure out which '+
          'data type to use.'
        },
        {
          sectionIdentifier: 2,
          chapterIdentifier: 2,
          mainHeading : 'Data Types',
          subHeading : 'Simple Data Types',
          description : 'Newer programming languages have only five categories of simple data types: integer, '+
          'real, char, bool, and the enumeration type. The integral data types that are used in this '+
          'book are int, bool, and char. '+
          '<b/>Table 2-2 gives the range of possible values associated with these three data types and the '+
          'size of memory allocated to manipulate these values.' +
          '<br/><br/>  <img class="data_ytypes" src="../assets/images/content/data_types_two.PNG" alt="Main page image" height="200px" width="600px">'
        },

    ];

    const chapterTwoSectionThreeContent  = [
        {
          sectionIdentifier: 3,
          chapterIdentifier: 2,
          mainHeading : 'Data Types',
          subHeading : 'Floating Point Data Types',
          description : 'In this chapter, you will learn the basic elements and concepts of the C++ programming language to create C++ programs. In addition to giving examples to illustrate various concepts, we will also show C++ programs to clarify them. In this section, we provide an example of a C++ program. At this point, you need not be too concerned with the details of this program. You only need to know the effect of an output statement, which is introduced in this program. \n \n#include <iostream> using namespace std; \nint main() { int num; num = 6; \ncout << \"My first C++ program.\" << endl; \ncout << \"The sum of 2 and 3 = \" << 5 << endl; \ncout << \"7 + 8 = \" << 7 + 8 << endl; \ncout << \"Num = \" << num << endl;\n return 0; } '
        },
        {
          sectionIdentifier: 3,
          chapterIdentifier: 2,
          mainHeading : 'Data Types',
          subHeading : 'Floating Point Data Types',
          description : 'Usually, a C++ program contains various types of expressions such as arithmetic and strings. For example, 7 + 8 is an arithmetic expression. Anything in double quotes is a string. For example, \"My first C++ program.\" and \"7 + 8 = \" are strings. Typically, a string evaluates to itself. Arithmetic expressions are evaluated according to rules of arithmetic operations, which you typically learn in an algebra course. Later in this chapter, we explain how arithmetic expressions and strings are formed and evaluated. Also note that in an output statement, endl causes the insertion point to move to the beginning of the next line. (On the screen, the insertion point is where the cursor is.) Therefore, the preceding statement causes the system to display the following line on the screen. My first C++ program. Let us now consider the following statement. cout << \"The sum of 2 and 3 = \" << 5 << endl; This output statement consists of two expressions. The first expression (after the first <<) is \"The sum of 2 and 3 = \" and the second expression (after the second <<) consists of the number 5. The expression \"The sum of 2 and 3 = \" is a string and evaluates to itself.  (Notice the space after =.) The second expression, which consists of the number 5 evaluates to 5. Thus, the output of the preceding statement is: <strong>The sum of 2 and 3 = 5</strong>'
        },
        {
          sectionIdentifier: 3,
          chapterIdentifier: 2,
          mainHeading : 'Data Types',
          subHeading : 'Floating Point Data Types',
          description : 'Let us now consider the following statement. cout << \"7 + 8 = \" << 7 + 8 << endl; In this output statement, the expression \"7 + 8 = \", which is a string, evaluates to itself. Let us consider the second expression, 7 + 8. This expression consists of the numbers 7 and 8 and the C++ arithmetic operator +. Therefore, the result of the expression 7 + 8 is the sum of 7 and 8, which is 15. Thus, the output of the preceding statement is: 7 + 8 = 15 This statement consists of the string \"Num = \", which evaluates to itself, and the word num. The statement num = 6; assigns the value 6 to num. Therefore, the expression num, after the second <<, evaluates to 6. It now follows that the output of the previous statement is: Num = 6 The last statement, that is, return 0; returns the value 0 to the operating system when the program terminates. We will elaborate on this statement later in this chapter.'
        },

    ];
        return {chapterTwoSectionOneContent, chapterTwoSectionTwoContent, chapterTwoSectionThreeContent};
    }

}
