use std::io::Cursor;

use aws_config::BehaviorVersion;
use axum::{extract::Path, http::StatusCode, response::IntoResponse, routing::get, Json};
use image::ImageReader;
use lambda_http::{tower::ServiceBuilder, Error};
use ndarray::Array4;
use ort::session::{builder::GraphOptimizationLevel, Session};
use serde::Serialize;
use tower_http::trace::TraceLayer;

#[derive(Serialize)]
pub struct Ping {
    message: &'static str,
}

async fn download_file(key: &str) -> Result<Vec<u8>, Error> {
    let config = aws_config::load_defaults(BehaviorVersion::v2024_03_28()).await;
    dbg!(&config);
    let client = aws_sdk_s3::Client::new(&config);
    dbg!(&client);
    let bucket = std::env::var("BUCKET_NAME").unwrap();
    dbg!(&bucket);

    let resp = client.get_object().bucket(bucket).key(key).send().await?;
    dbg!(&resp);

    let data = resp.body.collect().await?;
    Ok(data.into_bytes().to_vec())
}

pub async fn ping(Path(id): Path<String>) -> impl IntoResponse {
    eprintln!("{id}");
    let model = Session::builder()
        .unwrap()
        .with_optimization_level(GraphOptimizationLevel::Level3)
        .unwrap()
        .with_intra_threads(4)
        .unwrap()
        .with_config_entry("session.load_model_format", "ORT")
        .unwrap()
        .commit_from_memory_directly(include_bytes!("../model.ort"))
        .unwrap();

    eprintln!("model done");

    let file_bytes = download_file(&id).await.unwrap();
    eprintln!("{:?}", file_bytes);

    let img = ImageReader::new(Cursor::new(file_bytes))
        .with_guessed_format()
        .unwrap()
        .decode()
        .unwrap();

    dbg!(&img);

    let img = img.resize_exact(104, 104, image::imageops::FilterType::Gaussian);
    dbg!(&img);
    let rgb_img = img.to_rgb8();
    let mut input = Array4::<f32>::zeros((1, 104, 104, 3));

    // Fill the array with normalized pixel values
    for y in 0..104usize {
        for x in 0..104usize {
            let pixel = rgb_img.get_pixel(x as u32, y as u32);
            input[[0, y, x, 0]] = pixel[0] as f32 / 255.0;
            input[[0, y, x, 1]] = pixel[1] as f32 / 255.0;
            input[[0, y, x, 2]] = pixel[2] as f32 / 255.0;
        }
    }

    dbg!(&input);

    let output = model.run(ort::inputs![input].unwrap()).unwrap();
    println!("{:?}", output);

    (
        StatusCode::IM_A_TEAPOT,
        Json(Ping {
            message: "hello from rust :)",
        }),
    )
}

#[tokio::main]
pub async fn main() -> Result<(), Error> {
    eprintln!("here!");

    let app = axum::Router::new()
        .route("/", get(ping))
        .route("/{id}", get(ping))
        .layer(ServiceBuilder::new().layer(TraceLayer::new_for_http()));

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
