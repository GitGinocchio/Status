PRAGMA foreign_keys = ON;
BEGIN;

CREATE TABLE IF NOT EXISTS services (
    name                                TEXT PRIMARY KEY,
    display_name                        TEXT,
    description                         TEXT,
    endpoint                            TEXT,                                               -- "https://...", "wss://..."
    type                                TEXT,                                               -- "HTTP", "HTTPS", "FTP", "WSS" etc.
    enabled                             BOOLEAN,
    monitoring_start                    DATETIME                                            -- "%Y-%m-%d %H:%M:%S"
);

CREATE TABLE IF NOT EXISTS metrics (
    name                                TEXT,                                               -- abcdef... [0,255]
    timestamp                           DATETIME,                                           -- "%Y-%m-%d %H:%M:%S"

    -- Ottenuti dalla richiesta
    last_uptime                         DATETIME NULL,                                      -- "%Y-%m-%d %H:%M:%S"
    last_downtime                       DATETIME NULL,                                      -- "%Y-%m-%d %H:%M:%S"
    code                                INTEGER,                                            -- 000 -> 999 HTTP status codes
    status                              TEXT,                                               -- "Tutti i servizi sono disponibili"
    
    -- Calcolati
    uptime                              REAL NULL,
    avg_uptime                          REAL NULL,
    min_uptime                          REAL NULL,
    max_uptime                          REAL NULL,

    downtime                            REAL NULL,
    avg_downtime                        REAL NULL,
    min_downtime                        REAL NULL,
    max_downtime                        REAL NULL,
    
    latency                             DECIMAL(12,6),                                      -- 000000.000000s
    avg_latency                         DECIMAL(12,6),                                      -- 000000.000000s
    min_latency                         DECIMAL(12,6),                                      -- 000000.000000s
    max_latency                         DECIMAL(12,6),                                      -- 000000.000000s
    
    uptime_percentage                   DECIMAL(6,3),                                       -- 100.000%
    avg_uptime_percentage               DECIMAL(6,3),                                       -- 100.000%
    min_uptime_percentage               DECIMAL(6,3),                                       -- 100.000%
    max_uptime_percentage               DECIMAL(6,3),                                       -- 100.000%

    PRIMARY KEY (name, timestamp)
    FOREIGN KEY (name)                  REFERENCES services (name) ON DELETE CASCADE        -- Garantiamo che name esista nella tabella services
);

CREATE TABLE IF NOT EXISTS reports (
    name                                TEXT,
    timestamp                           DATETIME,                                           -- "%Y-%m-%d %H:%M:%S"

    title                               TEXT,                                               -- "Titolo"
    message                             TEXT,                                               -- "I servizi sono offline"

    PRIMARY KEY (name, timestamp)
    FOREIGN KEY (name)                  REFERENCES services (name) ON DELETE CASCADE        -- Garantiamo che name esista nella tabella services
);

CREATE TABLE IF NOT EXISTS events (
    name                                TEXT,
    timestamp                           DATETIME,                                           -- "%Y-%m-%d %H:%M:%S"

    fromtime                            DATETIME,                                           -- "Da orario"
    totime                              DATETIME,                                           -- "A orario"
    title                               TEXT,                                               -- "Titolo"
    message                             TEXT,                                               -- "I servizi sono offline" / "Manutenzione"

    PRIMARY KEY (name, timestamp)
    FOREIGN KEY (name)                  REFERENCES services (name) ON DELETE CASCADE        -- Garantiamo che name esista nella tabella services
);

COMMIT; 