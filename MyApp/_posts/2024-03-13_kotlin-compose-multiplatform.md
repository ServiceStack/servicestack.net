---
title: Kotlin Compose Multiplatform with end-to-end typed Kotlin & C# APIs
summary: Explore the exciting new JetBrains Technology for creating native Mobile, Desktop and Web Apps
tags: [kotlin,ios,android]
image: /img/posts/kotlin-compose-multiplatform/compose-multiplatform.webp
author: Demis Bellot
---

The last few years of neglect of Xamarin has slid it into irrelevance, removing itself from consideration in the already 
shortlist of viable development options for creating native multi-platform iOS, Android and Desktop Apps, which leaves
us just Flutter and React Native as the only viable options. 

Thanks to the vast language ecosystem covered by [Add ServiceStack Reference](https://docs.servicestack.net/add-servicestack-reference),
which ever technology you end up choosing to develop native Mobile and Desktop Apps with,
you'll always be able to develop with the productivity and type safety benefits of end-to-end typed APIs in your preferred language,
whether it's [TypeScript](https://docs.servicestack.net/typescript-add-servicestack-reference) or
[JavaScript](https://docs.servicestack.net/javascript-add-servicestack-reference) for React Native,
[Dart](https://docs.servicestack.net/dart-add-servicestack-reference) for Flutter,
[Java](https://docs.servicestack.net/java-add-servicestack-reference) or [Kotlin](https://docs.servicestack.net/kotlin-add-servicestack-reference) for Android,
or [Swift](https://docs.servicestack.net/swift-add-servicestack-reference) for iOS.

Fortunately JetBrains has stepped in to fill the void with Compose Multiplatform offering a 
modern alternative for creating native Mobile, Desktop & Web Apps which can also leverage
[Kotlin ServiceStack Reference](https://docs.servicestack.net/kotlin-add-servicestack-reference) for end-to-end typed APIs.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) builds on
[Jetpack Compose](https://developer.android.com/jetpack/compose) - Google's modern toolkit for building 
native Android UIs bringing it to more platforms, including Windows, macOS and Linux Desktops, 
Web UIs with [Kotlin Wasm](https://kotlinlang.org/docs/wasm-overview.html)
and on iOS with [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html).

We'll look at the latest [Compose Multiplatform v1.6 Release](https://blog.jetbrains.com/kotlin/2024/02/compose-multiplatform-1-6-0-release/)
and use it to build a cross-platform Desktop App integrated with a .NET API backend utilizing 
[Kotlin ServiceStack Reference](https://docs.servicestack.net/kotlin-add-servicestack-reference) to generate Kotlin DTOs
that can be used with the generic ServiceStack Java `JsonServiceClient` to enable its end-to-end typed API
integration.

### JVM Platform Required

Whilst Compose Multiplatform supports both JVM and non-JVM platforms, targeting a non JVM platform is very limited
as you won't be able to reference and use any Java packages like ServiceStack's Java Client library in `net.servicestack:client`
which is required for this example utilizing [Kotlin ServiceStack Reference](https://docs.servicestack.net/kotlin-add-servicestack-reference)
typed Kotlin DTOs.

## Compose Multiplatform iOS & Android Apps

:::youtube r6T3B7o1GYE
JetBrains Compose Multiplatform iOS & Android Apps
:::

The quickest way to a working Compose Multiplatform App integrated with a .NET API backend is to create a new project 
from the Compose Desktop template:

<div class="not-prose relative bg-white dark:bg-black py-4">
    <div class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Create a new Compose Desktop App</p>
        <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500"> 
            Create a new Kotlin Multiplatform App with your preferred project name:
        </p>
    </div>
    <compose-template repo="NetCoreTemplates/kmp-desktop" hide="demo"></compose-template>
</div>

Or install from the command-line with the [x dotnet tool](https://docs.servicestack.net/dotnet-tool):

:::sh
x new kmp-desktop MyApp
:::

### Install JetBrains IDE

As a JetBrains technology, you're spoilt for choice for which IDE to use.

#### Android Studio

If you're primarily developing for Android, Android Studio is likely the the best option, which you can setup by following their 
[Getting Started with Android Studio](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-setup.html) guide. 

#### JetBrains Fleet

Otherwise if you're primarily developing a Desktop App it's recommended to use [Fleet](https://www.jetbrains.com/fleet/) - JetBrains 
alternative to VS Code as a lightweight IDE for Kotlin Multiplatform Development. 
It's the preferred IDE when developing against a .NET API as you can develop both Kotlin front-end UI and backend .NET APIs from a single IDE.

To get setup with Fleet, follow the [Getting Started with JetBrains Fleet](https://www.jetbrains.com/help/kotlin-multiplatform-dev/fleet.html).

### Open Project with Fleet

Once you've installed Fleet, you can open your Desktop App project by opening the Folder in the Fleet IDE, or like VS Code
you can launch it to open your Project's folder from the command-line with:

:::sh
fleet MyApp
:::

### Setup Fleet

When first opening fleet you'll start with an empty canvas. I'd recommend adding the **Files** tool window on the left panel
to manage the Kotlin UI and the **Solution** tool window on the bottom left panel to manage the .NET API backend.

### Run .NET API and Kotlin Desktop App

Once setup, you can run both the Desktop App and the .NET API backend with from the Run Dialog with the `Ctrl+R` keyboard shortcut, 
or by clicking on the play button icon in the top menu bar:

![](/img/posts/kotlin-compose-multiplatform/fleet-run.webp)

You'll want to run the .NET API backend first by selecting your Project Name which should launch your browser at `https://localhost:5001`, 
then launch the Desktop App by selecting the **composeApp [Desktop]** configuration which should launch a working Desktop App
that calls your .NET API on each keystroke to search for matching files in your project:

![](/img/posts/kotlin-compose-multiplatform/search-files-app.webp)

The majority of the UI is maintained in
[/commonMain/kotlin/App.kt](https://github.com/NetCoreTemplates/kmp-desktop/blob/main/kmp/composeApp/src/commonMain/kotlin/App.kt)
created using Jetpack Compose's declarative Kotlin UI.

### Update Kotlin DTOs

The typed Kotlin DTOs for your .NET APIs is generated in [dtos.kt](https://github.com/NetCoreTemplates/kmp-desktop/blob/main/kmp/composeApp/src/commonMain/kotlin/dtos.kt).
Which can be regenerated by running **Update DTOs** in the Run Dialog.

Alternatively they can also be regenerated by running the `dtos` npm script from the command-line in your .NET Host project:

:::sh
npm run dtos
:::

#### Android Studio

If you're using Android Studio, you can also install the [ServiceStack Plugin](https://plugins.jetbrains.com/plugin/7749-servicestack) from
the JetBrains Marketplace:

![](/img/posts/kotlin-compose-multiplatform/android-studio-plugins.webp)

Which provides a **Add ServiceStack Reference** UI on the Context Menu, by right-clicking the folder where you want the DTOs generated:

![](/img/posts/kotlin-compose-multiplatform/add-servicestack-reference-dialog.webp)

Then to update just right-click the `dtos.kt` and click **Update ServiceStack Reference** on the context menu: 

![](/img/posts/kotlin-compose-multiplatform/update-servicestack-reference-dialog.webp)

### Command Line

For any other Text Editors or IDEs a Kotlin ServiceStack Reference can also be added from the command-line using the 
[x dotnet tool](https://docs.servicestack.net/dotnet-tool) by specifying the BaseUrl where the ServiceStack APIs are hosted, e.g:

:::sh
x kotlin https://localhost:5001
:::

To update and regenerate all Kotlin DTOs within a folder, run:  

:::sh
x kotlin
:::

## Create a new Kotlin Multiplatform App from Scratch

For a customized Compose Multiplatform App, you can create a new App with [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com)
with just the options you need:

[![](/img/posts/kotlin-compose-multiplatform/kmp-wizard.webp)](https://kmp.jetbrains.com)

Which you can download in an empty Web Project:

:::sh
x new web MyApp
:::

Then open the folder with both the Kotlin Multiplatform and .NET Web App in fleet:

:::sh
fleet MyApp
:::
