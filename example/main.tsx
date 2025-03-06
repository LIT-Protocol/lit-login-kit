import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { StytchProvider } from "@stytch/react";
import { StytchUIClient } from "@stytch/vanilla-js";
import { config, queryClient } from "./wagmi";

const stytchPublicToken = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN

const client = new StytchUIClient(stytchPublicToken);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <StytchProvider stytch={client}>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </WagmiProvider>
        </StytchProvider>
    </React.StrictMode>
);