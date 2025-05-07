import cryptoJs from 'crypto-js';

export function verifyResult(serverSeed, clientSeed, nonce) {
  if (!serverSeed || !clientSeed || !nonce) {
    throw new Error('All fields are required');
  }

  const hash = cryptoJs.HmacSHA256(
    `${serverSeed}:${clientSeed}:${nonce}`,
    process.env.REACT_APP_SERVER_SEED_SECRET || 'your_server_seed_secret'
  ).toString();
  const index = parseInt(hash.slice(0, 8), 16) % 3;
  return ['Red', 'Green', 'Blue'][index];
}