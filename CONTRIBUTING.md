# Contributing Guide

### Contributing to danfojs

**Table of contents:**

* **TL:DR**
* Where to start?
* Working with the code
  * Version control, Git, and GitHub
  * Getting started with Git
  * Forking
  * Creating a development environment
* Documentation Guidelines
* Writing tests
  * Using mocha
  * Running the test suite
* Contributing your changes to danfojs
  * Committing your code
  * Pushing your changes
  * Review your code and finally, make the pull request
* Danfojs internal (Brief)

## TL:DR

All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome.

For contributors familiar with open-source, below is a quick guide to setting up danfojs locally.

```
git clone https://github.com/javascriptdata/danfojs.git
cd danfojs
git checkout -b <your-branch-name>
```

There are three main folders in the `src` folder, **danfojs-base**, **danfojs-browser,** and **danfojs-node**.&#x20;

The **danfojs-base** folder holds all shared classes, modules, and functions used by both danfojs-browser and danfojs-node. So features or bug fixes that work the same way in both versions will generally be done in the **danfojs-base** folder.&#x20;

## Where to start?

For first-time contributors, you can find pending issues on the GitHub “issues” page. There are a number of issues listed and "good first issue" where you could start out. Once you’ve found an interesting issue, and have an improvement in mind, next thing is to set up your development environment.

## Working with the code

If you have an issue you want to fix, an enhancement to add, or documentation to improve, you need to learn how to work with GitHub and the Danfojs code base.

### **Version control, Git, and GitHub**

Danfojs code is hosted on GitHub. To contribute you will need to sign up for a free GitHub account. We use Git for version control to allow many people to work together on this project.

Some great resources for learning Git:

* Official [GitHub pages](http://help.github.com).

### **Getting started with Git**

Find [Instructions](http://help.github.com/set-up-git-redirect) for installing git, setting up your SSH key, and configuring git. These steps need to be completed before you can work seamlessly between your local repository and GitHub.

## **Forking the Danfojs repo**

You will need your own fork to work on the code. Go to the danfojs [project page](https://github.com/opensource9ja/danfojs) and hit the Fork button.

Next, you will clone your fork to your local machine:

```
git clone https://github.com/javascriptdata/danfojs.git
cd danfojs
```

This creates the directory danfojs and connects your repository to the upstream (main project) repository.

Some Javascript features are supported both in the browser and node environment, and it is recommended to add features in the **danfojs-base** folder.&#x20;

For features that work differently or only in a specific environment, you can add them in the corresponding danfojs-node or danfojs-browser folder.&#x20;



## **Creating a development environment**

To test out code changes, you’ll need to build danfojs, which requires a Nodejs environment.

```python
git clone https://github.com/javascriptdata/danfojs.git
cd danfojs
yarn install ## automatically installs all required packages
yarn test ##Runs test in both node and browser folder
```

> Now you can start adding features or fixing bugs!

## Documentation Guidelines

Documentation helps clarify what a function or a method is doing. It also gives insight to users of the function or methods on what parameters to pass in and know what the function will return.

Sample documentation:

```javascript
 /**
 * Add two series of the same length
 * @param {series1} series1 [Series]
 * @param {series2} series2 [Series]
 * @returns Series
 */
function add_series(series1, series2){

        ...................

        return new Series()
}
```

And for functions that contain more than two arguments, a keyword argument can be used. Parsing of keyword argument is also applicable to most of the methods in a class

```javascript
/**
 * Join two or more dataframe together along an axis
 * @param {kwargs} kwargs --> {
 *                      df_list: [Array of DataFrame],
 *                      axis : int {0 or 1},
 *                      by_column : String {name of a column},
 *                    }
 * @returns DataFrame 
 */
function join_df(kwargs){
        ........

        return DataFrame
}
```

## **Writing tests**

We strongly encourage contributors to write tests for their code. Like many packages, Danfojs uses mocha.&#x20;

All tests should go into the tests subdirectory and placed in the corresponding module. The tests folder contains some current examples of tests, and we suggest looking to these for inspiration.

Below is the general Framework to write a test for each module.

{% tabs %}
{% tab title="JavaScript" %}
```javascript
import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'

describe("Name of the class|module", function(){
 
  it("name of the methods| expected result",function(){
    
       //write your test code here
       //use assert.{proprty} to test your code
   })

});
```
{% endtab %}
{% endtabs %}

For a class with lots of methods.

```python
import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'

describe("Name of the class|module", function(){
 
 describe("method name 1", function(){
 
   it("expected result",function(){
     
        //write your test code here
        //use assert.{proprty} to test your code
    })
  })
  
  describe("method name 2", function(){
 
   it("expected result",function(){
     
        //write your test code here
        //use assert.{proprty} to test your code
    })
  })
  .......
});
```

**Example**: Let write a test, to test if the values in a dataframe are off a certain length. Assuming the method to obtain length is values\_len()

```javascript
import { assert } from "chai"
import { DataFrame } from '../../src/core/frame'

describe("DataFrame", function(){
    
  describe("value_len", function(){
 
   it("check dataframe length",function(){
     
       let data = [[1,2],[4,5]]
       let columns = ["A","B"]
       let df = new DataFrame(data,{columns: columns})
       
       let expected_result = 2
       
       assert.deepEqual(sf.value_len(), expected_result))
       
       
    })
  })

});
```

### **Running the test case**

To run the test for the module you created,

**1)** Open the package.json

**2)** change the name of the test script to the file name you want to test.

```python
"scripts": {
    "test": "....... danfojs/tests/sub_directory_name/filename",
```

**3)** run the test, in the danfojs directory terminal

```python
yarn test
```

Learn more about mocha [here](https://mochajs.org)

## Contributing your changes to danfojs

### **Committing your code**

Once you’ve made changes, you can see them by typing:

```
git status
```

Next, you can track your changes using

```
git add .
```

Next, you commit changes using:

```
git commit -m "Enter any commit message here"
```

### **Pushing your changes**

When you want your changes to appear publicly on your GitHub page, you can push to your forked repo with:

```
git push
```

### Review your code and finally, make a pull request

If everything looks good, you are ready to make a pull request. A pull request is how code from a local repository becomes available to the GitHub community and can be reviewed and eventually merged into the master version. To submit a pull request:

1. Navigate to your repository on GitHub
2. Click on the Pull Request button
3. Write a description of your changes in the Preview Discussion tab
4. Click Send Pull Request.

This request then goes to the repository maintainers, and they will review the code and everything looks good, merge it with the master.

**Hooray! You're now a contributor to danfojs. Now go bask in the euphoria!**

## **Danfojs Internals**

In other to contribute to the code base of danfojs, there are some functions and properties provided to make implementation easy.

The folder **danfojs-base** contains the bulk of Danfojs modules, and these are simply extended or exported by the **danfojs-browser** and **danfojs-node** folders. The base class for Frames and Series is the NdFrame class which is found in the `danfojs-base/core/generic` file.&#x20;



