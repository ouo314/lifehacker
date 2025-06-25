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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
