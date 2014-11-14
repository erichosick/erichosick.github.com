---
layout: post
title: "Javascript Map, Filter and Reduce Without Lambda's"
description: "Map, filter and reduce mechanisms implemented without lambdas in javascript."
category: Design
tags: [Javascript, map, reduce, filter, lambda]
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
[mech-scope-cell-link]: https://github.com/mechanismsjs/mech-scope-cell "Cell based scoping"

## Introduction

Checkout [jsfiddle](http://jsfiddle.net/erichosick/gmxcxcqk/), the [npm][mech-core-npm-link] and [github][mech-core-link].

In this post, we will show how to use map, filter and reduce without using callbacks or lambda expressions.

We'll follow the same format as this post on [python lambda operators](http://www.python-course.eu/lambda.php).

If you find mechanisms interesting, please follow me [@erichosick](http://www.twitter.com/erichosick).

## Map

### Basic Lambda

Python defines a lambda as follows:

    >>> f = lambda x, y : x + y
    >>> f(1,1)
    2

Examples in other languages can be found on [Stack Overflow - What is a Lambda Function](https://stackoverflow.com/questions/16501/what-is-a-lambda-function).

Using a mechanism for [add](https://github.com/mechanismsjs/mech-math#basic-ops-mechanism):


    var x = math.add(1,1);

and invoke that mechanism in different primitive data types.

    x.go; // 2
    x.goNum; // 2
    x.goStr; // (1 + 1)
    x.goArr; // [2]
    x.goBool; // true


2, (1 + 1), [2], and *true* are possible results of the mechanism.

### Convert Celsius to Fahrenheit

Using python, this lambda expressions will convert lists of celsius values to fahrenheit.

    >>> Celsius = [39.2, 36.5, 37.3, 37.8]
    >>> Fahrenheit = map(lambda x: (float(9)/5)*x + 32, Celsius)
    >>> print Fahrenheit
    [102.56, 97.700000000000003, 99.140000000000001, 100.03999999999999]

and from fahrenheit to celsius.

    >>> C = map(lambda x: (float(5)/9)*(x-32), Fahrenheit)
    >>> print C
    [39.200000000000003, 36.5, 37.300000000000004, 37.799999999999997]
    >>>

Mechanisms approach this using maps and emitters.

[Map](https://github.com/mechanismsjs/mech-core#map-mechanism) repeatedly invokes a mechanism and inserts the results into an array (see [map](https://github.com/mechanismsjs/mech-core#map-mechanism)) until there is nothing more to emit.

An emitter, each time it is invoked, returns the next value from a source (array, range, socket, etc.). The *x* value in the above python example is replaced with an emitter.

The emitter looks like this:

    var em = emit.emitFromArr([39.2, 36.5, 37.3, 37.8]);

and it's output is:

    em.go; // returns 39.2
    em.go; // returns 36.5
    em.go; // returns 37.3
    em.go; // returns 37.8
    em.go; // returns undefined indefinitely

The emitter is done when it starts to emit *undefined*.

Using the emitter with a map will return the array:

    var em = m.map(emit.emitFromArr([39.2, 36.5, 37.3, 37.8]));
    em.go; // returns [39.2, 36.5, 37.3, 37.8]

The equation for fahrenheit:

    var fahrenheit = math.add(32, math.mul(
      math.div(9, 5),
      emit.emitFromArr([39.2, 36.5, 37.3, 37.8], true)
    ));

    var mapFar = m.map(fahrenheit, 4);
    mapFar.go; // [102.56, 97.7, 99.14, 100.03999999999999]

The equation for celsius:

    var c = m.map(
      math.mul(
        math.div(5, 9),
        math.sub(fahrenheit, 32)
      ), 4
    );
    c.go; // [39.2, 36.5, 37.300000000000004, 37.8]

### Map Applied to Multiple Lists

Mapping can be done against multiple lists.

    >>> a = [1,2,3,4]
    >>> b = [17,12,11,10]
    >>> c = [-1,-4,5,9]
    >>> map(lambda x,y:x+y, a,b)
    [18, 14, 14, 14]
    >>> map(lambda x,y,z:x+y+z, a,b,c)
    [17, 10, 19, 23]
    >>> map(lambda x,y,z:x+y-z, a,b,c)
    [19, 18, 9, 5]

Using two emitters:

    m.map(math.add(
      emit.emitFromArr([1,2,3,4]),
      emit.emitFromArr([17,12,11,10])
    )).go; // [18, 14, 14, 14]

## Filter

Filtering runs through a source only returning the values which "pass the filter".

    >>> fib = [0,1,1,2,3,5,8,13,21,34,55]
    >>> result = filter(lambda x: x % 2, fib)
    >>> print result
    [1, 1, 3, 5, 13, 21, 55]
    >>> result = filter(lambda x: x % 2 == 0, fib)
    >>> print result
    [0, 2, 8, 34]
    >>>

The filter mechanism is similar to an [emitter][mech-emit-link] in that each invocation emits the next **filtered** value.

    var filter = m.filter(
      m.eqlNum(0,
        m.modulus(
          m.parentPropSet("fv", m.emitFromRange(1,2000,1)),
          2
        )
      )
    );


Invoking go on the filter causes the next **filtered** value to return:

    filter.go; // returns 2
    filter.go; // returns 4
    filter.go; // returns 6
    filter.go; // returns 8

### The Filter Explained

The filter is reading from an emitted range:

    m.emitFromRange(1,2000,1)

The emitted value is used twice: once in the modulus comparison and then once as the return value if it passes the filter. In the above example, the reference to the *emitFromRange* instance is only accessible within the *modulus* instance. *modulus* is returning the modulus of the emitted value, not the emitted value itself.

To get around this, the filter mechanism is designed to return whatever value is located in the filter.fv property whenever invocation of goBool on the internal mechanism returns true.

This example uses the *parentPropSet* scoping mechanism although [cell scoping][mech-scope-cell-link] could also be used.

    m.parentPropSet("fv", m.emitFromRange(1,2000,1,true))

So, in this case, the value emitted from the range is written to the fv property of the filter and the value is also passed back to the calling mechanism: *modulus*.

This gives us the ability to configure any type of filter we want and we can filter on any source: even ones that don't have a known length (like a socket stream).

## Reduce

Reducing using python can be done as follows:

    >>> reduce(lambda x,y: x+y, [47,11,42,13])
    113

and here is an example summing a range:

    >>> reduce(lambda x, y: x+y, range(1,101))
    5050

and here is how we find the largest value in a list:

    >>> f = lambda a,b: a if (a > b) else b
    >>> reduce(f, [47,11,42,102,13])
    102
    >>>

Given a dual-argument algorithm, the reduce mechanism invokes the algorithm until undefined is returned by that algorithm.

    var reduceAdd = m.reduce(
      m.add(
        null,
        m.emitFromArr([1, 5, 7])
      )
    );

    reduceAdd.go; // returns 13

*add* is a dual argument algorithm. The emitter is configured on the *right* (2nd argument) and *null* configured on the *left* (1st argument). *Reduce* places the first emitted value in the *right* argument: which is why *right* is null.

The *reduce* mechanism continues to reduce until undefined is emitted.

    var reduceAdd = m.reduce(
      m.add(
        null,
        m.emitFromArr([1, 5, 7, undefined, 22, 34, 56])
      )
    );

    reduceAdd.go; // returns 13
    reduceAdd.go; // returns 125
    reduceAdd.go; // returns 125

Invoking reduce again will cause reduce to continue reducing from it's prior state.

Consider a socket emitter that periodically returning numerical values.

    var avgSock = m.reduce(
      m.avg(
        null,
        m.emitFromSocket('http://source', 423)
      )
    );

Invoking *avgSock* will read from and reduce the data coming from the stream until no more data is **currently** available.

Invoking *avgSock* at a latter time would continue the averaging process (invoked in a callback on the socket for example).

Finding the largest value:

    var largest = m.reduce(
      m.gt(
        null,
        m.add(
          6,
          m.emitFromArr([47,11,42,102,13])
        )
      )
    );

    largest.go; // 108

In the above example, add is adding 6 to every emitted value before the reducer applies the reduction algorithm: hence why 108, instead of 102, is the largest value.

## Conclusion

If you find mechanisms interesting, please follow me [@erichosick](http://www.twitter.com/erichosick).
