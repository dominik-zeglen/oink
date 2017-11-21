const currentDateTime = ((): string => {
  const currentdate = new Date();

  return currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
});

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

export {
  currentDateTime,
  isEmpty,
  makeFields,
};
