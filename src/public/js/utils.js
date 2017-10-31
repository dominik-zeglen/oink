export function gQL(query, done, error, debug = false) {
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

export default {
  gQL
};
