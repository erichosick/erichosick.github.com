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

Please visit the [jsVision](https://github.com/erichosick/jsVision) gitub repository to checkout and play with mechanisms.

A working example (may require latest browser):

<form id="add">
  <input id="lft" value="5"/>
  +
  <input id="rgh" value="-2"/>
  =
  <input id="res" value=""/>
  <input type="button" value="calc" onClick='
  M.propSet("value", M.e$("res"),
    M.add( M.p$( "value", M.e$("lft") ), M.p$( "value", M.e$("rgh") ) )
  ).go;
'/>
</form>

    // The policy invoked when calc is pressed.
    // Try copying and pasting the code into your browser console.

    M.propSet("value", M.getElemById("res"),
      M.add(
        M.propGet("value", M.getElemById("lft")),
        M.propGet("value", M.getElemById("rgh"))
      )
    ).go;

Software engineers strive to separate the what (policy) from the how (mechanism) for reasons like [code re-use](https://en.wikipedia.org/wiki/Code_reuse), [maintainability](https://en.wikipedia.org/wiki/Maintainability), [modularity](https://en.wikipedia.org/wiki/Modular_programming) and [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns).

We propose a mechanism centric [programming paradigm](https://en.wikipedia.org/wiki/Programming_paradigm) to help engineers design software frameworks which are easy to use.

Mechanisms help framework users focus on their business solutions and not the framework.

## What are Mechanisms?

A mechanism is "the how". Mechanisms cover everything from language syntax to operating system features. Examples are:

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
  * An invocation point is a calculated property.
    * [C#](http://csharp.2000things.com/tag/calculated-property/)
    * Javascript [get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/get) and [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/set)
    * [Ruby Language](https://stackoverflow.com/questions/11716550/ruby-class-set-get)
    * [Python](http://blaag.haard.se/What-s-the-point-of-properties-in-Python/)
  * Optionally, invocation points can be defined for primitive data-types in any given language.

A single invocation point means the behavioral interface of **all** mechanisms (algorithms) is the same. You can think of it as playing a game of [dominoes](https://en.wikipedia.org/wiki/Dominoes) where every tile has the exact same number of spots.

<p class="featurette pagination-centered">
    <img class="featurette-image img-polaroid" src="/assets/img/posts/mechanisms_domino_interface.png"></img>
</p>

This makes it really easy to use a mechanism.

### Example Mechanisms

Mechanisms are tightly coupled to the language they are implemented in meaning the constructs we use to implement mechanisms may not be mechanisms.

Source-code for examples:

* [Core Mechanisms](/assets/js/mCore.js)
* [Web Mechanisms](/assets/js/mWeb.js)
* [Github Repository](https://github.com/erichosick/jsVision)

An example add mechanism in Javascript with two invocation points (goNum and goStr):

    function AddF(){};
    AddF.prototype = Object.create(DualArgF.prototype, {
      goNum: { get: function() { return this._l.goNum + this._r.goNum; }},
      goStr: { get: function() { return "(" + this._l.goStr + " + " + this._r.goStr + ")"; }}
    });
    function add(left, right) {
      var f = Object.create(AddF.prototype);
      f.l = left;
      f.r = right;
      return f;
    };


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

A policy is "the what" defined by using mechanisms. A policy is the program or application. Policies are fully decoupled from mechanism implementation.

### Defining Policies

An example policy using add, propGet (also p$), propSet and getElemById (also e$) mechanisms.

in Javascript ([sip-ish]({% post_url 2013-12-19-design-composition-based-language %})):

    // preferred syntax
    // propSet(propertyName, destination, source) { ... };
    // propGet(propertyName, source) { ... };
    // add(left, right) {...};
    M.propSet("value", M.getElemById("result"),
      M.add(
        M.propGet("value", M.getElemById("left")),
        M.propGet("value", M.getElemById("right"))
      )
    ).go;

in Javascript (object-ish):

    // Dooable but we prefer the sip-ish syntax
    M.propSet({
      destProp: "value",
      dest: M.getElemById("result"),
      src: M.add({
        l: M.propGet({
          prop: "value",
          item: M.getElemById("left")
        }),
        r: M.propGet({
          prop: "value",
          item: M.getElemById("right")
        })
      })
    }).go;

<form id="add">
  <input id="left" value="17"/>
  +
  <input id="right" value="-5"/>
  =
  <input id="result" value=""/>
  <input type="button" value="calc" onClick='
  M.propSet("value", M.e$("result"),
    M.add( M.p$( "value", M.e$("left") ), M.p$( "value", M.e$("right") ) )
  ).go;
'/>
</form>


in [SipCoffee]({% post_url 2013-12-19-design-composition-based-language %}):

    propSet("value"
      getElemById("result")
      add(
        propGet("value" getElemById(id "left"))
        propGet("value" getElemById(id "right"))
      )
    )

in C#:

    new propSet {
      destProp = "result",
      dest = new getElemById {id = "result "},
      src = new add {
        l = new propGet {
          item = new getElemById {id = "left"},
          prop = "left",
        },
        r = new propGet {
          item = new getElemById {id = "right"},
          prop = "right",
        }
      },
    };

You've probably noticed already that policies can be easily converted between different languages.


## Further Reading

Some readings on separation of mechanism and policy:

* [Stackoverflow - Policy and Mechanisms](https://stackoverflow.com/questions/4784500/policy-and-mechanism)
* [Wikipedia - Separation of Mechanism and Policy](https://en.wikipedia.org/wiki/Separation_of_mechanism_and_policy)
* [Policy-vs-Mechanism](https://sites.google.com/site/mylokesh/policyvsmechanism)


## When do we Create New Mechanisms?

All programs and applications are implemented using policies.

We ask ourselves the question:

> Can we, efficiently, implement our policy (program) using available mechanisms?

Create a mechanism when:

* the policy can't be defined because the mechanisms required don't exist.
* the existing mechanisms aren't efficient enough for the problem domain (the software framework is lacking).
* there are common policies that would look better if we created a single mechanism out of the policy.
  * In the examples, accessing a property of a DOM element requires two mechanisms. We could make that one.

A, lofty, goal is to provide all mechanisms necessary to create any policy within a single programming-language-framework.

### Why Consider Efficiency?

Let's consider only problems that could be solved using a [turing machine](https://en.wikipedia.org/wiki/Turing_machine).

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

The truck is a policy.

One domain's mechanism is another domain's policy.

## Mechanisms -vs- (Parameterized) Sub-Routines

Sub-routines have data "pushed" into them via parameters (though sub-routines can "pull" from scoped data).

Mechanisms never have data "pushed" to them. Instead, mechanisms "pull" data into the mechanism for use by the algorithm.

Consider an add sub-routine with an addition algorithm:

    int add(int left, int right) {
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

We must provide the left,right parameters to add at the time of invocation.

    int left = 5;
    int right = 8;
    int result = add(left, right); // We must push data into add right here.

We can't get around it. While coding, we have to pass parameters to add at the time of invocation! It's forced on us by the language syntax.

We can invoke an add mechanism at anytime in our code without knowing anything about left and right **at the time of invocation**!

    mechanism result = addMech.go; // We can initialize addMech somewhere else
    
    // OR

    mechanism result = addMech(left, right).go // or do it right here

## Play Around In the Console

Go into a console (For example: View -> Developer -> JavaScript Console in Chrome).

    // NOTE: Be careful NOT to hook a policy to itself.

    // Create addA policy
    $ var addA = M.add(4, 2);
    $ addA.go; // 6
    $ addA.goStr; // (4 + 2)
    $ addA.goBool; // true
    $ addA.goArr; // [6]

    // Create addB policy
    $ var addB = M.add(3, -1);
    $ addB.go; // 2
    $ addB.goStr; // (3 + -1)

    // Create addC policy
    $ var addC = M.add(addA, addB);
    $ addC.go; // 8
    $ addC.goStr; // (4 + 2) + (3 + -1))

    // Create a form-access policy
    $ var frmL = M.p$("value", M.e$("left"));
    $ frmL.go; // based on form data
    $ frmL.goNum;
    $ frmL.goStr;    

    // Create addD policy
    $ var addD = M.add(M.add(4, 2), M.p$("value", M.e$("left")));
    $ addD.go;  // based on form data
    $ addD.goNum;
    $ addD.goStr;
    $ addD.goBool;
    $ addD.goArr;

## Conclusion

Mechanisms and policies are a way of helping programmers separate the how from the why. Software frameworks only contain the how (mechanisms) and **never** the why (policies).

If you find our work on mechanisms interesting, please follow us [@interfaceVision](http://www.twitter.com/interfaceVision) and/or [@erichosick](http://www.twitter.com/erichosick).

