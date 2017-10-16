import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import field from '../../types/field';

export default {
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  type: field,
  resolve (root, params, options) {
    console.log(options);
    return true;
    // const projection = getProjection(options.fieldASTs[0]);
    //
    // return BlogPostModel
    //   .findById(params.id)
    //   .select(projection)
    //   .exec();
  }
};