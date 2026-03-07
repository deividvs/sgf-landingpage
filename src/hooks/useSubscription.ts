import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserSubscription {
  id: string;
  user_id: string;
  hotmart_transaction_id: string;
  subscription_status: 'active' | 'expired' | 'cancelled' | 'pending';
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const bypassSubscription = import.meta.env.VITE_BYPASS_SUBSCRIPTION === 'true';

  useEffect(() => {
    if (bypassSubscription) {
      setIsActive(true);
      setLoading(false);
      setSubscription({
        id: 'bypass',
        user_id: user?.id || '',
        hotmart_transaction_id: 'BYPASS-DEV',
        subscription_status: 'active',
        started_at: new Date().toISOString(),
        expires_at: null,
        cancelled_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return;
    }

    if (!user) {
      setSubscription(null);
      setIsActive(false);
      setLoading(false);
      return;
    }

    loadSubscription();

    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Subscription changed:', payload);
          loadSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error loading subscription:', fetchError);
        setError(fetchError.message);
        setIsActive(false);
        setSubscription(null);
        return;
      }

      setSubscription(data);

      if (data) {
        const isSubscriptionActive =
          data.subscription_status === 'active' &&
          (data.expires_at === null || new Date(data.expires_at) > new Date());
        setIsActive(isSubscriptionActive);
      } else {
        setIsActive(false);
      }
    } catch (err) {
      console.error('Error in loadSubscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsActive(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    loadSubscription();
  };

  return {
    subscription,
    isActive,
    loading,
    error,
    refreshSubscription,
  };
}
