import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis();

    // To check if we are connected on refresh, and if yes, connect automatically
    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) enableWeb3();
        }
    }, []);

    // To check if the user disconnect his wallet, and if yes, delete the "connect" local storage storage item
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account change to ${account}`);
            if (account == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
            }
        });
    }, [isWeb3Enabled]);
    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3();
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected");
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    );
}
