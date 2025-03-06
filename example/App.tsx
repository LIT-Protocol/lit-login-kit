import React from "react";
// import { LitConnectButton } from "../src";
import { LitConnectButton } from '@test/lit-login-kit'

function App() {
    return (
        <div className="App">
            <header>
                <h1>Lit Login Kit Demo</h1>
            </header>
            <main>
                <div className="demo-container">
                    <div className="lit-connect-wallet">
                        <LitConnectButton />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
