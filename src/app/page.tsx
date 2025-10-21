"use client";

import { useInngestSubscription } from "@inngest/realtime/hooks";

import { fetchRealtimeSubscriptionToken } from "./actions/get-subscribe-token";

export default function Home() {
  const { data, error, freshData, state, latestData } = useInngestSubscription({
    refreshToken: fetchRealtimeSubscriptionToken,
  });

  return <div></div>;
}
