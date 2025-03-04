import { useCallback, useState, useEffect } from 'react';
import { AuthMethod } from '@lit-protocol/types';
import { getPKPs, mintPKP } from '../utils/lit';
import { IRelayPKP } from '@lit-protocol/types';
import { verify } from 'crypto';

type FlowType = 'login' | 'signup';

export default function useAccounts(flow: FlowType = 'login') {
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
      // Don't fetch accounts in signup flow
      if (flow === 'signup') {
        return;
      }

      setLoading(true);
      setError(undefined);
      try {
        // Fetch PKPs tied to given auth method
        const myPKPs = await getPKPs(authMethod);
        // console.log('fetchAccounts pkps: ', myPKPs);
        setAccounts(myPKPs);
        // If only one PKP, set as current account
        if (myPKPs.length === 1) {
          setCurrentAccount(myPKPs[0]);
        }
      } catch (err) {
        setError(err);
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

        // console.log('createAccount pkp: ', newPKP);
        setAccounts(prev => [...prev, newPKP]);
        setCurrentAccount(newPKP);
      } catch (err) {
        setError(err);
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
