package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"edutrace/indexer/domain"
)

type HttpApiHandler struct {
	repo    domain.StudentRepository
	useCase domain.IndexerUseCase
}

func NewHttpApiHandler(repo domain.StudentRepository, useCase domain.IndexerUseCase) *HttpApiHandler {
	return &HttpApiHandler{
		repo:    repo,
		useCase: useCase,
	}
}

// EnableCORS applies global CORS headers for Next.js AppRouter integration.
func (h *HttpApiHandler) EnableCORS(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return true
	}
	return false
}

// ServeHTTP implements custom path routing using standard Go net/http.
func (h *HttpApiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if h.EnableCORS(w, r) {
		return
	}

	path := r.URL.Path
	method := r.Method

	// Route 1: Health check
	if path == "/health" && method == "GET" {
		h.handleHealth(w, r)
		return
	}

	// Route 2: Get Student Dashboard Details (GET /api/student/{address})
	if strings.HasPrefix(path, "/api/student/") && method == "GET" {
		parts := strings.Split(path, "/")
		if len(parts) >= 4 && parts[3] != "" {
			studentAddress := parts[3]
			h.handleGetStudentDashboard(w, r, studentAddress)
			return
		}
	}

	// Route 3: Mock event triggers for development (POST /api/mint-mock)
	if path == "/api/mint-mock" && method == "POST" {
		h.handleMintMock(w, r)
		return
	}

	// 404 Route
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(map[string]string{"error": "route not found"})
}

func (h *HttpApiHandler) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "healthy",
		"service": "edutrace-go-indexer",
	})
}

func (h *HttpApiHandler) handleGetStudentDashboard(w http.ResponseWriter, r *http.Request, address string) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	dashboard, err := h.repo.GetStudentDashboard(ctx, address)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(dashboard)
}

type mintMockRequest struct {
	StudentAddress string `json:"student_address"`
	TokenID        int64  `json:"token_id"`
	CID            string `json:"cid"`
}

func (h *HttpApiHandler) handleMintMock(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var req mintMockRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid JSON body"})
		return
	}

	if req.StudentAddress == "" || req.CID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "student_address and cid are required"})
		return
	}

	if req.TokenID <= 0 {
		req.TokenID = 1
	}

	// Trigger use case indexing asynchronously or synchronously
	err := h.useCase.IndexMintEvent(ctx, req.StudentAddress, req.TokenID, req.CID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Mock mint event received and successfully indexed",
		"data":    req,
	})
}
