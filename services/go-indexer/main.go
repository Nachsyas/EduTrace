package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"edutrace/indexer/domain"
	"edutrace/indexer/handler"
	"edutrace/indexer/listener"
	"edutrace/indexer/repository"
	"edutrace/indexer/usecase"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	log.Println("[SERVER] Initializing EduTrace Go Indexer Backend...")

	// 1. Load configuration from environment variables
	dbURL := os.Getenv("DATABASE_URL")
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	rpcURL := os.Getenv("RPC_URL")
	contractAddr := os.Getenv("CONTRACT_ADDRESS")
	aiURL := os.Getenv("AI_SERVICE_URL")
	if aiURL == "" {
		aiURL = "http://localhost:8000"
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var repo domain.StudentRepository

	// 2. Initialize Database Connection (or fallback to Memory Repository)
	if dbURL == "" {
		log.Println("[DATABASE] Warning: DATABASE_URL is not set. Initializing in-memory mock repository for stability.")
		repo = NewMemoryStudentRepository()
	} else {
		log.Println("[DATABASE] Connecting to PostgreSQL/Supabase...")
		poolConfig, err := pgxpool.ParseConfig(dbURL)
		if err != nil {
			log.Printf("[DATABASE] Error parsing DATABASE_URL (%v). Initializing in-memory mock repository.", err)
			repo = NewMemoryStudentRepository()
		} else {
			// Connect to postgres pool
			pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
			if err != nil {
				log.Printf("[DATABASE] Connection failed (%v). Initializing in-memory mock repository.", err)
				repo = NewMemoryStudentRepository()
			} else {
				// Ping check
				if err := pool.Ping(ctx); err != nil {
					log.Printf("[DATABASE] Ping check failed (%v). Initializing in-memory mock repository.", err)
					repo = NewMemoryStudentRepository()
				} else {
					log.Println("[DATABASE] Connected successfully to PostgreSQL database pool!")
					repo = repository.NewPostgresStudentRepository(pool)
				}
			}
		}
	}

	// 3. Initialize UseCase
	indexerUseCase := usecase.NewStudentIndexerUseCase(repo, aiURL)

	// 4. Initialize Blockchain Event Listener (runs as a separate routine)
	ethListener, err := listener.NewEthEventListener(rpcURL, contractAddr, indexerUseCase)
	if err != nil {
		log.Fatalf("[LISTENER] Critical error setting up listener: %v", err)
	}
	ethListener.Start(ctx)

	// 5. Initialize HTTP REST Server
	apiHandler := handler.NewHttpApiHandler(repo, indexerUseCase)

	serverAddr := fmt.Sprintf("0.0.0.0:%s", port)
	log.Printf("[SERVER] HTTP Server running on http://localhost:%s", port)
	log.Println("[SERVER] Health check endpoint at http://localhost:" + port + "/health")

	if err := http.ListenAndServe(serverAddr, apiHandler); err != nil {
		log.Fatalf("[SERVER] Critical server failure: %v", err)
	}
}

// =============================================================================
// Highly Robust In-Memory Mock Repository for Out-of-the-Box Stability
// =============================================================================

type MemoryStudentRepository struct {
	mu        sync.RWMutex
	students  map[string]domain.Student
	cards     map[int64]domain.ReportCard
	academic  map[string][]domain.AcademicRecord
	attend    map[string][]domain.AttendanceRecord
	predicts  map[string][]domain.Prediction
}

func NewMemoryStudentRepository() domain.StudentRepository {
	return &MemoryStudentRepository{
		students: make(map[string]domain.Student),
		cards:    make(map[int64]domain.ReportCard),
		academic: make(map[string][]domain.AcademicRecord),
		attend:   make(map[string][]domain.AttendanceRecord),
		predicts: make(map[string][]domain.Prediction),
	}
}

func (m *MemoryStudentRepository) SaveStudent(ctx context.Context, s *domain.Student) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.students[s.StudentAddress] = *s
	return nil
}

func (m *MemoryStudentRepository) SaveReportCard(ctx context.Context, rc *domain.ReportCard) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.cards[rc.TokenID] = *rc
	return nil
}

func (m *MemoryStudentRepository) SaveAcademicRecords(ctx context.Context, records []domain.AcademicRecord) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, r := range records {
		m.academic[r.StudentAddress] = append(m.academic[r.StudentAddress], r)
	}
	return nil
}

func (m *MemoryStudentRepository) SaveAttendanceRecord(ctx context.Context, att *domain.AttendanceRecord) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.attend[att.StudentAddress] = append(m.attend[att.StudentAddress], *att)
	return nil
}

func (m *MemoryStudentRepository) SavePrediction(ctx context.Context, p *domain.Prediction) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.predicts[p.StudentAddress] = append(m.predicts[p.StudentAddress], *p)
	return nil
}

func (m *MemoryStudentRepository) GetStudentDashboard(ctx context.Context, address string) (*domain.StudentDashboard, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	s, ok := m.students[address]
	if !ok {
		return nil, fmt.Errorf("student profile not found for address: %s", address)
	}

	dashboard := &domain.StudentDashboard{
		Student:         s,
		ReportCards:     []domain.ReportCard{},
		AcademicRecords: []domain.AcademicRecord{},
		Attendance:      []domain.AttendanceRecord{},
	}

	for _, rc := range m.cards {
		if rc.StudentAddress == address {
			dashboard.ReportCards = append(dashboard.ReportCards, rc)
		}
	}

	if recs, ok := m.academic[address]; ok {
		dashboard.AcademicRecords = recs
	}

	if atts, ok := m.attend[address]; ok {
		dashboard.Attendance = atts
	}

	if preds, ok := m.predicts[address]; ok && len(preds) > 0 {
		dashboard.Prediction = &preds[len(preds)-1] // Return latest
	}

	return dashboard, nil
}
