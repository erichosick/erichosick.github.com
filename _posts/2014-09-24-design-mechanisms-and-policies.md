---
layout: post
title: "Mechanisms as a Programming Paradigm"
description: "Mechanisms - Blurring the Distinction Between Languages, Operating Systems and Frameworks"
category: Design
tags: [C#, csharp, composition, mechanisms, policy, frameworks, programming languages]
author: Eric Hosick
author_twitter: erichosick
---

## Introduction

Software engineers strive to separate the what (policy) from the how (mechanism) for reasons like [code re-use](https://en.wikipedia.org/wiki/Code_reuse), [maintainability](https://en.wikipedia.org/wiki/Maintainability), [modularity](https://en.wikipedia.org/wiki/Modular_programming) and [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns).

We propose a mechanism centric [programming paradigm](https://en.wikipedia.org/wiki/Programming_paradigm) to help engineers create better software frameworks.

## What are Mechanisms?

A mechanism is "the how". Our mechanisms cover everything from language syntax to operating system features like:

* [language syntax](https://en.wikipedia.org/wiki/Syntax_%28programming_languages%29) mechanisms
  * loops (while, doWhile, for, forEach, etc.)
  * conditionals (==, <, >, <=, etc.)
  * primitive data types (int, float, var, array[], etc.)
  * [scope](https://en.wikipedia.org/wiki/Scope_%28computer_science%29) ( {}, (), closures, parameterized sub-routines, blocks, etc.)
* [programming paradigm](https://en.wikipedia.org/wiki/Programming_paradigm) mechanisms
  * behaviors, signals, switching, events, etc. ([functional reactive programming](https://en.wikipedia.org/wiki/Functional_reactive_programming))
  * entities, ports, buffers, etc. ([flow based programming](https://en.wikipedia.org/wiki/Flow-based_programming))
  * connectors, primitive constraints, quantities, constraint networks, probes ([constraint systems programming](https://mitpress.mit.edu/sicp/full-text/book/book-Z-H-22.html#%_sec_3.3.5))
  * ourselves (mechanisms)
  * etc.
* [operating system](https://en.wikipedia.org/wiki/Operating_system) mechanisms
  * persistence (files, memory)
  * communication (sockets, ports, pipes)
  * ui/ux (windows, buttons)
  * databases (sql, key/value stores, map reduce)
  * devices (display, keyboard, mouse, trackpad)
* math mechanisms
  * addition, subtraction, vectors, matrices, etc.
* etc.

Mechanisms are tightly coupled to the programming language by-which they were implemented.

### Defining Mechanisms

A mechanism can be viewed as a fundamental data-type that also contains an algorithm:

* **an algorithm** - The source-code that implements the mechanism's algorithm.
* **data** - The data required by the mechanism to run the algorithm.
  * Since a mechanism **is** the only fundamental data-type, the data is also a mechanism.
* **an invocation point** - "go", "makeItSo#1", "run"
  * For performance purposes, invocation points can be defined for each primitive data-type in any given language: especially strongly typed languages (see C# add mechanism below).
  
A single invocation point means the behavioral interface to a mechanism is the same for all mechanisms. You can think of it as playing a game of [dominoes](https://en.wikipedia.org/wiki/Dominoes) where every tile has the exact same number of spots.

<p class="featurette pagination-centered">
    <img class="featurette-image img-polaroid" src="/assets/img/posts/mechanisms_domino_interface.png"></img>
</p>

This makes it really easy to use mechanisms.

An example add mechanism in Javascript:

    var ArrF = function() {};
    ArrF.prototype = {
      get val() { return this.d; },
      get go() { return this.d; },
      get asNum() { return this.d[0]; },
      get asArr() { return this.d; },
      get asStr() { return "[" + this.d.toString() +"]"; }
    };
    function arr(d) { var f = new ArrF(); f.d = d; return f; };
    
in C#:

    public class add : iMech {
      public iMech left { get; set; }
      public iMech right { get; set; }
      public iMech go {
      	get { return new num { val = asNum }; }
      }
      public float asNum {
      	get { return left.go.asNum + right.go.asNum; }
      }
      public string asStr {
      	get { return string.Format ("({0} + {1})", left.asStr, right.asStr); }
      }
    }

## What are Policies?

A policy is "the what" defined by using mechanisms. A policy is your program or application. Policies are fully decoupled from mechanism implementation.

### Defining Policies

An example policy using a add, fieldGet and fieldSet mechanisms.

in Javascript:

    var mech = fieldSet ({
      form: "calc",
      field: "result",
      source: add({
        left: fieldGet({
          form: "calc",
          field: "left"
        }),
        right: fieldGet({
          form: "calc",
          field: "right"
        })
      })
    });
    
in [SipCoffee]({% post_url 2013-12-19-design-composition-based-language %}):

    fieldSet (
      form "calc"
      field "result"
      source add (
        left fieldGet (
          form "calc"
          field "left"
        )
        right fieldGet (
          form "calc"
          field "right"
        )
      )
    )

in C#:

    var mech = new fieldSet {
      form = "calc",
      field = "result",
      source = new add {
        left = new fieldGet { form = "calc", field = "left" },
        right = new fieldGet { form = "calc", field = "right" }
      },
    };
    
These policies add two values entered on a form and place the result in a form field called "result".

## Further Reading

Some readings on separation of mechanism and policy:

* [Stackoverflow - Policy and Mechanisms](https://stackoverflow.com/questions/4784500/policy-and-mechanism)
* [Wikipedia - Separation of Mechanism and Policy](https://en.wikipedia.org/wiki/Separation_of_mechanism_and_policy)
* [Policy-vs-Mechanism](https://sites.google.com/site/mylokesh/policyvsmechanism)


## When do we Create New Mechanisms?

In our programming paradigm, all programs and applications are implemented using policies.

So, we ask ourselves the question:

> Can we, efficiently, implement our policy using available mechanisms?

If the answer is yes, then don't create any new mechanisms.

If the answer is no, then most likely the policy can't be defined because the mechanisms required don't exist or they aren't efficient enough for the problem domain (the software framework is lacking).

### Why Consider Efficiency?

To quickly make the point on why efficiency is important, let's focus on problems that could be solved using a [turing machine](https://en.wikipedia.org/wiki/Turing_machine).

All [turing complete](https://en.wikipedia.org/wiki/Turing_completeness) problems could be solved by creating policies using only those mechanisms that make up a turing machine (example mechanisms being states, tables, alphabets, leftShift and rightShift).

However, on current day architectures, these mechanisms could result in policies with unsatisfactory algorithm execution times.

If a policy was taking too long to run, it's time to reconsider the mechanisms being used and/or consider implementing new mechanisms better suited for the problem space.

## Why use a Trivial Policy Example?

Things (mechanisms) have an almost unlimited number of usages.

Take apples for example. We could:

* eat them raw
* use them to grow a tree
* turn them into apple sauce
* turn them into an apple pie
* use them in experiments
* burn them
* create [dried apple dolls](http://civilwartalk.com/threads/dried-apple-dolls.91125/)
* use one to play catch

The decision on what we want to do, the policy, with apples is never trivial when we have an unlimited list of policies to choose from.

The ability to make the decision to use add in a policy is only possible because of years of education, an understanding of the problem space, working with customers, mocking out solutions and coming up with unit tests.

Only after all that work are we able to define what (the policy) we want to do with add (the mechanism).

A line of code is never trivial.

## Mechanisms -vs- Parameterized Sub-Routines

Traditionally, sub-routines have data "pushed" into them via parameters (though sub-routines can "pull" from scoped data) and then run the algorithm contained in the sub-routine.

Mechanisms never have data (mechanisms) "pushed" to them. Instead, mechanisms use internal data (mechanisms) to "pull" information to the algorithm.

Consider an add sub-routine with an addition algorithm:

    int add ( int left, int right ) {
      return left + right;
    }

We "push" into add values contained in the left and right parameters.

Consider an add mechanism (pseudo-code):

    mechanism add {
      mechanism left;
      mechanism right;
      
      mechanism go {
        return left.go + right.go;
      }
    }

In this case, data is "pulled" from the left and right mechanisms by invoking those mechanisms (go) on left and right.

Further examples using real languages are provided in the post [C# and Homoiconicity]({% post_url 2014-09-21-design-csharp-and-homoiconicity %}) and [Javascript and Homoiconicity]({% post_url 2014-09-18-design-javascript-and-homoiconicity %}).

When we use the traditional add in a program, we need to know where the value of left and right come from before we can call add's algorithm:

    int x = 5;
    int y = 8;
    int result = add (x, y); // can't get around it. We must push something to add here.

We can't get around it. At some point, when we call add while programming, we have to pass parameters to add.

When we use add as a mechanism, we don't need to know where the values of left and right come from before we call add's algorithm:

    // addMech defined anywhere in the program.
    // perhaps during initiation

    mechanism result = addMech.go;
    
In fact, we don't even need to know what data is required by the add algorithm when we use add in our policy. The internal workings of add are **fully** encapsulated and hidden from the policy.


### Defining Mechanisms Using Functional Programming

So far, we've discussed how to create mechanisms using objects. It should also be possible to create mechanisms using functional programming which we will discuss in another post.

## Scope, scopeGet and scopeSet Mechanisms

I'm thinking about perhaps implementing a few of the mechanisms required for constraint systems. Any ideas?

Either that, or implement Scope as a mechanism.


Let's choose something that is very core to a language and maybe a little difficult to implement: [scoping](https://en.wikipedia.org/wiki/Scope_%28computer_science%29). This is just one, of many ways, to implement the scope mechanism in C#. Remember, you can roll your own scope mechanism.


## Conclusion

Mechanisms and policies are a great way of assuring separation of the how we do something from the why. Our software frameworks only contain the how (mechanisms) and **never** the why (policies).

This means our programs, the policies, are 100% decoupled from the framework. This makes it a lot easier to port our policies to different programming languages, operating systems and future languages. Imagine if programs had always been written using policies as opposed to mixing the how and why in the framework.

If you find our work on mechanisms interesting, please follow us [@interfaceVision](http://www.twitter.com/interfaceVision) and/or [@erichosick](http://www.twitter.com/erichosick).
