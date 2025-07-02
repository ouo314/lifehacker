use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migration = vec![
        Migration {
            version: 1,
            description: "create init todo list",
            // 0:未執行 1:已完成 2:執行中
            sql: r#"CREATE TABLE IF NOT EXISTS todos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                text TEXT NOT NULL,
                status INTEGER DEFAULT 0 
                );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create init calendar events",
            sql: r#"CREATE TABLE IF NOT EXISTS calendarEvents(
                id TEXT PRIMARY KEY ,
                title TEXT NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                all_day BOOLEAN DEFAULT 0,
                description TEXT,
                type TEXT DEFAULT 'calendar'
                );"#,
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:lifehacker.db", migration)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
