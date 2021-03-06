

describe("Str", function () {
  it("Converts all characters to lowercase.", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ 'lower', 'capitals', 'this is a sentence', 'swapcase' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.toLowerCase().values, res);
  });
  it("Converts all characters to uppercase.", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ 'LOWER', 'CAPITALS', 'THIS IS A SENTENCE', 'SWAPCASE' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.toUpperCase().values, res);
  });
  it("Converts all characters to capital case.", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ 'Lower', 'Capitals', 'This is a sentence', 'Swapcase' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.capitalize().values, res);
  });

  it("Returns the character at the specified index (position)", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ "w", "P", "i", "A" ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.charAt(2).values, res);
  });
  it("Joins two or more strings. 0 joins from the start", function () {
    let data = [ 'lower', 'CAPITALS', 'sentence', 'SwApCaSe' ];
    let data2 = [ 'XX', 'YY', 'BB', '01' ];

    let res = [ 'XXlower', 'YYCAPITALS', 'BBsentence', '01SwApCaSe' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.concat(data2, 0).values, res);
  });

  it("Joins two or more strings. 1 joins from the end", function () {
    let data = [ 'lower', 'CAPITALS', 'sentence', 'SwApCaSe' ];
    let data2 = [ 'XX', 'YY', 'BB', '01' ];

    let res = [ 'lowerXX', 'CAPITALSYY', 'sentenceBB', 'SwApCaSe01' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.concat(data2, 1).values, res);
  });

  it("Joins two arrays of strings. 0 joins from the start", function () {
    let data = [ 'lower', 'CAPITALS', 'sentence', 'SwApCaSe' ];
    let res = [ 'prelower', 'preCAPITALS', 'presentence', 'preSwApCaSe' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.concat("pre", 0).values, res);
  });

  it("Joins two or more strings. 1 joins from the end", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ 'lowerpost', 'CAPITALSpost', 'this is a sentencepost', 'SwApCaSepost' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.concat("post", 1).values, res);
  });

  it("Checks whether a string begins with specified characters", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ true, false, false, false ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.startsWith("l").values, res);
  });
  it("Checks whether a string ends with specified characters", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ false, false, true, true ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.endsWith("e").values, res);
  });

  it("Checks whether a string contains the specified string/characters", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ false, false, true, false ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.includes("sentence").values, res);
  });

  it("Returns the position of the first found occurrence of a specified value in a string", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ -1, 0, -1, 4 ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.indexOf("C").values, res);
  });

  it("Returns the position of the last found occurrence of a specified value in a string", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ 4, -1, -1, -1 ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.lastIndexOf("r").values, res);
  });

  it("Returns a new string with a specified number of copies of an existing string", function () {
    let data = [ 'a', 'b', 'c', 'd' ];
    let res = [ 'aaa', 'bbb', 'ccc', 'ddd' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.repeat(3).values, res);
  });

  it("Searches a string for a specified value, or a regular expression, and returns a new string where the specified values are replaced", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ 'lower', 'CXXXPITALS', 'this is a sentence', 'SwXXXpCaSe' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.replace("A", "XXX").values, res);
  });

  it("Searches a string for a specified value, or regular expression, and returns the position of the match", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ -1, 1, -1, 2 ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.search("A").values, res);
  });

  it("Extracts a part of a string and returns a new string", function () {
    let data = [ 'lower', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ 'ow', 'AP', 'hi', 'wA' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.slice(1, 3).values, res);
  });

  it("Splits a string into an array of substrings", function () {
    let data = [ 'lower part', 'CAPITALS city', 'is a sentence', 'SwAp CaSe' ];
    let res = [ "lower,part", "CAPITALS,city", "is,a,sentence", "SwAp,CaSe" ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.split(" ").values, res);
  });

  it("Extracts the characters from a string, beginning at a specified start position, and through the specified number of character", function () {
    let data = [ 'lower part', 'CAPITALS city', 'this is a sentence', 'SwAp CaSe' ];
    let res = [ " p", "AL", "is", "Ca" ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.substr(5, 2).values, res);
  });

  it("Extracts the characters from a string, between two specified indices", function () {
    let data = [ 'lower part', 'CAPITALS city', 'this is a sentence', 'SwAp CaSe' ];
    let res = [ "w", "P", "i", "A" ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.substring(2, 3).values, res);
  });

  it("Removes whitespace from both ends of a string", function () {
    let data = [ 'lower part ', ' CAPITALS city', ' this is a sentence', '  SwAp CaSe' ];
    let res = [ 'lower part', 'CAPITALS city', 'this is a sentence', 'SwAp CaSe' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.trim().values, res);
  });

  it("Joins strings to specified value", function () {
    let data = [ 'lower part', 'CAPITALS city', 'this is a sentence', 'SwAp CaSe' ];
    let res = [ 'lower part,new', 'CAPITALS city,new', 'this is a sentence,new', 'SwAp CaSe,new' ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.join("new", ",").values, res);
  });

  it("Counts the number of characters in string", function () {
    let data = [ 'lower part', 'CAPITALS', 'this is a sentence', 'SwApCaSe' ];
    let res = [ 10, 8, 18, 8 ];
    let str = new dfd.Str(new dfd.Series(data));
    assert.deepEqual(str.len().values, res);
  });

});
