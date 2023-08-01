---
title: JSON Lines Data Format
url: https://docs.servicestack.net/releases/v6_10#json-lines-data-format
image: /img/whatsnew/v6.10/jsonl.png
order: 4
---

JSON Lines is an efficient JSON data format parseable by streaming parsers and text processing tools like Unix 
shell pipelines, whose streamable properties is making it a popular data format for maintaining large datasets 
like the large AI datasets maintained on [huggingface.co](https://huggingface.co) that's now accessible on 
[Auto HTML API pages](https://docs.servicestack.net/auto-html-api).

The JSON Lines data format behaves the same way as the CSV format where it will automatically serialize the 
first IEnumerable property, including for all AutoQuery APIs which now benefit from a streamable JSON data format.