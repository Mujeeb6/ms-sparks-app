"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // We initialize the client inside the component 
  // so it correctly binds to the browser environment
  const client = new ApolloClient({
    link: new HttpLink({
      uri: "/api/graphql",
    }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}