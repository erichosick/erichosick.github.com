---
layout: post
title: "A Programming Language Based on Composition of Mechanisms"
description: "A very simple mechanism-oriented programming language which uses composition of mechanisms exclusively."
category: Design
tags: [Language, Persistence, Scripting, Composition, mechanisms, policies]
author: Eric Hosick
author_twitter: erichosick
---

## Introduction

Interface Vision is a Gui based visual object language and framework. Programming is done by hooking up [mechanisms]({% post_url 2014-09-24-design-mechanisms-and-policies %}): either visually or by coding in C#.

The composition of mechanisms results in a policy (what is done) and looks very different from defining a mechanism (see [mechanisms]({% post_url 2014-09-24-design-mechanisms-and-policies %})).

The syntax in C# for defining policies looks funky so we've designed a language called SipCoffee.

We focus on the creation of policy through the composition of existing mechanisms. There is no language syntax to describe [mechanisms]({% post_url 2014-09-24-design-mechanisms-and-policies %}).

## Examples

### Hello World Policy

The Hello world policy in SipCoffee:

<div id='id-s1-1-top'>&nbsp;</div>
    Application {
      do WriteLine { text "Hello World" }
    }

    // with property ordering
    
    Application {
      WriteLine { "Hello World" }
    }

###### Policy-1.1: Hello World in SipCoffee. {#id-s1-1}

### Hello World Explained

[Policy-1.1](#id-s1-1-top) contains two mechanisms named Application and WriteLine (mechanisms written in C#). 

Application has the property do. The do property contains an instance of WriteLine.

WriteLine has a text property, which is the text to write, and has the value "Hello World".

We can also define our policy by assuming an order for properties. This does lead to readability problems so you may want to use it sparingly.

### Hello World 10 Times

A policy to write Hello World 10 times on separate lines.

<div id='id-s1-2-top'>&nbsp;</div>
    Application {
      do For { start 1 end 20 by 2 
        do WriteLine { text "Hello World" }
      }
    }

    // with property ordering
    
    Application {
      For { 1 20 2 
        WriteLine { "Hello World" }
      }
    }

###### Policy-1.2: Hello written 10 times in SipCoffee. {#id-s1-2}

### A ForEach

A policy to write the numbers 1, 2, 4, 8, 16 and 32 on separate lines.

<div id='id-s1-3-top'>&nbsp;</div>
    Application {
      do ForEach {
        item List [ 1 2 4 8 16 32 ]
        do WriteLine { text CurrentItem {} }
      }
    }

###### Policy-1.3: A for each in SipCoffee. {#id-s1-3}

### Another ForEach

A policy to write out the first name of users Jane, Smith and Joe: each on a new line.

<div id='id-s1-4-top'>&nbsp;</div>
    Application {
      do ForEach {
        item List [
          Hash [
            KeyPair { key "firstName" value "Jane"}
            KeyPair { key "lastName" value "First"}
          ]
          Hash [
            KeyPair { key "firstName" value "Smith"}
            KeyPair { key "lastName" value "Between"}
          ]
          Hash [
            KeyPair { key "firstName" value "Joe"}
            KeyPair { key "lastName" value "Last"}
          ]
        ]
        do WriteLine {
          text HashRead { hash CurrentItem{} key "firstName" }
        }
      }
    }

###### Policy-1.4: A for each in SipCoffee. {#id-s1-4}

### ForEach Using Sql

A policy to write out the first name of users with data coming from a database: each on a new line.

<div id='id-s1-4-top'>&nbsp;</div>
    Application {
      do ForEach {
        item SqlConnect {
          database "someDatabase"
          command SqlQuery {
            sql "SELECT firstName, lastName FROM users"
          }
        }
        do WriteLine {
          text HashRead { hash CurrentItem{} key "firstName" }
        }
      }
    }

###### Policy-1.4: A for each in SipCoffee. {#id-s1-4}

### ForEach Using Sql Explained

A ForEach mechanism contains an item property. The item property contains a SqlConnect mechanism configured with a database (named "someDatabase") and a command (a SqlQuery mechanism with sql "SELECT firstName, lastName FROM users").

The ForEach mechanism invokes the SqlConnect mechanism. The SqlConnect mechanism connects to the database and invokes the mechanism located in the command property. This causes SqlQuery to invoke which runs the sql and returns a list of records to SqlConnect. Each record is a hash table with a key/value pair for each field.

SqlConnect passes that list back up to the ForEach mechanism. The ForEach mechanism is now able to iterate through the list of records.

The ForEach mechanism, internally, stores the current item in the list. It then invokes the mechanism located in the do property. In this case, ForEach invokes the WriteLine mechanism.

We want to write out the first name of each user. This means we need to access that field within the current item (which happens to be a HashTable mechanism).

This means we use the HashRead mechanism in the text property of WriteLine. What hash table are we reading from? Well, the CurrentItem mechanism is able to retrieve the current item from the ForEach mechanism. This then becomes the hash table that the HashRead mechanism uses. The key is then used to locate an entry in the hash table: in this case "firstName".

HashRead passes up to WriteLine the result of reading from the hash table (in this case a string) and the WriteLine mechanism writes the final value of text to the console.

## The Syntax

Syntactically, the language is simple.

Mechanisms are upper/lower case and properties are lower case. A property contains a mechanism or composition of mechanisms.

We use {} to define the contents of a mechanism. We use [] to define special mechanisms which manage collections of data (Hash, List and Array are examples of just such a mechanism).

## Parsing Expression Grammar

A pseudo parsing expression grammar is as follows:
  
<div id='id-g1-1-top'>&nbsp;</div>
    a} PROPERTY <- property primitive+
    b} PROPERTY <- property MECHANISM+
    c} MECHANISM <- Mechanism { PROPERTY* } // Could also be () if people prefered that.
    d} MECHANISM <- Mechanism [ MECHANISM ]

###### Grammar-1.1: Parsing expression grammar for SipCoffee. {#id-g1-1}

### Primitives are Mechanisms

Primitives are things like string, numbers and dates (to name a few). Primitives are actually mechanisms.

Examples being:

* Strings - "Hello" (String mechanism)
* Floats - 34.56f (Float mechanism)
* Reals - 3.456 (Real mechanism)
* Integers - 34 (Int mechanism)
* Longs - 56l (Long mechanism)
* Dates - 1994-11-05T08:15:30-05:00 (Date mechanism - Considering only allowing UTC dates to be stored)

### Collections

A collection is defined by simply listing the item in the array separated by white space (we could also separate items using commas).

* array of strings - [ "Hello" "And" "GoodBye" ]
* array of integers - [ 1 2 5 6 12 656 ]
* array of floats - [ 23.0f 345.4f 63.346f ]
* array of Mechanisms - [ User { name "Jane" } User { name "Toan" } User { name "Frank" } ]

## Availability

SipCoffee works with mechanisms defined in C#. We've created an initial persister that is able to save a program configured in Interface Vision as SipCoffee. The persister will itself be written in SipCoffee. When we get to that point, we will blog about it.

In the mean time, please follow us [@interfaceVision](http://www.twitter.com/interfaceVision) and/or [@erichosick](http://www.twitter.com/erichosick).

## Other Possible Syntax

We could also use spacing to associate mechanisms with properties removing the need for {} or ()

    Application
      do ForEach
        item List [ 1 2 4 8 16 32 ]
        do WriteLine
          text CurrentItem

    // another example

    Application
      do ForEach
        item SqlConnect
          database "someDatabase"
          command SqlQuery
            sql "SELECT firstName, lastName FROM users"
        do WriteLine
          text HashRead
            hash CurrentItem
            key "firstName"


and with property ordering

    Application
      ForEach
        List [ 1 2 4 8 16 32 ]
        WriteLine
          CurrentItem

    // another example

    Application
      ForEach
        SqlConnect
          "someDatabase"
          SqlQuery
            "SELECT firstName, lastName FROM users"
        WriteLine
          HashRead
            CurrentItem
            "firstName"

Though readability is getting tricky and knowledge of each mechanism's property ordering is required.


Something that looks a lot like functional programming (it could even be functional programming)

    Application (
      ForEach (
        List ([ 1 2 4 8 16 32 ]),
        WriteLine (
          CurrentItem
        )
      )
    )
    
    // another example

    Application (
      ForEach (
        SqlConnect ( "someDatabase",
          SqlQuery ( "SELECT firstName, lastName FROM users" )
        ),
        WriteLine (
          HashRead ( CurrentItem, "firstName" )
        )
      )
    )


## Conclusion

That's it. A very simple language based on composition of mechanisms called policies. Policies are your program or application.

## Next Step

The [next step]({% post_url 2013-12-31-example-window-basic %}) was to get a program to display a native window using SipCoffee.

