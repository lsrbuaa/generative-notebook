use serde::Serialize;
use std::time::Instant;

#[derive(Serialize)]
struct AppInfo {
    name: String,
    version: String,
    platform: String,
    rust_version: String,
}

#[tauri::command]
fn get_app_info() -> AppInfo {
    AppInfo {
        name: "Generative Notebook".into(),
        version: env!("CARGO_PKG_VERSION").into(),
        platform: std::env::consts::OS.into(),
        rust_version: "1.95.0".into(),
    }
}

#[tauri::command]
fn ping(message: String) -> String {
    format!("pong: {}", message)
}

#[tauri::command]
fn benchmark_ipc(iterations: u32) -> Vec<f64> {
    let mut times = Vec::with_capacity(iterations as usize);
    for _ in 0..iterations {
        let start = Instant::now();
        let _ = format!("benchmark payload {}", chrono::Utc::now());
        times.push(start.elapsed().as_secs_f64() * 1000.0);
    }
    times
}

#[tauri::command]
fn save_data(key: String, value: String) -> Result<String, String> {
    Ok(format!("saved {}={} ({} bytes)", key, &value[..value.len().min(20)], value.len()))
}

#[tauri::command]
fn load_data(key: String) -> Result<String, String> {
    Ok(format!("mock data for key: {}", key))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_app_info,
            ping,
            benchmark_ipc,
            save_data,
            load_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
