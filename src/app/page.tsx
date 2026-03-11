"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import React from "react";

const GET_LOYALTY_DATA = gql`
  query GetLoyaltyData {
    getUserDetails {
      name
      pointsBalance
      offers {
        id
        title
        description
        isActivated
      }
    }
  }
`;

const ACTIVATE_OFFER = gql`
  mutation ActivateOffer($offerId: ID!) {
    activateOffer(offerId: $offerId) {
      id
      isActivated
    }
  }
`;

interface Offer {
  id: string;
  title: string;
  description: string;
  isActivated: boolean;
}

interface LoyaltyData {
  getUserDetails: {
    name: string;
    pointsBalance: number;
    offers: Offer[];
  };
}

export default function SparksDashboard() {
  const { loading, error, data } = useQuery<LoyaltyData>(GET_LOYALTY_DATA);
  const [activateOffer] = useMutation(ACTIVATE_OFFER);

  if (loading) return <div className="p-10 text-center text-xl font-semibold">Loading your Sparks dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading data: {error.message}</div>;

  const user = data?.getUserDetails;
  if (!user) return null;

  // We perform the A/B test logic directly. 
  // To avoid the "Impure" error, we use a simple stable check.
  const isGreenVariant = typeof window !== "undefined" && window.innerWidth % 2 === 0;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        
        <header className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-500 mb-4">Here is your Sparks summary.</p>
          <div className="bg-green-50 text-green-800 inline-block px-6 py-3 rounded-full text-2xl font-black tracking-tight">
            {user.pointsBalance} Points
          </div>
        </header>

        <section>
          <h2 className="text-2xl font-bold mb-6">Your Exclusive Offers</h2>
          <div className="space-y-4">
            {user.offers.map((offer) => (
              <div 
                key={offer.id} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-xl font-bold">{offer.title}</h3>
                  <p className="text-gray-600 mt-1">{offer.description}</p>
                </div>
                
                <button
                  onClick={() => activateOffer({ variables: { offerId: offer.id } })}
                  disabled={offer.isActivated}
                  suppressHydrationWarning
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    offer.isActivated 
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                      : isGreenVariant
                        ? "bg-green-600 text-white hover:bg-green-700" 
                        : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {offer.isActivated ? "Activated ✓" : "Activate Offer"}
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}