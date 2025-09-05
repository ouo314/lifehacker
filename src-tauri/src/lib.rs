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
        Migration {
            version: 3,
            description: "create pain point sql",
            // 0:未處理 1:已處理 2:處理中
            // level: 影響程度、疼痛程度
            sql: r#"CREATE TABLE IF NOT EXISTS pain_points(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tag TEXT NOT NULL,
                title TEXT NOT NULL,
                status INTEGER DEFAULT 0 ,
                level INTEGER , 
                description TEXT,
                possible_solution_description TEXT,
                possible_solution_result TEXT
                );"#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create init expense sql",
            //id 金額 分類 子分類 付款方式 時間(日期+早上 下午 晚上) 地點 動機 重要度 平台
            sql: r#"CREATE TABLE IF NOT EXISTS expense(
                id INTERGER PRIMARY KEY ,
                amount TEXT NOT NULL,
                category TEXT,
                subCategory TEXT,
                paymentMethod TEXT,
                date TEXT,
                timeOfDate TEXT,
                area TEXT,
                satification INTERGER
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
