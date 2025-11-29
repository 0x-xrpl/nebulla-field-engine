"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Wallet, QrCode, X } from 'lucide-react';
import { useWallet } from './WalletContext';

const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMetaMask: () => Promise<void> | void;
  onSelectSomniaWallet: () => Promise<void> | void;
  onSelectWalletConnect: () => Promise<void> | void;
  error?: string | null;
  clearError?: () => void;
  isConnected?: boolean;
  connectedAddress?: string | null;
  onDisconnect?: () => void;
}

const ConnectWalletModalContent: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onSelectMetaMask,
  onSelectSomniaWallet,
  onSelectWalletConnect,
  error,
  clearError,
  isConnected,
  connectedAddress,
  onDisconnect,
}) => {
  const handleClose = () => {
    clearError?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-lg px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#050505]/95 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
          >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
            <div>
              <p className="text-[0.6rem] font-data tracking-[0.55em] text-white/40">SOMNIA INTENT ENGINE</p>
              <h3 className="text-2xl font-heading tracking-[0.4em] text-white">CONNECT WALLET</h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close connect wallet modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 px-6 py-6">
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            {isConnected && connectedAddress && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-3 text-sm text-white/80 space-y-2">
                <p className="font-data tracking-[0.3em] text-[0.65rem] text-white/60 uppercase">
                  Connected as {formatAddress(connectedAddress)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onDisconnect?.();
                    handleClose();
                  }}
                  className="w-full rounded-xl border border-emerald-400/40 bg-emerald-400/10 py-2 text-xs font-data tracking-[0.35em] text-emerald-200 hover:border-red-400/60 hover:text-red-200 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => onSelectMetaMask?.()}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-emerald-400/40 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6851B]/10">
                  <Globe size={22} className="text-[#F6851B]" />
                </div>
                <div>
                  <p className="text-base font-data tracking-wider text-white">MetaMask</p>
                  <p className="text-xs font-body text-white/40">Browser extension & mobile app</p>
                </div>
              </div>
              <span className="text-[0.6rem] font-data tracking-[0.4em] text-emerald-400">PRIMARY</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectSomniaWallet?.()}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-emerald-400/40 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10">
                  <Wallet size={22} className="text-sky-400" />
                </div>
                <div>
                  <p className="text-base font-data tracking-wider text-white">Somnia Wallet</p>
                  <p className="text-xs font-body text-white/40">Native mobile + desktop connector</p>
                </div>
              </div>
              <span className="text-[0.6rem] font-data tracking-[0.4em] text-white/40">BETA</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectWalletConnect?.()}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-emerald-400/40 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">
                  <QrCode size={22} className="text-purple-300" />
                </div>
                <div>
                  <p className="text-base font-data tracking-wider text-white">WalletConnect</p>
                  <p className="text-xs font-body text-white/40">QR / deep-link to mobile wallets</p>
                </div>
              </div>
              <span className="text-[0.6rem] font-data tracking-[0.4em] text-white/60">MULTI</span>
            </button>

            <p className="text-center text-[0.6rem] font-data tracking-[0.45em] text-white/30">
              Compatible wallets are shown. Unsupported wallets remain hidden.
            </p>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

const ConnectWalletModal = () => {
  const {
    isModalOpen,
    closeWalletModal,
    connectWithMetaMask,
    connectWithSomniaWallet,
    connectWithWalletConnect,
    error,
    clearError,
    isConnected,
    address,
    disconnect,
  } = useWallet();

  return (
    <ConnectWalletModalContent
      isOpen={isModalOpen}
      onClose={closeWalletModal}
      onSelectMetaMask={connectWithMetaMask}
      onSelectSomniaWallet={connectWithSomniaWallet}
      onSelectWalletConnect={connectWithWalletConnect}
      error={error}
      clearError={clearError}
      isConnected={isConnected}
      connectedAddress={address}
      onDisconnect={disconnect}
    />
  );
};

export default ConnectWalletModal;
