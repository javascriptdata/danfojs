"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _series = _interopRequireDefault(require("./series"));

/**
*  @license
* Copyright 2021, JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/
class Str {
  constructor(series) {
    this.series = series;
    this.values = series.values;
  }

  toLowerCase(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.toLowerCase());
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  toUpperCase(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.toUpperCase());
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  capitalize(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        let firstChar = `${val}`.slice(0, 1);
        let leftChar = `${val}`.slice(1);
        let newStr = `${firstChar.toUpperCase()}${leftChar.toLowerCase()}`;
        newArr.push(newStr);
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  charAt(index = 0, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.charAt(index));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  concat(other, position = 1, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];

    if (Array.isArray(other)) {
      for (let i = 0; i < other.length; i++) {
        let leftStr = `${this.values[i]}`;
        let rightStr = `${other[i]}`;

        if (position == 1) {
          newArr.push(leftStr.concat(rightStr));
        } else {
          newArr.push(rightStr.concat(leftStr));
        }
      }
    } else {
      this.values.map(val => {
        if (position == 1) {
          if (isNaN(val) && typeof val != "string") {
            newArr.push(NaN);
          } else {
            newArr.push(`${val}`.concat(`${other}`));
          }
        } else {
          if (isNaN(val) && typeof val != "string") {
            newArr.push(NaN);
          } else {
            newArr.push(other.concat(`${val}`));
          }
        }
      });
    }

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  startsWith(str = "", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.forEach(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.startsWith(str));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  endsWith(str = "", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.endsWith(str));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  includes(str = "", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.includes(str));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  indexOf(str = "", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.indexOf(str));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  lastIndexOf(str = "", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.lastIndexOf(str));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  replace(searchValue = "", replaceValue = "", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.replace(searchValue, replaceValue));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  repeat(num = 1, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.repeat(num));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  search(str = "", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.search(str));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  slice(startIndex = 0, endIndex = 1, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.slice(startIndex, endIndex));
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  split(splitVal = " ", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${String(val).split(splitVal)}`);
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  substr(startIndex = 0, num = 1, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${String(val).substr(startIndex, num)}`);
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  substring(startIndex = 0, endIndex = 1, options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${String(val).substring(startIndex, endIndex)}`);
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  trim(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.trim());
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  join(valToJoin = "", joinChar = " ", options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        let leftChar = val;
        let rightChar = valToJoin;
        let new_char = `${leftChar}${joinChar}${rightChar}`;
        newArr.push(new_char);
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

  len(options) {
    const {
      inplace
    } = {
      inplace: false,
      ...options
    };
    const newArr = [];
    this.values.map(val => {
      if (isNaN(val) && typeof val != "string") {
        newArr.push(NaN);
      } else {
        newArr.push(`${val}`.length);
      }
    });

    if (inplace) {
      this.series.$setValues(newArr);
      this.series.print();
    } else {
      const sf = this.series.copy();
      sf.$setValues(newArr);
      return sf;
    }
  }

}

exports.default = Str;