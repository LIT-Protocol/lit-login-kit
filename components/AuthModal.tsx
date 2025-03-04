import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthenticate from '../hooks/useAuthenticate';
import useSession from '../hooks/useSession';
import useAccounts from '../hooks/useAccounts';
import {
  ORIGIN,
  signInWithDiscord,
  signInWithGoogle,
  registerWebAuthn,
  SELECTED_LIT_NETWORK,
} from '../utils/lit';
import Dashboard from '../components/Dashboard';
import Loading from '../components/Loading';
import AccountSelection from '../components/AccountSelection';
import CreateAccount from '../components/CreateAccount';
import { AUTH_METHOD_TYPE } from '@lit-protocol/constants';
import WebAuthn from './WebAuthn';
import WalletMethods from './WalletMethods';
import StytchOTP from './StytchOTP';
import AuthMethods from './AuthMethods';
import { useIsMounted } from '../hooks/useIsMounted';

export default function AuthModal() {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const isMounted = useIsMounted();

  // ---------- Login View ----------

  function LoginView({ onSignUpClick }: { onSignUpClick: () => void }) {
    const redirectUri = ORIGIN;

    const {
      authMethod,
      authWithEthWallet,
      authWithWebAuthn,
      authWithStytch,
      loading: authLoading,
      error: authError,
    } = useAuthenticate(redirectUri);
    const {
      fetchAccounts,
      setCurrentAccount,
      currentAccount,
      accounts,
      loading: accountsLoading,
      error: accountsError,
      flow,
    } = useAccounts('login');
    const {
      initSession,
      sessionSigs,
      loading: sessionLoading,
      error: sessionError,
    } = useSession();
    const router = useRouter();

    const error = authError || accountsError || sessionError;

    async function handleGoogleLogin() {
      await signInWithGoogle(redirectUri);
    }

    async function handleDiscordLogin() {
      await signInWithDiscord(redirectUri);
    }

    function goToSignUp() {
      onSignUpClick();
    }

    useEffect(() => {
      // If user is authenticated, fetch accounts
      if (authMethod && isMounted) {
        fetchAccounts(authMethod);
      }
    }, [authMethod, fetchAccounts, isMounted]);

    useEffect(() => {
      // If user is authenticated and has selected an account, initialize session
      if (authMethod && currentAccount && isMounted) {
        initSession(authMethod, currentAccount);
      }
    }, [authMethod, currentAccount, initSession, isMounted]);

    if (authLoading) {
      return (
        <Loading copy={'Authenticating your credentials...'} error={error} />
      );
    }

    if (accountsLoading) {
      return <Loading copy={'Looking up your accounts...'} error={error} />;
    }

    if (sessionLoading) {
      return <Loading copy={'Securing your session...'} error={error} />;
    }

    // If user is authenticated and has selected an account, initialize session
    if (currentAccount && sessionSigs) {
      return (
        <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
      );
    }

    // If user is authenticated and has more than 1 account, show account selection
    if (authMethod && accounts.length > 0) {
      return (
        <AccountSelection
          accounts={accounts}
          setCurrentAccount={setCurrentAccount}
          error={error}
        />
      );
    }

    // If user is authenticated but has no accounts, prompt to create an account
    if (authMethod && accounts.length === 0) {
      return <CreateAccount signUp={goToSignUp} error={error} />;
    }

    // If user is not authenticated, show login methods
    return (
      <LoginMethods
        handleGoogleLogin={handleGoogleLogin}
        handleDiscordLogin={handleDiscordLogin}
        authWithEthWallet={authWithEthWallet}
        authWithWebAuthn={authWithWebAuthn}
        authWithStytch={authWithStytch}
        signUp={goToSignUp}
        error={error}
      />
    );
  }

  // ---------- Login Methods ----------

  interface LoginProps {
    handleGoogleLogin: () => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    authWithEthWallet: any;
    authWithWebAuthn: any;
    authWithStytch: any;
    signUp: any;
    error?: Error;
  }

  type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

  function LoginMethods({
    handleGoogleLogin,
    handleDiscordLogin,
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    signUp,
    error,
  }: LoginProps) {
    const [view, setView] = useState<AuthView>('default');

    return (
      <div className="container">
        <div className="wrapper">
          {error && (
            <div className="alert alert--error">
              <p>{error.message}</p>
            </div>
          )}
          {view === 'default' && (
            <>
              <h1>Login to your existing account</h1>
              <p>Access your Lit wallet.</p>
              <AuthMethods
                handleGoogleLogin={handleGoogleLogin}
                handleDiscordLogin={handleDiscordLogin}
                setView={setView}
              />
              <div className="buttons-container">
                <button
                  type="button"
                  className="btn btn--link"
                  onClick={signUp}
                >
                  Need an account? Sign up
                </button>
              </div>
            </>
          )}
          {view === 'email' && (
            <StytchOTP
              method={'email'}
              authWithStytch={authWithStytch}
              setView={setView}
            />
          )}
          {view === 'phone' && (
            <StytchOTP
              method={'phone'}
              authWithStytch={authWithStytch}
              setView={setView}
            />
          )}
          {view === 'wallet' && (
            <WalletMethods
              authWithEthWallet={authWithEthWallet}
              setView={setView}
            />
          )}
          {view === 'webauthn' && (
            <WebAuthn
              start={'authenticate'}
              authWithWebAuthn={authWithWebAuthn}
              setView={setView}
            />
          )}
        </div>
      </div>
    );
  }

  // ---------- Sign Up Methods ----------

  function SignUpView({ onLoginClick }: { onLoginClick: () => void }) {
    const redirectUri = ORIGIN;

    const {
      authMethod,
      authWithEthWallet,
      authWithWebAuthn,
      authWithStytch,
      loading: authLoading,
      error: authError,
    } = useAuthenticate(redirectUri);
    const {
      createAccount,
      setCurrentAccount,
      currentAccount,
      loading: accountsLoading,
      error: accountsError,
      flow,
    } = useAccounts('signup');
    const {
      initSession,
      sessionSigs,
      loading: sessionLoading,
      error: sessionError,
    } = useSession();
    const router = useRouter();

    const error = authError || accountsError || sessionError;

    if (error) {
      if (authError) {
        console.error('Auth error:', authError);
      }

      if (accountsError) {
        console.error('Accounts error:', accountsError);
      }

      if (sessionError) {
        console.error('Session error:', sessionError);
      }
    }

    async function handleGoogleLogin() {
      await signInWithGoogle(redirectUri);
    }

    async function handleDiscordLogin() {
      await signInWithDiscord(redirectUri);
    }

    async function registerWithWebAuthn() {
      const newPKP = await registerWebAuthn();
      if (newPKP) {
        setCurrentAccount(newPKP);
      }
    }

    useEffect(() => {
      // If user is authenticated, create an account
      // For WebAuthn, the account creation is handled by the registerWithWebAuthn function
      if (
        authMethod &&
        authMethod.authMethodType !== AUTH_METHOD_TYPE.WebAuthn &&
        isMounted
      ) {
        createAccount(authMethod);
      }
    }, [authMethod, createAccount, isMounted]);

    useEffect(() => {
      // If user is authenticated and has at least one account, initialize session
      if (authMethod && currentAccount && isMounted) {
        initSession(authMethod, currentAccount);
      }
    }, [authMethod, currentAccount, initSession, isMounted]);

    if (authLoading) {
      return (
        <Loading copy={'Authenticating your credentials...'} error={error} />
      );
    }

    if (accountsLoading) {
      return <Loading copy={'Creating your account...'} error={error} />;
    }

    if (sessionLoading) {
      return <Loading copy={'Securing your session...'} error={error} />;
    }

    if (currentAccount && sessionSigs) {
      return (
        <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
      );
    }

    // If user is authenticated, show create account
    if (authMethod) {
      return (
        <div className="container">
          <div className="wrapper">
            {error && (
              <div className="alert alert--error">
                <p>{error.message}</p>
              </div>
            )}
            <h1>Create your account</h1>
            <p>Set up your Lit wallet to get started.</p>
            <div className="buttons-container">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => createAccount(authMethod)}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If user is not authenticated, show signup methods
    return (
      <SignUpMethods
        handleGoogleLogin={handleGoogleLogin}
        handleDiscordLogin={handleDiscordLogin}
        authWithEthWallet={authWithEthWallet}
        registerWithWebAuthn={registerWithWebAuthn}
        authWithWebAuthn={authWithWebAuthn}
        authWithStytch={authWithStytch}
        goToLogin={onLoginClick}
        error={error}
      />
    );
  }

  // ---------- Sign Up Methods ----------

  interface SignUpProps {
    handleGoogleLogin: () => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    authWithEthWallet: any;
    registerWithWebAuthn: any;
    authWithWebAuthn: any;
    authWithStytch: any;
    goToLogin: any;
    error?: Error;
  }

  function SignUpMethods({
    handleGoogleLogin,
    handleDiscordLogin,
    authWithEthWallet,
    registerWithWebAuthn,
    authWithWebAuthn,
    authWithStytch,
    goToLogin,
    error,
  }: SignUpProps) {
    const [view, setView] = useState<AuthView>('default');

    return (
      <div className="container">
        <div className="wrapper">
          {error && (
            <div className="alert alert--error">
              <p>{error.message}</p>
            </div>
          )}
          {view === 'default' && (
            <>
              <h1>Create your account on the {SELECTED_LIT_NETWORK} network</h1>
              <p>
                Create a wallet secured by accounts you already have. No need to
                worry about seed phrases.
              </p>
              <AuthMethods
                handleGoogleLogin={handleGoogleLogin}
                handleDiscordLogin={handleDiscordLogin}
                setView={setView}
              />
              <div className="buttons-container">
                <button
                  type="button"
                  className="btn btn--link"
                  onClick={goToLogin}
                >
                  Have an account? Log in
                </button>
              </div>
            </>
          )}
          {view === 'email' && (
            <StytchOTP
              method={'email'}
              authWithStytch={authWithStytch}
              setView={setView}
            />
          )}
          {view === 'phone' && (
            <StytchOTP
              method={'phone'}
              authWithStytch={authWithStytch}
              setView={setView}
            />
          )}
          {view === 'wallet' && (
            <WalletMethods
              authWithEthWallet={authWithEthWallet}
              setView={setView}
            />
          )}
          {view === 'webauthn' && (
            <WebAuthn
              start={'register'}
              authWithWebAuthn={authWithWebAuthn}
              setView={setView}
              registerWithWebAuthn={registerWithWebAuthn}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="wrapper">
        {view === 'login' ? (
          <LoginView onSignUpClick={() => setView('signup')} />
        ) : (
          <SignUpView onLoginClick={() => setView('login')} />
        )}
      </div>
    </div>
  );
}
