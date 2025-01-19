# Build Stage
FROM rust:1.83.0 as builder

# Build web app with own code
RUN rm src/*.rs
ADD . ./
RUN rm ./target/release/*
RUN cargo build --release


FROM debian:buster-slim
ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get install -y ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

COPY --from=builder /model-rs/target/release/model-rs ${APP}/model-rs
COPY --from=builder /model-rs/static ${APP}/static

RUN chown -R $APP_USER:$APP_USER ${APP}

USER $APP_USER
WORKDIR ${APP}

CMD ["./model-rs"]
