import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';

/* istanbul ignore next */
export const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.GRAPHQL_URL,
    }),
    cache: new InMemoryCache(),
  });
};
