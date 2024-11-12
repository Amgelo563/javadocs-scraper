<p align="center">
  <img src="https://github.com/Amgelo563/javadocs-scraper/blob/main/assets/javadocs-scraper.png?raw=true" alt="javadocs-scraper logo" width="250"/>
</p>

# `📚` javadocs-scraper

A TypeScript library to scrape Java objects information from a Javadocs website.

![Build Status](https://img.shields.io/github/actions/workflow/status/Amgelo563/javadocs-scraper/build.yml?style=for-the-badge&logo=github)
[![Latest Release](https://img.shields.io/github/v/release/Amgelo563/javadocs-scraper?style=for-the-badge&logo=nodedotjs&color=5FA04E)](https://github.com/Amgelo563/javadocs-scraper/releases/latest)
[![View on Typedoc](https://img.shields.io/badge/View%20on-Typedoc-9600ff?style=for-the-badge&logo=gitbook&logoColor=9600ff)](https://amgelo563.github.io/javadocs-scraper//) 
[![Built with Typescript](https://img.shields.io/badge/Built%20with-Typescript-3176C6?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)

Specifically, it scrapes data (name, description, url, etc) about, and links together:

- [Packages](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/package/PackageData.ts)
- [Classes](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/class/ClassData.ts)
- [Interfaces](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/interface/InterfaceData.ts)
- [Object Type Parameters (Object Generics)](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/object/ObjectTypeParameterData.ts), on classes and interfaces
- [Enums](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/enum/EnumData.ts)
    - [Enum Constants](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/enum/constant/EnumConstantData.ts)
- [Annotations](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/annotation/AnnotationData.ts)
    - [Annotation Elements](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/annotation/element/AnnotationElementData.ts)
- [Fields](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/field/FieldData.ts)
- [Methods](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/method/MethodData.ts)
    - [Return Type](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/method/return/MethodReturnData.ts)
    - [Parameters](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/parameter/ParameterData.ts)
    - [Type Parameters (Method Generics)](https://github.com/Amgelo563/javadocs-scraper/blob/main/src/entities/method/type/MethodTypeParameterData.ts)

Some extra data is also calculated post scraping, like method and field inheritance.

> [!CAUTION]
> Tested with Javadocs generated from Java 7 to Java 21. I cannot guarantee this will work with older or newer versions.

#### Contents
- [`📦` Installation and Usage](#-installation-and-usage)
- [`🔒` Warnings](#-warnings)
- [`🔍` Specifics](#-specifics)

## `📦` Installation and Usage

1. Install with your preferred package manager:
```bash
npm install javadocs-scraper
yarn add javadocs-scraper
pnpm add javadocs-scraper
```

2. Instantiate a `Scraper`:

```ts
import { Scraper } from 'javadocs-scraper';

const scraper = Scraper.fromURL('https://...');
```

> [!NOTE]
> This package uses constructor dependency injection for every class.
>
> You can also instantiate `Scraper` with the `new` keyword, but you'll need to specify every dependency manually.
>
> The easier way is to use the `Scraper.fromURL()` method, which will use the default implementations.

> [!TIP]
> Alternatively, you can provide your own `Fetcher` to fetch data from the Javadocs:
> ```ts
> import type { Fetcher } from 'javadocs-scraper';
> 
> class MyFetcher implements Fetcher {
>   /** ... */
> }
> 
> const myFetcher = new MyFetcher('https://...');
> const scraper = Scraper.with({ fetcher: myFetcher });
> ```

3. Use the `Scraper` to scrape information:

```ts
const javadocs: Javadocs = await scraper.scrape();

/** for example */
const myInterface = javadocs.getInterface('org.example.Interface');
```

> [!TIP]
> The `Javadocs` object uses discord.js' `Collection` class to store all the scraped data. This is an extension of `Map` with utility methods, like `find()`, `reduce()`, etc.
> 
> These collections are also typed as **mutable**, so any modification will be reflected in the backing `Javadocs`. This is by design, since the library no longer uses this object once it's given to you, and doesn't care what you then do with it.
> 
> Check the [discord.js guide](https://discordjs.guide/additional-info/collections.html) or the [`Collection` docs](https://discord.js.org/docs/packages/collection/main/Collection:Class) for more info.

## `🔒` Warnings

- Make sure to not spam a Javadocs website. It's your responsibility to not abuse the library, and implement appropiate methods to avoid abuse, like a cache.
- The `scrape()` method **will** take a while to scrape the entire website. Make sure to only run it when necessary, ideally only once in the entire program's lifecycle.

## `🔍` Specifics

There are distinct types of objects that hold the library together:

- A `Fetcher`¹, which makes requests to the Javadocs website.
- `Entities`², which represent a scraped object.
- `QueryStrategies`¹, which query the website through cheerio. Needed since HTML class and ids change between Javadoc versions.
- `Scrapers`¹, which scrape information from a given URL or cheerio object, to a partial object.
- `Partials`², which represent a partially scraped object, that is, an object without circular references to other objects.
- A `ScraperCache`, which caches partial objects in memory.
- `Patchers`¹, which patch partials to make them full entities, by linking them together.
- `Javadocs`, which is the final result of the scraping process.

_¹ - Replaceable via constructor injection._

_² - Only a type, not available in runtime._

The scraping process ocurs in the following steps:

1. A `QueryStrategy` is chosen by the `QueryStrategyFactory`.
2. The `RootScraper` iterates through every package in the Javadocs root.
3. For every package, it's fetched, and passed to the `PackageScraper`.
4. The `PackageScraper` iterates through every class, interface, enum and annotation in the package and passes them to the appropriate `Scraper`.
5. Each scraper creates a partial object, and caches it in the `ScraperCache`.
6. Once everything is done, the `Scraper` uses the `Patchers` to patch the partial objects together, by passing the cache to each patcher.
7. The `Scraper` returns the patched objects, in a `Javadocs` object.

> [!TIP]
> You can provide your own `QueryStrategyFactory` to change the way the `QueryStrategy` is chosen.
> ```ts
> import { OnlineFetcher } from 'javadocs-scraper';
> 
> const myFetcher = new OnlineFetcher('https://...');
> const factory = new MyQueryStrategyFactory();
> const scraper = Scraper.with({
>   fetcher: myFetcher,
>   queryStrategyFactory: factory
> });
> ```
