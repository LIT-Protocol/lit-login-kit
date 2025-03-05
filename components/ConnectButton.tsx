import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';
import useSession from '../hooks/useSession';
import useAccounts from '../hooks/useAccounts';
import '../styles/auth-modal.css';
import { useRouter } from 'next/navigation';
import { useDisconnect } from 'wagmi';

export default function ConnectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { clearSession } = useSession();
  const { currentAccount, setCurrentAccount } = useAccounts('login');

  const { disconnectAsync } = useDisconnect();
  const router = useRouter();

  useEffect(() => {
    console.log('connect button says currentAccount changed', currentAccount);
    // When currentAccount changes, ensure modal is closed and logout dropdown is hidden
    if (currentAccount) {
      setIsModalOpen(false);
      setShowLogout(false);
    }
  }, [currentAccount]);

  const handleButtonClick = () => {
    if (currentAccount) {
      // If logged in, toggle logout option
      setShowLogout(!showLogout);
    } else {
      // If not logged in, show auth modal
      setIsModalOpen(true);
    }
  };

  const handleLogout = async () => {
    clearSession();
    await disconnectAsync();
    setCurrentAccount(undefined);
    setShowLogout(false);
    router.refresh();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="connect-button-container">
      <button
        className={`connect-button ${ currentAccount ? 'connect-button--connected' : ''}`}
        onClick={handleButtonClick}
      >
        {currentAccount ? (
          <>
            <span className="address-text">
              {truncateAddress(currentAccount.ethAddress)}
            </span>
          </>
        ) : (
          'Connect Wallet'
        )}
      </button>

      {showLogout && (
        <div className="logout-dropdown">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <AuthModal />
          </div>
        </div>
      )}
    </div>
  );
}
