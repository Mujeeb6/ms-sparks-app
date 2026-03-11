import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

// 1. The Schema
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

// 2. The Mock Database (Fixed: Now using 'const' to pass ESLint)
const mockOffers = [
  { id: '1', title: '20% off Food Hall', description: 'Valid until Friday on all M&S Food', isActivated: false },
  { id: '2', title: 'Free Coffee', description: 'Redeem at any M&S Cafe', isActivated: false },
  { id: '3', title: '15% off Third-Party Brands', description: 'Online only', isActivated: false }
];

// 3. The Resolvers (Fixed: Using 'unknown' instead of 'any' for strict TypeScript)
const resolvers = {
  Query: {
    getUserDetails: () => ({ 
        name: "Alex", 
        pointsBalance: 1250, 
        offers: mockOffers 
    }),
  },
  Mutation: {
    activateOffer: (_: unknown, { offerId }: { offerId: string }) => {
      const offer = mockOffers.find(o => o.id === offerId);
      if (offer) {
        offer.isActivated = true;
      }
      return offer;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server);

// 4. App Router Specific Exports (Fixed: Prevents the RouteHandlerConfig error)
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}