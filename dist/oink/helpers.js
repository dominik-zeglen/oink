function isEmpty(a) {
  return (a === undefined || a === null || a === '' || a === [] || a === {});
}

function makeFields(fields) {
  const output = {};
  fields.forEach((f) => {
    output[f.name] = f.value;
  });
  return output;
}

module.exports = {
  makeFields,
  isEmpty
};
