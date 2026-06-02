package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"edutrace/indexer/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresStudentRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresStudentRepository(pool *pgxpool.Pool) domain.StudentRepository {
	return &PostgresStudentRepository{pool: pool}
}

func (r *PostgresStudentRepository) SaveStudent(ctx context.Context, s *domain.Student) error {
	query := `
		INSERT INTO students (student_address, name, email, created_at)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (student_address) DO UPDATE
		SET name = EXCLUDED.name, email = EXCLUDED.email;
	`
	_, err := r.pool.Exec(ctx, query, s.StudentAddress, s.Name, s.Email, s.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to save student: %w", err)
	}
	return nil
}

func (r *PostgresStudentRepository) SaveReportCard(ctx context.Context, rc *domain.ReportCard) error {
	query := `
		INSERT INTO report_cards (token_id, student_address, cid, minted_at)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (token_id) DO NOTHING;
	`
	_, err := r.pool.Exec(ctx, query, rc.TokenID, rc.StudentAddress, rc.CID, rc.MintedAt)
	if err != nil {
		return fmt.Errorf("failed to save report card: %w", err)
	}
	return nil
}

func (r *PostgresStudentRepository) SaveAcademicRecords(ctx context.Context, records []domain.AcademicRecord) error {
	// Execute within a transaction for batch safety
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	query := `
		INSERT INTO academic_records (student_address, subject, score, grade_level, academic_year, created_at)
		VALUES ($1, $2, $3, $4, $5, $6);
	`

	for _, rec := range records {
		_, err := tx.Exec(ctx, query, rec.StudentAddress, rec.Subject, rec.Score, rec.GradeLevel, rec.AcademicYear, rec.CreatedAt)
		if err != nil {
			return fmt.Errorf("failed to insert academic record: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

func (r *PostgresStudentRepository) SaveAttendanceRecord(ctx context.Context, att *domain.AttendanceRecord) error {
	query := `
		INSERT INTO attendance_records (student_address, grade_level, total_classes, absences, created_at)
		VALUES ($1, $2, $3, $4, $5);
	`
	_, err := r.pool.Exec(ctx, query, att.StudentAddress, att.GradeLevel, att.TotalClasses, att.Absences, att.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to save attendance: %w", err)
	}
	return nil
}

func (r *PostgresStudentRepository) SavePrediction(ctx context.Context, p *domain.Prediction) error {
	query := `
		INSERT INTO predictions (student_address, dropout_risk, career_recommendation, skill_profile, job_matching, salary_projection, startup_probability, learning_roadmap, predicted_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
	`
	_, err := r.pool.Exec(ctx, query, p.StudentAddress, p.DropoutRisk, p.CareerRecommendation, p.SkillProfile, p.JobMatching, p.SalaryProjection, p.StartupProbability, p.LearningRoadmap, p.PredictedAt)
	if err != nil {
		return fmt.Errorf("failed to save prediction: %w", err)
	}
	return nil
}

func (r *PostgresStudentRepository) GetStudentDashboard(ctx context.Context, studentAddress string) (*domain.StudentDashboard, error) {
	dashboard := &domain.StudentDashboard{
		ReportCards:     []domain.ReportCard{},
		AcademicRecords: []domain.AcademicRecord{},
		Attendance:      []domain.AttendanceRecord{},
	}

	// 1. Fetch Student Profile
	studentQuery := `SELECT student_address, name, email, created_at FROM students WHERE student_address = $1;`
	err := r.pool.QueryRow(ctx, studentQuery, studentAddress).Scan(
		&dashboard.Student.StudentAddress,
		&dashboard.Student.Name,
		&dashboard.Student.Email,
		&dashboard.Student.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("student not found: %s", studentAddress)
		}
		return nil, fmt.Errorf("failed to query student profile: %w", err)
	}

	// 2. Fetch Report Cards
	rcQuery := `SELECT token_id, student_address, cid, minted_at FROM report_cards WHERE student_address = $1 ORDER BY minted_at DESC;`
	rows, err := r.pool.Query(ctx, rcQuery, studentAddress)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var rc domain.ReportCard
			if err := rows.Scan(&rc.TokenID, &rc.StudentAddress, &rc.CID, &rc.MintedAt); err == nil {
				dashboard.ReportCards = append(dashboard.ReportCards, rc)
			}
		}
	}

	// 3. Fetch Academic Records
	arQuery := `SELECT id, student_address, subject, score, grade_level, academic_year, created_at FROM academic_records WHERE student_address = $1 ORDER BY created_at ASC;`
	arRows, err := r.pool.Query(ctx, arQuery, studentAddress)
	if err == nil {
		defer arRows.Close()
		for arRows.Next() {
			var ar domain.AcademicRecord
			if err := arRows.Scan(&ar.ID, &ar.StudentAddress, &ar.Subject, &ar.Score, &ar.GradeLevel, &ar.AcademicYear, &ar.CreatedAt); err == nil {
				dashboard.AcademicRecords = append(dashboard.AcademicRecords, ar)
			}
		}
	}

	// 4. Fetch Attendance Records
	attQuery := `SELECT id, student_address, grade_level, total_classes, absences, created_at FROM attendance_records WHERE student_address = $1 ORDER BY created_at ASC;`
	attRows, err := r.pool.Query(ctx, attQuery, studentAddress)
	if err == nil {
		defer attRows.Close()
		for attRows.Next() {
			var att domain.AttendanceRecord
			if err := attRows.Scan(&att.ID, &att.StudentAddress, &att.GradeLevel, &att.TotalClasses, &att.Absences, &att.CreatedAt); err == nil {
				dashboard.Attendance = append(dashboard.Attendance, att)
			}
		}
	}

	// 5. Fetch Latest Prediction
	predQuery := `
		SELECT id, student_address, dropout_risk, career_recommendation, skill_profile, job_matching, salary_projection, startup_probability, learning_roadmap, predicted_at 
		FROM predictions 
		WHERE student_address = $1 
		ORDER BY predicted_at DESC 
		LIMIT 1;
	`
	var pred domain.Prediction
	err = r.pool.QueryRow(ctx, predQuery, studentAddress).Scan(
		&pred.ID,
		&pred.StudentAddress,
		&pred.DropoutRisk,
		&pred.CareerRecommendation,
		&pred.SkillProfile,
		&pred.JobMatching,
		&pred.SalaryProjection,
		&pred.StartupProbability,
		&pred.LearningRoadmap,
		&pred.PredictedAt,
	)
	if err == nil {
		dashboard.Prediction = &pred
	} else if !errors.Is(err, pgx.ErrNoRows) && !errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("failed to query student prediction: %w", err)
	}

	return dashboard, nil
}
