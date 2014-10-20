---
layout: post
title: "Generating Sequences Using Emitters"
description: "Emitters are neat little mechanisms that allow you to generate sequences."
category: Design
tags: [Javascript, sequences, emitters, emit]
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

In this post, we will show how we can generate different [sequences](https://en.wikipedia.org/wiki/Sequence) by using [emitters][mech-emit-link].

> Hay! Emitters are framework agnostic. You can use them in your Javascript programs by 'npm installing' [emitters](https://www.npmjs.org/package/mech-emit).

Let's define a sequence that is the addition of two emitters limited to the number of elements **you** enter (as long as it is less than 100,001):

    m.map(
      m.add (
        m.emitFromRange(2, Infinity, 2), // positive integers
        m.emitFromRange(1, Infinity, 2)  // negative integers
      ),
      m.min(
        m.propGet("value", m.elemById("inp05")),
        100000
      )
    );
    
    // Quick Documentation:
    // m.map(algorithm, max) - Invokes an algorithm up to max number of times aggregating the results.
    // m.add(left, right) - add left to right.
    // m.min(arg1, arg2 ... argN) - find min of arg1, arg2 ... argN.
    // m.emitFromRange(min,max,by) - On each invocation, emit an element starting at min upto max intcremented-by by.
    // m.propGet(prop,item) - return the value located in item.prop.
    // m.elemById(id) - return the dom element with id.

Try it out:

<form id="ex05">
  <textarea id="lst05" rows="4"></textarea><br>
  <input id = "inp05" value="30"/>&nbsp;enter maximum elements in the sequence<br>
  <input id="btn05" type="button" value="Press Me"
    onClick='
    m.propSet("value",
      m.elemById("lst05"),
      m.map(
        m.add (
          m.emitFromRange(2, Infinity, 2),
          m.emitFromRange(1, Infinity, 2)
        ),
        m.min(m.propGet("value", m.elemById("inp05")),100000)
      )
    ).go
    '
  />
</form>

Go to the console (in chrome: View->Developer->Javascript Console) and checkout the library 'm': just type m return to see what is available).

## Programming Emitters

Let's start with simple emitters and build up to more complex ones.

#### Basic Emitter

Let's build a basic emitter:

    var emiter = m.emitFromRange(2, Infinity, 2); // even positive numbers

Try it out:

<script>
  var emiter01 = m.emitFromRange(2, Infinity, 2);
</script>

<form id="ex10">
  <input id="lst10"/>&nbsp;
  <input id="btn10" type="button" value="Press Me Alot" onClick='m.propSet("value", m.elemById("lst10"), emiter01).go' />
</form>

Every time you press the button, we call *emiter.go* like so:

    emiter.go;

#### Basic Emitter 2

What does this one do?

    var emiter = m.emitFromRange(1, Infinity, 2);


<script>
  var emiter02 = m.emitFromRange(1, Infinity, 2);
</script>

<form id="ex11">
  <input id="lst11"/>&nbsp;
  <input id="btn11" type="button" value="Press Me Alot" onClick='m.propSet("value", m.elemById("lst11"), emiter02).go' />
</form>

#### Looping To Create a Sequence

Instead of pressing the button a lot of times, let's use a map to call our emitter some number of times on our behalf.

    m.map(m.emitFromRange(10, Infinity, 10),100).go;

<form id="ex12">
  <textarea id="lst12" rows="8"></textarea><br>
  <input id="btn12" type="button" value="Press Me One Time" onClick='m.propSet("value", m.elemById("lst12"), m.map(m.emitFromRange(10, Infinity, 10),100)).go;' />
</form>

Since this is an infinite range, we tell our map to only call the emitter 100 times.

#### Looping To Create a Sequence 2

If we are creating a sequence from a finite range, we can ignore the maximum number of elements in our map:

    m.map(m.emitFromRange(60, 2, -2)).go;

<form id="ex13">
  <textarea id="lst13" rows="4"></textarea><br>
  <input id="btn13" type="button" value="Press Me One Time" onClick='m.propSet("value", m.elemById("lst13"), m.map(m.emitFromRange(60, 2, -2))).go;' />
</form>

#### Creating Sequences With Algorithms

We can do more than just emit from a range of values. We can plug emitters into algorithms. Let's shift a range by 2 using addition:

    var emitAdd2 = m.map(
      m.add(2, m.emitFromArr([1, 2, 3, 4, 5, 12, 15]) )
    );

Try it out:

<form id="ex01">
  <textarea id="lst01" rows="4"></textarea><br>
  <input id="btn01" type="button" value="Press Me One Time"
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

We are also using an *emitFromArr* emitter which pulls values from an array.

#### Sequences Of Strings

Let's write each element as an equation (we are invoking multiply as a string) to the console as they are being sequenced (open the console to see the results):

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

## Emitters Described

An [emitter][mech-emit-link] provides the next item from... something. We have created two emitters so far:

* **emitFromArr** - An emitter that pulls items from an array.
* **emitFromRange** - An emitter that pulls items from a dynamically generated range of numbers.

We can do some cool things with these.

How about:

    m.emitFromRange(0, Infinity, 23); // an unlimited range
    m.emitFromRange(-20, 20, .5); // a simple range
    m.emitFromRange(1, Infinity, 2); // emit odd numbers
    m.emitFromRange(0, Infinity, 2); // emit even numbers

How about a range that repeats:

    m.map(
      m.emitFromRange(1,3,1,true), // infinite sequence
      30
    ).go;

Try it out:

<form id="ex14">
  <textarea id="lst14" rows="4"></textarea><br>
  <input id="btn14" type="button" value="Press Me One Time"
    onClick='
    m.propSet("value",
      m.elemById("lst14"),
      m.map(
        m.emitFromRange(1,3,1,true),
        30
      )
    ).go
    '
  />
</form>

#### Add Two Sequences

Now things are going to get interesting. In our prior algorithm example, we add 2 to an emitter. However, we can actually add two emitters:

Let's add two emitters (the above example):

    m.map(
      m.add(
        m.emitFromRange(0, Infinity, 2),
        m.emitFromRange(1, Infinity, 2)
      ),100
    ).go;


<form id="ex15">
  <textarea id="lst15" rows="4"></textarea><br>
  <input id="btn15" type="button" value="Press Me One Time"
    onClick='
    m.propSet("value",
      m.elemById("lst15"),
      m.map(
        m.add(
          m.emitFromRange(0, Infinity, 2),
          m.emitFromRange(1, Infinity, 2)
        ),100
      )
    ).go
    '
  />
</form>

#### Subtract Two Sequences

We could also subtract two sequences being emitted:

    var sequenceBoring = m.map( 
      m.sub(
        m.emitFromRange(0, Infinity, 2),
        m.emitFromRange(1, Infinity, 2)
      ),120
    ).go;
    
<form id="ex16">
  <textarea id="lst16" rows="4"></textarea><br>
  <input id="btn16" type="button" value="Press Me One Time"
    onClick='
    m.propSet("value",
      m.elemById("lst16"),
      m.map(
        m.sub(
          m.emitFromRange(0, Infinity, 2),
          m.emitFromRange(1, Infinity, 2)
        )
      ),120
    ).go
    '
  />
</form>

#### How Flexible Are Emitters?

Emitters are so flexible that we can use an emitter as the increment-by value for our *emitFromRange* emitter.:

    var seuenceBoring = m.map( 
        m.emitFromRange(1, Infinity, 
          m.emitFromArr([1,-8,3,12], true)
        )
      ),500
    ).go;
    
<form id="ex17">
  <textarea id="lst17" rows="4"></textarea><br>
  <input id="btn17" type="button" value="Press Me One Time"
    onClick='
    m.propSet("value",
      m.elemById("lst17"),
      m.map(
        m.emitFromRange(1, Infinity, 
          m.emitFromArr([1,-8,3,12], true)
        )
      ),500
    ).go
    '
  />
</form>

That is one strange sequence we are emitting.

#### How Flexible Are Emitters 2

In this example, we can see how emitters can work with UI elements so we can see what is going on as each element is generated.

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

### Different Examples (You can try in the console)

#### Alternate +/-

    var alternate = m.mul(
      m.emitFromRange(0, Infinity, 1),
      m.emitFromArr([1, -1], true)
    );

    // [0, -1, 2, -3, 4, ...]
    // remember to call alternate.go; in the
    // javascript console to use alternate.

#### Powers

    var power2 = m.pow(
      2,
      m.emitFromRange(1, Infinity, 1)
    );

    // [1, 2, 4, 8, 16, ...]

BUT

    var power2 = m.pow(
      m.emitFromRange(1, Infinity, 1),
      2
    );

    // [1, 4, 9, 16, 25, ...]



## Conclusion

We've shown a few interesting ways we can generate sequences using emitters. There is always a need for more emitters (a [Fibonacci sequence](https://en.wikipedia.org/wiki/Fibonacci_number) emitter would be awesome for someone to add).

And remember, the [emitter][mech-emit-npm-link] is **framework agnostic**.

If you find emitters interesting, please follow [@erichosick](http://www.twitter.com/erichosick).

