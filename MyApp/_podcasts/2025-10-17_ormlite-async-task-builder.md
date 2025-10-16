---
title: OrmLite new Configuration Model and Defaults
summary: Learn about OrmLite's new fluent Configuration Model, new defaults & features
tags: [db,ormlite]
author: Demis Bellot
url: https://media.servicestack.com/podcasts/ormlite-async-task-builder.mp3
media: {size:10311918,duration:725.028571,format:mp3}
---

The episode introduces **OrmLite's new Async Tasks Builder**, a tool designed to simplify running multiple 
independent database requests in parallel within asynchronous applications.  

While asynchronous operations improve thread utilization, they do not inherently parallelize sequential database 
requests, which often leads to less optimal performance, then contrasts this complexity with languages like 
**TypeScript**, which more easily handles parallel database requests. 

**AsyncDbTasksBuilder** allows developers to effortlessly execute up to **eight async tasks concurrently** while 
returning positionally typed results similar to TypeScript's destructuring capabilities. 
It supports mixing and matching standard async `Task` and `Task<T>` APIs and how errors are handled where
exceptions are only thrown when the tasks are awaited.