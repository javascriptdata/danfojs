
<div align="center">
  <img src="logo.png"><br>
</div>

-----------------

## danfojs: powerful javascript data analysis toolkit 

## What is it?

**danfojs** is a javascript package that provides fast, flexible, and expressive data
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
danfojs is hosted on NPM, and can installed via package managers like npm and yarn

```sh
npm install danfojs
```

//Example usage in Nodejs

```javascript
 dfd.read_csv("https://raw.githubusercontent.com/risenW/medium_tutorial_notebooks/master/train.csv")
            .then(df => {
                df.describe().print()

          
```

To install via script tags, copy and paste the CDN below to your HTML file

## Example Usage in the Browser

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="main.js"></script>
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

                df['Product_Weight'].plot("some_div", { kind: "histogram" })
                df.plot("alldiv", { x: "Product_Price", y: "Product_Shelf_Visibility", kind: "scatter", mode: 'markers' })


            }).catch(err => {
                console.log(err);
            })
    </script>
</body>

</html>
```


See the [full installation instructions](https://pandas.pydata.org/pandas-docs/stable/install.html#dependencies) for minimum supported versions of required, recommended and optional dependencies.

## Installation from sources
To install pandas from source you need Cython in addition to the normal
dependencies above. Cython can be installed from pypi:

```sh
pip install cython
```

In the `pandas` directory (same one where you found this file after
cloning the git repo), execute:

```sh
python setup.py install
```

or for installing in [development mode](https://pip.pypa.io/en/latest/reference/pip_install.html#editable-installs):


```sh
python -m pip install -e . --no-build-isolation --no-use-pep517
```

If you have `make`, you can also use `make develop` to run the same command.

or alternatively

```sh
python setup.py develop
```

See the full instructions for [installing from source](https://pandas.pydata.org/pandas-docs/stable/install.html#installing-from-source).

## License
[BSD 3](LICENSE)

## Documentation
The official documentation is hosted on PyData.org: https://pandas.pydata.org/pandas-docs/stable

## Background
Work on ``pandas`` started at AQR (a quantitative hedge fund) in 2008 and
has been under active development since then.

## Getting Help

For usage questions, the best place to go to is [StackOverflow](https://stackoverflow.com/questions/tagged/pandas).
Further, general questions and discussions can also take place on the [pydata mailing list](https://groups.google.com/forum/?fromgroups#!forum/pydata).

## Discussion and Development
Most development discussions take place on github in this repo. Further, the [pandas-dev mailing list](https://mail.python.org/mailman/listinfo/pandas-dev) can also be used for specialized discussions or design issues, and a [Gitter channel](https://gitter.im/pydata/pandas) is available for quick development related questions.

## Contributing to pandas [![Open Source Helpers](https://www.codetriage.com/pandas-dev/pandas/badges/users.svg)](https://www.codetriage.com/pandas-dev/pandas)

All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome.

A detailed overview on how to contribute can be found in the **[contributing guide](https://pandas.pydata.org/docs/dev/development/contributing.html)**. There is also an [overview](.github/CONTRIBUTING.md) on GitHub.

If you are simply looking to start working with the pandas codebase, navigate to the [GitHub "issues" tab](https://github.com/pandas-dev/pandas/issues) and start looking through interesting issues. There are a number of issues listed under [Docs](https://github.com/pandas-dev/pandas/issues?labels=Docs&sort=updated&state=open) and [good first issue](https://github.com/pandas-dev/pandas/issues?labels=good+first+issue&sort=updated&state=open) where you could start out.

You can also triage issues which may include reproducing bug reports, or asking for vital information such as version numbers or reproduction instructions. If you would like to start triaging issues, one easy way to get started is to [subscribe to pandas on CodeTriage](https://www.codetriage.com/pandas-dev/pandas).

Or maybe through using pandas you have an idea of your own or are looking for something in the documentation and thinking ‘this can be improved’...you can do something about it!

Feel free to ask questions on the [mailing list](https://groups.google.com/forum/?fromgroups#!forum/pydata) or on [Gitter](https://gitter.im/pydata/pandas).

As contributors and maintainers to this project, you are expected to abide by pandas' code of conduct. More information can be found at: [Contributor Code of Conduct](https://github.com/pandas-dev/pandas/blob/master/.github/CODE_OF_CONDUCT.md)
Javascript version of Pandas

![Node.js CI](https://github.com/opensource9ja/danfojs/workflows/Node.js%20CI/badge.svg?branch=master)
