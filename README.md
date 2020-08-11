
<div align="center">
  <img src="logo.png"><br>
</div>

-----------------

## danfojs: powerful javascript data analysis toolkit 
![Node.js CI](https://github.com/opensource9ja/danfojs/workflows/Node.js%20CI/badge.svg?branch=master)
[![](https://data.jsdelivr.com/v1/package/npm/danfojs/badge?style=rounded)](https://www.jsdelivr.com/package/npm/danfojs)
![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FDanfoJs) 


## What is it?

**danfo.js** is a javascript package that provides fast, flexible, and expressive data
structures designed to make working with "relational" or "labeled" data both
easy and intuitive. It is heavily inspired by [Pandas](https://pandas.pydata.org/pandas-docs/stable/) library, and provides a similar API. This means that users familiar with [Pandas](https://pandas.pydata.org/pandas-docs/stable/), can easily pick up danfo.js. 

## Main Features

  - Easy handling of [missing-data](https://jsdata.gitbook.io/danfojs/api-reference/dataframe#missing-data-handling) (represented as
    `NaN`) in floating point as well as non-floating point data
  - Size mutability: columns can be [inserted/deleted](https://jsdata.gitbook.io/danfojs/api-reference/dataframe#indexing-iteration) from DataFrame
  - Automatic and explicit [alignment](https://jsdata.gitbook.io/danfojs/api-reference/dataframe#reindexing-selection-label-manipulation): objects can
    be explicitly aligned to a set of labels, or the user can simply
    ignore the labels and let `Series`, `DataFrame`, etc. automatically
    align the data for you in computations
  - Powerful, flexible [groupby](https://jsdata.gitbook.io/danfojs/api-reference/dataframe/danfo.dataframe.groupby) functionality to perform
    split-apply-combine operations on data sets, for both aggregating
    and transforming data
  - Make it easy to convert Arrays, JSONs, List or Objects, Tensors and 
    differently-indexed data structures
    into DataFrame objects
  - Intelligent label-based [slicing](https://jsdata.gitbook.io/danfojs/api-reference/dataframe/danfo.dataframe.loc), [fancy indexing](https://jsdata.gitbook.io/danfojs/api-reference/dataframe/danfo.dataframe.iloc), and [querying](https://jsdata.gitbook.io/danfojs/api-reference/dataframe/danfo.dataframe.query) of
    large data sets
  - Intuitive [merging](https://jsdata.gitbook.io/danfojs/api-reference/merge-and-joins/danfo.merge) and [joining](https://jsdata.gitbook.io/danfojs/api-reference/merge-and-joins/danfo.concat) data
    sets
  - Robust IO tools for loading data from [flat-files](https://jsdata.gitbook.io/danfojs/api-reference/input-output)
    (CSV and delimited) and JSON data format.
  - [Timeseries](https://jsdata.gitbook.io/danfojs/api-reference/series#accessors)-specific functionality: date range
    generation and date and time properties. 


## How to install
danfo.js is hosted on NPM, and can installed via package managers like npm and yarn

```sh
npm install danfojs-node
```

### Example usage in Nodejs

```javascript

const dfd = require("danfojs-node")


dfd.read_csv("https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/stuff/titanic.csv")
  .then(df => {
    //prints the first five columns
    df.head().print()

    //Calculate descriptive statistics for all numerical columns
    df.describe().print()

    //prints the shape of the data
    console.log(df.shape);

    //prints all column names
    console.log(df.column_names);

    //prints the inferred dtypes of each column
    df.ctypes.print()

    //selecting a column by subsettiing
    df['Name'].print()

    //drop columns by names
    cols_2_remove = ['Age', 'Pclass']
    df_drop = df.drop({ columns: cols_2_remove, axis: 1 })
    df_drop.print()


    //select columns by dtypes
    let str_cols = df_drop.select_dtypes(["string"])
    let num_cols = df_drop.select_dtypes(["int32", "float32"])
    str_cols.print()
    num_cols.print()


    //add new column to Dataframe
    let new_vals = df['Fare'].round().values
    df_drop.addColumn({ column: "fare_round", value:  new_vals})
    df_drop.print()

    df_drop['fare_round'].print(5)

    //prints the number of occurence each value in the column
    df_drop['Survived'].value_counts().print()

    //print the last ten elementa of a DataFrame
    df_drop.tail(10).print()

    //prints the number of missing values in a DataFrame
    df_drop.isna().sum().print()

  }).catch(err => {
    console.log(err);
  })

```

To use danfo.js via script tags, copy and paste the CDN below to your HTML file

```html
  <script src="https://cdn.jsdelivr.net/npm/danfojs@0.0.13/dist/index.min.js"></script>
```

### Example Usage in the Browser

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/danfojs@0.0.13/dist/index.min.js"></script>
    <title>Document</title>
</head>

<body>

    <div id="some_div"></div>
    <div id="alldiv"></div>
    <script>

        dfd.read_csv("https://raw.githubusercontent.com/risenW/medium_tutorial_notebooks/master/train.csv")
            .then(df => {
                df.describe().print()

                //prints in console
                //  Shape: (5,5) 

                // ╔════════╤═══════════════════╤═══════════════════╤═══════════════════╤═══════════════════╤═══════════════════╗
                // ║        │ Product_Weight    │ Product_Shelf...  │ Product_Price     │ Product_Super...  │ Supermarket_O...  ║
                // ╟────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
                // ║ count  │ 4188              │ 4990              │ 4990              │ 4990              │ 4990              ║
                // ╟────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
                // ║ mean   │ 12.908838         │ 0.066916          │ 391.803772        │ 6103.52002        │ 2004.783447       ║
                // ╟────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
                // ║ std    │ NaN               │ 0.053058          │ 119.378259        │ 4447.333835       │ 8.283151          ║
                // ╟────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
                // ║ min    │ 4.555             │ 0                 │ 78.730003         │ 83.230003         │ 1992              ║
                // ╟────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────╢
                // ║ median │ NaN               │ 0.053564          │ 393.86            │ 5374.675          │ 2006              ║
                // ╚════════╧═══════════════════╧═══════════════════╧═══════════════════╧═══════════════════╧═══════════════════╝

                var layout = {
                    title: 'A sample plot',
                    xaxis: {
                        title: 'X',
                    },
                    yaxis: {
                        title: 'Y',
                    }
                };

                //Displays plot in the specified div
                df['Product_Weight'].plot("some_div", { kind: "histogram" })
                df.plot("alldiv", { x: "Product_Price", y: "Product_Shelf_Visibility", kind: "scatter", mode: 'markers' })


            }).catch(err => {
                console.log(err);
            })
    </script>
</body>

</html>
```

## Installation from sources
To install danfo in [development mode], clone the repo:

```sh
git clone https://github.com/opensource9ja/danfojs
```

cd into danfojs folder and run:

```sh
npm install
```

## Documentation
The official documentation can be found [here](https://jsdata.gitbook.io/danfojs/)

## Discussion and Development
Most development discussions take place on github in this repo. Feel free to use the issues tab. 

## Contributing to Danfo
All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome. A detailed overview on how to contribute can be found in the [contributing guide](https://jsdata.gitbook.io/danfojs/contributing-guide). As contributors and maintainers to this project, you are expected to abide by danfo' code of conduct. More information can be found at: [Contributor Code of Conduct](https://github.com/pandas-dev/pandas/blob/master/.github/CODE_OF_CONDUCT.md) Javascript version of Pandas

#### Licence [MIT](https://github.com/opensource9ja/danfojs/blob/master/LICENCE)

#### Logo Design By [Seyi Oniyitan](https://twitter.com/seyioniyitan)
