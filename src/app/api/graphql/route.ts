import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

// 1. The Schema: This defines the shape of our M&S data
const typeDefs = `#graphql
  type Offer {
    id: ID!
    title: String!
    description: String!
    isActivated: Boolean!
  }

  type User {
    name: String!
    pointsBalance: Int!
    offers: [Offer!]!
  }

  type Query {
    getUserDetails: User
  }

  type Mutation {
    activateOffer(offerId: ID!): Offer
  }
`;

// 2. The Mock Database: Simulating what the M&S backend would store
let mockOffers = [
  { id: '1', title: '20% off Food Hall', description: 'Valid until Friday on all M&S Food', isActivated: false },
  { id: '2', title: 'Free Coffee', description: 'Redeem at any M&S Cafe', isActivated: false },
  { id: '3', title: '15% off Third-Party Brands', description: 'Online only', isActivated: false }
];

// 3. The Resolvers: This tells GraphQL how to fetch or change the data
const resolvers = {
  Query: {
    getUserDetails: () => ({ 
        name: "Alex", 
        pointsBalance: 1250, 
        offers: mockOffers 
    }),
  },
  Mutation: {
    activateOffer: (_: any, { offerId }: { offerId: string }) => {
      const offer = mockOffers.find(o => o.id === offerId);
      if (offer) {
        offer.isActivated = true; // Changes the status in our mock database
      }
      return offer;
    }
  }
};

// 4. Initialize the Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server);

export { handler as GET, handler as POST };