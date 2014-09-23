---
layout: post
title: "A Simple Webserver That Could Some Day Challenge the Big Names"
description: "How to confiure "
category: Design
tags: [Interface Vision, CSS, resize, Compose-able, Web Server, nginx, mechanism-oriented Programming]
author: Eric Hosick
author_twitter: erichosick
---

## Introduction

One question we've been asked is how fast is the Vision framework? To answer that, we've created [mechanisms]({% post_url 2014-09-24-design-mechanisms-and-policies %}) that can be used to configure a web server from scratch. The results are shown below.

### The Results

We ran siege on a single 15" macbook pro (C# mono):

    sudo siege -b -c300 -r50 http://localhost:3050

with the following results:

    Transactions:             15000 hits
    Availability:             100.00 %
    Elapsed time:             9.55 secs
    Data transferred:         12.47 MB
    Response time:            0.13 secs
    Transaction rate:         1570.68 trans/sec
    Throughput:               1.31 MB/sec
    Concurrency:              199.18
    Successful transactions:  15000
    Failed transactions:      0
    Longest transaction:      4.39
    Shortest transaction:     0.00

the same siege test was ran by [Centmin Mod](http://centminmod.com/siegebenchmark_nginx_test1.html) with the following results:

    Transactions:             15000 hits
    Availability:             100.00 %
    Elapsed time:             20.20 secs
    Data transferred:         43.89 MB
    Response time:            0.27 secs
    Transaction rate:         742.57 trans/sec
    Throughput:               2.17 MB/sec
    Concurrency:              199.77
    Successful transactions:  15000
    Failed transactions:      0
    Longest transaction:      7.43
    Shortest transaction:     0.00

> We realize the comparison is **not** apples to apples but we wanted to have something we can start comparing to.

Let's look at the policy defined using [SipCoffee]({% post_url 2013-12-19-design-composition-based-language %}) that gave us these results.

## Quick Introduction to SipCoffee

SipCoffee is a programming language that creates policies defined by the composition of [mechanisms]({% post_url 2014-09-24-design-mechanisms-and-policies %}). A mechanism contains some specific behavior (an algorithm) and properties which contain one or more mechanisms.

A program is a policy that is created by composing mechanisms. This can also be viewed as creating a data structure which contains both data and behavior (behavior and data-structures are inseparable: see [homoiconicity](https://en.wikipedia.org/wiki/Homoiconicity)).

When a mechanism is activated, the behavior contained within the mechanism is executed. This may cause one or more properties, which contain mechanisms, to also active.

SipCoffee programs are called policies because we've completely separated mechanisms from policy. Any changes you make in a program are directly related to the policy.

In the policy below, you can twiddle with the Web Server at any level. You can change queue sizes, time out periods, the server port and uri, the number of parts in a part pool, and even the cache size of the socket reader.

You can't change the mechanisms themselves. If you want the File mechanism to act differently, you will need to go into the code that describes that mechanism and edit it there.

## A Web Server Policy From Scratch

The following policy is a very very simple, but complete, WebServer in only **50 lines** of SipCoffee.

    Scope ( scopeId -2
      ins (
        File ( named "Http200.Body.Html" fileUriStr "./Html/200.html" )
        ArrayByteBuilder ( named "Http200.Header"
          replace Byte ( byte 120 )
          part ArrayByte ( withArrayByte byte ( 72 84 84 80 47 49 46 49 32 50 48 48 32 79 75 13 10 68 97 116 101 58 32 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 120 13 10 83 101 114 118 101 114 58 32 86 105 115 105 111 110 13 10 67 111 110 116 101 110 116 45 84 121 112 101 58 32 116 101 120 116 47 104 116 109 108 59 32 99 104 97 114 115 101 116 61 85 84 70 45 56 13 10 67 111 110 110 101 99 116 105 111 110 58 32 107 101 101 112 45 97 108 105 118 101 13 10 67 111 110 116 101 110 116 45 76 101 110 103 116 104 58 32 120 120 120 120 120 120 120 120 120 120 120 120 13 10 13 10 ) )
          items ArrayList (
            ins (
              DateTimeNow ()
              WithLength ( part ScopeGet ( withName "Http200.Body.Html" scopeId -2 ) )
            ) ) ) )
      part SocketRouter ( named "restServ" 
        streamSource SocketListener ( backlogQueueSize 2000 
          ipEndPoint IPEndPoint ( port 3050 
            ipAddress DNSLookup ( hostEntryStr "localhost" )
          )
        )
        socketFactory PartPool ( initialSize 500
          item FactoryInstance (
            part PartPoolDecorator (
              part RunWorkerWithTimeOut ( waitTime 60000
                part Scope (
                  ins (
                    Socket ( named "socket" )
                    ArrayByteBuffered ( named "requestBody" sizeGrowBy 1024 sizeInitial 1024 )
                    ScopeGet ( named "respHead" scopeId -2 withName "Http200.Header" )
                    ScopeGet ( named "respBody" scopeId -2 withName "Http200.Body.Html" )
                    HttpHeader ( named "httpHeader" )
                  )
                  part Array ( run true
                    ins (
                      SocketReaderHeaderBody ( autoOpen true
                        streamSource ScopeGet ( withName "socket" )
                        data ArrayByteBuffered ( sizeGrowBy 1024 sizeInitial 1024 )
                        body ScopeGet ( withName "requestBody" )
                        headerEncoder ScopeGet ( withName "httpHeader" )
                        buffer ArrayByteBuffered ( sizeInitial 1024 sizeGrowBy 1024 )
                        terminator ArrayByte ( withArrayByte byte ( 13 10 13 10 ) )
                      )
                      SocketWrite ( autoOpen false 
                        streamSource ScopeGet ( withName "socket" )
                        data ScopeGet ( withName "respHead" )
                      )
                      SocketWrite ( autoOpen false 
                        streamSource ScopeGet ( withName "socket" )
                        data ScopeGet ( withName "respBody" )
                      )
                      NamedMechanismGet ( withName "close" 
                        part ScopeGet ( withName "socket" callBehavior false )
                      ) ) ) ) ) ) ) ) ) )

Example mechanisms are **Scope**, **File**, **ArrayByteBuilder**, **ArrayByte** and **Socket** (all implemented using C# classes). Example properties are *ins*, *named*, *sizeGrowBy* and *withName* (all implemented using C# computed properties).

Let's break the policy down into smaller parts we can easily explain.

### The SocketRouter Mechanism

The **SocketRouter** mechanism, when activated, listens to a data stream on a given port. Any new connections on that data stream are forwarded to another data stream for handling.

The **SocketRouter** has two properties:

* streamSource - The source of all data streams.
* socketFactory - The policy that handles reading from and writing to any incoming data streams.

The policy for the *streamSource* property is very simple. 

    streamSource SocketListener ( backlogQueueSize 2000 
      ipEndPoint IPEndPoint ( port 3050 
        ipAddress DNSLookup ( hostEntryStr "localhost" )
      )
    )

The *streamSource* property is a **SocketListener** mechanism with a *backlogQueueSize* property of a **2000** mechanism (Yep! 2000 is also a mechanism) and a configured *ipEndPoint* which is easy to figure out.

The *socketFactory* property is a bit more complicated. We could define a policy for our Web Server to handle one request at a time. However, that isn't very practical and scales worth shit. We need a way to allow mechanisms to run on multiple threads at the same time.

To do this, we can use factories and part pools.

### The FactoryInstance, PartPool and PartPoolDecorator Mechanisms

A **FactoryInstance** mechanism, when activated, will return a copy of the policy located in the *part* property.

* part - The policy we'll make a copy of.

Our policy is as follows:

    FactoryInstance (
      part PartPoolDecorator (
        ...
      )
    )

In the above policy, the **FactoryInstance** mechanism creates a copy of a **PartPoolDecorator** and all mechanisms configured in the **PartPoolDecorator** mechanism. This is one of the advantages of programming using data structures as opposed to parameterized functions. Want to create a copy of a program? Just duplicate it (Functions are great at manipulating data structures but don't make for very good data-structures in and of themselves).

We could implement our Web Server using only the **FactoryInstance** policy. Each time a request comes in, a copy of the policy to handle the request is made and ran in it's own thread (more on that below). However, why keep making copies of our policy for every request by a client? Allocating and freeing memory are expensive operations. We should be able to re-use our copied policys. This is where the **PartPool** and **PartPoolDecorator** mechanisms come into play.

The mechanisms **PartPool** and **PartPoolDecorator**, together, allow any policy to be re-used multiple times throughout the execution of a program.

The **PartPool** mechanism is simple:

* initialSize - The initial number of parts in the pool. If all the parts in the pool are in use, a new item is created and added to the part pool.
* item - The policy that is pooled by the **PartPool** mechanism. This is always configured with some kind of factory. The item's policy is activated initialSize number of times and the result pooled inside the **PartPool** mechanism.

The **PartPoolDecorator** mechanism, when activated, activates the mechanism contained in the *part* property. When the configured-mechanism in *part* finishes, the **PartPoolDecorator** mechanism automatically returns itself to it's part pool.

* part - The configured mechanism to activate. When the mechanism is finished, the **PartPoolDecorator** places itself back into the **PartPool**.

Using these two mechanisms in conjunction with a factory, we can take **any** policy and make it re-usable. This allows us to configure very scalable policys.

Our specific policy is as follows:

    PartPool ( initialSize 500
      item FactoryInstance (
        part PartPoolDecorator (
          part RunWorkerWithTimeOut (
            ... 
          ) ) ) )

The **PartPool** mechanism starts out with an initialSize property of **500**. When the PartPool is first activated, the **FactoryInstance** mechanism is activated 500 times (on as many threads as we can) and the results are placed in the **PartPool** mechanism. The **PartPool** pulls a single mechanism from it's pool and activates it.

In this case, the **PartPoolDecorator** is configured to contain a **RunWorkerWithTimeOut** mechanism. This means the **PartPoolDecorator** is actually activated in a new thread meaning the **PartPool** returns control, almost immediately, to it's parent mechanism: the **SocketRouter** mechanism. The **SocketRouter** mechanism is now ready to handle the next incoming request.

### The RunWorkerWithTimeOut Mechanism

Here are where things get even cooler. The **RunWorkerWithTimeOut** mechanism is able to run **any** policy in a thread. Yep. Multi-threaded programming in SipCoffee is just that simple.

* waitTime - The time in milliseconds before the worker thread times out.
* part - The policy to run within the worker thread.

### The Scope and ScopeGet Mechanisms

Take a quick look at the original policy. What you will notice is that there are no functions, parameters or variables. In mechanism-oriented programming, **everything is a mechanism**. Even the context/scope that a mechanism is activated in, usually defined with a language using { and } (Defining context in a language isn't very data-structure friendly), is a mechanism.

To support context, we have a **Scope** mechanism to define the context a policy runs in.

* part - The configured-mechanism to activate within the context.
* ins - One or more configured-mechanisms contained within the context of the scope. These can also be viewed as Variables.
* scopeId - When configured with a negative numeric mechanism, the scope is "global" in nature. When not configured, the scopeId is based on the managed thread id a policy is ran in (this is really powerful and explained below in detail)

In our policy we have the following **Scope** mechanism configured:

    part Scope (
      ins (
        Socket ( named "socket" )
        ArrayByteBuffered ( named "requestBody" sizeGrowBy 1024 sizeInitial 1024 )
        ScopeGet ( named "respHead" scopeId -2 withName "Http200.Header" )
        ScopeGet ( named "respBody" scopeId -2 withName "Http200.Body.Html" )
        HttpHeader ( named "httpHeader" )
      )
      part Array ( ... )
    )

The *part* property contains an **Array** mechanism (more on that later). The *ins* property contains 5 mechanisms, something like variables, each with a unique name within that Scope's context:

* A Socket mechanism named "socket" - The socket we use to read and write to the stream within the current thread.
* An ArrayByteBuffered mechanism named "requestBody" - The buffer where the body of the request from the client is placed.
* A ScopeGet mechanism named "respHead" - The header that will be sent to the client.
* Another ScopeGet mechanism named "respBody" - The mechanism body that will be sent to the client.
* An HttpHeader mechanism named "httpHeader" - The http header received from the client.

Here comes some programming power! A "variable" can be a single mechanism like **Socket** or it can be another configured mechanism! Yep! Just think of the power you have as a programmer. Variables are actually configured-mechanisms!

Notice that, for this **Scope** mechanism, the *scopeId* property is not defined. This means, the context of the Scope will be based on the current named thread. Yep! Even more **POWER**! We can run this policy in as many threads as we want and there is no chance of the "variables" being accessed from multiple threads. You no longer need to worry about re-entrance or things being thread safe within this **Scope** (this isn't the case when a **Scope** mechanism is configured to be global).

In mechanism-oriented programming, accessing a "Variable" is also done using mechanisms. SipCoffee has no equals (=) operator. To access a "Variable" within the current scope, you use the **ScopeGet** mechanism.

* withName - The name of the "Variable".
* named - The unique name of the ScopeGet mechanism (so we can access a ScopeGet mechanism from another ScopeGet mechanism if we like).
* scopeId - When configured with a negative numeric mechanism, the scope is "global" in nature. When not configured, the scopeId is based on the managed thread id a policy is ran in (this is really powerful and explained below in detail).

In this example:

    ScopeGet ( named "respHead" scopeId -2 withName "Http200.Body.Html" )
    
The **ScopeGet** mechanism locates and activates a mechanism *named* "respHead" in a *scopeId* of -2. This is configured as follows:

    Scope ( scopeId -2
      ins (
        File ( named "Http200.Body.Html" fileUriStr "./Html/200.html" )
      )
    )

Awesome! It looks like we have a "global variable" named 'Http200.Body.Html' that, when activated, reads from a file named './Html/200.html'. 

In this example:

    SocketReaderHeaderBody ( autoOpen true
      streamSource ScopeGet ( withName "socket" )
    )  

the *streamSource* property of the **SocketReaderHeaderBody** is a **ScopeGet** mechanism. That mechanism is configured to locate a mechanism named "socket" configured as follows:

    part Scope (
      ins (
        Socket ( named "socket" )
      )
    )

Even more Awesome! It looks like we have not configured the scopeId meaning that this Scope is based on the managed thread id. When the **SocketReaderHeaderBody** is activated within a managed thread, the Scope is also contained within that managed thread.


## Reading from and Writing to the Stream

To activate mechanisms in a given order, we can use an *Array* mechanism setting the *run* property to a **true** mechanism (Yep, even true is a mechanism).

    Array ( run true
      ins ( ... )
    )

Any mechanisms in the *ins* property of the *Array* mechanism are activated in the order they were inserted.

Let's look at how the policy works.

First, we activate a **SocketReaderHeaderBody** mechanism:

    SocketReaderHeaderBody ( autoOpen true
      streamSource ScopeGet ( withName "socket" )
      data ArrayByteBuffered ( sizeGrowBy 1024 sizeInitial 1024 )
      body ScopeGet ( withName "requestBody" )
      headerEncoder ScopeGet ( withName "httpHeader" )
      buffer ArrayByteBuffered ( sizeInitial 1024 sizeGrowBy 1024 )
      terminator ArrayByte ( withArrayByte byte ( 13 10 13 10 ) )
    )

* autoOpen true - Automatically open the stream source.
* streamSource ScopeGet ( withName "socket" ) - the source of the stream is located in a Scoped "Variable" named 'socket'
* data ArrayByteBuffered ( sizeGrowBy 1024 sizeInitial 1024 ) - The header data of the mechanism is an ArrayByteBuffered with an initial size of 1024 bytes and grows by 1024 bytes to place the header data in.
* body ScopeGet ( withName "requestBody" ) - The body buffer is located in a Scoped "Variable" named 'requestBody'
* headerEncoder ScopeGet ( withName "httpHeader" ) - The mechanism to encode and decode the header is located in a Scoped "Variable" named "httpHeader"
* buffer ArrayByteBuffered ( sizeInitial 1024 sizeGrowBy 1024 ) - The buffer used directly by the socket is an ArrayByteBuffered with an initial size of 1024 bytes and grows by 1024 bytes to place the header data in.
* terminator ArrayByte ( withArrayByte byte ( 13 10 13 10 ) ) - The terminator between a mechanism header and body is this ArraByte of 13 10 13 10 which happens to be the terminator between the header and body of html.

Second, we write to the socket the response header:

    SocketWrite ( autoOpen false 
      streamSource ScopeGet ( withName "socket" )
      data ScopeGet ( withName "respHead" )
    )

* autoOpen false - Don't auto open the data stream because we did that with the read above.
* streamSource ScopeGet ( withName "socket" ) - the source of the stream is located in a Scoped "Variable" named 'socket'. Yep. The same streamSource as above.
* data ScopeGet ( withName "respHead" ) - Oh man! Awesome. We are accessing a Variable named "respHead" which is a ScopeGet mechanism which accesses a "Variable" named "Http200.Header". Of course, in future policys, the response header to write could change.


Third, we write to the socket the response body:

    SocketWrite ( autoOpen false 
      streamSource ScopeGet ( withName "socket" )
      data ScopeGet ( withName "respBody" )
    )

* autoOpen false - Yep! Still don't auto open the data stream because we did that with the read above.
* streamSource ScopeGet ( withName "socket" ) - the source of the stream is located in a Scoped "Variable" named 'socket'. Yep. The same streamSource as above.
* data ScopeGet ( withName "respBody" ) - Oh man! Awesome. We are accessing a Variable named "respBody" which is a ScopeGet mechanism which accesses a "Variable" named "Http200.Body.Html". We are writing to our socket the information located in a file.

Finally, we close the socket:

    NamedMechanismGet ( withName "close" 
      part ScopeGet ( withName "socket" callBehavior false )
    )

The **NamedMechanismGet** mechanism causes a named mechanism to activate. In this case, the property *close* (implementation is a calculated property accessed using reflection) of that same socket is activated.

And, once all of that runs we "fall-up" the policy and the **PartPoolDecorator** mechanism returns us to the PartPool to be used again!

## Conclusion

Mechanism-oriented programming kicks ass. In 50 lines of code, we are able to create a scalable web server that is able to keep up with the big names. We haven't even started to optimize our underlying technology and it was written in C#. Imagine if it was implemented in something like [Rust](http://www.rust-lang.org/) (aww please add calculated properties rust people!).

We have a data-structure of mechanisms that is also the behavior of the program. That makes the policy very easily re-used in a multi-threaded environment. We aren't allocating memory all the time and we are able to activate policys without the overhead of locking and worrying about re-entrance. We get the speed of "single threaded" programming in a multi-threaded environment. Woo hoo!

If you find our work on mechanism-oriented programming interesting, please follow us [@interfaceVision](http://www.twitter.com/interfaceVision) and/or [@erichosick](http://www.twitter.com/erichosick).