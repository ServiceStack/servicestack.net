---
title: Database-First Development Model
url: https://docs.servicestack.net/releases/v6_1#database-first
image: /img/whatsnew/v6.1/youtube-locode-intro.png
---

Using [AutoQuery's AutoGen](https://docs.servicestack.net/autoquery-autogen) enables the quickest way to modernize an existing database by dynamically creating Data Models & AutoQuery CRUD APIs from RDBMS table schemas at runtime.

Locode provides a highly functional UI out-of-the-box that doesn't rely on code-gen that allows you to only override the Custom UI or Custom API implementation when needed resulting in a significantly smaller code-base to maintain as reflected in the comparitive code-bases of a customized
Northwind Locode App vs the Northwind code-base of a popular RAD code-gen tool for .NET

<table>
  <thead>
    <tr>
      <th>Locode Northwind</th>
      <th>Radzen Northwind</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>~120 lines</strong> of C#</td>
      <td><strong>~4500 lines</strong> of C# (generated)</td>
    </tr>
    <tr>
      <td class="pr-2"><strong>29 lines</strong> custom Home Page</td>
      <td><strong>10k+ lines</strong> of Angular HTML/TS (generated)</td>
    </tr>
  </tbody>
</table>
