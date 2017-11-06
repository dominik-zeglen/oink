function gQL(query, done, error, debug = false) {
  $.ajax({
    url: '/graphql',
    method: 'POST',
    headers: {
      charset: 'utf-8',
      contentType: 'application/json'
    },
    data: {
      query: query.replace('\n', ' ')
    },
    success: (res) => {
      if (debug) {
        console.log(res);
      }
      done(res);
    },
    error: (res) => {
      if (debug) {
        console.log(res);
      }
      error(res);
    }
  });
}

function makename(a) {
  return a.toLowerCase().replace(/ /g, '_');
}

function jsonStringify(obj_from_json) {
  if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
    // not an object, stringify using native function
    return JSON.stringify(obj_from_json);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  let props = Object
    .keys(obj_from_json)
    .map(key => `${key}:${jsonStringify(obj_from_json[key])}`)
    .join(",");
  return `{${props}}`;
}

export {
  gQL,
  makename,
  jsonStringify
};
