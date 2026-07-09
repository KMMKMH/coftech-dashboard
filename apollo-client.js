import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import fetch from 'isomorphic-unfetch';
import { setContext } from "@apollo/client/link/context";

const initializeApollo = (token) => {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_ENDPOINT_URL + "/graphql",
    fetch
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });

  const Apollo = new ApolloClient({
    ssrMode: true,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return Apollo
}

export default initializeApollo