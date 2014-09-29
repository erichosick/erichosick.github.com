---
layout: post
title: "Mechanisms"
description: "Mechanisms - Blurring the Distinction Between Languages, Operating Systems and Frameworks"
category: Design
tags: [C#, csharp, Javascript, composition, mechanisms, policy, frameworks, programming languages]
author: Eric Hosick
author_twitter: erichosick
---

<script src="/assets/js/mCore.js"></script>
<script src="/assets/js/mWeb.js"></script>

## Introduction

Please visit the [jsVision](http://www.github.com/jsVision) gitub repository to checkout and play with mechanisms.

A working example (requires latest browsers):

<form id="add">
  <input id="lft" value="5"/>
  +
  <input id="rgh" value="-2"/>
  =
  <input id="res" value=""/>
  <input type="button" value="calc" onClick='
  M.propSet({
    dest: M.getElemById("res"),
    destProp: "value",
    src: M.add({
      l: M.propGet({ item: M.getElemById("lft"), prop: "value" }),
      r: M.propGet({ item: M.getElemById("rgh"), prop: "value" })
    })
  }).go;
'/>
</form>

##### (be sure to inspect the calc button)

Software engineers strive to separate the what (policy) from the how (mechanism) for reasons like [code re-use](https://en.wikipedia.org/wiki/Code_reuse), [maintainability](https://en.wikipedia.org/wiki/Maintainability), [modularity](https://en.wikipedia.org/wiki/Modular_programming) and [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns).

We propose a mechanism centric [programming paradigm](https://en.wikipedia.org/wiki/Programming_paradigm) to help engineers create better software frameworks.

## What are Mechanisms?

A mechanism is "the how". Mechanisms cover everything from language syntax to operating system features like:

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

### Mechanisms Make Everything "First-Class Citizens"

Every mechanism is a [first class citizen](https://en.wikipedia.org/wiki/First-class_citizen).

Even traditional programming statements like break or catch are first class citizens.

### Defining Mechanisms

A mechanism can be viewed as a fundamental data-type that also contains an algorithm:

* **an algorithm** - The source-code that implements the mechanism's algorithm.
* **data** - The data required by the mechanism to run the algorithm.
  * Since a mechanism **is** the only fundamental data-type, the data is also a mechanism.
* **an invocation point** - "go", "makeItSo#1", "run"
  * An invocation point is a calculated property
    * [C#](http://csharp.2000things.com/tag/calculated-property/)
    * Javascript [get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/get) and [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/set)
    * [Ruby Language](https://stackoverflow.com/questions/11716550/ruby-class-set-get)
    * [Python](http://blaag.haard.se/What-s-the-point-of-properties-in-Python/)
  * For performance purposes, invocation points can be defined for each primitive data-type in any given language.

A single invocation point means the behavioral interface to a mechanism is the same for all mechanisms. You can think of it as playing a game of [dominoes](https://en.wikipedia.org/wiki/Dominoes) where every tile has the exact same number of spots.

<p class="featurette pagination-centered">
    <img class="featurette-image img-polaroid" src="/assets/img/posts/mechanisms_domino_interface.png"></img>
</p>

This makes it really easy to use a mechanism.

### Example Mechanisms

Mechanisms are tightly coupled to the language they are implemented in meaning the constructs we use to implement mechanisms may not be mechanisms.

An example add mechanism in Javascript with two invocation points (goNum and goStr):

    function AddF(){};
    AddF.prototype = Object.create(DualArgF.prototype, {
      goNum: { get: function() { return this._l.goNum + this._r.goNum; } },
      goStr: { get: function() { return "(" + this._l.goStr + " + " + this._r.goStr + ")"; } }
    });
    function add(d) {
      var f = Object.create(AddF.prototype);
      f.d = d;
      return f;
    };

Mechanisms for this post are defined in:

* [Core Mechanisms](/assets/js/mCore.js)
* [Web Mechanisms](/assets/js/mWeb.js)
* [Github Repository](http://www.github.com/jsVision) (with LOTS of tests)

in C#:

    public class add : mechanism {
      public mechanism l { get; set; }
      public mechanism r { get; set; }
      public mechanism go {
      	get { return new num { v = goNum }; }
      }
      public float goNum {
      	get { return l.goNum + r.goNum; }
      }
      public string goStr {
      	get { return string.Format ("({0} + {1})", l.goStr, r.goStr); }
      }
    }

## What are Policies?

A policy is "the what" defined by using mechanisms. A policy is your program or application. Policies are fully decoupled from mechanism implementation.

### Defining Policies

An example policy using add, propGet, propSet and getElemById mechanisms.

in Javascript:

    M.propSet({
      dest: M.getElemById("result"),
      destProp: "value",
      src: M.add({
        l: M.propGet({
          item: M.getElemById("left"),
          prop: "value"
        }),
        r: M.propGet({
          item: M.getElemById("right"),
          prop: "value"
        })
      })
    }).go;

<form id="add">
  <input id="left" value="5"/>
  +
  <input id="right" value="-2"/>
  =
  <input id="result" value=""/>
  <input type="button" value="calc" onClick='
  M.propSet({
    dest: M.getElemById("result"),
    destProp: "value",
    src: M.add({
      l: M.propGet({
        item: M.getElemById("left"),
        prop: "value"
      }),
      r: M.propGet({
        item: M.getElemById("right"),
        prop: "value"
      })
    })
  }).go;
'/>
</form>


in [SipCoffee]({% post_url 2013-12-19-design-composition-based-language %}):

    propSet (
      destProp "value"
      dest getElemById ( id "result")
      src add (
        l propGet (
          item getElemById (id "left")
          prop "value"
        )
        r propGet (
          item getElemById (id "right")
          prop "value"
        )
      )
    )

in C#:

    new propSet {
      dest = new getElemById { id = "result "},
      destProp = "result",
      src = new add {
        l = new propGet {
          item = new getElemById { id = "left"},
          prop = "left",
        },
        r = new propGet {
          item = new getElemById { id = "right"},
          prop = "right",
        }
      },
    };

Your probably noticed already that policies can be easily converted to different languages.


## Further Reading

Some readings on separation of mechanism and policy:

* [Stackoverflow - Policy and Mechanisms](https://stackoverflow.com/questions/4784500/policy-and-mechanism)
* [Wikipedia - Separation of Mechanism and Policy](https://en.wikipedia.org/wiki/Separation_of_mechanism_and_policy)
* [Policy-vs-Mechanism](https://sites.google.com/site/mylokesh/policyvsmechanism)


## When do we Create New Mechanisms?

All programs and applications are implemented using policies.

So, we ask ourselves the question:

> Can we, efficiently, implement our policy (program) using available mechanisms?

If the answer is yes, then don't create any new mechanisms.

If the answer is no, it is because:

* the policy can't be defined because the mechanisms required don't exist.
* the existing mechanisms aren't efficient enough for the problem domain (the software framework is lacking).
* there are common policy configurations and policies would look better if we created a single mechanism out of a policy configuration.
  * In the above examples, we access the value property of getElemById quite often. A mechanism, say called getElemValById, may be a good addition.

A, lofty, goal is to provide all mechanisms necessary to create any policy within a single programming-language-framework.

### Why Consider Efficiency?

To quickly make the point on why efficiency is important, let's focus on problems that could be solved using a [turing machine](https://en.wikipedia.org/wiki/Turing_machine).

All [turing complete](https://en.wikipedia.org/wiki/Turing_completeness) problems could be solved by creating policies using only those mechanisms that make up a turing machine (example mechanisms being states, tables, alphabets, leftShift and rightShift).

However, on current day architectures, these mechanisms could result in policies with unsatisfactory algorithm execution times.

If a policy was taking too long to run, it's time to reconsider the mechanisms being used and/or consider implementing new mechanisms better suited for the problem space.

### When Is a Policy a Mechanism

Context is important when considering if something is a policy or a mechanism.

#### A Company That Ships Goods

* **What** we need to do is ship goods to our customers (the policy).
* **How** we do that is with a truck, some goods and directions (the mechanisms).

The truck is a mechanism.

#### A Company That Makes Trucks

* **What** we need to do is assemble trucks (the policy).
* **How** we do that is with purchased parts and tools (the mechanisms).

The truck (assembly) is a policy.

One domain's mechanism is another domain's policy.

## Mechanisms -vs- (Parameterized) Sub-Routines

Traditionally, sub-routines have data "pushed" into them via parameters, though sub-routines can "pull" from scoped data, and then run the algorithm contained in the sub-routine.

Mechanisms never have data "pushed" to them. Instead, mechanisms "pull" data into the mechanism for use by the algorithm.

Consider an add sub-routine with an addition algorithm:

    int add ( int left, int right ) {
      return left + right;
    }

We "push" into the add sub-routine the values contained in the left and right parameters.

Consider an add mechanism (pseudo-code):

    mechanism add {
      mechanism left;
      mechanism right;
      
      mechanism goNum {
        return left.goNum + right.goNum;
      }
    }

In this case, data is "pulled" from the left and right mechanisms by invoking those mechanisms: left.goNum and right.goNum.

Further examples using real languages are provided in the post [C# and Homoiconicity]({% post_url 2014-09-21-design-csharp-and-homoiconicity %}) and [Javascript and Homoiconicity]({% post_url 2014-09-18-design-javascript-and-homoiconicity %}).

When we use the traditional add in a program, we need to know where the value of left and right come from before we can call add's algorithm:

    int x = 5;
    int y = 8;
    int result = add (x, y); // We must push data into add right here.

We can't get around it. At some point while coding, when we call add, we have to pass parameters to add at that point in the code.

When we use add as a mechanism, we don't need to know where the values of left and right come from before we call add's algorithm:

    // addMech defined anywhere in the program.
    // perhaps during initiation

    mechanism result = addMech.go; // We can initialize addMech somewhere else
    
In fact, we don't even need to know what data is required by the add algorithm when we use add in our policy. The internal workings of add are **fully** encapsulated and hidden from the policy.

## Play Around In the Console

Go into a console (For example: View -> Developer -> JavaScript Console in Chrome).

    // NOTE: Be careful NOT to hook an add policy to itself.

    // Create addA policy
    $ var addA = M.add({l:4,r:2});
    $ addA.go; // 6
    $ addA.goStr; // (4 + 2)

    // Create addB policy
    $ var addB = M.add({l:3,r:-1});
    $ addB.go; // 2
    $ addB.goStr; // (3 + -1)

    // Create addC policy
    $ var addC = M.add({l:addA,r:addB});
    $ addC.go; // 8
    $ addC.goStr; // (4 + 2) + (3 + -1))

    // Create form access policy
    $ var frmL = M.propGet({item: M.getElemById("left"), prop: "value" });
    $ frmL.go; // based on form data
    $ frmL.goNum;
    $ frmL.goStr;    

    // Create addD policy
    $ var addD = M.add({l:addA,r:frmL});
    $ addD.go;  // based on form data
    $ addD.goNum;
    $ addD.goStr;    

## Conclusion

Mechanisms and policies are a way of helping programmers separate the how from the why. Our software frameworks only contain the how (mechanisms) and **never** the why (policies).

This means our programs, the policies, are 100% decoupled from the framework. This makes it easier to port our programs (policies) to different programming languages, operating systems and future languages.

If you find our work on mechanisms interesting, please follow us [@interfaceVision](http://www.twitter.com/interfaceVision) and/or [@erichosick](http://www.twitter.com/erichosick).
