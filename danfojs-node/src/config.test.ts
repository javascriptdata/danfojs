import { assert } from 'chai';
import Configs from './config';
import { BASE_CONFIG } from './defaults'

const config = new Configs(BASE_CONFIG);

describe("Config", function () {
  it("gets the default config val for table width", () => {
    let tableWidth = config.getTableWidth;
    assert.equal(tableWidth, 17);
  });

  it("gets the default config val for table truncation", () => {
    let tableTrunc = config.getTableTruncate;
    assert.equal(tableTrunc, 16);
  });

  it("Sets the config val for table width", () => {
    config.setTableWidth(7)
    let tableWidth = config.getTableWidth;
    assert.equal(tableWidth, 7);
  });

  it("Sets the config val for table truncation", () => {
    config.setTableTruncate(5);
    let tableTrunc = config.getTableTruncate;
    assert.equal(tableTrunc, 5);
  });
});
