---
title: PHP typed client DTOs for .NET APIs 
summary: Announcing 1st class end-to-end typed support for calling .NET APIs with PHP
tags: [php, servicestack, service-reference]
image: ./img/posts/php-typed-apis/bg.webp
author: Demis Bellot
---

We're happy to announce the **11th** [Add ServiceStack Reference](https://docs.servicestack.net/add-servicestack-reference)
language to enjoy end-to-end typed support for calling .NET APIs - [PHP](https://www.php.net)!

The **Add ServiceStack Reference** feature enables a simple way for PHP clients and Applications to generate native PHP DTO classes 
to access to your ServiceStack APIs.

<div class="not-prose mt-16 flex flex-col items-center">
   <div class="flex">
      <svg class="w-60 h-60" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#4F5B93" d="M64 30.332C28.654 30.332 0 45.407 0 64s28.654 33.668 64 33.668c35.345 0 64-15.075 64-33.668S99.346 30.332 64 30.332zm-5.982 9.81h7.293v.003l-1.745 8.968h6.496c4.087 0 6.908.714 8.458 2.139c1.553 1.427 2.017 3.737 1.398 6.93l-3.053 15.7h-7.408l2.902-14.929c.33-1.698.208-2.855-.365-3.473c-.573-.617-1.793-.925-3.658-.925h-5.828L58.752 73.88h-7.291l6.557-33.738zM26.73 49.114h14.133c4.252 0 7.355 1.116 9.305 3.348c1.95 2.232 2.536 5.346 1.758 9.346c-.32 1.649-.863 3.154-1.625 4.52c-.763 1.364-1.76 2.613-2.99 3.745c-1.468 1.373-3.098 2.353-4.891 2.936c-1.794.585-4.08.875-6.858.875h-6.294l-1.745 8.97h-7.35l6.557-33.74zm57.366 0h14.13c4.252 0 7.353 1.116 9.303 3.348h.002c1.95 2.232 2.538 5.346 1.76 9.346c-.32 1.649-.861 3.154-1.623 4.52c-.763 1.364-1.76 2.613-2.992 3.745c-1.467 1.373-3.098 2.353-4.893 2.936c-1.794.585-4.077.875-6.855.875h-6.295l-1.744 8.97h-7.35l6.557-33.74zm-51.051 5.325l-2.742 14.12h4.468c2.963 0 5.172-.556 6.622-1.673c1.45-1.116 2.428-2.981 2.937-5.592c.485-2.507.264-4.279-.666-5.309c-.93-1.032-2.79-1.547-5.584-1.547h-5.035zm57.363 0l-2.744 14.12h4.47c2.965 0 5.17-.556 6.622-1.673c1.449-1.116 2.427-2.981 2.935-5.592c.487-2.507.266-4.279-.664-5.309c-.93-1.032-2.792-1.547-5.584-1.547h-5.035z"/></svg>
   </div>
</div>
<div class="not-prose">
    <div class="text-center"><h3 id="php" class="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-gray-900">
        End-to-end typed PHP
    </h3></div>
    <p class="mx-auto mt-5 max-w-3xl text-xl text-gray-500">
        Learn about the rich JsonServiceClient & end-to-end typed API support for PHP 
    </p>
    <div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="ZLVdaJ38vwc" style="background-image: url('https://img.youtube.com/vi/ZLVdaJ38vwc/maxresdefault.jpg')"></lite-youtube>
    </div>
</div>

### PhpStorm ServiceStack Plugin

PHP developers of [PhpStorm](https://www.jetbrains.com/phpstorm/) can get a simplified development experience for consuming
ServiceStack Services by installing the [ServiceStack Plugin](https://plugins.jetbrains.com/plugin/7749-servicestack) 
from the JetBrains Marketplace:

[![](/img/posts/php-typed-apis/phpstorm-servicestack-plugin.webp)](https://plugins.jetbrains.com/plugin/7749-servicestack)

Where you'll be able to right-click on a directory and click on **ServiceStack Reference** on the context menu:

![](/img/posts/php-typed-apis/phpstorm-add-servicestack-reference.webp)

To launch the **Add PHP ServiceStack Reference** dialog where you can enter the remote URL of the ServiceStack endpoint you wish to call to generate the Typed PHP DTOs for all APIs which by default will saved to `dtos.php`:

![](/img/posts/php-typed-apis/phpstorm-add-servicestack-reference-dialog.webp)

Then just import the DTOs and `JsonServiceClient` to be able to consume any of the remote ServiceStack APIs:

```php
<?php

require_once __DIR__ . '/vendor/autoload.php'; // Autoload files using Composer autoload
require_once 'dtos.php';

use dtos\FindTechnologies;
use Servicestack\JsonServiceClient;

$client = JsonServiceClient::create("https://techstacks.io");

$response = $client->send(new FindTechnologies(
    ids: [1,2,4,6],
    vendorName: "Google"));

print_r($response);
```

If any of the the remote APIs change their DTOs can be updated by right-clicking on `dtos.php` and clicking **Update ServiceStack Reference**:

![](/img/posts/php-typed-apis/phpstorm-update-servicestack-reference.webp)

### Install PHP ServiceStack Client

The only requirements for PHP apps to perform typed API Requests are the generated PHP DTOs and the generic `JsonServiceClient`
which can be installed in Composer projects with:

```bash
$ composer require servicestack/client
```

Or by adding the package to your `composer.json` then installing the dependencies:

```json
{
  "require": {
    "servicestack/client": "^1.0"
  }
}
```

## First class development experience

[PHP](https://www.php.net) is one of the worlds most popular programming languages thanks to its ease of use,
platform independence, large standard library, flexibility and fast development experience which sees it excels as
a popular language for web development and for development of popular CMS products like WordPress, Drupal and Joomla
thanks to its flexibility, embeddability and ease of customization.

To maximize the experience for calling ServiceStack APIs within these environments ServiceStack now supports PHP as a
1st class Add ServiceStack Reference supported language which gives PHP developers an end-to-end typed API for consuming
ServiceStack APIs, complete with IDE integration in [PhpStorm](https://www.jetbrains.com/phpstorm/) as well as
[built-in support in x dotnet tool](https://docs.servicestack.net/dotnet-tool#addupdate-servicestack-references)
to generate Typed and annotated PHP DTOs for a remote ServiceStack instance from a single command-line.

### Ideal idiomatic Typed Message-based API

To maximize the utility of PHP DTOs and enable richer tooling support and greater development experience, PHP DTOs are generated as
Typed [JsonSerializable](https://www.php.net/manual/en/class.jsonserializable.php) classes with
[promoted constructors](https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.constructor.promotion)
and annotated with [PHPDoc Types](https://phpstan.org/writing-php-code/phpdoc-types) - that's invaluable when scaling
large PHP code-bases and greatly improves discoverability of a remote API. DTOs are also enriched with interface markers
and Annotations which enables its optimal end-to-end typed API:

The PHP DTOs and `JsonServiceClient` library follow
[PHP naming conventions](https://infinum.com/handbook/wordpress/coding-standards/php-coding-standards/naming)
so they'll naturally fit into existing PHP code bases. Here's a sample of [techstacks.io](https://techstacks.io)
generated PHP DTOs containing string and int Enums, an example AutoQuery and a standard Request & Response DTO showcasing
the rich typing annotations and naming conventions used:

```php
enum TechnologyTier : string
{
    case ProgrammingLanguage = 'ProgrammingLanguage';
    case Client = 'Client';
    case Http = 'Http';
    case Server = 'Server';
    case Data = 'Data';
    case SoftwareInfrastructure = 'SoftwareInfrastructure';
    case OperatingSystem = 'OperatingSystem';
    case HardwareInfrastructure = 'HardwareInfrastructure';
    case ThirdPartyServices = 'ThirdPartyServices';
}

enum Frequency : int
{
    case Daily = 1;
    case Weekly = 7;
    case Monthly = 30;
    case Quarterly = 90;
}

// @Route("/technology/search")
#[Returns('QueryResponse')]
/**
 * @template QueryDb of Technology
 * @template QueryDb1 of TechnologyView
 */
class FindTechnologies extends QueryDb implements IReturn, IGet, JsonSerializable
{
    public function __construct(
        /** @var array<int>|null */
        public ?array $ids=null,
        /** @var string|null */
        public ?string $name=null,
        /** @var string|null */
        public ?string $vendorName=null,
        /** @var string|null */
        public ?string $nameContains=null,
        /** @var string|null */
        public ?string $vendorNameContains=null,
        /** @var string|null */
        public ?string $descriptionContains=null
    ) {
    }

    /** @throws Exception */
    public function fromMap($o): void {
        parent::fromMap($o);
        if (isset($o['ids'])) $this->ids = JsonConverters::fromArray('int', $o['ids']);
        if (isset($o['name'])) $this->name = $o['name'];
        if (isset($o['vendorName'])) $this->vendorName = $o['vendorName'];
        if (isset($o['nameContains'])) $this->nameContains = $o['nameContains'];
        if (isset($o['vendorNameContains'])) $this->vendorNameContains = $o['vendorNameContains'];
        if (isset($o['descriptionContains'])) $this->descriptionContains = $o['descriptionContains'];
    }
    
    /** @throws Exception */
    public function jsonSerialize(): mixed
    {
        $o = parent::jsonSerialize();
        if (isset($this->ids)) $o['ids'] = JsonConverters::toArray('int', $this->ids);
        if (isset($this->name)) $o['name'] = $this->name;
        if (isset($this->vendorName)) $o['vendorName'] = $this->vendorName;
        if (isset($this->nameContains)) $o['nameContains'] = $this->nameContains;
        if (isset($this->vendorNameContains)) $o['vendorNameContains'] = $this->vendorNameContains;
        if (isset($this->descriptionContains)) $o['descriptionContains'] = $this->descriptionContains;
        return empty($o) ? new class(){} : $o;
    }
    public function getTypeName(): string { return 'FindTechnologies'; }
    public function getMethod(): string { return 'GET'; }
    public function createResponse(): mixed { return QueryResponse::create(genericArgs:['TechnologyView']); }
}

// @Route("/orgs/{Id}", "DELETE")
class DeleteOrganization implements IReturnVoid, IDelete, JsonSerializable
{
    public function __construct(
        /** @var int */
        public int $id=0
    ) {
    }

    /** @throws Exception */
    public function fromMap($o): void {
        if (isset($o['id'])) $this->id = $o['id'];
    }
    
    /** @throws Exception */
    public function jsonSerialize(): mixed
    {
        $o = [];
        if (isset($this->id)) $o['id'] = $this->id;
        return empty($o) ? new class(){} : $o;
    }
    public function getTypeName(): string { return 'DeleteOrganization'; }
    public function getMethod(): string { return 'DELETE'; }
    public function createResponse(): void {}
}
```

The smart PHP `JsonServiceClient` available in the [servicestack/client](https://packagist.org/packages/servicestack/client)
packagist package enables the same productive, typed API development experience available in our other 1st-class supported
client platforms.

Using promoted constructors enables DTOs to be populated using a single constructor expression utilizing named parameters
which together with the generic `JsonServiceClient` enables end-to-end typed API Requests in a single LOC:

```php
use Servicestack\JsonServiceClient;
use dtos\Hello;

$client = new JsonServiceClient("https://test.servicestack.net");

/** @var HelloResponse $response */
$response = client->get(new Hello(name:"World"));
```

> The `HelloResponse` optional type hint doesn't change runtime behavior but enables static analysis tools and IDEs like PyCharm to provide rich intelli-sense and development time feedback.

For more usage examples and information about ServiceStack's PHP support checkout the
[PHP Add ServiceStack Reference](https://docs.servicestack.net/php-add-servicestack-reference) docs.