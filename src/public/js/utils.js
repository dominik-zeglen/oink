function gQL(query, done, error, debug = false) {
  fetch('/manage/graphql', {
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query.replace('\n', ' ')
    })
  }).then((r) => {
    return r.json();
  }).then((r) => {
    if (debug) {
      console.log(r);
    }
    done(r);
  }).catch((e) => {
    if (debug) {
      console.log(e);
    }
    error(e);
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
