use axum::{extract::Path, http::StatusCode, response::IntoResponse, routing::get, Json};
use lambda_http::Error;
use ort::session::{builder::GraphOptimizationLevel, Session};
use serde::Serialize;

#[derive(Serialize)]
pub struct Ping {
    message: &'static str,
}

pub async fn ping(Path(id): Path<String>) -> impl IntoResponse {

    (
        StatusCode::IM_A_TEAPOT,
        Json(Ping {
            message: "hello from rust :)",
        }),
    )
}


#[tokio::main]
pub async fn main() -> Result<(), Error> {
    println!("here!");
    let model = Session::builder()?
        .with_optimization_level(GraphOptimizationLevel::Level3)?
        .with_intra_threads(4)?
        .with_config_entry("session.load_model_format", "ORT")?
        .commit_from_memory_directly(include_bytes!("../../../model.ort"))?;


    let app = axum::Router::new().route("/{id}", get(ping));
    lambda_http::run(app).await
}
