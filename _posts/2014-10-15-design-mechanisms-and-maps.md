---
layout: post
title: "Mechanisms and Maps With Javascript"
description: "Maps are implement using emitters."
category: Design
tags: [Javascript, composition, mechanisms, policy, frameworks, programming languages, maps, emitters, emit]
author: Eric Hosick
author_twitter: erichosick
---

<script src="/assets/js/mech/mech-core.js"></script>
<script src="/assets/js/mech/mech-math.js"></script>
<script src="/assets/js/mech/mech-emit.js"></script>
<script src="/assets/js/mech/mech-guid.js"></script>
<script src="/assets/js/mech/mech-math.js"></script>
<script src="/assets/js/mech/mech-web.js"></script>

[mechanisms-policy-link]: {% post_url 2014-09-24-design-mechanisms-and-policies %} "mechanisms and policies"
[mech-library-link]: https://github.com/mechanismsjs/mech-library "Clone to easily create new mechanism libraries"
[mech-core-link]: https://github.com/mechanismsjs/mech-core "Core mechanisms"
[mech-web-link]: https://github.com/mechanismsjs/mech-web "Web centric DOM mechanisms"
[mech-math-link]: https://github.com/mechanismsjs/mech-math "Math mechanism"
[mech-math-map-link]: https://github.com/mechanismsjs/mech-math#map-mechanism "The map mechanism"
[mech-guid-link]: https://github.com/mechanismsjs/mech-guid "Mechanisms for guids"
[mech-emit-link]: https://github.com/mechanismsjs/mech-emit "Mechanisms for emitting data"
[mech-home-link]: https://github.com/mechanisms/mech "Home repository for mechanisms"

[mech-core-npm-link]: https://www.npmjs.org/package/mech-core "NPM of core mechanisms"
[mech-web-npm-link]: https://www.npmjs.org/package/mech-web "NPM of web centric DOM mechanisms"
[mech-math-npm-link]: https://www.npmjs.org/package/mech-math "NPM of math mechanism"
[mech-guid-npm-link]: https://www.npmjs.org/package/mech-guid "NPM of mechanisms for guids"
[mech-emit-npm-link]: https://www.npmjs.org/package/mech-emit "NPM of mechanisms for emitting data"



## Introduction

Mechanisms give programmers more flexible ways to use mapping algorithms in their programs (see our prior post on what [mechanisms and policies][mechanisms-policy-link] are).

> Hay! Mechanisms like emitters and maps are not coupled to any framework. You can use them in your Javascript programs by 'npm installing' small npms like [emitters](https://www.npmjs.org/package/mech-emit) and [maps][mech-math-npm-link].

In this post, we will show how we can implement [mapping][mech-math-map-link] using [mechanisms][mechanisms-policy-link] and [emitters][mech-emit-link].

Let's map the addition of two emitters limited to the number of elements **you** enter (as long as it is less than 100,001):

    m.map(
      m.add (
        m.emitFromRange(0, Infinity, 2), // positive integers
        m.emitFromRange(1, Infinity, 2)  // negative integers
      ),
      m.min(
        m.propGet("value", m.elemById("inp05")),
        100000
      )
    );
    
    // Quick Documentation:
    // m.map(algorithm, max) - Invokes the algorithm up to max number of times.
    // m.add(left, right) - add left to right.
    // m.min(arg1, arg2 ... argN) - find min of arg1, arg2 ... argN.
    // m.emitFromRange(min,max,by) - On each invocation, emit an element starting at min upto max intcremented-by by.
    // m.propGet(prop,item) - return the value located in item.prop.
    // m.elemById(id) - return the dom element with id.

Try it out:

<form id="ex05">
  <textarea id="lst05" rows="4"></textarea><br>
  <input id = "inp05" value="30"/>&nbsp;enter maximum number of elements to map<br>
  <input id="btn05" type="button" value="Press Me"
    onClick='
    m.propSet("value",
      m.elemById("lst05"),
      m.map(
        m.add (
          m.emitFromRange(0, Infinity, 2),
          m.emitFromRange(1, Infinity, 2)
        ),
        m.min(m.propGet("value", m.elemById("inp05")),100000)
      )
    ).go
    '
  />
</form>

Go to the console (in chrome: View->Developer->Javascript Console) and checkout the mechanisms library m: just type m return to see what is available).

## Map Examples

Mapping "calls a defined callback function on each element of an array, and returns an array that contains the results".

Traditionally, this is done in Javascript as follows:

    // traditional javascript
    var x = [1, 2, 3, 4, 5, 12, 15].map(
       function(number) {
         return number + 2;
       }
    );

    // x contains [3, 4, 5, 6, 7, 14, 17]

Map is **pushing** data into the call-back function's *number* parameter and **pulling** a result from the call-back function all the while aggregating the results into an array.

Let's build a program that does the same thing using a **map** and an **emitter** described in detail below.

    // mapping defined with mechanisms
    var x = m.map(
      m.add(2, m.emitFromArr([1, 2, 3, 4, 5, 12, 15]) )
    );
    
    x.go; // run the program

Try it out:

<form id="ex01">
  <textarea id="lst01" rows="4"></textarea><br>
  <input id="btn01" type="button" value="Press Me"
    onClick='
    m.propSet("value",
      m.elemById("lst01"),
      m.map(
        m.add(2, m.emitFromArr([1, 2, 3, 4, 5, 12, 15]) )
      )
    ).go
    '
  />
</form>

Instead of **pushing** values into a call-back function, we **pull** the result of the *add* algorithm. The difference is subtle but gives programmers more flexibility with their programs while providing a consistent looking programming syntax.

## Basic Example Of Maps and Emitters

Maybe we just want to **pull** directly from the emitter:

    m.map(
      m.emitFromArr([1, 2, 3, 4, 5])
    );

Try it out:

<form id="ex02">
  <textarea id="lst02" rows="4"></textarea><br>
  <input id="btn02" type="button" value="Press Me"
    onClick='
    m.propSet("value",
      m.elemById("lst02"),
      m.map(
        m.emitFromArr([1, 2, 3, 4, 5])
      )
    ).go
    '
  />
</form>

Write each element as an equation (we are invoking multiply as a string) to the console as they are being mapped (open the console to see the results):

    m.map(
      m.writeLn(
        m.mul(3, m.emitFromRange(1, 3, 1))
      ), 5
    );

Try it out:

<form id="ex03">
  <textarea id="lst03" rows="4"></textarea><br>
  <input id="btn03" type="button" value="Press Me"
    onClick='
    m.propSet("value",
      m.elemById("lst03"),
      m.map(
        m.writeLn(
          m.mul(3, m.emitFromRange(1, 3, .5))
        ), 5
      )
    ).go
    '
  />
</form>

We can even map a literal:

    m.map(4,25);

Try it out:

<form id="ex04">
  <textarea id="lst04" rows="4"></textarea><br>
  <input id="btn04" type="button" value="Press Me"
    onClick='
    m.propSet("value",
      m.elemById("lst04"),
      m.map(4,25)
    ).go
    '
  />
</form>

There is added flexibility for the programmer because we can map more than just a call-back function.

### Implementation

The map mechanism itself is simple and the [implementation](https://github.com/mechanismsjs/mech-math/blob/master/src/map.js) is partially provided here:

    MapF.prototype = Object.create(Object.prototype, {
      go: { get: function() {
        if ( null === this._cache) {
           var algo = this._a;
           var isMechanism = algo.isMech;
           this._cache = [];
           var cur = isMechanism ? algo.go : algo;
           var i = 0;
           while ((undefined !== cur) && ( i < this._fixed)) {
              this._cache[i++] = cur;
              cur = isMechanism ? algo.go : algo;
           }
        }
        return this._cache;
      }}
    });

We simply **pull** a result from the algorithm located in *this._a*, invoking the program by accessing go, and insert it into an array.

## More Examples of Mapping with Emitter Mechanisms

An [emitter][mech-emit-link] provides the next item from... something. We have created two emitter mechanisms so far:

* **emitFromArr** - An emitter that pulls items from an array.
* **emitFromRange** - An emitter that pulls items from a dynamically generated range of numbers.

We can do some cool things with these.

How about:

    m.emitFromRange(0, Infinity, 23); // an unlimited range
    m.emitFromRange(-20, 20, .5); // a simple range
    m.emitFromRange(1, Infinity, 2); // emit odd numbers
    m.emitFromRange(0, Infinity, 2); // emit even numbers

How about a range that repeats:

    m.emitFromRange(1,3,1,true); // an unlimited range [1,2,3,1,2,3...]

Let's add two emitters (the above example):

    m.add(
      m.emitFromRange(0, Infinity, 2),
      m.emitFromRange(1, Infinity, 2)
    );

or subtract two emitters:

    var x = m.sub(
      m.emitFromRange(0, Infinity, 2),
      m.emitFromRange(1, Infinity, 2)
    );
    
    x.go;
    
    // kinda boring: try it in the console.

## Maps of Unlimited Length?

Emitters are mechanisms that do mapping without placing the results in an array. This added flexibility means we can place emitters anywhere within our program without first mapping them. This effectively allows us to have maps of unlimited length.

## How Flexible Are Mechanisms?

The programs we build out of mechanisms can be used in any property of another mechanism.

Check this out:

    m.propSet("value",
      m.elemById("lst06B"),
      m.emitFromRange( 1, Infinity,
        m.propSet("value",
          m.elemById("lst06A"),
          m.emitFromArr([1,-8,3,12], true)
        )
      )
    );

Try it out:

<script>
var weirdEmitter =
  m.propSet("value",
    m.elemById("lst06B"),
    m.emitFromRange( 1, Infinity,
      m.propSet("value",
        m.elemById("lst06A"),
        m.emitFromArr([1,-8,3,12], true)
      )
    )
  );
</script>

<form id="ex06">
  <input id="lst06A"/>&nbsp;value of 'by'<br>
  <input id="lst06B"/>&nbsp;value of emitter<br>
  <input id="btn06" type="button" value="Press Me A Lot Of Times"
    onClick='weirdEmitter.go;'
  />
</form>

Each time you press the button, the next value is pulled from the 'by' property. The *increment-by* for the emitFromRange emitter changes on each emission because *increment-by* is itself an emitter encapsulated in small program to write that emitted value to an input field.

We are effectively able to 'observe' what is going on by 'injecting' that small program between the emitFromRange emitter and the emitFromArr emitter.

Mechanisms are really flexible and we think programmers are really going to value this flexibility.

## Conclusion

We've shown a few interesting characteristics of mechanisms. One characteristic is that mechansism give programmers **a lot** of flexibility in what they can do at **any point** in their program. In our examples, we see that we are able to use only mechanisms to provide a highly flexible way to describe mapping. 

Another characteristic is that we are able to provide a consistent programming syntax for describing how to do something. In our examples, we are able to see that the syntax is consistent because we don't need to describe call-back functions, variables and scope (the {} around the function) within our syntax.

And as always, a characteristics of mechanisms is that they are **framework agnostic**. You can use any of these mechanism libraries independently of each other in any other framework: [emitters][mech-emit-npm-link], [guids][mech-guid-npm-link], [web][mech-web-npm-link], [math][mech-math-npm-link] and [core][mech-core-npm-link].

If you find mechanisms interesting, please follow [@erichosick](http://www.twitter.com/erichosick).

