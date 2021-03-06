---
layout: post
title: "C# and Homoiconicity: Source-code that is a Data-Structure"
description: "Homoiconicity should be a feature of programming languages and this is how to do it in C#."
category: Design
tags: [C#, chspar, composition, Homoiconicity, Homoiconic]
author: Eric Hosick
author_twitter: erichosick
---

## Introduction

You can mess around with a C# demo project in [csVision github](https://github.com/erichosick/csVision) and Javascript demo project [jsVision github](https://github.com/erichosick/jscriptVision).

[Homoiconicity](https://en.wikipedia.org/wiki/Homoiconicity) is a feature of a language where the language's "program code is represented as the language's fundamental data type" (also see [Homoiconic Languages](http://c2.com/cgi/wiki?HomoiconicLanguages) on c2).

C# is a strongly typed language whose fundamental datatypes are primitives (strings, floats, int, longs, etc.) and classes with properties. From these fundamental data-types, we will create a single fundamental data type for C# (called a mechanism).

Homoiconic source-code is a data-structure in and of itself. Programming becomes the composition of this single fundamental datatype which results in the new algorithm (the program) and data-structure at the same time.

## Why is Homoiconicity So Cool

Programming is the automation of process. We take real world processes and define them in algorithms that operate against data structures.

Data-structures and algorithms are cool. All the software we see today, and other abstractions like objects and functions, are built from these two abstractions: data-structures and algorithms.

The cool thing about data-structures is the things you can do with them. You can:

* store them
* load them
* traverse them
* order them
* duplicate them
* give them "meaning" in context
* pass them between algorithms
* search them
* splice them
* MERGE them
* insert elements
* delete elements
* multiple visual representations
* every element has the same signature (no specialization: it's just data)

and a lot of other cool things.

Imagine then a program whose source-code is a data-structure in and of itself. There is a one-to-one mapping of your source-code with the allocated instances of objects on the heap during run-time. This means anything you can do with a data-structure, you can do to a program: even during run time.

* Want to inject behavior at any point in a program: even during run-time? Easily done.
* Want to persist any part of your program? Easily done.
* Want to check for lack of error handling in a program? Run an agent against the data structure.
* Want to merge two programs during run-time? Yep! You can easily merge two programs.
* Want to scale your program to support thousands of users? Just make as many copies of the program as you want and run each one in their own thread (say goodbye to issues like re-entrance).

And this:

> You can display and edit your program using different visual representations!

Just like you can display and edit trees in many [different visual formats](https://www.google.com/search?q=tree+structure&tbm=isch), you can display and edit source code visually. You can have multiple visual representations of the same program: each one tailored towards the reader of your program!

It really surprises me that we have gone this far without Homoiconicity going main stream.

## Why is Homoiconicity Hard To Do in Languages?

I think I know why it is hard to find languages that are really Homoiconic. However, I have a really hard time articulating the reasons why. Perhaps it could be articulated as follows:

> Homoiconic languages don't need parameterized sub-routines.

If you are creating a language, and remove parameterized sub-routines as the core abstraction for communication of data between sub-routines, you end up with a Homoiconic language.

The fundamental datatypes (mechanisms) take the place of parameterized sub-routines and passing of information between mechanism becomes an inherent part of the data-structure you create when programming.

## C# and Homoiconicity

Here is C# code that is also a data-structure (both the code and the instances on the heap are a data-structure):

The fundamental datatype mechanism interface:

    public interface iMech {
      iMech go { get; }
      float asNum { get; }
      string asStr { get; }
    }

Let's write the addition of ((3 + -1) + -1) to the console and the addition result of 1.

    iMech mechWrite = new writeToCon {
      text = new add {
        left = new add {
          left = new num { val = 3 },
          right = new num { val = -1 }
        },
        right = new num { val = -1 }
      },
    };
    
    mechWrite.go; // invoke the program
    mechWrite.asNum; // invoke the program => output is 1
    

How about we persist it:

    iMech persistIt = new persist {
      fileName = "/somefile",
      fileType = "json",
      program = mechWrite
    };

    persistIt.go; // invoke the program

How about we persist it using a file name and file type entered by a user on a form:

    iMech persistIt2 = new persist {
      fileName = new formFieldGet {
        formName = "persist_form",
        formField = "file_name"
      },
      fileType = new formFieldGet {
        formName = "persist_form",
        formField = "file_type"
      },
      program = mechWrite
    };

    persistIt2.go; // invoke the program

How about we inject behavior to write a message to the console when the file_type form field is accessed:

    iMech persistIt3 = new persist {
      fileName = new formFieldGet {
        formName = "persist_form",
        formField = "file_name"
      },
      fileType = new writeToCon {
        text = new formFieldGet {
          formName = "persist_form",
          formField = "file_type"
        },
      },
      program = mechWrite
    };

    persistIt3.go; // invoke the program

That's kinda cool. When the persister-mechanism runs go on the writeToCon-mechanism placed in the fileType property, writeToCon runs the mechanism in the text property.

That eventually causes the text in the form field to propagate up to the writeToCon-mechanism which then writes that text to the console.

The writeToCon-mechanism then propagates the text up to the persist-mechanism which uses the text to determine the file type.

If you look back, you will notice that no matter how complex the program, the interface to it is the exact same. To invoke the behavior of **any program** you simply call go on that program.

Standardization of behavioral interface (notice everything is an iMech interface: even primitive datatypes) is an emergent property of any Homoiconic language and may be a good litmus test to determine if a language is Homoiconic.

## But This Looks More Like a Framework Than a Language

Exactly!

In a Homoiconic language, there is no way to distinguish the language itself from the software frameworks built in the language because **everything** is a fundamental datatype (a mechanism): even **scope** is implemented as a mechanism.

In my opinion, separation of language and framework is a red-flag that we are doing something wrong.

Fundamental parts of the language are key words (loop, between, forEach, withEach, doWhile, etc.) but the structure of the code does not give any hint as to what those key words are.

    iMech mechLoop = between {
      from = new num {val = 2},
      to = new num {val = 8},
      by = new num {val = 2},
      do = new writeToCon {
        text = str { val = "Hello world!" },
      },
    };

    mechLoop.go; // invoke the program

Traditional code would give us a hint as to what the keywords are:

    for (int i=2; i<=8; i++) {
      Console.WriteLn ("Hello world!")
    }

## Difficult to Read

As pointed out by this [great blog post](https://blogs.oracle.com/blue/entry/homoiconic_languages) on the subject by blue, "it is hard for humans to visually parse as the uniformity of the language often removes any visual cues that we are familiar with in most of the languages".

You can see an example of a web server configured from scratch [here]({% post_url 2014-06-23-vision-minimal-webserver %}) using a Homoiconic language called SipCoffee. In 50 lines of code, we compose a multi-threaded web server that supports socket routing. But it is a little difficult to read at first due to a lack of visual cues. However, remember that since the code is a data-structure, we can display the code in anyway we like: even a visual representation of the code (hint hint).

Perhaps, some day, we will end up with visual programming languages that, behind the scenes, are simply manipulating code that is a data-structure.

## Conclusion

Although there is still [debate](http://c2.com/cgi/wiki?HomoiconicityClassification) as to what makes a language Homoiconic, I think we have shown that it is indeed possible to program in C# using only a fundamental datatype (a mechanism).

Our programs are indeed data-structures both in code and when instantiated on the heap.

Our code being a data-structure gives us the ability to manipulate code just like any data-structure. This means we can join, cut, copy, merge, delete, search, sort, load and save code: even during runtime!

If you find our work on Homoiconicity interesting, please follow us [@interfaceVision](http://www.twitter.com/interfaceVision) and/or [@erichosick](http://www.twitter.com/erichosick).
