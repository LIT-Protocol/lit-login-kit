import React from 'react'
import { ConnectButton } from '../src'
// import { ConnectButton } from '@test/lit-login-kit'

function App() {
  return (
    <div className="App">
      <header>
        <h1>Lit Login Kit Demo</h1>
      </header>
      <main>
        <div className="demo-container">
          <div className="lit-connect-wallet">
            <ConnectButton />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App