/* eslint-disable no-undef */

describe("LabelEncoder", function () {

  it("LabelEncoder works for Series", function () {
    const sf = new dfd.Series([ 1, 2, 2, 6 ]);
    const scaler = new dfd.LabelEncoder();
    scaler.fit(sf);
    const expected = [ 0, 1, 1, 2 ];
    assert.deepEqual(scaler.transform(sf).values, expected);
  });
  it("LabelEncoder works for 1D array", function () {
    const sf = [ 1, 2, 2, "boy", "git", "git" ];
    const scaler = new dfd.LabelEncoder();
    scaler.fit(sf);
    const expected = [ 0, 1, 1, 2, 3, 3 ];
    assert.deepEqual(scaler.transform(sf), expected);
  });
  it("LabelEncoder works for values not found", function () {
    const sf = new dfd.Series([ 1, 2, 2, 6 ]);
    const scaler = new dfd.LabelEncoder();
    scaler.fit(sf);

    const expected = [ 0, 1, 1, 2, -1 ];
    assert.deepEqual((scaler.transform(new dfd.Series([ 1, 2, 2, 6, 7 ]))).values, expected);
  });
  it("fitTransform works for 1D array", function () {
    const sf = [ 1, 2, 2, "boy", "git", "git" ];
    const scaler = new dfd.LabelEncoder();
    const result = scaler.fitTransform(sf);
    const expected = [ 0, 1, 1, 2, 3, 3 ];
    assert.deepEqual(result, expected);
  });
  it("inverseTransform works for 1D array", function () {
    const sf = [ 1, 2, 2, "boy", "git", "git" ];
    const scaler = new dfd.LabelEncoder();
    scaler.fit(sf);
    const result = scaler.inverseTransform([ 0, 1, 1, 2, 3, 3 ]);
    assert.deepEqual(result, [ 1, 2, 2, "boy", "git", "git" ]);
  });
  it("Get properties from LabelEncoder", function () {
    const sf = [ 1, 2, 2, "boy", "git", "git" ];
    const scaler = new dfd.LabelEncoder();
    scaler.fit(sf);
    const classes = scaler.classes;
    const nClasses = scaler.nClasses;

    assert.deepEqual(classes, { 1: 0, 2: 1, boy: 2, git: 3 });
    assert.equal(nClasses, 4);
  });
});
