// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migration = vec![Migration {
        version: 1,
        description: "create init todo list",
        sql: r#"CREATE TABLE IF NOT EXISTS todos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                status INTEGER DEFAULT 0
            );"#, // 0:未執行 1:已完成 2:執行中
        kind: MigrationKind::Up,
    }];
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:lifehacker.db", migration)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![list_todos, add_todo, toggle_todo])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn list_todos(
    db: tauri::State<tauri_plugin_sql::DbPool>,
) -> Result<Vec<(i64, String, i64)>, String> {
    db.query("SELECT id,text,status FROM todos ORDER BY id DESC", ())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn add_todo(text: String, db: tauri::State<tauri_plugin_sql::Db>) -> Result<(), String> {
    db.execute("INSERT INTO todos (text) VALUES(?)", (text,))
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn toggle_todo(
    id: i64,
    status: i64,
    db: tauri::State<tauri_plugin_sql::DbPool>,
) -> Result<(), String> {
    db.execute("UPDATE todos SET status=? WHERE id=?", (status, id))
        .map_err(|e| e.to_string())
}
