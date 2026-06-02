package listener

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"strings"
	"time"

	"edutrace/indexer/domain"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

type EthEventListener struct {
	client          *ethclient.Client
	contractAddress common.Address
	useCase         domain.IndexerUseCase
	rpcURL          string
	topicHash       common.Hash
}

func NewEthEventListener(rpcURL string, contractAddressHex string, useCase domain.IndexerUseCase) (*EthEventListener, error) {
	// Recompute topic hash for ReportCardMinted(address,uint256,string)
	eventSig := []byte("ReportCardMinted(address,uint256,string)")
	topicHash := crypto.Keccak256Hash(eventSig)

	log.Printf("[LISTENER] Computed event signature hash for ReportCardMinted: %s", topicHash.Hex())

	var client *ethclient.Client
	var err error
	var finalAddress common.Address

	// If contractAddress is empty or invalid, log a warning but proceed for mock stability
	if contractAddressHex != "" {
		if !common.IsHexAddress(contractAddressHex) {
			log.Printf("[LISTENER] Warning: Invalid contract address hex format: %s", contractAddressHex)
		} else {
			finalAddress = common.HexToAddress(contractAddressHex)
		}
	}

	// Dial RPC in background or during setup
	if rpcURL != "" && !strings.Contains(rpcURL, "localhost:8545") {
		client, err = ethclient.Dial(rpcURL)
		if err != nil {
			log.Printf("[LISTENER] Warning: Could not connect to RPC URL (%s): %v. Poller will run in mock simulation mode.", rpcURL, err)
		}
	} else {
		log.Printf("[LISTENER] RPC URL set to local/mock default (%s). Using mock simulation mode.", rpcURL)
	}

	return &EthEventListener{
		client:          client,
		contractAddress: finalAddress,
		useCase:         useCase,
		rpcURL:          rpcURL,
		topicHash:       topicHash,
	}, nil
}

func (l *EthEventListener) Start(ctx context.Context) {
	log.Printf("[LISTENER] Starting Go Blockchain Event Listener...")

	// If RPC client is offline/uninitialized, start high-fidelity mock polling loop
	if l.client == nil {
		l.startMockSimulation(ctx)
		return
	}

	// Active blockchain polling loop
	go l.pollingLoop(ctx)
}

func (l *EthEventListener) pollingLoop(ctx context.Context) {
	ticker := time.NewTicker(3 * time.Second)
	defer ticker.Stop()

	// Track last evaluated block (defaults to latest)
	lastBlockEvaluated, err := l.client.BlockNumber(ctx)
	if err != nil {
		log.Printf("[LISTENER] Error fetching initial block: %v. Starting at 0.", err)
		lastBlockEvaluated = 0
	}

	log.Printf("[LISTENER] Connected successfully to RPC! Monitoring logs starting from block %d...", lastBlockEvaluated)

	for {
		select {
		case <-ctx.Done():
			log.Println("[LISTENER] Stopping polling loop.")
			return
		case <-ticker.C:
			currentBlock, err := l.client.BlockNumber(ctx)
			if err != nil {
				log.Printf("[LISTENER] Error fetching current block: %v", err)
				continue
			}

			if currentBlock <= lastBlockEvaluated {
				continue
			}

			// Filter query looking for our contract events
			query := ethereum.FilterQuery{
				FromBlock: big.NewInt(int64(lastBlockEvaluated + 1)),
				ToBlock:   big.NewInt(int64(currentBlock)),
				Addresses: []common.Address{l.contractAddress},
				Topics: [][]common.Hash{
					{l.topicHash},
				},
			}

			logs, err := l.client.FilterLogs(ctx, query)
			if err != nil {
				log.Printf("[LISTENER] Error filtering logs: %v", err)
				continue
			}

			for _, logItem := range logs {
				l.processLog(ctx, logItem)
			}

			lastBlockEvaluated = currentBlock
		}
	}
}

func (l *EthEventListener) processLog(ctx context.Context, vLog types.Log) {
	// Safety check on topics length
	// Topic 0: signature
	// Topic 1: studentAddress (indexed)
	// Topic 2: tokenId (indexed)
	if len(vLog.Topics) < 3 {
		log.Printf("[LISTENER] Warning: Received log with insufficient topics count: %d", len(vLog.Topics))
		return
	}

	// 1. Decode student address
	studentAddr := common.HexToAddress(vLog.Topics[1].Hex()).Hex()

	// 2. Decode tokenId
	tokenID := vLog.Topics[2].Big().Int64()

	// 3. Decode string cid from Data payload (non-indexed)
	cid, err := decodeABIString(vLog.Data)
	if err != nil {
		log.Printf("[LISTENER] Error decoding IPFS CID from ABI data: %v", err)
		return
	}

	log.Printf("[LISTENER] Caught Solidity event on-chain! Student: %s, TokenID: %d, CID: %s", studentAddr, tokenID, cid)

	// Trigger use case indexing pipeline
	if err := l.useCase.IndexMintEvent(ctx, studentAddr, tokenID, cid); err != nil {
		log.Printf("[LISTENER] Error indexing event: %v", err)
	}
}

// decodeABIString parses non-indexed string variables from Ethereum Log Data.
func decodeABIString(data []byte) (string, error) {
	// ABI encoding for dynamic arrays/strings:
	// data[0:32]: offset to string bytes (usually 0x20 = 32)
	// data[32:64]: length of string (L)
	// data[64:64+L]: ASCII character bytes
	if len(data) < 64 {
		return "", fmt.Errorf("abi data payload too small (len: %d)", len(data))
	}

	lengthBig := new(big.Int).SetBytes(data[32:64])
	length := lengthBig.Uint64()

	if uint64(len(data)) < 64+length {
		return "", fmt.Errorf("abi data length mismatch: expected %d bytes, got %d", 64+length, len(data))
	}

	return string(data[64 : 64+length]), nil
}

// startMockSimulation fires realistic mock blockchain events for offline testing/stability.
func (l *EthEventListener) startMockSimulation(ctx context.Context) {
	log.Println("[LISTENER] Listening started in Mock Simulation Mode.")
	log.Println("[LISTENER] Tip: Mint event mock triggers automatically 5 seconds after start!")

	go func() {
		select {
		case <-ctx.Done():
			return
		case <-time.After(5 * time.Second):
			// Simulated mint event payloads
			mockStudent := "0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496"
			mockCid := "QmXoyp1eg2jotzWJaR24G1t75v847mJ675G8mG687v2G8z"
			var mockTokenID int64 = 1

			log.Printf("[SIMULATOR] Triggering simulated blockchain mint event... (Student: %s, Token: %d)", mockStudent, mockTokenID)
			if err := l.useCase.IndexMintEvent(ctx, mockStudent, mockTokenID, mockCid); err != nil {
				log.Printf("[SIMULATOR] Error indexing mock event: %v", err)
			}
		}
	}()
}
