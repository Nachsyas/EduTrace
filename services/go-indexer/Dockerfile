# Stage 1: Build the Go application binary
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

WORKDIR /app

# Copy dependency manifests and download modules
COPY go.mod go.sum ./
RUN go mod download

# Copy application source code
COPY . .

# Compile application to a static binary (reducing size and dependencies)
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/go-indexer .

# Stage 2: Minimal production image
FROM alpine:3.18

# Add certificates and timezone database (crucial for connecting securely to Polygon and Supabase)
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/go-indexer /app/go-indexer

# Expose Go Indexer API port
EXPOSE 8080

# Run the Go indexer
CMD ["/app/go-indexer"]
