import { Configs } from '../../src/config/config';
import { assert } from 'chai';

const config = new Configs();

describe("Config", function () {
  it("gets the default config val for table width", function () {
    let table_width = config.get_width;
    assert.equal(table_width, 17);
  });
  it("gets the default config val for table truncation", function () {
    let table_trunc = config.get_truncate;
    assert.equal(table_trunc, 16);
  });
  it("Sets the config val for table width", function () {
    config.set_width(7);
    let table_width = config.get_width;
    assert.equal(table_width, 7);
  });
  it("Sets the config val for table truncation", function () {
    config.set_truncate(5);
    let table_trunc = config.get_truncate;
    assert.equal(table_trunc, 5);
  });
});
