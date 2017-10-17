import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export default new GraphQLObjectType({
  fields: {
    // TODO: get a list of locales
    en: {
      type: GraphQLString,
    },
  },
  name: 'OinkLocalizedString',
});
