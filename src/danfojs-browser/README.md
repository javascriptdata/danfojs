
<div align="center">
  <img src="assets/logo.png"><br>
</div>

-----------------

## Danfojs: powerful javascript data analysis toolkit 
![Node.js CI](https://github.com/opensource9ja/danfojs/workflows/Node.js%20CI/badge.svg?branch=master)
[![](https://data.jsdelivr.com/v1/package/npm/danfojs/badge?style=rounded)](https://www.jsdelivr.com/package/npm/danfojs)
[![Coverage Status](https://coveralls.io/repos/github/opensource9ja/danfojs/badge.svg)](https://coveralls.io/github/opensource9ja/danfojs)
![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FDanfoJs) 
<span class="badge-patreon"><a href="https://www.patreon.com/bePatron?u=40496758" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>


## What is it?

**Danfo.js** is a javascript package that provides fast, flexible, and expressive data
structures designed to make working with "relational" or "labeled" data both
easy and intuitive. It is heavily inspired by [Pandas](https://pandas.pydata.org/pandas-docs/stable/) library, and provides a similar API. This means that users familiar with [Pandas](https://pandas.pydata.org/pandas-docs/stable/), can easily pick up danfo.js. 

## Main Features

  - Danfo.js is fast. It is built on Tensorflow.js, and supports tensors out of the box. This means you can [convert Danfo data structure](https://danfo.jsdata.org/api-reference/dataframe/dataframe.tensor) to Tensors.
  - Easy handling of [missing-data](https://danfo.jsdata.org/getting-started#missing-data) (represented as
    `NaN`) in floating point as well as non-floating point data
  - Size mutability: columns can be [inserted/deleted](https://danfo.jsdata.org/api-reference/dataframe#combining-comparing-joining-merging) from DataFrame
  - Automatic and explicit [alignment](https://danfo.jsdata.org/api-reference/dataframe#reindexing-selection-label-manipulation): objects can
    be explicitly aligned to a set of labels, or the user can simply
    ignore the labels and let `Series`, `DataFrame`, etc. automatically
    align the data for you in computations
  - Powerful, flexible [groupby](https://danfo.jsdata.org/api-reference/groupby) functionality to perform
    split-apply-combine operations on data sets, for both aggregating
    and transforming data
  - Make it easy to convert Arrays, JSONs, List or Objects, Tensors and 
    differently-indexed data structures
    into DataFrame objects
  - Intelligent label-based [slicing](https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.loc), [fancy indexing](https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.iloc), and [querying](https://danfo.jsdata.org/api-reference/dataframe/danfo.dataframe.query) of
    large data sets
  - Intuitive [merging](https://danfo.jsdata.org/api-reference/general-functions/danfo.merge) and [joining](https://danfo.jsdata.org/api-reference/general-functions/danfo.concat) data
    sets
  - Robust IO tools for loading data from [flat-files](https://danfo.jsdata.org/api-reference/input-output)
    (CSV, Json, Excel, Data package).
  - Powerful, flexible and intutive API for [plotting](https://danfo.jsdata.org/api-reference/plotting) DataFrames and Series interactively.
  - [Timeseries](https://danfo.jsdata.org/api-reference/series#accessors)-specific functionality: date range
    generation and date and time properties. 
  - Robust data preprocessing functions like [OneHotEncoders](https://danfo.jsdata.org/api-reference/general-functions/danfo.onehotencoder), [LabelEncoders](https://danfo.jsdata.org/api-reference/general-functions/danfo.labelencoder), and scalers like [StandardScaler](https://danfo.jsdata.org/api-reference/general-functions/danfo.standardscaler) and [MinMaxScaler](https://danfo.jsdata.org/api-reference/general-functions/danfo.minmaxscaler) are supported on DataFrame and Series



To use Danfo.js via script tags, copy and paste the CDN below to the body of your HTML file

```html
    <script src="https://cdn.jsdelivr.net/npm/danfojs@0.2.7/lib/bundle.min.js"></script> 
```
### Example Usage in the Client Side Frameworks like React, Angular, Vue.js, etc.

> If you want to use Danfo in frontend frameworks like React/Vue, read this [guide](https://danfo.jsdata.org/examples/using-danfojs-in-react)

TODO:

### Example Usage in the Browser

> See the example below in [Code Sandbox](https://codepen.io/risingodegua/pen/bGwPGMG)

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.plot.ly/plotly-1.2.0.min.js"></script> 
    <script src="https://cdn.jsdelivr.net/npm/danfojs@0.2.7/lib/bundle.min.js"></script> 

    <title>Document</title>
</head>

<body>

    <div id="div1"></div>
    <div id="div2"></div>
    <div id="div3"></div>

    <script>

        dfd.read_csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv")
            .then(df => {

                df['AAPL.Open'].plot("div1").box() //makes a box plot

                df.plot("div2").table() //display csv as table

                new_df = df.set_index({ key: "Date" }) //resets the index to Date column
                new_df.plot("div3").line({ columns: ["AAPL.Open", "AAPL.High"] })  //makes a timeseries plot

            }).catch(err => {
                console.log(err);
            })

    </script>
    
</body>

</html>
```

Output in Browser:

![](assets/browser-out.gif)

## How to install
Danfo.js is hosted on NPM, and can installed via package managers like npm and yarn

```sh
npm install danfojs
```

### Danfo-js in Node.js
To use Danfo.js in Node.js, you need to install the nodejs version (danfojs-node) via NPM/Yarn. See more information here. 
#### You can play with Danfo.js on Dnotebooks playground [here](https://playnotebook.jsdata.org/demo)

#### [See the Official Getting Started Guide](https://danfo.jsdata.org/getting-started)

## Documentation
The official documentation can be found [here](https://danfo.jsdata.org)

## Discussion and Development
Development discussions take place on our [issues](https://github.com/opensource9ja/danfojs/issues) tab. 

## Contributing to Danfo
All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome. A detailed overview on how to contribute can be found in the [contributing guide](https://danfo.jsdata.org/contributing-guide).

#### Licence [MIT](https://github.com/opensource9ja/danfojs/blob/master/LICENCE)

#### Created by [Rising Odegua](https://github.com/risenW) and [Stephen Oni](https://github.com/steveoni)

<a href="https://www.producthunt.com/posts/danfo-js?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-danfo-js" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=233871&theme=light" alt="Danfo.js - Open Source JavaScript library for manipulating data. | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>
