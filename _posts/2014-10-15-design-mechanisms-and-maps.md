---
layout: post
title: "Mechanisms and Maps"
description: "Maps are implement using emitters."
category: Design
tags: [Javascript, composition, mechanisms, policy, frameworks, programming languages, maps, emitters, emit]
author: Eric Hosick
author_twitter: erichosick
---

<script src="/assets/js/mCore.js"></script>
<script src="/assets/js/mWeb.js"></script>

[mechanisms-policy-link]: {% post_url 2014-09-24-design-mechanisms-and-policies %} "mechanisms and policies"
[mech-library-link]: https://github.com/mechanismsjs/mech-library "Clone to easily create new mechanism libraries"
[mech-core-link]: https://github.com/mechanismsjs/mech-core "Core mechanisms"
[mech-web-link]: https://github.com/mechanismsjs/mech-web "Web centric DOM mechanisms"
[mech-math-link]: https://github.com/mechanismsjs/mech-math "Math mechanism"
[mech-math-map-link]: https://github.com/mechanismsjs/mech-math#map-mechanism "The map mechanism"
[mech-guid-link]: https://github.com/mechanismsjs/mech-guid "Mechanisms for guids"
[mech-emit-link]: https://github.com/mechanismsjs/mech-emit "Mechanisms for emitting data"
[mech-home-link]: https://github.com/mechanisms/mech "Home repository for mechanisms"

## Introduction

This is a continuation of the [mechanisms and policies][mechanisms-policy-link] post.

People asked for a less-trivial example on what mechanisms are. In this post, we will show how we can implement [mapping][mech-math-map-link] using [mechanisms][mechanisms-policy-link] and [emitters][mech-emit-link].

## Map Examples

Mapping "calls a defined callback function (policy) on each element of an array, and returns an array that contains the results"."

Traditionally, this is done in Javascript as follows:

    // traditional approach
    var x = [1, 2, 3, 4, 5].map(
       function(n) {
         return n + 2;
       }
    );

    // x contains [3, 4, 5, 6, 7]

Let's build a policy that does the same thing using a **map** and an **emitter** described in detail below.

    // our policy defined with mechanism
    var x = m.map(
      m.add(
        2,
        m.emitArr([1,2,3,4,5])
      )
    ).go;

    // x also contains [3, 4, 5, 6, 7]

## Pushing Into -vs- Pulling Into 

### Push-Then-Pull Approach

Traditionally, we use a **push-then-pull** approach to programming algorithms. We **push** data into the algorithm and **pull** a result.

In the traditional example, we **pushed** a callback-function to the map algorithm. The map algorithm itself **pushes** into the our callback-function the value of the current element. It then **pulls** the result of the call-back function and adds that value to an array that is eventually **pulled** from the map function and placed in the variable *x*.

### Pull Approach

A pull centric approach has the algorithm **pulling** into itself the information it needs.

Our policy is made up of a *map*, *add* and *emitArr* mechanism. We can plug any policy into our map mechanism. Maybe we just want to **pull** directly from the emitter:

    // map simply returns an array
    var x = m.map(
      m.emitArr([1, 2, 3, 4, 5])
    ).go;

    // x contains [1, 2, 3, 4, 5]

or something silly like writing to the console each element we are adding to the map:


    // our policy defined with mechanism
    var x = m.map(
      m.writeLn(
        m.mul(
          3,
          m.emitRange(1, 3, .5)
        )
      )
    ).go;

    // x contains [3, 4.5, 6, 7.5, 9]
    // and we will see 3, 4.5, 6, 7.5 and 9: each written on it's own line

The point is, we aren't limited to one kind of thing: a call-back function. It can by any mechanism or any policy.

The map mechanism itself becomes crazy simple and the implementation ([here](https://github.com/mechanismsjs/mech-math/blob/master/src/map.js)) is partially provided:

    MapF.prototype = Object.create(Object.prototype, {
       go: { get: function() {
          if ( null === this._cache) {
             this._cache = [];
             var cur = this._a.go;
             var i = 0;
             while ((undefined !== cur) && ( i < this._fixed)) {
                this._cache[i++] = cur;
                cur = this._a.go;
             }
          }
          return this._cache;
       }}
    });

We simply **pull** a result from the policy located in *this._a*, invoking the policy by accessing go, and add it to an array.

## More Examples of Mapping with Emitter Mechanisms

An [emitter][mech-emit-link] provides the next value. We have created two emitters so far:

* **emitArr** - An emitter that pulls items from an array (ya - a bad name. emitArrSource maybe?)
* **emitRange** - An emitter that pulls items from a dynamically generated range of numbers (ya - a bad name. emitRangeSource maybe?)

We can do some cool things with these.

How about:

    m.emitRange(0, Infinity, 23); // an unlimited range
    m.emitRange(-20, 20, .5); // a simple range
    m.emitRange(1, Infinity, 2); // emit odd numbers
    m.emitRange(0, Infinity, 2); // emit even numbers

How about a range that repeats:

    m.emitRange(1,3,1,true); // an unlimited range [1,2,3,1,2,3...]

Let's add two emitters:

    m.add (
      m.emitRange(0, Infinity, 2),
      m.emitRange(1, Infinity, 2)
    );

Let's map that addition limited to 30 elements:

    var x = m.map(
      m.add (
        m.emitRange(0, Infinity, 2),
        m.emitRange(1, Infinity, 2)
      ),
      30
    ).go;

    // [ 1,  5,  9, 13, 17,  21,  25,  29,  33,  37,
    //  41, 45, 49, 53, 57,  61,  65,  69,  73,  77,
    //  81, 85, 89, 93, 97, 101, 105, 109, 113, 117]

## WHY LIMIT THE SIZE OF YOUR MAPS?

Remember that traditionally, somewhere in the program we take the result of our map and stuff it into something else. That something else then does something to that map.

But do we really need such maps anymore? Remember, we can plug our example addition of emitters policy into anything. This means, we can effectively have infinite sized maps.

And by plug into anything, we mean **ANYTHING**.

Even the *increment-by* argument of an emitter can be an emitter!?!?!

    m.emitRange(0, Infinity, m.emitArr([1,-8,3,12]), true));

This is some strange emitter where we increment by 1, then -8, then 12, then 2 and then repeat (1, -8, 3, 12).

    1, -7, -4, 8, 9, 1, 13, 14, 6, 9, 21, ... // infinite

These example may be silly, but we really want to help people grok just how effective mechanisms are as a programming construct and abstraction.

## What Problems Are We Solving

// TODO


## Why Mechanisms Feel Right

// TODO



If you find mechanisms interesting, please follow [@erichosick](http://www.twitter.com/erichosick).

