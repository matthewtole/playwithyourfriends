import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

/* istanbul ignore next */
export const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.GRAPHQL_URL,
    }),
    cache: new InMemoryCache(),
  });
};
