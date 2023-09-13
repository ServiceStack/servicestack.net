---
title: Modelling TypeChat's CoffeeShop in .NET
summary: We look at Modelling TypeChat's CoffeeShop App  
tags: [autoquery, c#, dev, servicestack]
image: https://images.unsplash.com/photo-1501516069922-a9982bd6f3bd?crop=entropy&fit=crop&h=1000&w=2000
author: Demis Bellot
draft: true
---

## Building a TypeChat CoffeeShop .NET App 

Since the release of [Open AI's Chat GPT](https://chat.openai.com) we've been exploring its potential
in unlocking new AI powered capabilities in our Apps that were previously limited to Large companies
with dedicated AI development teams, now their capabilities is within everyone's reach with just 1 API call away - 
as-is the [nature of remote APIs](https://docs.servicestack.net/service-complexity-and-dto-roles#services).

<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="MjNqPAXLH5w" style="background-image: url('https://img.youtube.com/vi/MjNqPAXLH5w/maxresdefault.jpg')"></lite-youtube>
</div>

### Chain of thought Prompt engineering

Our initial approach of leveraging LLMs was to [create ChatGPT Agents to call APIs](/posts/chat-gpt-agents) 
by adopting the [Chain-of-Thought](https://arxiv.org/abs/2201.11903) technique popularized by 
[Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT) where along with the goal we also ask it for its
**plan**, **reasoning**, and **criticism** which influences its future decisions to help break down its tasks into 
smaller, more achievable steps.

We adopt this approach within a scoped context with just the APIs that we want Chat GPT to know about in order to
accomplish purpose specific tasks we assign it. We showcase the utility of this approach in 
[GPTMeetingAgent(github)](https://github.com/NetCoreApps/GPTMeetingAgent) in which we use the GPT Meeting Agent 
to use available APIs to search for Users and book Meetings:

<div class="not-prose my-16 px-4 sm:px-6">
    <div class="text-center">
        <h3 class="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-gray-900">
            <a class="text-indigo-600 hover:text-indigo-600" href="https://gptmeetings.netcore.io">gptmeetings.netcore.io</a>
        </h3>
    </div>
    <p class="mx-auto pt-5 text-xl text-gray-500"> 
        Use Natural Language to get GPT Agents to book meetings with your APIs
    </p>
    <div class="my-8">
        <div class="flex justify-center">
            <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="7vChIGHWPuI" style="background-image: url('https://img.youtube.com/vi/7vChIGHWPuI/maxresdefault.jpg')"></lite-youtube>
        </div>
    </div>
</div>

This approach relies on a fairly sophisticated prompt to get the desired outcome whose probability of a successful response
is dependent on the ambiguity and complexity of a command and the surface complexity of the APIs they need to call.

The difficulty then becomes how best to construct the interface of our System APIs to LLMs and how best to detect a valid
response from an invalid one. In our experience the key to best guiding LLMs to produce a valid response is to front load
the prompt with descriptive information of available functionality it should utilize and constrain its output to a restricted
surface area. 

### TypeChat

Microsoft's new [TypeChat](https://github.com/microsoft/TypeChat) library takes another interesting approach to interfacing with LLMs where instead of 
using chain of thought to continually refine LLM outputs towards a valid successful response, it relies on using 
TypeScript schemas to define and restrict what valid responses Chat GPT should return, which both validates LLM responses
to verify if they're valid and if not replies back with Schema Validation errors to guide GPT into returning a successful response.

Whilst this approach is less ambitious and open ended from harnessing the reasoning capabilities of LLMs than Chain of Thought, 
it's easier to develop from a pragmatic view where instead of tweaking and refining prompt templates to get more desirable
outcomes you're defining TypeScript schemas of what you want the Natural Language free text to convert into.

[TypeChat's CoffeeShop](https://github.com/microsoft/TypeChat/tree/main/examples/coffeeShop) 
is a good example of what this looks like in real world application which uses LLMs to
implement a natural language ordering system by capturing all the different ways a Customer can order at a Cafe, 
as defined in:
[coffeeShopSchema.ts](https://github.com/microsoft/TypeChat/blob/main/examples/coffeeShop/src/coffeeShopSchema.ts)

```ts
// The following is a schema definition for ordering lattes.

export interface Cart {
    items: (LineItem | UnknownText)[];
}

// Use this type for order items that match nothing else
export interface UnknownText {
    type: 'unknown',
    text: string; // The text that wasn't understood
}

export interface LineItem {
    type: 'lineitem',
    product: Product;
    quantity: number;
}

export type Product = BakeryProducts | LatteDrinks | EspressoDrinks | CoffeeDrinks;

export interface BakeryProducts {
    type: 'BakeryProducts';
    name: 'apple bran muffin' | 'blueberry muffin' | 'lemon poppyseed muffin' |'bagel'
    options: (BakeryOptions | BakeryPreparations)[];
}

export interface BakeryOptions {
    type: 'BakeryOptions';
    name: 'butter' | 'strawberry jam' | 'cream cheese';
    optionQuantity?: OptionQuantity;
}

export interface BakeryPreparations {
    type: 'BakeryPreparations';
    name: 'warmed' | 'cut in half';
}

export interface LatteDrinks {
    type: 'LatteDrinks';
    name: 'cappuccino' | 'flat white' | 'latte' | 'macchiato' | 'mocha' |'chai latte'
    temperature?: CoffeeTemperature;
    size?: CoffeeSize;  // The default is 'grande'
    options?:(Milks | Sweeteners | Syrups | Toppings | Caffeines|LattePreparations)[]
}

// more categories and products...
export type CoffeeTemperature = 'hot' | 'extra hot' | 'warm' | 'iced';

export type CoffeeSize = 'short' | 'tall' | 'grande' | 'venti';

export type EspressoSize = 'solo' | 'doppio' | 'triple' | 'quad';

export type OptionQuantity = 'no' | 'light' | 'regular' | 'extra' | number;
```

We can see TypeScript's expressive Type System really shines here which is easily able to succinctly express all
available products and options with minimal syntax. It's also worth noting the schema is solely concerned with the orders
customers are able to make and not about how the data is modelled in a datastore which is a good approach when interfacing
with LLMs to increase the probability of a successful result.

But to be useful App's still need to model their data model which as a goal needs to:
- Capture all categories and products Customers can order
- Be able to dynamically generate the resulting TypeScript Schema
- Persist in a Data Store
- Enable management through a User Friendly UI
 
Which will be the initial goal of our .NET App. FortunatelyTypeScript schema also serves as a great requirements documentation,
clearly and precisely defining all the categories, products, relationships and variants our Data Model needs to support.

### Code-First Data Modelling

This can be easily done in code-first ORMs like [OrmLite](https://docs.servicestack.net/ormlite/) which lets you design
RDBMS Tables with simple POCO classes. Since we'll also be using the Data Model to generate our online store we'll also add
an `ImageUrl` on **Category** and **Product** Models. 

OrmLite also supports persisting complex types on Data Models which are serialized with the RDBMS configured 
[Complex Type Serializer](https://docs.servicestack.net/ormlite/complex-type-serializers) which saves from requiring 
a number of unnecessary code tables and inefficient table joins for table data that doesn't need to be queried server-side. 

By utilizing complex type collections we can get this down to **5 tables** to define a data model that supports capturing the
categories, products, options and relationships in the [coffeeShopSchema.ts](https://github.com/microsoft/TypeChat/blob/main/examples/coffeeShop/src/coffeeShopSchema.ts):

```csharp
public class Category
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<string>? Temperatures { get; set; }
    public string? DefaultTemperature { get; set; }
    public List<string>? Sizes { get; set; }
    public string? DefaultSize { get; set; }
    public string? ImageUrl { get; set; }
    
    [Reference]
    public List<Product> Products { get; set; }

    [Reference]
    public List<CategoryOption> CategoryOptions { get; set; }
}

public class Product
{
    [AutoIncrement]
    public int Id { get; set; }
    [References(typeof(Category))]
    public int CategoryId { get; set; }
    public string Name { get; set; }
    public decimal Cost { get; set; }
    public string? ImageUrl { get; set; }

    [Reference]
    public Category Category { get; set; }
}

public class Option
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Type { get; set; }
    public List<string> Names { get; set; }
    public bool? AllowQuantity { get; set; }
    public string? QuantityLabel { get; set; }
}

public class OptionQuantity
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Value { get; set; }
}

public class CategoryOption
{
    [AutoIncrement]
    public int Id { get; set; } 
    [References(typeof(Category))]
    public int CategoryId { get; set; }
    [References(typeof(Option))]
    public int OptionId { get; set; }
}
```

:::info
The `[Reference]` attributes defines [POCO References](https://docs.servicestack.net/ormlite/reference-support) for pulling 
in data from related tables in OrmLite's `Load*` APIs
:::

## Creating the CoffeeShop Database

Next step is to create the RDBMS tables, which we recommend doing from within a 
[Code-First DB Migration](https://docs.servicestack.net/ormlite/db-migrations) class so they can be easily run, re-run
and extend over time. 

For this we can just copy all data models into a 
[Migration1000.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/Migrations/Migration1000.cs) 
class which represents the initial state of the Application database, where all RDBMS tables are created and populated 
in the `Up()` method and tables deleted and drop in the `Down()` method:

```csharp
public class Migration1000 : MigrationBase
{
    // Embedded copy of Data Models...
    
    public override void Up()
    {
        Db.CreateTable<Category>();
        Db.CreateTable<Option>();
        Db.CreateTable<OptionQuantity>();
        Db.CreateTable<CategoryOption>();
        Db.CreateTable<Product>();
        
        Db.SaveAll(new OptionQuantity[]
        {
            new() { Name = "no", Value = 0 },
            new() { Name = "light", Value = 0.5m },
            new() { Name = "regular", Value = 1 },
            new() { Name = "extra", Value = 2 },
        });
        
        void AddOptions(string type, string[] names, bool? allowQuantity = false, string? quantityLabel = null)
        {
            var item = new Option
            {
                Type = type,
                Names = new(names),
                AllowQuantity = allowQuantity,
                QuantityLabel = quantityLabel,
            };
            Db.Save(item);
        }
        
        AddOptions("BakeryOptions", new[] {
            "Butter", 
            "Strawberry Jam", 
            "Cream Cheese",
        });
        AddOptions("BakeryPreparations", new[] {
            "Warmed", 
            "Cut in Half", 
        });
        AddOptions("Milks", new[] {
            "Whole Milk", 
            "Two Percent Milk", 
            "NonFat Milk", 
            "Coconut Milk", 
            "Soy Milk", 
            "Almond Milk", 
            "Oat Milk",
        });
        //....
        
        void AddCategoryProducts(string category, 
            (string name, decimal cost)[] productInfos, 
            string[]? optionTypes = null,
            string[]? temperatures = null,
            string? defaultTemperature = null,
            string[]? sizes = null,
            string? defaultSize = null)
        {
            var cat = new Category
            {
                Name = category,
                Description = category.SplitCamelCase(),
                Temperatures = temperatures != null ? new(temperatures) : null,
                DefaultTemperature = defaultTemperature,
                Sizes = sizes != null ? new(sizes) : null,
                DefaultSize = defaultSize,
                ImageUrl = $"/products/{category.SplitCamelCase().GenerateSlug()}.jpg",
            };
            Db.Save(cat);

            foreach (var optionType in optionTypes.Safe())
            {
                var option = options.First(x => x.Type == optionType);
                var categoryOption = new CategoryOption
                {
                    CategoryId = cat.Id,
                    OptionId = option.Id,
                };
                Db.Save(categoryOption);
            }
            
            foreach (var productInfo in productInfos)
            {
                var product = new Product
                {
                    CategoryId = cat.Id,
                    Name = productInfo.name,
                    Cost = productInfo.cost,
                    ImageUrl = $"/products/{productInfo.name.GenerateSlug()}.jpg",
                };
                Db.Save(product);
            }
        }

        AddCategoryProducts("BakeryProducts", new[] {
            ("Apple Bran Muffin", 4m),
            ("Blueberry Muffin", 4),
            ("Lemon Poppy seed Muffin", 4),
            ("Bagel", 4),
        }, new[]{ "BakeryOptions", "BakeryPreparations" });
        
        AddCategoryProducts("LatteDrinks", new[] {
            ("Cappuccino", 5.5m),
            ("Flat White", 5),
            ("Latte", 5),
            ("Latte Macchiato", 5),
            ("Mocha", 4.5m),
            ("Chai Latte", 4),
        }, new[] { "Milks", "Sweeteners", "Syrups", "Toppings", "Caffeines", "LattePreparations" },
           new[] { "Iced", "Warm", "Hot", "Extra Hot" }, defaultTemperature:"Hot",
           new[] { "Short", "Tall", "Grande", "Venti" }, defaultSize:"Grande");
        //...
    }
    
    public override void Down()
    {
        // Delete referential foreign key data first
        Db.DeleteAll<Product>();
        Db.DeleteAll<CategoryOption>();
        Db.DeleteAll<OptionQuantity>();
        Db.DeleteAll<Option>();
        Db.DeleteAll<Category>();

        Db.DropTable<Product>();
        Db.DropTable<CategoryOption>();
        Db.DropTable<OptionQuantity>();
        Db.DropTable<Option>();
        Db.DropTable<Category>();
    }
}
```

Within the `Up()` method we can utilize everything C# offers including Tuples and local functions to populate the 
database with minimal boilerplate. The `Down()` method just needs to undo everything the `Up()` method does, which
typically means dropping any new tables with `Db.DropTable<T>` in the reverse order they were created, the data 
only needs to be deleted first if tables have foreign keys and foreign key enforcement is enabled.

### Running Migrations

After creating the initial migration all that's left is to run it, which you can do from the command-line with:

:::sh
npm run migrate
:::

Which is an alias for [dotnet Migration App Tasks](https://docs.servicestack.net/ormlite/db-migrations#dotnet-migration-tasks)
to run your App in the context of a Migration App Tasks. 

Alternatively Migration Tasks can also be run from within your IDE by running the `Migrate()` Unit Test in 
[CoffeeShop's MigrationTasks.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop.Tests/MigrationTasks.cs)

### Rerunning the last Migration

Often you'll need a few iterations before you're happy with the your current set of Database changes, a productive workflow
for making iterative changes to your current migration you're actively working on (but haven't committed) is to make changes
to your current migration then revert and re-run it, which you and do with the `Rerun_Last_Migration()` Unit Test or
on the command-line with:

:::sh
npm run rerun:last
:::

Or for your first DB Migration you could also delete the entire `App_Data\db.sqlite` database and re-run `npm run migrate`
to rerun migrations and recreate the database.

### Viewing the App database

By default CoffeeShop is configured to use an embedded SQLite database at `App_Data\db.sqlite` which you can inspect
with your favorite RDBMS viewer. My favorite all-purpose database tool is [JetBrains DataGrip](https://www.jetbrains.com/datagrip/)
but if you're using Rider you can simply drag **db.sqlite** to Rider's **Database** panel to view it within the same IDE:

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/db.png)](/img/posts/building-typechat-coffeeshop-modelling/db.png)
:::

## Building the UI and API

With the Data Models and Database created we can get to the fun stuff in building our App's APIs and UI. Luckily this
is effortless with AutoQuery where most of it can be done without any implementation - i.e. by just using code-first
DTOs to describe the API we want, then ServiceStack's [AutoQuery](/autoquery) and [Vue Components](/vue/) does the rest.

For this we just create the [AutoQuery CRUD](https://docs.servicestack.net/autoquery/crud) APIs for the functionality
we want to enable. E.g. 
 - Defining `QueryDb<T>` for a Data Model allows it to be queried
 - Defining `ICreateDb<T>` enables new rows to be created
 - Defining `IPatchDb<T>` enables rows to be updated
 - Defining `IDeleteDb<T>` enables rows to be deleted

So that CoffeeShop owners can manage their own database we'll implement AutoQuery CRUD APIs for the `Category`, `Product`,
`Option` and `OptionQuantity` tables. We'll handle the **Many to Many** `CategoryOption` table later as it's not something
users will want to manage directly. 

We can accomplish the bulk of the functionality we need by with the CRUD APIs below after copying all the properties
from the DataModels we want users to be able to Create / Edit:

```csharp
public class QueryCategories : QueryDb<Category> {}
public class CreateCategory : ICreateDb<Category>, IReturn<Category>
{
    public string Name { get; set; }
    public string Description { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Sizes { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Temperatures { get; set; }
    public string? DefaultSize { get; set; }
    public string? DefaultTemperature { get; set; }
    [Input(Type = "file"), UploadTo("products")]
    public string? ImageUrl { get; set; }
}
public class UpdateCategory : IPatchDb<Category>, IReturn<Category>
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Sizes { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Temperatures { get; set; }
    public string? DefaultSize { get; set; }
    public string? DefaultTemperature { get; set; }
    [Input(Type = "file"), UploadTo("products")]
    public string? ImageUrl { get; set; }
}
public class DeleteCategory : IDeleteDb<Category>, IReturnVoid
{
    public int Id { get; set; }
}

public class QueryProducts : QueryDb<Product> {}
public class CreateProduct : ICreateDb<Product>, IReturn<Product>
{
    public int CategoryId { get; set; }
    public string Name { get; set; }
    public decimal Cost { get; set; }
    [Input(Type = "file"), UploadTo("products")]
    public string? ImageUrl { get; set; }
}
public class UpdateProduct : IPatchDb<Product>, IReturn<Product>
{
    public int Id { get; set; }
    public int? CategoryId { get; set; }
    public string? Name { get; set; }
    public decimal? Cost { get; set; }
    [Input(Type = "file"), UploadTo("products")]
    public string? ImageUrl { get; set; }
}
public class DeleteProduct : IDeleteDb<Product>, IReturnVoid
{
    public int Id { get; set; }
}

public class QueryOptions : QueryDb<Option> {}
public class CreateOption : ICreateDb<Option>, IReturn<Option>
{
    public string Type { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string> Names { get; set; }
    public bool? AllowQuantity { get; set; }
    public string? QuantityLabel { get; set; }
}
public class UpdateOption : IPatchDb<Option>, IReturn<Option>
{
    public int Id { get; set; }
    public string? Type { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Names { get; set; }
    public bool? AllowQuantity { get; set; }
    public string? QuantityLabel { get; set; }
}
public class DeleteOption : IDeleteDb<Option>, IReturnVoid
{
    public int Id { get; set; }
}

public class QueryOptionQuantities : QueryDb<OptionQuantity> {}
public class CreateOptionQuantity : ICreateDb<OptionQuantity>, IReturn<OptionQuantity>
{
    public string Name { get; set; }
}
public class UpdateOptionQuantity : IPatchDb<OptionQuantity>, IReturn<OptionQuantity>
{
    public int Id { get; set; }
    public string? Name { get; set; }
}
public class DeleteOptionQuantity : IDeleteDb<OptionQuantity>, IReturnVoid
{
    public int Id { get; set; }
}
```

### Partial Updates

The one thing we have to look out for if we implement our Update APIs with `IPatchDb<T>` Partial Updates is that all properties
other than the Primary Key should be nullable. This isn't required when implementing Update APIs with `IUpdateDb<T>`
which sends full updates of every property per request.

### Custom Fields

Most of the functionality available to APIs can be enabled using [declarative attributes](https://docs.servicestack.net/locode/declarative),
In this case we're making usage of the `[Input]` [UI Attribute](https://docs.servicestack.net/locode/declarative#ui-metadata-attributes)
to customize which UI Control is used to render the property in ServiceStack [Auto UIs](/auto-ui).

The [Auto Form Components](https://docs.servicestack.net/vue/autoform) only render Input UI Components for .NET Types 
where their exists a HTML Input Element for it. Since there's no HTML Input element that edits collections natively
we'll need to specify which Custom Vue Component to use, which in that case will use the [TagInput Component](https://docs.servicestack.net/vue/taginput)
to edit `List<string>` properties:

```csharp
public class UpdateCategory : IPatchDb<Category>, IReturn<Category>
{
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Sizes { get; set; }

    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Temperatures { get; set; }

    [Input(Type = "file"), UploadTo("products")]
    public string? ImageUrl { get; set; }
    //...
}
```

Whilst `[Input(Type="file")]` specifies to use the HTML File Input to populate the `ImageUrl` property with the path to 
the uploaded file that's handled by the `[UploadTo("products")]` [Managed File Upload Location](https://docs.servicestack.net/locode/files-overview)
defined in [Configure.AppHost.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/Configure.AppHost.cs):

```csharp
var wwwrootVfs = GetVirtualFileSource<FileSystemVirtualFiles>();
Plugins.Add(new FilesUploadFeature(
    new UploadLocation("products", wwwrootVfs, allowExtensions:FileExt.WebImages,
        resolvePath: ctx => $"/products/{ctx.FileName}"))
));
```

## Locode Auto UI

A nice UX touch we can add to our UIs is to give each Table visual icons to better describe what they're for which we
can do by annotating them with SVGs in [Icons.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop.ServiceModel/Icons.cs):

```csharp
[Icon(Svg = Icons.Category)]
public class Category { ... }

[Icon(Svg = Icons.Option)]
public class Option { ... }

[Icon(Svg = Icons.OptionQuantity)]
public class OptionQuantity { ... }

[Icon(Svg = Icons.Product)]
public class Product { ... }
```

Where it will now show up next to each Table in [Locode's CRUD UI](https://docs.servicestack.net/locode/) accessible at:

<h3 class="not-prose text-center pb-8">
    <a class="text-4xl text-blue-600 hover:underline" href="https://localhost:5001/locode/">https://localhost:5001/locode/</a>
</h3>

Which we can login with the `admin@email.com` user and default `p@55wOrd` created in [Configure.AuthRepository.cs](https://github.com/NetCoreApps/CoffeeShop/blob/f00d4e5d3edd3dd23e325d1899e0078db025204a/CoffeeShop/Configure.AuthRepository.cs#L44).

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/query-products.png)](/img/posts/building-typechat-coffeeshop-modelling/query-products.png)
:::

So without having needing to write any implementation, Locode provides us with a full CRUD UI generated from your APIs typed
Request DTOs that's used to render all UI Forms using Vue [Auto Form Components](https://docs.servicestack.net/vue/autoform),
which we can see makes use of our customizations with `Sizes` and `Temperatures` properties managed by **full-width** `Tag` Input components
and `ImageUrl` managed by the [FileInput Component](https://docs.servicestack.net/vue/fileinput): 

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/update-category.png)](/img/posts/building-typechat-coffeeshop-modelling/update-category.png)
:::

And because we have [Crud Events registered](https://github.com/NetCoreApps/CoffeeShop/blob/f00d4e5d3edd3dd23e325d1899e0078db025204a/CoffeeShop/Configure.AutoQuery.cs#L13)
our UI Forms also shows the [AutoQuery CRUD Executable Audit Log](https://docs.servicestack.net/autoquery/audit-log) to be able to track and view 
all edits made to each record through our AutoQuery APIs.

## Custom Admin UI

Locode is a great way to enable an instant Management UI for backend developers or employees to browse and manage your Apps
data, and whilst it offers a [lot of customizability](https://docs.servicestack.net/locode/custom-overview) it's not as 
customizable as a Bespoke UI.

Fortunately as Locode is built on ServiceStack's [Vue Components](https://servicestack.net/vue/) we can reuse the same
components to quickly build Custom Admin UIs:

<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="wlRA4_owEsc" style="background-image: url('https://img.youtube.com/vi/wlRA4_owEsc/maxresdefault.jpg')"></lite-youtube>
</div>

To get started quickly the [vue-mjs](https://vue-mjs.web-templates.io) template includes a Client Admin example at:

- [/portal/](https://vue-mjs.web-templates.io/portal/) - [/portal/index.html](https://github.com/NetCoreTemplates/vue-mjs/blob/main/MyApp/wwwroot/portal/index.html)

Whose sections of Vue Components can be replaced with our Models to create the CoffeeShop Admin UI:  

```js
const sections = {
    //...
    Categories: {
        type: 'Category',
        component: {
            template:`
            <AutoQueryGrid :type="type" selectedColumns="imageUrl,id,name,defaultSize,products"
                    :headerTitles="{ imageUrl: ' ' }" :canFilter="x => x != 'ImageUrl'">
                <template #imageUrl="{ imageUrl }">
                    <Icon :src="imageUrl" class="w-8 h-8 rounded-full" />
                </template>
                <template #id="{ id }">{{id}}</template>
                <template #name="{ name }">{{name}}</template>
                <template #description="{ description }">{{description}}</template>
                <template #defaultSize="{ defaultSize }">{{defaultSize}}</template>
                <template #products="{ products }">{{ products.map(x => x.name).join(', ') }}</template>
            </AutoQueryGrid>`,
        },
    },
    Products: {
        type: 'Product',
        component: {
            template:`
            <AutoQueryGrid :type="type" selectedColumns="imageUrl,category,id,name,cost"
                    :headerTitles="{ imageUrl: ' ' }" :canFilter="x => x != 'ImageUrl'">
                <template #imageUrl="{ imageUrl }">
                    <Icon :src="imageUrl" class="w-8 h-8 rounded-full" />
                </template>
                <template #category="{ category }">
                    <a :href="'#Categories?edit=' + category.id" class="flex text-indigo-600 hover:underline">
                        <icon :svg="getIcon('Categories')" class="w-5 h-5 mr-1 shrink-0 text-indigo-600"></icon>
                        {{category.name}}
                    </a>
                </template>
                <template #id="{ id }">{{id}}</template>
                <template #name="{ name }">{{name}}</template>
                <template #cost="{ cost }">
                    <preview-format :value="cost" :format="Formats.currency"></preview-format>
                </template>
            </AutoQueryGrid>`,
            setup() {
                return { getIcon, Formats }
            }
        },
    },
    Options: {
        type: 'Option',
        component: {
            template:`<AutoQueryGrid :type="type" />`,
        },
    },
    OptionQuantities: {
        type: 'OptionQuantity',
        component: {
            template:`<AutoQueryGrid :type="type" />`,
        },
    },
}
```

Which gives us a similar Admin UI with the advantage of a completely customizable UI, which we make use of to implement
custom [AutoQueryGrid components](https://docs.servicestack.net/vue/autoquerygrid) for **Categories** and **Products** 
showing a customized view with just the columns we want, the order and format we want it in whilst **Options** and 
**OptionQuantities** continue to use the default AutoQueryGrid components:

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/portal-products.png)](/img/posts/building-typechat-coffeeshop-modelling/portal-products.png)
:::

## Custom UI Forms

We're pretty close to a complete Admin UI with AutoQuery and AutoForm Components being able to implement most of the 
standard UI Forms we need except it doesn't have auto support for managing Many-to-Many relationships like `CategoryOption` 
table which we'll need to implement ourselves to be able to specify which Options a category of Products can have.

### Implementing Many to Many CategoryOption Admin UI

The easier way to implement this functionality would be to have the UI call an API each time an `Option` was added or removed
to a `Category`. The problem with this approach is that it doesn't match the existing behavior where if a User **cancels**
a form they'd expect for none of their changes to be applied.

To implement the desired functionality we'll instead create a custom `UpdateCategory` implementation that also
handles any changes to `CategoryOption` using new `AddOptionIds` and `RemoveOptionIds` properties that we'll want 
rendered as **hidden** inputs in our HTML Form with:

```csharp
public class UpdateCategory : IPatchDb<Category>, IReturn<Category>
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Sizes { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Temperatures { get; set; }
    public string? DefaultSize { get; set; }
    public string? DefaultTemperature { get; set; }
    [Input(Type = "file"), UploadTo("products")]
    public string? ImageUrl { get; set; }

    [Input(Type = "hidden")]
    public List<int>? AddOptionIds { get; set; }
 
    [Input(Type = "hidden")]
    public List<int>? RemoveOptionIds { get; set; }
}
```

We can then provide a [Custom AutoQuery Implementation](https://docs.servicestack.net/autoquery/rdbms#custom-autoquery-implementations)
in [CoffeeShopServices.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop.ServiceInterface/CoffeeShopServices.cs) 
which AutoQuery will use instead of its own.

Where our custom implementation continues to utilize AutoQuery's Partial Update functionality if there's any changes to update, 
as well as removing or adding any Options the user makes to the `Category`: 

```csharp
public class CoffeeShopServices : Service
{
    public IAutoQueryDb AutoQuery { get; set; }
    
    public async Task<object> Any(UpdateCategory request)
    {
        // Perform all RDBMS Updates within the same Transaction
        using var trans = Db.OpenTransaction();

        Category? response = null;
        var ignore = new[] { nameof(request.Id), nameof(request.AddOptionIds), nameof(request.RemoveOptionIds) };
        // Only call AutoQuery Update if there's something to update
        if (request.ToObjectDictionary().HasNonDefaultValues(ignoreKeys:ignore))
        {
            response = (Category) await AutoQuery.PartialUpdateAsync<Category>(request, Request, Db);
        }
        if (request.RemoveOptionIds?.Count > 0)
        {
            await Db.DeleteAsync<CategoryOption>(x => x.CategoryId == request.Id && request.RemoveOptionIds.Contains(x.OptionId));
        }
        if (request.AddOptionIds?.Count > 0)
        {
            await Db.InsertAllAsync(request.AddOptionIds.Map(id => new CategoryOption { CategoryId = request.Id, OptionId = id }));
        }
        trans.Commit();

        response ??= request.ConvertTo<Category>();
        return response;
    }
}
```

We now need to implement the Custom UI that Adds/Removes Options from a Category which we'll do in a custom `CategoryOptions`
Vue Component that displays all the Category Options with a button to remove existing ones and a Select Input to 
add non existing options.

The purpose of the component is to populate the `addOptionIds` field with Option Ids that should be added and `removeOptionIds`
with Ids to be removed, which updates the Request DTO of the parent Form Model with the `update:modelValue` event:

```js
const CategoryOptions = {
    template:`
         <div>
            <ul v-for="optionType in currentOptionTypes">
                <li class="py-1 flex justify-between">
                    <span>
                        {{optionType}}
                    </span>
                    <span>
                        <svg class="w-6 h-6 text-red-600 hover:text-red-800 cursor-pointer" @click="removeOption(optionType)" xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 1024 1024'>
                            <title>Remove Option</title>
                            <path fill='currentColor' d='M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896zM288 512a38.4 38.4 0 0 0 38.4 38.4h371.2a38.4 38.4 0 0 0 0-76.8H326.4A38.4 38.4 0 0 0 288 512z'/>
                        </svg>
                    </span>
                </li> 
            </ul>
            <div class="flex justify-between items-center">
                <select-input class="flex-grow" @change="addOption" :values="['',...options.filter(x => !currentOptionTypes.includes(x.type)).map(x => x.type)]"></select-input>
                <svg class="ml-2 w-6 h-6 text-green-600" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <title>Add Option</title>
                    <path fill='currentColor' d='M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4v4Zm1 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z'/>
                </svg>            
            </div>
         </div>
    `,
    props:['type','id','modelValue'],
    emits:['update:modelValue'],
    setup(props, { emit }) {
        const client = useClient()
        const options = ref([])
        const model = props.modelValue

        model.addOptionIds ??= []
        model.removeOptionIds ??= []
        const origOptionIds = model.categoryOptions?.map(x => x.optionId) || []

        const currentOptionIds = computed(() => [...origOptionIds, ...model.addOptionIds]
            .filter(x => !model.removeOptionIds.includes(x)))
        const currentOptionTypes = computed(() =>
            currentOptionIds.value.map(id => options.value.find(x => x.id === id)?.type).filter(x => !!x))

        function addOption(e) {
            const optionType = e.target.value
            if (!optionType) return
            const option = options.value.find(x => x.type === optionType)
            if (model.removeOptionIds.includes(option.id))
                model.removeOptionIds = model.removeOptionIds.filter(id => id !== option.id)
            else if (!model.addOptionIds.includes(option.id))
                model.addOptionIds.push(option.id)
            emit('update:modelValue', model)
        }
        function removeOption(optionType) {
            const option = options.value.find(x => x.type === optionType)
            if (model.addOptionIds.includes(option.id))
                model.addOptionIds = model.addOptionIds.filter(id => id !== option.id)
            else if (!model.removeOptionIds.includes(option.id))
                model.removeOptionIds.push(option.id)
        }

        onMounted(async () => {
            const api = await client.api(new QueryOptions({ orderBy:'id' }))
            options.value = api.response.results || []
            emit('update:modelValue', model)
        })

        return { options, addOption, removeOption, currentOptionTypes }
    }
}
```

Which is then attached to the AutoQueryGrid Form Components using its `<template #formfooter>` to include it in the
bottom of the Create and Edit Form Components:

```js
const sections = {
    Categories: {
        type: 'Category',
        component: {
            components: { CategoryOptions },
            template:`
            <AutoQueryGrid :type="type" selectedColumns="imageUrl,id,name,defaultSize,products"
                    :headerTitles="{ imageUrl: ' ' }" :canFilter="x => x != 'ImageUrl'">
                <template #imageUrl="{ imageUrl }">
                    <Icon :src="imageUrl" class="w-8 h-8 rounded-full" />
                </template>
                <template #id="{ id }">{{id}}</template>
                <template #name="{ name }">{{name}}</template>
                <template #description="{ description }">{{description}}</template>
                <template #defaultSize="{ defaultSize }">{{defaultSize}}</template>
                <template #products="{ products }">{{ products.map(x => x.name).join(', ') }}</template>
                <template #formfooter="{ form, type, apis, model, id, updateModel }">
                    <div class="w-1/2 mt-4 px-4 sm:px-6">
                        <h3 class="text-lg font-semibold">Options</h3>
                        <CategoryOptions v-if="form === 'edit'" :key="id" :type="type" :id="id" v-model="model" @update:modelValue="updateModel(model)" />
                    </div>
                </template>                
            </AutoQueryGrid>`,
        },
    },
    //...
}
```

With those finishing touches our back-end Admin UI is now complete which CoffeeShop owners can use to manage their entire database:

:::{.shadow .rounded-sm}
[![](/img/posts/building-typechat-coffeeshop-modelling/portal-update-category.png)](/img/posts/building-typechat-coffeeshop-modelling/portal-update-category.png)
:::

### Generate TypeScript Schema

One of the goals for our App's Database is to dynamically generating the TypeScript Schema for TypeChat to use
to translate Customers Orders into valid Cart Orders that our Application can process. ServiceStack does include functionality
to [convert C# DTOs into TypeScript Types](https://docs.servicestack.net/typescript-add-servicestack-reference) except that's not
useful here as the [coffeeShopSchema.ts](https://github.com/microsoft/TypeChat/blob/main/examples/coffeeShop/src/coffeeShopSchema.ts)
is primarily populated from data not C# Types.

Instead the most flexible option to be able to generate the schema is to use a templating language, luckily we have a
great option for this in [#Script](https://sharpscript.net) which combines [Handlebars](https://handlebarsjs.com) and
[JavaScript Expression](https://sharpscript.net/docs/expression-viewer) syntax with tight 
[integration with .NET](https://sharpscript.net/docs/script-net) that we can develop quickly thanks to its 
[Live Reloading](https://sharpscript.net/#exploratory-programming) dev UX.

To utilize #Script we need to create a `ScriptContext` in C# with all the Data and functionality the template needs to 
generate the prompt by adding script arguments for all the data in our App's database which is done in
[CoffeeShopPromptProvider.cs](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop.ServiceInterface/CoffeeShopPromptProvider.cs):

```csharp
public class CoffeeShopPromptProvider : IPromptProvider
{
    public IDbConnectionFactory DbFactory { get; set; }
    public AppConfig Config { get; set; }

    public async Task<string> CreateSchemaAsync(TypeChatRequest request, CancellationToken token)
    {
        var file = new FileInfo(Config.CoffeeShop.GptPath.CombineWith("schema.ss"));
        if (file == null)
            throw HttpError.NotFound($"{Config.CoffeeShop.GptPath}/schema.ss not found");

        using var db = await DbFactory.OpenDbConnectionAsync(token: token);
        var categories = await db.LoadSelectAsync(db.From<Category>(), token:token);
        var options = await db.SelectAsync<Option>(token: token);
        var optionsMap = options.ToDictionary(x => x.Id);
        var optionQuantities = await db.SelectAsync<OptionQuantity>(token: token);

        var tpl = await file.ReadAllTextAsync(token: token);
        var context = new ScriptContext {
            Plugins = { new TypeScriptPlugin() }
        }.Init();

        var output = await new PageResult(context.OneTimePage(tpl))
        {
            Args =
            {
                [nameof(categories)] = categories,
                [nameof(options)] = options,
                [nameof(optionsMap)] = optionsMap,
                [nameof(optionQuantities)] = optionQuantities,
            },
        }.RenderScriptAsync(token: token);
        return output;
    }
    //...
}
```

With the only added functionality our schema makes use of are the simple helpers in
[TypeScriptMethods.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Common/Script/Methods/TypeScriptMethods.cs)

```csharp
public class TypeScriptPlugin : IScriptPlugin
{
    public void Register(ScriptContext context) => 
        context.ScriptMethods.Add(new TypeScriptMethods());
}

public class TypeScriptMethods : ScriptMethods
{
    public RawString tsUnionStrings(IEnumerable<string> strings) => new(
        StringUtils.Join(" | ", strings.Map(x => $"'{x}'"), lineBreak:108));

    public RawString tsUnionTypes(IEnumerable<string> strings) => new(
        StringUtils.Join(" | ", strings, lineBreak:108));
}
```

The populated `ScriptContext` is then used to execute the
[gpt/coffeeshop/schema.ss](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/gpt/coffeeshop/schema.ss) **#Script** template:

```js
// The following is a schema definition for ordering lattes.

export interface Cart {
    items: (LineItem | UnknownText)[];
}

// Use this type for order items that match nothing else
export interface UnknownText {
    type: 'unknown',
    text: string; // The text that wasn't understood
}

export interface LineItem {
    type: 'lineitem',
    product: Product;
    quantity: number;
}

export type Product = {{categories.map(x => x.name) |> tsUnionTypes}};

{{#each category in categories}}
export interface {{category.name}} {
    type: '{{category.name}}';
    name: {{ category.products.map(x => x.name.lower()) |> tsUnionStrings }};
{{#if !category.temperatures.isEmpty() }}
    temperature?: {{category.temperatures.map(x => x.lower()) |> tsUnionStrings}};{{category.defaultTemperature ? ` // The default is '${category.defaultTemperature.lower()}'`.raw() : ''}}
{{/if}}
{{#if !category.sizes.isEmpty() }}
    size?: {{category.sizes.map(x => x.lower()) |> tsUnionStrings}};{{category.defaultSize ? ` // The default is '${category.defaultSize.lower()}'`.raw() : ''}}
{{/if}}
{{#if options.count > 0}}
    options?: ({{ options.map(x => x.type) |> tsUnionTypes }})[];
{{/if}}
}

{{/each}}

{{#each option in options}}
export interface {{option.type}} {
    type: '{{option.type}}';
    name: {{ option.names.map(x => x.lower()) |> tsUnionStrings }};
{{#if option.allowQuantity}}
    optionQuantity?: OptionQuantity;
{{/if}}
}
{{/each}}

export type OptionQuantity = {{optionQuantities.map(x => x.name.lower()) |> tsUnionStrings}} | number;
```

To generate our [gpt/coffeeshop/schema.ts](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/gpt/coffeeshop/schema.ts)
which is functionality equivalent to TypeChat's hand crafted [coffeeShopSchema.ts](https://github.com/microsoft/TypeChat/blob/main/examples/coffeeShop/src/coffeeShopSchema.ts): 

```ts
// The following is a schema definition for ordering lattes.

export interface Cart {
    items: (LineItem | UnknownText)[];
}

// Use this type for order items that match nothing else
export interface UnknownText {
    type: 'unknown',
    text: string; // The text that wasn't understood
}

export interface LineItem {
    type: 'lineitem',
    product: Product;
    quantity: number;
}

export type Product = BakeryProducts | LatteDrinks | EspressoDrinks | CoffeeDrinks;

export interface BakeryProducts {
    type: 'BakeryProducts';
    name: 'apple bran muffin' | 'blueberry muffin' | 'lemon poppy seed muffin' | 'bagel';
    options?: (BakeryOptions | BakeryPreparations | Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations | 
        Creamers)[];
}

export interface LatteDrinks {
    type: 'LatteDrinks';
    name: 'cappuccino' | 'flat white' | 'latte' | 'latte macchiato' | 'mocha' | 'chai latte';
    temperature?: 'iced' | 'warm' | 'hot' | 'extra hot'; // The default is 'hot'
    size?: 'short' | 'tall' | 'grande' | 'venti'; // The default is 'grande'
    options?: (BakeryOptions | BakeryPreparations | Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations | 
        Creamers)[];
}

export interface EspressoDrinks {
    type: 'EspressoDrinks';
    name: 'espresso' | 'lungo' | 'ristretto' | 'macchiato';
    temperature?: 'iced' | 'warm' | 'hot' | 'extra hot'; // The default is 'hot'
    size?: 'solo' | 'doppio' | 'triple' | 'quad'; // The default is 'doppio'
    options?: (BakeryOptions | BakeryPreparations | Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations | 
        Creamers)[];
}

export interface CoffeeDrinks {
    type: 'CoffeeDrinks';
    name: 'americano' | 'coffee';
    temperature?: 'iced' | 'warm' | 'hot' | 'extra hot'; // The default is 'hot'
    size?: 'short' | 'tall' | 'grande' | 'venti'; // The default is 'grande'
    options?: (BakeryOptions | BakeryPreparations | Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations | 
        Creamers)[];
}


export interface BakeryOptions {
    type: 'BakeryOptions';
    name: 'butter' | 'strawberry jam' | 'cream cheese';
    optionQuantity?: OptionQuantity;
}
export interface BakeryPreparations {
    type: 'BakeryPreparations';
    name: 'warmed' | 'cut in half';
}
export interface Milks {
    type: 'Milks';
    name: 'whole milk' | 'two percent milk' | 'nonfat milk' | 'coconut milk' | 'soy milk' | 'almond milk' | 'oat milk';
}
export interface Sweeteners {
    type: 'Sweeteners';
    name: 'equal' | 'honey' | 'splenda' | 'sugar' | 'sugar in the raw' | 'sweet n low';
    optionQuantity?: OptionQuantity;
}
export interface Syrups {
    type: 'Syrups';
    name: 'almond syrup' | 'buttered rum syrup' | 'caramel syrup' | 'cinnamon syrup' | 'hazelnut syrup' | 
        'orange syrup' | 'peppermint syrup' | 'raspberry syrup' | 'toffee syrup' | 'vanilla syrup';
    optionQuantity?: OptionQuantity;
}
export interface Toppings {
    type: 'Toppings';
    name: 'cinnamon' | 'foam' | 'ice' | 'nutmeg' | 'whipped cream' | 'water';
    optionQuantity?: OptionQuantity;
}
export interface Caffeines {
    type: 'Caffeines';
    name: 'regular' | 'two thirds caf' | 'half caf' | 'one third caf' | 'decaf';
    optionQuantity?: OptionQuantity;
}
export interface LattePreparations {
    type: 'LattePreparations';
    name: 'for here cup' | 'lid' | 'with room' | 'to go' | 'dry' | 'wet';
}
export interface Creamers {
    type: 'Creamers';
    name: 'whole milk creamer' | 'two percent milk creamer' | 'one percent milk creamer' | 'nonfat milk creamer' | 
        'coconut milk creamer' | 'soy milk creamer' | 'almond milk creamer' | 'oat milk creamer' | 
        'half and half' | 'heavy cream';
}

export type OptionQuantity = 'no' | 'light' | 'regular' | 'extra' | number;
```

### Optimizing TypeScript Schema Generation

Whilst our schema is functionally equivalent to TypeChat's [coffeeShopSchema.ts](https://github.com/microsoft/TypeChat/blob/main/examples/coffeeShop/src/coffeeShopSchema.ts), we noticed that some 
of the prompts were not returning the same desirable results. After several iterations of experimentation we learned
that several factors about the structure of the schema contributed to the effectiveness of the results.

For example the `CoffeeTemperature`, `CoffeeSize`, `EspressoSize` Types aren't just inert aliases and adds descriptive
context to the prompt. Likewise the proximity and order of the Types affects the strength of their relationships and
we were able to get more effective results by defining Options next to the Categories they apply to. 

We applied both changes to our [schema.ss](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/gpt/coffeeshop/schema.ss) 
which now looks like:

```js
{{* Type Aliases *}}
{{ var coffeeTemperatures = ['Iced','Warm','Hot','Extra Hot'] }}
{{ var coffeeSizes        = ['Short','Tall','Grande','Venti'] }}
{{ var espressoSizes      = ['Solo','Doppio','Triple','Quad'] }}

// The following is a schema definition for ordering lattes.

export interface Cart {
    items: (LineItem | UnknownText)[];
}

// Use this type for order items that match nothing else
export interface UnknownText {
    type: 'unknown',
    text: string; // The text that wasn't understood
}

export interface LineItem {
    type: 'lineitem',
    product: Product;
    quantity: number;
}

export type Product = {{categories.map(x => x.name) |> tsUnionTypes}};

{{ var generatedOptionTypes = [] }}
{{#each category in categories}}
export interface {{category.name}} {
    type: '{{category.name}}';
    name: {{ category.products.map(x => x.name.lower()) |> tsUnionStrings }};
{{#if coffeeTemperatures.equivalentTo(category.temperatures) }}
    temperature?: CoffeeTemperature;{{category.defaultTemperature ? `  // The default is '${category.defaultTemperature.lower()}'`.raw() : ''}}
{{else if !category.temperatures.isEmpty() }}
    temperature?: {{category.temperatures.map(x => x.lower()) |> tsUnionStrings}};{{category.defaultTemperature ? `  // The default is '${category.defaultTemperature.lower()}'`.raw() : ''}}
{{/if}}
{{#if coffeeSizes.equivalentTo(category.sizes) }}
    size?: CoffeeSize;{{category.defaultSize ? `  // The default is '${category.defaultSize.lower()}'`.raw() : ''}}
{{else if espressoSizes.equivalentTo(category.sizes) }}
    size?: EspressoSize;{{category.defaultSize ? `  // The default is '${category.defaultSize.lower()}'`.raw() : ''}}
{{else if !category.sizes.isEmpty() }}
    size?: {{category.sizes.map(x => x.lower()) |> tsUnionStrings}};{{category.defaultSize ? `  // The default is '${category.defaultSize.lower()}'`.raw() : ''}}
{{/if}}
{{#if options.count > 0}}
    options?: ({{ options.map(x => x.type) |> tsUnionTypes }})[];
{{/if}}
}

{{ var options = category.categoryOptions.map(x => optionsMap[x.optionId]) }}
{{#each option in options.where(x => !generatedOptionTypes.contains(x.type)) }}
{{ generatedOptionTypes.push(option.type) |> ignore }}
export interface {{option.type}} {
    type: '{{option.type}}';
    name: {{ option.names.map(x => x.lower()) |> tsUnionStrings }};
{{#if option.allowQuantity}}
    optionQuantity?: OptionQuantity;
{{/if}}
}
{{/each}}

{{/each}}

export type CoffeeTemperature = {{coffeeTemperatures.map(x => x.lower()) |> tsUnionStrings}};

export type CoffeeSize = {{coffeeSizes.map(x => x.lower()) |> tsUnionStrings}};

export type EspressoSize = {{espressoSizes.map(x => x.lower()) |> tsUnionStrings}};

export type OptionQuantity = {{optionQuantities.map(x => x.name.lower()) |> tsUnionStrings}} | number;
```

To generate our restructured and more effective resulting Schema:

```typescript
// The following is a schema definition for ordering lattes.

export interface Cart {
    items: (LineItem | UnknownText)[];
}

// Use this type for order items that match nothing else
export interface UnknownText {
    type: 'unknown',
    text: string; // The text that wasn't understood
}

export interface LineItem {
    type: 'lineitem',
    product: Product;
    quantity: number;
}

export type Product = BakeryProducts | LatteDrinks | EspressoDrinks | CoffeeDrinks;

export interface BakeryProducts {
    type: 'BakeryProducts';
    name: 'apple bran muffin' | 'blueberry muffin' | 'lemon poppy seed muffin' | 'bagel';
    options?: (BakeryOptions | BakeryPreparations | Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations |
        Creamers)[];
}


export interface BakeryOptions {
    type: 'BakeryOptions';
    name: 'butter' | 'strawberry jam' | 'cream cheese';
    optionQuantity?: OptionQuantity;
}

export interface BakeryPreparations {
    type: 'BakeryPreparations';
    name: 'warmed' | 'cut in half';
}

export interface LatteDrinks {
    type: 'LatteDrinks';
    name: 'cappuccino' | 'flat white' | 'latte' | 'latte macchiato' | 'mocha' | 'chai latte';
    temperature?: CoffeeTemperature;  // The default is 'hot'
    size?: CoffeeSize;  // The default is 'grande'
    options?: (BakeryOptions | BakeryPreparations | Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations |
        Creamers)[];
}


export interface Milks {
    type: 'Milks';
    name: 'whole milk' | 'two percent milk' | 'nonfat milk' | 'coconut milk' | 'soy milk' | 'almond milk' | 'oat milk';
}

export interface Sweeteners {
    type: 'Sweeteners';
    name: 'equal' | 'honey' | 'splenda' | 'sugar' | 'sugar in the raw' | 'sweet n low';
    optionQuantity?: OptionQuantity;
}

export interface Syrups {
    type: 'Syrups';
    name: 'almond syrup' | 'buttered rum syrup' | 'caramel syrup' | 'cinnamon syrup' | 'hazelnut syrup' |
        'orange syrup' | 'peppermint syrup' | 'raspberry syrup' | 'toffee syrup' | 'vanilla syrup';
    optionQuantity?: OptionQuantity;
}

export interface Toppings {
    type: 'Toppings';
    name: 'cinnamon' | 'foam' | 'ice' | 'nutmeg' | 'whipped cream' | 'water';
    optionQuantity?: OptionQuantity;
}

export interface Caffeines {
    type: 'Caffeines';
    name: 'regular' | 'two thirds caf' | 'half caf' | 'one third caf' | 'decaf';
    optionQuantity?: OptionQuantity;
}

export interface LattePreparations {
    type: 'LattePreparations';
    name: 'for here cup' | 'lid' | 'with room' | 'to go' | 'dry' | 'wet';
}

export interface EspressoDrinks {
    type: 'EspressoDrinks';
    name: 'espresso' | 'lungo' | 'ristretto' | 'macchiato';
    temperature?: CoffeeTemperature;  // The default is 'hot'
    size?: EspressoSize;  // The default is 'doppio'
    options?: (BakeryOptions | BakeryPreparations | Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations |
        Creamers)[];
}


export interface Creamers {
    type: 'Creamers';
    name: 'whole milk creamer' | 'two percent milk creamer' | 'one percent milk creamer' | 'nonfat milk creamer' |
        'coconut milk creamer' | 'soy milk creamer' | 'almond milk creamer' | 'oat milk creamer' |
        'half and half' | 'heavy cream';
}

export interface CoffeeDrinks {
    type: 'CoffeeDrinks';
    name: 'americano' | 'coffee';
    temperature?: CoffeeTemperature;  // The default is 'hot'
    size?: CoffeeSize;  // The default is 'grande'
    options?: (BakeryOptions | BakeryPreparations | Milks | Sweeteners | Syrups | Toppings | Caffeines | LattePreparations |
        Creamers)[];
}


export type CoffeeTemperature = 'iced' | 'warm' | 'hot' | 'extra hot';

export type CoffeeSize = 'short' | 'tall' | 'grande' | 'venti';

export type EspressoSize = 'solo' | 'doppio' | 'triple' | 'quad';

export type OptionQuantity = 'no' | 'light' | 'regular' | 'extra' | number;
```

As prompt engineering is more an Art than a Science it took several iterations of experimentation across multiple prompts 
to be able to measure the effectiveness of different changes, as such it was important to be able to modify and test 
prompts quickly which generating prompts with **#Script** lets us do as we could make changes to the
[schema.ss](https://github.com/NetCoreApps/CoffeeShop/blob/main/CoffeeShop/gpt/coffeeshop/schema.ss) template and 
get immediate feedback of their efficacy whilst the App was running.  

## Part 2

Check back-in at the end of this week for Part 2 which will cover the different options and challenges for using this 
schema to create a functional Voice Command Activated Order System for our CoffeeShop comparing the results of using 
different Transcribing and LLM Providers.
