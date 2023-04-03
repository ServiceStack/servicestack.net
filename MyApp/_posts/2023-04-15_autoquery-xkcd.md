---
layout: _LayoutContent
title: AutoQuery with XKCD
summary: Rapidly create web apps from datasets with AutoQuery
tags: autoquery, data, development, huggingface, vue.js
draft: true
image: ./img/posts/autoquery-xkcd/drawing-xkcd-upscaled.png
author: Darren Reid
---

# Dataset to Web App with AutoQuery and Vue.js

One of the big advantages of using AutoQuery is the ability to turn data into an API with very little effort.
Once your data is exposed as an API, you can use the same data to create a web app while reducing the amount of code you need to write.

In this post, we'll look at how to use AutoQuery to create a web app from a dataset of XKCD comics.
This dataset is from HuggingFace's [datasets](https://huggingface.co/datasets/olivierdehaene/xkcd) repository if you want to repeat
the process yourself, but any dataset in formats like CSV, JSON, etc or in an existing SQL database like SQLite will work with the same approach.

## What is the dataset?

The dataset is licensed under the Creative Commons Attribution-ShareAlike 3.0 license, and the code for this example is available on GitHub.

The dataset contains 2630 comics from the XKCD website, with the following fields:

- id
- title
- url: xkcd.com URL
- image_url
- explained_url: explainxkcd.com URL
- transcript: english text transcript of the comic
- explanation: english explanation of the comic

## AutoQuery Datasources

AutoQuery support different ways of accessing data to make it flexible for different use cases.
The most common way to access data is via a SQL database using `AutoQuery RDBMS`, but also supports using `AutoQuery Data` which can with in-memory data, another service or even AWS DynamoDb.

This this example, our data is in a JSONL file which separates row entries by a new line, so we could use AutoQuery Data to load the data into memory and expose it as an API.

First we will declare a class that represents a row of data from our file.

```csharp
public class XkcdComic
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string ImageTitle { get; set; }
    public string Url { get; set; }
    public string ImageUrl { get; set; }
    public string ExplainedUrl { get; set; }
    public string Transcript { get; set; }
    public string Explanation { get; set; }
}
```

And then load our data into memory from the JSONL file.

```csharp
var allLines = "path/to/your/dataset.jsonl"
    .ReadAllText().Split("\n");
using var jsonConfig = JsConfig.With(new Config
{
    TextCase = TextCase.SnakeCase
});
var comics = allLines
    .Where(x => !x.IsNullOrEmpty())
    .Select(JsonSerializer.DeserializeFromString<XkcdComic>)
    .ToList();
```

Now we can add our data as a AutoQueryData source when configuring our AppHost and the `AutoQueryDataFeature` Plugin.

```csharp
//AutoQuery Data Plugin
Plugins.Add(new AutoQueryDataFeature { MaxLimit = 100 }
    .AddDataSource(ctx => ctx.MemorySource(comics))
);
```

And lastly, to expose the data over an API, we declare a Request DTO that inherits from `QueryData<XKCDComic>`.

```csharp
[Route("/xkcd")]
public class QueryXkcdComicData : QueryData<XkcdComic> {}
```

## Using QueryDb

Alternatively to using AutoQuery Data, we can use AutoQuery RDBMS to access our data from a SQLite database.
This is useful if you have a large dataset that you want to query, but don't want to load all the data into memory.

First we will load the data into the SQLite database.

```csharp
var dbFactory = new OrmLiteConnectionFactory("App_Data/db.sqlite", SqliteDialect.Provider);
container.Register<IDbConnectionFactory>(dbFactory);
using var db = dbFactory.Open();
if(db.CreateTableIfNotExists<XkcdComic>())
    db.InsertAll(comics);
```

Now we can use QueryDb<T> instead of QueryData<T> to access the data from the database, and use the `AutoQueryFeature` Plugin instead of `AutoQueryDataFeature`.

```csharp
//AutoQuery Plugin for RDBMS
Plugins.Add(new AutoQueryFeature { MaxLimit = 100 });
// Use QueryDb<T> instead of QueryData<T>.
[Route("/xkcd")]
public class QueryXkcdComics : QueryDb<XkcdComic> {}
```

And that's it, we now have an API that we can use to query our XKCD comics data.

## Locode

One of the advantages of loading our data into SQLite is taking advantage of the built in Locode App that comes with the `ServiceStack.Server` library.
Restarting the application, we can now navigate to the Locode App at `http://localhost:5000/locode` and see our XKCD comics data.

![Locode App](/img/posts/autoquery-xkcd/locode-app.png)

Looking at the UI, we can see we get a table of data with filtering capabilities in a user friendly way.
Locode is driven off the web services that are exposed by the AutoQuery API, so we can also use the same data to create a web app.

We can look at the endpoint itself and the default AutoHtml page to see how to interact with the API in 10 different languages.

![AutoHtml page](/img/posts/autoquery-xkcd/autohtml-page.png)

## Creating a web app with Razor and Vue.js

If you want to create a fully custom web UI for your data, you can use the same API to create a web app.

We can do this from whatever language you prefer, but for this example, we'll use Razor and Vue.js via the [ServiceStack vue-mjs template](https://github.com/NetCoreTemplates/vue-mjs), and the [ServiceStack Vue library](https://docs.servicestack.net/vue) to create our web app.

You will need the ServiceStack dotnet `x` tool installed to create a new project from the template. 

```
dotnet tool install -g x
```

First we'll create a new project from the template.

```bash
x new vue-mjs XkcdApp
```

This template comes with **Vue 3**, **TailwindCSS**, **AutoQuery**, and **SQLite** already configured, so we can get started right away.
It also utilizes [**JavaScript modules**](./posts/javascript), so we can use the `import` syntax to import the ServiceStack Vue library without having to use a bundler like Webpack.
This gives us instant feedback when we make changes to our code, instead of having to wait for a build step to complete.

This template also have a way to [manage database migrations](https://docs.servicestack.net/ormlite/db-migrations#introduction), if you want a more formal way to manage your database schema.
Otherwise, we can just use the `CreateTableIfNotExists` method to create our table like we did in the previous example.

## Creating a page with Razor and Vue.js

Now we can create a page to display our XKCD comics data.
We can do this by creating a new Razor page in the `Pages` folder, and then add a `@page` directive to the top of the file to declare the route.

This will server render the page, and then hydrate the page with Vue.js.

```html
@page "/comics"
@{
  ViewData["Title"] = "Xkcd Comics";
}

<div class="bg-gray-100 py-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="xkcd-comics"></div>
    </div>
</div>
<script>comics = @await ApiResultsAsJsonAsync(new QueryXkcdComics())</script>
<script type="module">
    import { Comics } from "/Pages/Comics.mjs"
    import { mount } from "/mjs/app.mjs"
    mount("#xkcd-comics", Comics, { comics })
</script>
```

The above example uses the `ApiResultsAsJsonAsync` helper method to fetch the data from the API and pass it to the Vue component as a prop.
This reduces the need to make an API call from the client when it renders the page, since the data is rendered into a JavaScript variable on the page.

## Creating a Vue component

We still need to create the Vue component that will render the data.
Under the `wwwroot` directory, we can use the `Pages` folder to create a `Comics.mjs` file to create our Vue component.

```javascript
import { ref } from "vue"
import { useClient } from "@servicestack/vue"
import { QueryXkcdComics } from "../../mjs/dtos.mjs"

export default {
    template: `<DataGrid :items="comics"></DataGrid>`,
    props: { comics:Array },
    setup(props) {
        const comics = ref(props.comics || [])
    },
}
```



We import `vue`, as well as the ServiceStack Vue components library along with our application specific DTOs from the `mjs/dtos.mjs` file.
The `DataGrid` component is a built in component that will render the data in a table within minimal markup.
This can be a great way to get the instant usability of a table without having to write a lot of code, and it can be used anywhere in your application.

![DataGrid component](/img/posts/autoquery-xkcd/vue-datagrid.png)

Let's now customize the `DataGrid` so we can have a view of the comics.

```javascript
export default {
    template: `
<DataGrid :items="comics" 
          :selected-columns="imageUrl,transcript" 
          :header-titles="{ imageUrl:'Comic',transcript: 'Description' }"
          class="max-w-screen-lg mx-auto">
        <template #imageUrl="{ imageUrl, title }">
            <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
            <img :src="imageUrl" class="h-48" /> 
        </template>
        <template #transcript="{ transcript }">
            <p class="whitespace-normal break-words">{{ transcript }}</p>
        </template>
</DataGrid>`,
    props: { comics:Array },
    setup(props) {
        const comics = ref(props.comics || [])
    },
}
```

Above we've added a few more props to the `DataGrid` component to customize the columns we want to display using `selected-columns`, and the titles of the columns by setting `header-titles` to a map of the column names to the titles we want to display.
We are also using `templates` to customize the rendering of the `imageUrl` and `transcript` columns to have more control over the layout.

![Customized DataGrid component](/img/posts/autoquery-xkcd/vue-datagrid-custom.png)

This is rendering the max 1000 items from the AutoQuery API, but we can also use the `Take` parameter on the `QueryXkcdComics` DTO to limit the number of items we want to fetch.

```html
<script>comics = @await ApiResultsAsJsonAsync(new QueryXkcdComics { Take: 10 })</script>
```

## Calling the AutoQuery API from Vue

Now our page is being initialized with the data we want to display, but we can also fetch the data from the API dynamically using the `JsonServiceClient` from the ServiceStack Vue library.

Let's update our `Comics.mjs` component to fetch the data from the API if it's not already been passed in as a prop.
We can do this by using the `JsonServiceClient` with the Request DTO related to the API we want to call.

```javascript
import { QueryXkcdComics } from "../../mjs/dtos.mjs"
import {JsonServiceClient} from "../../lib/mjs/servicestack-client.min.mjs";
let client = new JsonServiceClient("https://localhost:5001/")

export default {
    template: `...`,
    props: { comics:Array },
    setup(props) {
        const comics = ref(props.comics || [])
        let selectedComic = ref()

        async function refreshComics() {
            let api = await client.api(new QueryXkcdComics({take: 10}))
            if (api.succeeded) {
                comics.value = api.response.results || []
            }
        }

        if(!comics.value.length)
            refreshComics()
        return {selectedComic, comics}
    },
}
```

In this case, we want to call the `QueryXkcdComics` API, so we can use the `QueryXkcdComics` DTO to create the request.

However, we don't yet have the `QueryXkcdComics` Request DTO available in our Vue component, or in the `mjs/dtos.mjs` file.
We can use the ServiceStack dotnet `x` tool to update our `mjs/dtos.mjs` file to include the `QueryXkcdComics` Request DTO.

With our application running, we can run the following command in the terminal to update our `mjs/dtos.mjs` file.

```bash
x mjs
```

This command pulls the generated DTOs from the ServiceStack server, and updates the `mjs/dtos.mjs` file with the latest DTOs.
And this workflow works for any of the ServiceStack client libraries and supported languages.

To add some interactivity to our page, we can add a button to refresh the data from the API, and return a random list of 10 comics.

```javascript
export default {
    template: `
    <!-- A button that is at the top right, using TailwindCSS -->
    <div class="flex justify-end">
        <button @click="randomComics" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
        Refresh Comics
    </button>
    </div>
    <DataGrid :items="comics"
    ... `,
    setup(props) {
        //...
        async function randomComics() {
            let randomIds = randomNumbers(1, 2629, 10);
            let api = await client.api(new QueryXkcdComics({take: 10, ids: randomIds}))
            if (api.succeeded) {
                comics.value = api.response.results || []
            }
        }
    
        if(!comics.value.length)
            refreshComics()
        return {selectedComic, comics, randomComics}
    },
}
```

![Random Comics](/img/posts/autoquery-xkcd/vue-datagrid-random.png)

## Conclusion

In this post we've seen how we can use the AutoQuery API to quickly create a REST API for our data, and then use the ServiceStack Vue library to quickly create a Vue application that can consume the API.
We've also seen how we can use the `x` tool to update our client DTOs to match the latest generated DTOs from the ServiceStack server.

This typed end-to-end workflow is a great way to quickly create a full-stack application, and the ServiceStack Vue library is a great way to quickly create a Vue application that can consume the AutoQuery API.

Let us know what you think of the ServiceStack Vue library, and if you have any feedback or suggestions for improvements.

- [ServiceStack/Discuss](https://github.com/ServiceStack/Discuss/discussions/)
- [#ServiceStack channel on Discord](https://discord.gg/w4ayGbuYpA)
- [Example Source Code](https://github.com/NetCoreApps/XkcdApp)

