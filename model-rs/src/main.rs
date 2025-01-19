use aws_config::BehaviorVersion;
use image::ImageReader;
use labello::{Encoder, Transform};
use ndarray::Array4;
use ort::session::{builder::GraphOptimizationLevel, Session};
use std::io::Cursor;
use tiny_http::{Response, Server, StatusCode};

async fn download_file(key: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let config = aws_config::load_defaults(BehaviorVersion::v2024_03_28()).await;
    let client = aws_sdk_s3::Client::new(&config);
    let bucket = std::env::var("BUCKET_NAME").unwrap();

    let resp = client.get_object().bucket(bucket).key(key).send().await?;

    let data = resp.body.collect().await?;
    Ok(data.into_bytes().to_vec())
}

fn get_predicted_label(predictions: &[f32], encoder: &Encoder<&str>) -> String {
    use labello::{Config, Encoder, EncoderType};

    // Define your labels
    let labels = vec!["alive", "dead", "debris"];

    // Create and configure the encoder
    let mut encoder = Encoder::new(Some(EncoderType::Ordinal));
    let config = Config {
        max_nclasses: Some(3),
        mapping_function: None,
    };

    // Fit the encoder with the labels
    encoder.fit(&labels, &config);
    let max_idx = predictions
        .iter()
        .enumerate()
        .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
        .map(|(index, _)| index)
        .unwrap();

    let transform = Transform::Ordinal(vec![max_idx as u64]);
    // Convert index back to label
    encoder.inverse_transform(&transform)[0].to_string()
}

async fn handle_request(id: &str) -> Result<String, Box<dyn std::error::Error>> {
    eprintln!("{id}");
    let model = Session::builder()?
        .with_optimization_level(GraphOptimizationLevel::Level3)?
        .with_intra_threads(4)?
        .with_config_entry("session.load_model_format", "ORT")?
        .commit_from_memory_directly(include_bytes!("../model.ort"))?;

    eprintln!("model done");

    let file_bytes = download_file(id).await?;

    let img = ImageReader::new(Cursor::new(file_bytes))
        .with_guessed_format()?
        .decode()?;

    let img = img.resize_exact(104, 104, image::imageops::FilterType::Gaussian);
    let rgb_img = img.to_rgb8();
    let mut input = Array4::<f32>::zeros((1, 104, 104, 3));

    for y in 0..104usize {
        for x in 0..104usize {
            let pixel = rgb_img.get_pixel(x as u32, y as u32);
            input[[0, y, x, 0]] = pixel[0] as f32 / 255.0;
            input[[0, y, x, 1]] = pixel[1] as f32 / 255.0;
            input[[0, y, x, 2]] = pixel[2] as f32 / 255.0;
        }
    }

    let output = &model.run(ort::inputs![input]?)?["output"];
    let output = output.try_extract_tensor::<f32>().unwrap();

    let arr = {
        let s = output.to_string();
        let (first, _) = s.split_once("]]").unwrap();
        let first = &first[2..];
        let nums: Vec<f32> = first.split(", ").map(|n| n.parse().unwrap()).collect();
    };

    let output = output.to_string();
    let split = output.split(", ").nth(3).unwrap();
    dbg!(split);
    let (n, _) = split.split_once(']').unwrap();
    dbg!(n);

    let n: f32 = n.parse().unwrap();

    Ok(n.to_string())
}

#[tokio::main]
pub async fn main() -> Result<(), Box<dyn std::error::Error>> {
    eprintln!("here!");

    let server = Server::http("0.0.0.0:3000").unwrap();

    for request in server.incoming_requests() {
        let url = request.url().to_string();
        let id = if url == "/" {
            "default".to_string()
        } else {
            url[1..].to_string()
        };

        let response_body = match handle_request(&id).await {
            Ok(body) => Response::from_string(body)
                .with_status_code(StatusCode(418))
                .with_header(
                    tiny_http::Header::from_bytes(&b"Content-Type"[..], &b"application/json"[..])
                        .unwrap(),
                ),
            Err(e) => {
                Response::from_string(format!("Error: {}", e)).with_status_code(StatusCode(500))
            }
        };

        request.respond(response_body)?;
    }

    Ok(())
}
