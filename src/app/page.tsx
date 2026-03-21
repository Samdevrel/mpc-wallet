'use client';

import { useState } from 'react';

interface KeyShard {
  id: string;
  location: string;
  status: 'active' | 'offline';
  lastVerified: string;
  threshold: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  to: string;
  status: 'pending' | 'signing' | 'complete' | 'failed';
  signers: number;
  requiredSigners: number;
  timestamp: string;
}

const keyShards: KeyShard[] = [
  { id: 'SHARD-1', location: 'AWS HSM (us-east-1)', status: 'active', lastVerified: '2 min ago', threshold: 1 },
  { id: 'SHARD-2', location: 'Azure HSM (eu-west)', status: 'active', lastVerified: '5 min ago', threshold: 1 },
  { id: 'SHARD-3', location: 'GCP HSM (asia-east)', status: 'active', lastVerified: '8 min ago', threshold: 1 },
  { id: 'SHARD-4', location: 'Cold Storage (Offline)', status: 'offline', lastVerified: '24 hours ago', threshold: 0 },
];

const transactions: Transaction[] = [
  { id: 'TX-001', type: 'Transfer', amount: '5 ETH', to: '0x1234...5678', status: 'complete', signers: 3, requiredSigners: 3, timestamp: '10 min ago' },
  { id: 'TX-002', type: 'Swap', amount: '1000 USDC', to: 'Uniswap', status: 'signing', signers: 2, requiredSigners: 3, timestamp: '5 min ago' },
  { id: 'TX-003', type: 'Transfer', amount: '10 ETH', to: '0xabcd...efgh', status: 'pending', signers: 0, requiredSigners: 3, timestamp: '2 min ago' },
];

export default function Home() {
  const [threshold, setThreshold] = useState(3);
  const [totalShards, setTotalShards] = useState(4);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b-4 border-violet-400 bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black">MPC Wallet</h1>
          <p className="text-gray-400 mt-2">Multi-Party Computation for enterprise-grade key management</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border-4 border-violet-400 p-4 text-center">
            <div className="text-3xl font-black text-violet-400">{totalShards}</div>
            <div className="text-sm text-gray-400">Key Shards</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-4 text-center">
            <div className="text-3xl font-black">{threshold}/{totalShards}</div>
            <div className="text-sm text-gray-400">Threshold</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-4 text-center">
            <div className="text-3xl font-black text-green-400">3</div>
            <div className="text-sm text-gray-400">Active Shards</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-4 text-center">
            <div className="text-3xl font-black">0</div>
            <div className="text-sm text-gray-400">Breaches</div>
          </div>
        </section>

        {/* Threshold Configuration */}
        <section className="bg-gray-900 border-4 border-violet-400 p-6">
          <h2 className="text-xl font-black text-violet-400 mb-4">Threshold Configuration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Total Key Shards</label>
              <input
                type="range"
                min="2"
                max="7"
                value={totalShards}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotalShards(val);
                  if (threshold > val) setThreshold(val);
                }}
                className="w-full"
              />
              <div className="text-center font-bold text-2xl mt-2">{totalShards}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Required Signers (Threshold)</label>
              <input
                type="range"
                min="1"
                max={totalShards}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center font-bold text-2xl mt-2">{threshold} of {totalShards}</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-800 border border-gray-700 text-sm">
            <div className="text-violet-400 font-bold mb-1">⚡ Current Setup: {threshold}-of-{totalShards}</div>
            <div className="text-gray-400">
              {threshold} key shards must cooperate to sign transactions. No single party holds the full key.
            </div>
          </div>
        </section>

        {/* Key Shards */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-xl font-black mb-4">Key Shards</h2>
          <div className="space-y-3">
            {keyShards.map((shard) => (
              <div key={shard.id} className="p-4 bg-gray-800 border border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    shard.status === 'active' ? 'bg-green-400' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="font-bold text-violet-400">{shard.id}</div>
                    <div className="text-sm text-gray-400">{shard.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    shard.status === 'active' ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {shard.status.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">Verified: {shard.lastVerified}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pending Transactions */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-xl font-black mb-4">Transaction Queue</h2>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className={`p-4 bg-gray-800 border cursor-pointer transition-all hover:border-violet-400 ${
                  selectedTx?.id === tx.id ? 'border-violet-400' : 'border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-violet-400">{tx.id}</span>
                    <span className="ml-2 px-2 py-1 text-xs font-bold bg-gray-700 text-gray-400">
                      {tx.type}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold ${
                    tx.status === 'complete' ? 'bg-green-900 text-green-400' :
                    tx.status === 'signing' ? 'bg-yellow-900 text-yellow-400' :
                    tx.status === 'pending' ? 'bg-blue-900 text-blue-400' :
                    'bg-red-900 text-red-400'
                  }`}>
                    {tx.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-400">
                  <div>
                    <span className="text-gray-500">Amount:</span> {tx.amount}
                  </div>
                  <div>
                    <span className="text-gray-500">To:</span> {tx.to}
                  </div>
                  <div>
                    <span className="text-gray-500">Signers:</span> {tx.signers}/{tx.requiredSigners}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-900 border border-gray-600 h-2">
                    <div
                      className={`h-2 transition-all ${
                        tx.status === 'complete' ? 'bg-green-500' :
                        tx.status === 'signing' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${(tx.signers / tx.requiredSigners) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sign Transaction Panel */}
        {selectedTx && selectedTx.status !== 'complete' && (
          <section className="bg-gray-900 border-4 border-violet-400 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-violet-400">Sign: {selectedTx.id}</h2>
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-gray-700 text-white font-bold border-2 border-gray-600 hover:bg-gray-600"
              >
                Close
              </button>
            </div>
            <div className="p-4 bg-gray-800 border border-gray-700 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="ml-2 font-bold">{selectedTx.amount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Destination:</span>
                  <span className="ml-2 font-bold">{selectedTx.to}</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Signatures: {selectedTx.signers} of {selectedTx.requiredSigners} required</div>
              <div className="flex gap-2">
                {Array(selectedTx.requiredSigners).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 border-4 flex items-center justify-center font-bold ${
                      i < selectedTx.signers
                        ? 'bg-green-900 border-green-400 text-green-400'
                        : 'bg-gray-800 border-gray-600 text-gray-500'
                    }`}
                  >
                    {i < selectedTx.signers ? '✓' : i + 1}
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full py-4 bg-violet-500 text-white font-bold border-4 border-violet-400 hover:bg-violet-400">
              Sign with My Shard
            </button>
          </section>
        )}

        {/* How MPC Works */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-xl font-black mb-4">How MPC Wallets Work</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">1️⃣</div>
              <h3 className="font-bold text-violet-400 mb-2">Key Splitting</h3>
              <p className="text-xs text-gray-400">Private key split into shards</p>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">2️⃣</div>
              <h3 className="font-bold text-blue-400 mb-2">Distribution</h3>
              <p className="text-xs text-gray-400">Shards stored in separate locations</p>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">3️⃣</div>
              <h3 className="font-bold text-green-400 mb-2">Threshold Signing</h3>
              <p className="text-xs text-gray-400">N-of-M shards cooperate to sign</p>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">4️⃣</div>
              <h3 className="font-bold text-yellow-400 mb-2">No Single Point</h3>
              <p className="text-xs text-gray-400">Full key never reconstructed</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Built by <a href="https://x.com/samdevrel" className="text-violet-400 hover:underline">@samdevrel</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
