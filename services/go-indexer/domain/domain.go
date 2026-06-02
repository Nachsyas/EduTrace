package domain

import (
	"context"
	"encoding/json"
	"time"
)

// Student represents the core student entity off-chain.
type Student struct {
	StudentAddress string    `json:"student_address"`
	Name           string    `json:"name"`
	Email          string    `json:"email"`
	CreatedAt      time.Time `json:"created_at"`
}

// ReportCard represents a Soulbound Token mint record.
type ReportCard struct {
	TokenID        int64     `json:"token_id"`
	StudentAddress string    `json:"student_address"`
	CID            string    `json:"cid"`
	MintedAt       time.Time `json:"minted_at"`
}

// AcademicRecord represents an individual grade entry.
type AcademicRecord struct {
	ID             int       `json:"id"`
	StudentAddress string    `json:"student_address"`
	Subject        string    `json:"subject"`
	Score          float64   `json:"score"`
	GradeLevel     string    `json:"grade_level"`
	AcademicYear   string    `json:"academic_year"`
	CreatedAt      time.Time `json:"created_at"`
}

// AttendanceRecord represents student presence details.
type AttendanceRecord struct {
	ID             int       `json:"id"`
	StudentAddress string    `json:"student_address"`
	GradeLevel     string    `json:"grade_level"`
	TotalClasses   int       `json:"total_classes"`
	Absences       int       `json:"absences"`
	CreatedAt      time.Time `json:"created_at"`
}

// Prediction represents the AI LSTM generated analysis.
type Prediction struct {
	ID                   int             `json:"id" db:"id"`
	StudentAddress       string          `json:"student_address" db:"student_address"`
	DropoutRisk          float64         `json:"dropout_risk" db:"dropout_risk"`
	CareerRecommendation string          `json:"career_recommendation" db:"career_recommendation"`
	SkillProfile         json.RawMessage `json:"skill_profile" db:"skill_profile"`
	JobMatching          json.RawMessage `json:"job_matching" db:"job_matching"`
	SalaryProjection     json.RawMessage `json:"salary_projection" db:"salary_projection"`
	StartupProbability   json.RawMessage `json:"startup_probability" db:"startup_probability"`
	LearningRoadmap      json.RawMessage `json:"learning_roadmap" db:"learning_roadmap"`
	PredictedAt          time.Time       `json:"predicted_at" db:"predicted_at"`
}

// IPFSReportCardPayload represents the format of student data uploaded to Pinata/IPFS.
type IPFSReportCardPayload struct {
	Name         string             `json:"name"`
	Email        string             `json:"email"`
	GradeLevel   string             `json:"grade_level"`
	AcademicYear string             `json:"academic_year"`
	Subjects     map[string]float64 `json:"subjects"`
	TotalClasses int                `json:"total_classes"`
	Absences     int                `json:"absences"`
}

// StudentDashboard aggregates all student details for the Awwwards UI.
type StudentDashboard struct {
	Student         Student            `json:"student"`
	ReportCards     []ReportCard       `json:"report_cards"`
	AcademicRecords []AcademicRecord   `json:"academic_records"`
	Attendance      []AttendanceRecord `json:"attendance_records"`
	Prediction      *Prediction        `json:"prediction"`
}

// StudentRepository defines the storage persistence contracts.
type StudentRepository interface {
	SaveStudent(ctx context.Context, student *Student) error
	SaveReportCard(ctx context.Context, rc *ReportCard) error
	SaveAcademicRecords(ctx context.Context, records []AcademicRecord) error
	SaveAttendanceRecord(ctx context.Context, att *AttendanceRecord) error
	SavePrediction(ctx context.Context, pred *Prediction) error
	GetStudentDashboard(ctx context.Context, studentAddress string) (*StudentDashboard, error)
}

// IndexerUseCase defines the orchestration logic contracts.
type IndexerUseCase interface {
	IndexMintEvent(ctx context.Context, studentAddress string, tokenID int64, cid string) error
}
