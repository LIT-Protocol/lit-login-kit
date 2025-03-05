import { useState } from 'react';
import AuthModal from './AuthModal';
import useSession from '../hooks/useSession';
import useAccounts from '../hooks/useAccounts';
import '../styles/auth-modal.css';

export default function ConnectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { sessionSigs, clearSession } = useSession();
  const { currentAccount } = useAccounts('login');

  const handleButtonClick = () => {
    if (sessionSigs) {
      // If logged in, toggle logout option
      setShowLogout(!showLogout);
    } else {
      // If not logged in, show auth modal
      setIsModalOpen(true);
    }
  };

  const handleLogout = () => {
    clearSession();
    setShowLogout(false);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="connect-button-container">
      <button
        className={`connect-button ${sessionSigs ? 'connect-button--connected' : ''}`}
        onClick={handleButtonClick}
      >
        {sessionSigs ? (
          <>
            <span className="address-text">
              {currentAccount ? truncateAddress(currentAccount.ethAddress) : 'Connected'}
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
