
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

## New update
  - Allow to add or edit column by a number or string
  - Allow to shift left or right for a Series
  - Support rolling with sum, mean, max, min, any (any value is True), all (all values is True)
  - Example:
  ```javascript
    let data = [[1, 1, 2, 2], [1, 5, 6, 8], [20, 30, 40, 60], [20, 89, 78, 70]];
    let cols = ["A", "B", "C", "D"];
    let df:any = new dfd.DataFrame(data, { columns: cols });

    df.addColumn("E", 5, {inplace: true})
    df.print()

    df.addColumn("F", df['A'].shift(2), {inplace: true})
    df.print()

    df.addColumn("K", df['A'].rolling(3).sum(), {inplace: true})
    df.print()

    let grouped = df.groupby('A').agg({
        B: 'last',
        C: 'first',
        D: 'mean',
        E: 'sum'
    })
    grouped.print()
  ```

## Main Features

  - Danfo.js is fast and supports Tensorflow.js tensors out of the box. This means you can [convert Danfo data structure](https://danfo.jsdata.org/api-reference/dataframe/dataframe.tensor) to Tensors.
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
    (CSV, Json, Excel).
  - Powerful, flexible and intutive API for [plotting](https://danfo.jsdata.org/api-reference/plotting) DataFrames and Series interactively.
  - [Timeseries](https://danfo.jsdata.org/api-reference/series#accessors)-specific functionality: date range
    generation and date and time properties. 
  - Robust data preprocessing functions like [OneHotEncoders](https://danfo.jsdata.org/api-reference/general-functions/danfo.onehotencoder), [LabelEncoders](https://danfo.jsdata.org/api-reference/general-functions/danfo.labelencoder), and scalers like [StandardScaler](https://danfo.jsdata.org/api-reference/general-functions/danfo.standardscaler) and [MinMaxScaler](https://danfo.jsdata.org/api-reference/general-functions/danfo.minmaxscaler) are supported on DataFrame and Series


## Installation
There are three ways to install and use Danfo.js in your application
* For Nodejs applications, you can install the [__danfojs-node__]() version via package managers like yarn and/or npm:

```bash
npm install danfojs-node

or

yarn add danfojs-node
```
For client-side applications built with frameworks like React, Vue, Next.js, etc, you can install the [__danfojs__]() version:

```bash
npm install danfojs

or

yarn add danfojs
```

For use directly in HTML files, you can add the latest script tag from [JsDelivr](https://www.jsdelivr.com/package/npm/danfojs) to your HTML file:

```html
    <script src="https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.js"></script>
```
See all available versions [here](https://www.jsdelivr.com/package/npm/danfojs)

### Quick Examples
* [Danfojs with HTML and vanilla JavaScript on CodePen](https://codepen.io/risingodegua/pen/bGpwyYW)
* [Danfojs with React on Code Sandbox](https://codesandbox.io/s/using-danfojs-in-react-dwpv54?file=/src/App.js)
* [Danfojs on ObservableHq](https://observablehq.com/@risingodegua/using-danfojs-on-observablehq)
* [Danfojs in Nodejs on Replit](https://replit.com/@RisingOdegua/Danfojs-in-Nodejs)

### Example Usage in the Browser
```html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.js"></script>

    <title>Document</title>
  </head>

  <body>
    <div id="div1"></div>
    <div id="div2"></div>
    <div id="div3"></div>

    <script>

      dfd.readCSV("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv")
          .then(df => {

              df['AAPL.Open'].plot("div1").box() //makes a box plot

              df.plot("div2").table() //display csv as table

              new_df = df.setIndex({ column: "Date", drop: true }); //resets the index to Date column
              new_df.head().print() //
              new_df.plot("div3").line({
                  config: {
                      columns: ["AAPL.Open", "AAPL.High"]
                  }
              })  //makes a timeseries plot

          }).catch(err => {
              console.log(err);
          })
    </script>
  </body>
</html>

```

Output in Browser:

![](assets/browser-out.gif)

### Example usage in Nodejs

```javascript
const dfd = require("danfojs-node");

const file_url =
  "https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/stuff/titanic.csv";
dfd
  .readCSV(file_url)
  .then((df) => {
    //prints the first five columns
    df.head().print();

    // Calculate descriptive statistics for all numerical columns
    df.describe().print();

    //prints the shape of the data
    console.log(df.shape);

    //prints all column names
    console.log(df.columns);

    // //prints the inferred dtypes of each column
    df.ctypes.print();

    //selecting a column by subsetting
    df["Name"].print();

    //drop columns by names
    let cols_2_remove = ["Age", "Pclass"];
    let df_drop = df.drop({ columns: cols_2_remove, axis: 1 });
    df_drop.print();

    //select columns by dtypes
    let str_cols = df_drop.selectDtypes(["string"]);
    let num_cols = df_drop.selectDtypes(["int32", "float32"]);
    str_cols.print();
    num_cols.print();

    //add new column to Dataframe

    let new_vals = df["Fare"].round(1);
    df_drop.addColumn("fare_round", new_vals, { inplace: true });
    df_drop.print();

    df_drop["fare_round"].round(2).print(5);

    //prints the number of occurence each value in the column
    df_drop["Survived"].valueCounts().print();

    //print the last ten elementa of a DataFrame
    df_drop.tail(10).print();

    //prints the number of missing values in a DataFrame
    df_drop.isNa().sum().print();
  })
  .catch((err) => {
    console.log(err);
  });

```
Output in Node Console:

![](assets/node-rec.gif)
## Notebook support
* VsCode nodejs notebook extension now supports Danfo.js. See guide [here](https://marketplace.visualstudio.com/items?itemName=donjayamanne.typescript-notebook)
* ObservableHQ Notebooks. See example notebook [here](https://observablehq.com/@risingodegua/using-danfojs-on-observablehq)

#### [See the Official Getting Started Guide](https://danfo.jsdata.org/getting-started)

## Documentation
The official documentation can be found [here](https://danfo.jsdata.org)

## Danfo.js Official Book

We published a book titled "Building Data Driven Applications with Danfo.js". Read more about it [here](https://danfo.jsdata.org/building-data-driven-applications-with-danfo.js-book)

## Discussion and Development
Development discussions take place [here](https://github.com/opensource9ja/danfojs/discussions). 

## Contributing to Danfo
All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome. A detailed overview on how to contribute can be found in the [contributing guide](https://danfo.jsdata.org/contributing-guide).

#### Licence [MIT](https://github.com/opensource9ja/danfojs/blob/master/LICENCE)

#### Created by [Rising Odegua](https://github.com/risenW) and [Stephen Oni](https://github.com/steveoni)

<a href="https://www.producthunt.com/posts/danfo-js?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-danfo-js" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=233871&theme=light" alt="Danfo.js - Open Source JavaScript library for manipulating data. | Product Hunt Embed" style="width: 250px; height: 54px;" width="250px" height="54px" /></a>
