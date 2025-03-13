# Services

NEW_SERVICE_QUERY = """
INSERT INTO services (name, display_name, description, endpoint, type, enabled, monitoring_start)
VALUES (?, ?, ?, ?, ?, ?, ?)
"""

HAS_SERVICE_QUERY = """
SELECT 1 FROM services WHERE name = ?;
"""

SET_SERVICE_QUERY = """
UPDATE services
SET enabled = ?
WHERE name = ?
"""

DEL_SERVICE_QUERY = """
DELETE FROM services WHERE name = ?;
"""

GET_ALL_SERVICES_QUERY = """
SELECT * FROM services 
"""

# Metrics

GET_ALL_METRICS_QUERY = """
SELECT rowid, * FROM metrics ORDER BY timestamp ASC
"""

GET_ALL_METRICS_BY_NAME_QUERY = """
SELECT rowid, * FROM metrics WHERE name = ? ORDER BY timestamp ASC
"""

GET_LAST_METRIC = """
SELECT rowid, * FROM metrics WHERE name = ? ORDER BY timestamp DESC LIMIT 1
"""

NEW_METRIC_QUERY = """
INSERT INTO metrics (
    name, 
    timestamp, 
    
    last_uptime, 
    last_downtime,
    
    code, 
    status, 
    
    uptime,
    avg_uptime, 
    min_uptime, 
    max_uptime, 

    downtime,
    avg_downtime,
    min_downtime,
    max_downtime,
   
    latency,
    avg_latency, 
    min_latency, 
    max_latency, 
    
    uptime_percentage, 
    avg_uptime_percentage, 
    min_uptime_percentage, 
    max_uptime_percentage
)
VALUES (
    ?,          -- name
    ?,          -- timestamp

    ?,          -- last_uptime
    ?,          -- last_downtime

    ?,          -- code
    ?,          -- status

    ?,          -- uptime
    ?,          -- avg_uptime
    ?,          -- min_uptime
    ?,          -- max_uptime

    ?,          -- downtime
    ?,          -- avg_downtime
    ?,          -- min_downtime
    ?,          -- max_downtime

    ?,          -- latency
    ?,          -- avg_latency
    ?,          -- min_latency
    ?,          -- max_latency

    ?,          -- uptime_percentage
    ?,          -- avg_uptime_percentage
    ?,          -- min_uptime_percentage
    ?           -- max_uptime_percentage
)
"""

# Reports

GET_ALL_REPORTS_QUERY = """
SELECT * FROM reports
"""

# Events

GET_ALL_EVENTS_QUERY = """
SELECT * FROM events
"""