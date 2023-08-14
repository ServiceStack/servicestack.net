---
title: Using the JSON Lines Format in ServiceStack
summary: A cost-effective and straightforward web app deployment pattern using GitHub and a single Linux server
tags: serialization, jsonl, json-lines, streaming, servicestack
image: https://images.unsplash.com/photo-1518336751805-17d4ea1ba5a0?crop=entropy&fit=crop&h=1000&w=2000
author: Darren Reid
draft: true
---

ServiceStack already supports a range of serializers out of the box like CSV,JSON,JSV and XML, but today we will explore the new support for the JSON Lines (JSONL) format. JSON Lines is an efficient JSON data format that is parseable by streaming parsers and text processing tools. It is a popular data format for maintaining large datasets, such as the AI datasets maintained on [Huggingface](https://huggingface.co).

## Introducing the JSON Lines Format


<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="m0tAfjvJaZg" style="background-image: url('https://img.youtube.com/vi/m0tAfjvJaZg/maxresdefault.jpg')"></lite-youtube>
</div>

Before we dive into the details of using the new feature, let's take a moment to understand what JSON Lines is and why it is beneficial. JSON Lines is similar to the CSV format in the way it behaves, where each line in the file represents a separate JSON object. This makes it easy to process large datasets incrementally, without having to load the entire file into memory.

The JSON Lines format has become popular because of its streamable properties. It can be processed by streaming parsers and integrated with Unix shell pipelines, making it an ideal format for handling large datasets efficiently.

## Setting up an Endpoint to Support JSONL in ServiceStack

To enable the JSON Lines (JSONL) format for your ServiceStack endpoint, there are several ways to configure your Request DTO and Response DTO. JSONL behaves similarly to the CSV format, where the first `IEnumerable` property is automatically serialized in the streamable JSONL format. In this section, we will explore different ways to configure your DTOs for JSONL serialization.

### Automatic JSONL Serialization with AutoQuery

If you're using AutoQuery services in ServiceStack, JSONL serialization is already supported by default. The first `IEnumerable` property in your Request DTO will be automatically serialized in the JSONL format. This means that all AutoQuery APIs will return their `IEnumerable` datasets in the streamable JSONL format without any additional configuration.

### Configuring the Request DTO and Response DTO

To configure your own Request DTO and Response DTO for JSONL serialization, you can use either the `[DataContract]` and `[DataMember]` annotations or the `[Csv(CsvBehavior.FirstEnumerable)]` attribute.

### Using the `[DataContract]` and `[DataMember]` Annotations

By applying the `[DataContract]` annotation to your Response DTO and the `[DataMember]` annotation to the `IEnumerable` property, you can specify that the first `IEnumerable` property should be serialized in the JSONL format. Here's an example:

```csharp
[Route("/albums")]
public class QueryAlbums : IReturn<QueryAlbumsResponse>
{
}

[DataContract]
public class QueryAlbumsResponse
{
    [DataMember]
    public List<Album> Albums { get; set; }
}
```

In this example, the `QueryAlbumsResponse` class is annotated with `[DataContract]`, and the `Albums` property is annotated with `[DataMember]`. This signifies that the `Albums` property should be serialized in the JSONL format when returned as a response.

### Using the `[Csv(CsvBehavior.FirstEnumerable)]` Attribute

Alternatively, you can use the `[Csv(CsvBehavior.FirstEnumerable)]` attribute on your Response DTO to indicate that the first `IEnumerable` property should be serialized in the JSONL format. Here's an example:

```csharp
[Route("/users")]
public class SearchUsers : IReturn<SearchUsersResponse>
{
    public string Name { get; set; }
}

[Csv(CsvBehavior.FirstEnumerable)]
public class SearchUsersResponse
{
    public List<User> Users { get; set; }
}
```

## Async Streaming Parsing Example

To process each row of a JSON Lines file one at a time and avoid large allocations, ServiceStack provides convenient extension methods in the [HTTP Utils](/http-utils) package. These methods allow you to implement async streaming parsing effortlessly.

Let's take a look at an example that demonstrates how to use async streaming parsing to process each row of a JSON Lines file:

```csharp
const string BaseUrl = "https://api.example.com";
var url = BaseUrl.CombineWith("data.jsonl");
await using var stream = await url.GetStreamFromUrlAsync();
await foreach (var line in stream.ReadLinesAsync())
{
    var row = line.FromJson<DataType>();
    // Process each row as needed
}
```

In this example, we start by obtaining a stream from the URL of the JSON Lines file using the `url.GetStreamFromUrlAsync()` method provided by the ServiceStack HTTP Utils package. Then, we iterate over each line of the stream using the `stream.ReadLinesAsync()` method. Finally, we deserialize each line into the desired data type and process it accordingly.

Using async streaming parsing ensures that you can process large JSON Lines files efficiently, without consuming excessive memory.

## Using the JsonlSerializer

If streaming the results is not necessary, ServiceStack also provides the `JsonlSerializer` class to directly serialize and deserialize JSON Lines data. The `JsonlSerializer` can be used in scenarios where you want to work with the JSON Lines format as a whole, rather than streaming it line by line.

Here's an example of how to use the `JsonlSerializer` to deserialize a JSON Lines string into a list of objects:

```csharp
var jsonl = await url.GetStringFromUrlAsync();
var objects = JsonlSerializer.DeserializeFromString<List<DataType>>(jsonl);
```

In this example, we start by fetching the JSON Lines data as a string using the `url.GetStringFromUrlAsync()` method. Then, we use the `JsonlSerializer` to deserialize the string into a list of objects of the desired data type.

The `JsonlSerializer` can also be used to serialize objects to the JSON Lines format:

```csharp
var jsonl = JsonlSerializer.SerializeToString(objects);
JsonlSerializer.SerializeToStream(objects, stream);
JsonlSerializer.SerializeToWriter(objects, textWriter);
```

## Indexing AI-Generated Art Albums with JSONL

In this part, we will walk you through a practical demonstration of using JSON Lines to index AI-generated art albums. We will fetch data from the Blazor Diffusion API, which provides "Creatives" generated based on user-provided text prompts. Our goal is to index the text and image URLs of these Creatives into a Typesense search server.

Here is the code snippet with a practical implementation of interacting with `creatives.jsonl` endpoint:

```csharp
const string ApiUrl = "https://localhost:5001/creatives.jsonl";

var provider = TypesenseUtils.InitProvider();
var typesenseClient = provider.GetRequiredService<ITypesenseClient>();
await typesenseClient.InitCollection();
var sw = new Stopwatch();
sw.Start();

var lastIndexedCreative = 0;

while (true)
{
    await using var stream = await $"{ApiUrl}?IdGreaterThan={lastIndexedCreative}&OrderBy=Id".GetStreamFromUrlAsync();
    await foreach (var line in stream.ReadLinesAsync())
    {
        var creative = line.FromJson<Creative>();
        lastIndexedCreative = creative.Id;
        // processing
        if (creative.Artifacts.Count == 0)
            return;
        var imageId = creative.PrimaryArtifactId ?? creative.CuratedArtifactId ?? creative.Artifacts.First().Id;
        var artifact = creative.Artifacts.First(x => x.Id == imageId);
        var indexedCreative = new IndexedCreative
        {
            Text = creative.Prompt,
            Url = $"https://cdn.diffusion.works{artifact.FilePath}"
        };
        // Process and index the creative data
        await typesenseClient.CreateDocument("Creatives", indexedCreative);
    } 
    
    // sleep if no new data ..
}
```

Here we have the service client initialization with the `TypesenseUtils.InitProvider()`. Then, inside an infinite loop, we fetch data using `GetStreamFromUrlAsync()` and stream it line by line using the `ReadLinesAsync()` method. After processing each line, we index the creative item into typesense.

## Indexing Creative Data into Typesense

With Typesense, implementation of full-text search for our data can be achieved efficiently. Once we have fetched the Creative data from Blazor Diffusion's API, we can proceed to index it into Typesense for easy searching and analysis of the indexed documents. To index the Creative data, we're using [a C# client library built by the community](https://github.com/DAXGRID/typesense-dotnet).

Processed data are saved into IndexedCreative instances and are added into the Typesense server. Under the hood, the C# client library interacts with Typesense's API and handles all HTTP requests and responses for us.

### Memory Foot Print

Our application logs the memory usage over time, and we see it’s constant relative to the size of our process. Streamed JSONL parsing and async indexing allows us processing infinite datasets size without hitting the memory bounds.

## Skipping Already Indexed Data

For increased efficiency, instead of re-indexing all the data each time our program runs, we will only fetch and index data that hasn't been indexed already. We use `lastIndexedCreative` integer variable to keep track of the last creative indexed. On subsequent runs of our program, we fetch only new data by modifying the API URL to fetch Creative objects starting from the ID greater than `lastIndexedCreative`.

This is done by appending the `IdGreaterThan` query parameter to our AutoQuery endpoint.

```csharp
await using var stream = await $"{ApiUrl}?IdGreaterThan={lastIndexedCreative}&OrderBy=Id".GetStreamFromUrlAsync();
```

## Visualizing Indexed Documents with Typesense Dashboard

Another great community feature is the [Typesense dashboard project](https://github.com/bfritscher/typesense-dashboard), providing a user-friendly interface to manage and browse collections in a Typesense search server. The dashboard, which can be accessed via the browser or as a downloadable desktop app, provides real-time statistics and overview over the indexed collections.

The indexed creative data can now be explored and analyzed using the dashboard's intuitive interface. You can apply filters, perform searches, and manipulate the stored data through the user interface.

## Conclusion

The JSON lines format is a versatile and efficient standard for working with large datasets. Its streamable properties make it particularly useful for handling big data and its ease of use makes it an ideal choice for developers working in any language.

Streaming data directly to and from HTTP APIs — a major power of the JSON lines format — can dramatically improve the performance of data-intensive applications. Furthermore, ServiceStack's new JSON Lines support makes it very easy to serve and consume these streams.
