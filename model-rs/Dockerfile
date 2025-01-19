ARG RUST_VERSION=1.82.0

FROM rust:${RUST_VERSION}-slim-bookworm AS builder
WORKDIR /app
# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libstdc++-11-dev && \
    rm -rf /var/lib/apt/lists/*  # Clean up apt cache

COPY . .
RUN --mount=type=cache,target=/app/target/ \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    cargo build --release && \
    cp ./target/release/model-rs /

FROM debian:bookworm-slim AS final
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "10001" \
    appuser && \
    mkdir -p /opt/model-rs

COPY --from=builder /model-rs /usr/local/bin
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
RUN chown appuser /usr/local/bin/model-rs /opt/model-rs

USER appuser
WORKDIR /opt/model-rs
EXPOSE 3000/tcp
ENTRYPOINT ["model-rs"]
