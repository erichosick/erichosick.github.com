---
layout: post
title: "Why Software Engineering Is Being Taught Incorrectly In Schools"
description: "We need to spend more time teaching students how to see the world before they can program it."
category: Education
tags: [Lecturing, Learning, Software Engineering]
author: Eric Hosick
author_twitter: erichosick
---
{% include JB/setup %}

## Introduction

I've had a peek at academia (I lectured a few years at a university) and I've been involved in the software industry for quite some time (about 25 years). This has given me a chance to reflect on how Object-Oriented Methodologies (OOM) are taught -vs- current day best known practices in industry.

My feeling is that software engineering, in general, is being taught incorrectly.

## People Learn and Understand Through Physical Things

We start, as children, playing with physical things that are physically distinct and separate from other physical things. Give a toddler anything (a pen, a cookie, two blocks, etc.), and they will apply all behaviors they know (push, bite, lick, kick, gnaw) to that physical thing (the object). From this, they learn what behaviors an object accepts and the outcome of those behaviors: cookies taste better than pens. They also begin to understand that objects have different properties: blocks are heavier then pens.

Eventually, as they get older (and at what age I know not), they begin to start putting things into groups and generalizing: these are my fun toys and these are my boring toys. It is inherently (genetically) natural for people to generalize and group things: generalization and inheritance.

Further, it is inherently (genetically) natural for people to attribute behavior and attributes as **inseparable** aspects of physical things. Stop and think about this for a moment because that sentence is the core underlying foundation by which object-oriented methodologies are based.

Structured-programming, on the other hand, doesn’t naturally support the idea that functions (behavior) and variables/data (properties) are always intertwined. Instead, in structured-programming, functions (behavior) are fully separated from the properties that are required to define/support those functions [1] and the work (behavior/functions) they perform. The Struct construct supports the grouping of properties but it does not support the grouping of behavior (functions/methods): something that is natural in the real world.

So, this leads to a simple and obvious question [2] - How can something "unnatural" be easier to learn then something that is natural to people from birth?

Perhaps it is because we are learning methodologies and paradigms in the wrong order.

## Where I Lectured, Methodologies Were Taught in the Wrong Order

If we look at the history of teaching, we see object-oriented programming methodologies were “discovered” after structured programming and thus structured programming was part of the learning curriculum before object-oriented programming [3]. So, at one point in time, structured programming was one of the primary methods software developers learned before entering the business sector. With the introduction of object-oriented programming (and eventual acceptance) there was a natural need to educate those that were already developing using structured methods (including educators). There was also a need to make changes to programs within Universities to incorporate object-oriented methodologies into the curriculum. So, the approach to learning object-oriented programming was not OOM first and then structured. Instead, the learning process is: This is how we do it now in structured programming (learn this first) and this is how it is different in OOM.

The approach to learning object-oriented programming is effectively through built up knowledge based on structured programming methodologies. However, these two methodologies are drastically different [4]. Someone using structured programming methodologies will have problems “unlearning” best known practices of structured programming. Some of the best know practices of structured programming do not work well within object-oriented programming (and visa-versa). However, interestingly enough, object-oriented programming is “backwards” compatible with structured programming. Someone who knows object-oriented programming can easily see the differences and advantages of structured programming.

The learning of a new methodology to software engineering based on core knowledge of a different engineering methodology leads to a feelings of difficulty. This is due to the vast differences between the methodologies: specifically engineering differences in architecting software. So, to these students, object-oriented programming just doesn’t “feel right” and is “difficult to understand.” This idea has continued throughout the years through a self fulfilling prophecy where we teach a student structured programming and then later have to help them “unlearn” some of the important concepts of structured programming so they may grasp object-oriented programming.

I am not trying to argue that any one methodology is better at solving problems then another. There are many problem domains that are best solved using structured programming. I am arguing that object-oriented programming is fundamentally easier to understand.

From day one, students should be taught software engineering from the aspect of object-oriented methodologies. This, after all, is the most natural approach to modeling the world: the world is object centric.

So, if we teach object-oriented concepts first and students are still not getting it and if object-oriented concepts are so easy to understand then what are we doing wrong? Maybe, if this were the case, it is because we are teaching the concepts in the wrong order.

## Where I Lectured, Object-Oriented Concepts Were Introduced In The Wrong Order

The first thing toddlers learn is that behavior and properties are inseparable. If you break a cookie in half it can still be eaten but there isn’t as much cookie to eat (it weighs less).

So, why not teach students how to programming from day one with only this one object-oriented concept: encapsulation of behavior (methods) and attributes (properties) within a single construct called a class. Forget about abstraction, inheritance, polymorphism, interfaces, etc. These are all concepts used to improve on code re-use and have little to do with “object-oriented.” In fact, many of these concepts fall within the realm of structured programming (polymorphism is not a strictly object-oriented concept. Abstraction/Generalization is used in structured programming to help with code-reuse.).

From this step, it is easy to build up on concepts such as messaging (very important and also a fundamental aspect of OOM), scope, parameters, computer memory and allocation, re-entrance, etc. Once these concepts are mastered, students could then delve into the concepts of inheritance, polymorphism interfaces, etc. In this way, they can see these programming concepts as not intrinsic to the methodology itself but just simple helpers towards a final goal of code re-use.

However, instead of allowing a student to focus on the core aspect of object-oriented programming, we seem to trivialize it and dash forward with what are then confusing concepts.

So, what if this isn’t enough? What other factors could be making object-oriented programming “difficult to understand?” Maybe incorrect aspects of OO are still being taught in schools.

## Where I Lectured, They Were Knowingly Teaching Object-Oriented Methodologies Which are Incorrect

Object-oriented methodologies are a relatively young art. As such, there has been growing pains and mistakes made in the last few decades. The fact is mistakes have been made in the basic knowledge foundations of object-oriented methodologies which have been corrected. However, these mistakes are still prevalent in schools and the industry (Not enough focus on messaging for example).

Here is a common example used in schools which tries to teach students how, when and why to use inheritance and polymorphism: A dog barks and a cat meows. This common behavior can be abstracted into a base class called Animal with an abstract method PlaySound(). We then create two separate classes, one a Cat class and one a Dog class, and inherit from the base class Animal. We then override the PlaySound() abstract method and implement the specific way a cat or dog makes sounds. If we want a cat, we instantiate the cat and automatically have the ability to meow. When we create a dog, we automatically have the ability to bark.

The above paragraph doesn’t make much sense unless you’ve had a lot of experience developing using object-oriented methodologies. Heck, I have to think a lot just to understand the above paragraph every time I read it. This is probably because the entire example has been shown to be wrong: it isn’t an intuitive answer. The fact is, animals aren’t sounds and the process to make a sound isn’t distinct to animals (lots of things make sounds).

Here is the best-known practice:

Sounds are real and part of the world so lets make a Sound class which has an abstract method PlaySound(). We then inherit from that sound class and implement different sounds: bark, meow, moo, talk, etc. Common sense knows that an animal will make different sounds but they aren’t physically made of sounds (so it is something the animal can do, not what they are). We then develop an Animal class which has a Sound attribute (not a sound behavior). When we create an animal [5] in the program, we simply choose the correct sound they make and place it in the sound property. If you are making a dog, then you would use the Bark Sound Class [6]. If we are making a cat, we choose the Meow sound class. So, when the animal needs to make a sound it doesn’t make the sound. It asks the Sound class to make the sound.

Just to note: the above best-known practice example is known as the Strategy Pattern.

I believe that the process of learning object-oriented programming should incorporate best known practices as early on in the learning process as possible. Teach students how to do it right from day one when learning new knowledge that will be used as a foundation for further knowledge. Don’t try to build up a basic foundation of knowledge (such as inheritance and behavior) on proven incorrect solutions (Anti-patterns like the Animals, Dogs and Cats example) and later force a student to unlearn/relearn the foundation of knowledge using the correct solution [7].

As a side note: I find it funny that one of the artifacts of spaghetti code is the best known practice (anti-pattern) of not using global variables. Though, this is a great practice to follow, it is silly to bring it up (unless the developer knows how to do it in the first place). After all, if we no longer need global variables to program using object-oriented programming methods, then why teach it in the first place. Even worse, why teach it to blossoming programmers? Just don’t tell them that such a feature exists. This idea of teaching something we know is wrong to help a student “move forward” in their learning process and then later explaining it was wrong doesn’t make sense. I do believe in “learning from mistakes” but not teaching mistakes to learn. These are foundations of knowledge we are trying to build upon!

## Conclusion

Object-oriented methodologies are a natural way of modeling the real world. It is the way people naturally learn as children. Current lecture material for object-oriented programming is based on the idea that students are coming from a background with some knowledge in structured programming: this is no longer necessary. We can teach a "common sense" methodology like object-oriented programming first. This makes later teaching of structured programming easier.

Object-oriented programming methodologies should be taught from day one using up-to-date “proven” knowledge foundations. We shouldn’t teach anti-patterns (what not to do) until students have a firm grasp on how to do it right.

### Footnotes

[1] I fully agree in many cases this is acceptable. Like int Sum(int a, int b) { return a + b; }. There is no need to create a class to simply add two numbers. Further, I am talking about the variables/data passed as parameters as opposed to parameters and local variables within the scope of a function.

[2] Even more to the point: How can a methodology to simulate the real world be so lacking in one of the most fundamental aspects of the universe: the concept that behavior and attributes are inseparable aspects of the world we live in?

[3] This begs the question: Then why was it first? The reasons for this I believe are many and I look forward to writing about this in the future.

[4] For example, the way code-reuse is done in structured programming is fundamentally different from object-oriented programming. The architecture and propagation of data through that architecture is drastically different between object-oriented programming and structured programming. Encapsulation of both functionality and behavior is not as obvious coming out of structured programming because so many of the best known practices of structured programming attempt to implement this behavior in a conceptually different way.

[5] Note that we no longer need a class for every type of animal there is.

[6] If you want to get technical, sound is created by air flowing through a “voice box” which generates sound waves. So, in reality, we would picture the voice box as a sound generator and create different types of sound generators. Some could bark and some could meow.

[7] I do believe that at some point it is important to teach the mistakes of the past: but not while learning fundamentally new concepts.

