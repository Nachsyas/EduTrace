SOP 01 — Web3 & Smart Contract Standards
1. Development Engine
WAJIB menggunakan Foundry. Tidak boleh menggunakan Hardhat.

Build: forge build

Test: forge test -vvv

2. EIP-5192 Soulbound Token (SBT)
Semua ijazah/rapor menggunakan ERC721 yang di-override dengan EIP-5192.

Token tidak boleh bisa ditransfer (locked status wajib true).

3. Gas Optimization
Simpan data berat (nilai detail, JSON) di IPFS (Pinata).

Simpan hanya IPFS Hash (CID) di dalam Smart Contract.

4. Frontend Integration
DILARANG menggunakan web3.js or ethers.js.

WAJIB menggunakan Wagmi v2 dan Viem.

Gunakan @web3modal/wagmi (AppKit) untuk wallet connection.
