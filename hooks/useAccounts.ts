import { useCallback, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { getPKPs, mintPKP } from '../utils/lit';
import { IRelayPKP } from '@lit-protocol/types';

type FlowType = 'login' | 'signup';

interface AccountHookReturn {
  fetchAccounts: (authMethod: AuthMethod) => Promise<void>;
  createAccount: (authMethod: AuthMethod) => Promise<void>;
  setCurrentAccount: Dispatch<SetStateAction<IRelayPKP | undefined>>;
  accounts: IRelayPKP[];
  currentAccount: IRelayPKP | undefined;
  loading: boolean;
  error: Error | undefined;
  flow: FlowType;
}

export default function useAccounts(flow: FlowType = 'login'): AccountHookReturn {
  const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
  const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  // Reset state when flow changes
  useEffect(() => {
    setAccounts([]);
    setCurrentAccount(undefined);
    setError(undefined);
  }, [flow]);

  /**
   * Fetch PKPs tied to given auth method
   */
  const fetchAccounts = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      if (flow === 'signup') {
        return;
      }

      setLoading(true);
      setError(undefined);
      try {
        const myPKPs = await getPKPs(authMethod);
        setAccounts(myPKPs);
        if (myPKPs.length === 1) {
          setCurrentAccount(myPKPs[0]);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [flow]
  );

  /**
   * Mint a new PKP for current auth method
   */
  const createAccount = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        const newPKP = await mintPKP(authMethod);
        setAccounts(prev => {
          const updated = [...prev, newPKP];
          return updated;
        });
        setCurrentAccount(newPKP);
      } catch (err) {
        console.error('Error creating account:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchAccounts,
    createAccount,
    setCurrentAccount,
    accounts,
    currentAccount,
    loading,
    error,
    flow,
  };
}
