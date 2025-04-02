# Contributing Guide

### Contributing to danfojs

**Table of contents:**

* [TL;DR](#tldr)
* [Where to start?](#where-to-start)
* [Project Structure](#project-structure)
* [Development Setup](#development-setup)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Building](#building)
  * [Testing](#testing)
* [Working with Git](#working-with-git)
* [Documentation Guidelines](#documentation-guidelines)
* [Making Changes](#making-changes)
* [Creating Pull Requests](#creating-pull-requests)

## TL;DR

All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome.

Quick setup for experienced contributors:

```bash
git clone https://github.com/javascriptdata/danfojs.git
cd danfojs
yarn install
yarn build
yarn test
```

## Where to start?

For first-time contributors:

1. Look for issues labeled ["good first issue"](https://github.com/javascriptdata/danfojs/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
2. Read through our [Documentation](https://danfo.jsdata.org/getting-started)


## Project Structure

The project is organized into three main packages:

- **danfojs-base**: Core functionality shared between browser and Node.js versions
- **danfojs-browser**: Browser-specific implementation
- **danfojs-node**: Node.js-specific implementation

Most new features should be added to **danfojs-base** unless they are environment-specific.

## Development Setup

### Prerequisites

- Node.js (v16.x or later)
- Yarn package manager
- Git

### Installation

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/danfojs.git
   cd danfojs
   ```

3. Install dependencies:
   ```bash
   yarn install
   ```

### Building

Build all packages:
```bash
yarn build
```

Build specific package:
```bash
cd src/danfojs-browser
yarn build
```

Watch mode for development:
```bash
yarn dev
```

### Testing

Run all tests:
```bash
yarn test
```

Run specific test file:
```bash
yarn test tests/core/frame.test.js
```

Run tests matching a pattern:
```bash
yarn test -g "DataFrame.add"
```

Run tests in watch mode:
```bash
yarn test --watch
```

## Working with Git

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `test:` for adding tests
   - `refactor:` for code refactoring

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

## Documentation Guidelines

Good documentation includes:

1. JSDoc comments for all public methods
2. Clear parameter descriptions
3. Return value documentation
4. Usage examples

Example:
```javascript
/**
 * Add two series of the same length
 * @param {Series} series1 - First series to add
 * @param {Series} series2 - Second series to add
 * @returns {Series} New series containing the sum
 * 
 * @example
 * const s1 = new Series([1, 2, 3])
 * const s2 = new Series([4, 5, 6])
 * const result = add_series(s1, s2)
 * // result: Series([5, 7, 9])
 */
function add_series(series1, series2) {
    // Implementation
}
```

For methods with multiple options, use an options object:

```javascript
/**
 * Join two or more dataframes
 * @param {Object} options - Join options
 * @param {DataFrame[]} options.df_list - Array of DataFrames to join
 * @param {number} options.axis - Join axis (0: index, 1: columns)
 * @param {string} options.by_column - Column to join on
 * @returns {DataFrame} Joined DataFrame
 */
function join_df(options) {
    // Implementation
}
```

## Making Changes

1. Write tests for new functionality
2. Ensure all tests pass
3. Update documentation if needed
4. Add an entry to CHANGELOG.md
5. Run linter: `yarn lint`

## Creating Pull Requests

1. Push your changes to your fork
2. Go to the [danfojs repository](https://github.com/javascriptdata/danfojs)
3. Click "Pull Request"
4. Fill out the PR template:
   - Clear description of changes
   - Link to related issue
   - Screenshots/examples if relevant
   - Checklist of completed items

Your PR will be reviewed by maintainers. Address any feedback and update your PR accordingly.

---

## Need Help?


- Check our [Documentation](https://danfo.jsdata.org)
- Ask in GitHub Issues

Thank you for contributing to danfojs! 🎉
