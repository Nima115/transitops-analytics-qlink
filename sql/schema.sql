-- TransitOps Analytics SQL schema
-- Generic SQL/PostgreSQL-oriented DDL for loading the CSV datasets before BI consumption.

CREATE TABLE dim_station (
    station_id VARCHAR(10) PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    line_group VARCHAR(50) NOT NULL,
    city_area VARCHAR(80) NOT NULL,
    station_type VARCHAR(50) NOT NULL,
    opened_year INTEGER,
    platform_count INTEGER,
    daily_passenger_volume INTEGER,
    risk_band VARCHAR(20)
);

CREATE TABLE dim_staff (
    staff_id VARCHAR(12) PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    role VARCHAR(80) NOT NULL,
    home_station_id VARCHAR(10) REFERENCES dim_station(station_id),
    secondary_station_id VARCHAR(10) REFERENCES dim_station(station_id),
    contract_type VARCHAR(40),
    hire_date DATE,
    active_flag CHAR(1)
);

CREATE TABLE dim_date (
    date_key INTEGER PRIMARY KEY,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    quarter VARCHAR(2),
    month INTEGER,
    month_name VARCHAR(20),
    month_key VARCHAR(7),
    week INTEGER,
    day_of_week VARCHAR(20),
    is_weekend CHAR(1),
    is_public_holiday CHAR(1)
);

CREATE TABLE dim_incident_type (
    incident_type_id VARCHAR(10) PRIMARY KEY,
    incident_category VARCHAR(50) NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    default_severity VARCHAR(20),
    sla_response_minutes INTEGER,
    sla_resolution_hours INTEGER,
    operational_owner VARCHAR(80)
);

CREATE TABLE fact_incidents (
    incident_id VARCHAR(16) PRIMARY KEY,
    date_key INTEGER REFERENCES dim_date(date_key),
    station_id VARCHAR(10) REFERENCES dim_station(station_id),
    incident_type_id VARCHAR(10) REFERENCES dim_incident_type(incident_type_id),
    opened_at TIMESTAMP,
    first_response_at TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    status VARCHAR(30),
    severity VARCHAR(20),
    response_minutes INTEGER,
    resolution_minutes INTEGER NULL,
    sla_response_breached_flag CHAR(1),
    sla_resolution_breached_flag CHAR(1),
    reported_channel VARCHAR(60),
    location_detail VARCHAR(100),
    operational_note VARCHAR(200),
    repeat_issue_flag CHAR(1)
);

CREATE TABLE fact_support_cases (
    support_case_id VARCHAR(16) PRIMARY KEY,
    date_key INTEGER REFERENCES dim_date(date_key),
    station_id VARCHAR(10) REFERENCES dim_station(station_id),
    opened_at TIMESTAMP,
    closed_at TIMESTAMP NULL,
    case_category VARCHAR(80),
    case_status VARCHAR(40),
    priority VARCHAR(20),
    channel VARCHAR(40),
    handling_hours INTEGER NULL,
    sla_target_hours INTEGER,
    sla_breached_flag CHAR(1),
    repeat_contact_flag CHAR(1)
);

CREATE TABLE fact_shifts (
    shift_id VARCHAR(16) PRIMARY KEY,
    date_key INTEGER REFERENCES dim_date(date_key),
    shift_date DATE,
    station_id VARCHAR(10) REFERENCES dim_station(station_id),
    staff_id VARCHAR(12) REFERENCES dim_staff(staff_id),
    shift_type VARCHAR(20),
    scheduled_start TIME,
    scheduled_end TIME,
    planned_hours NUMERIC(4,1),
    actual_hours NUMERIC(4,1),
    shift_status VARCHAR(30),
    missed_coverage_flag CHAR(1)
);

CREATE TABLE fact_response_times (
    response_id VARCHAR(16) PRIMARY KEY,
    source_type VARCHAR(30),
    source_id VARCHAR(16),
    station_id VARCHAR(10) REFERENCES dim_station(station_id),
    date_key INTEGER REFERENCES dim_date(date_key),
    acknowledged_minutes INTEGER,
    dispatch_minutes INTEGER NULL,
    site_arrival_minutes INTEGER NULL,
    resolution_minutes INTEGER NULL,
    sla_breached_flag CHAR(1)
);

CREATE TABLE fact_service_disruptions (
    disruption_id VARCHAR(16) PRIMARY KEY,
    date_key INTEGER REFERENCES dim_date(date_key),
    station_id VARCHAR(10) REFERENCES dim_station(station_id),
    line_group VARCHAR(50),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    disruption_reason VARCHAR(100),
    owner_group VARCHAR(60),
    service_impact VARCHAR(40),
    delay_minutes INTEGER,
    passengers_estimated_impacted INTEGER
);

CREATE TABLE monthly_operational_kpis (
    month_key VARCHAR(7),
    station_id VARCHAR(10) REFERENCES dim_station(station_id),
    incident_count INTEGER,
    support_case_count INTEGER,
    resolved_incident_count INTEGER,
    resolved_support_case_count INTEGER,
    open_incident_count INTEGER,
    avg_response_minutes NUMERIC(8,1),
    staffing_coverage_pct NUMERIC(6,1),
    incident_resolution_rate_pct NUMERIC(6,1),
    sla_breach_rate_pct NUMERIC(6,1),
    station_risk_score NUMERIC(6,1),
    monthly_incident_growth_pct NUMERIC(8,1),
    PRIMARY KEY (month_key, station_id)
);

CREATE VIEW vw_station_month_summary AS
SELECT
    k.month_key,
    s.station_name,
    s.line_group,
    s.city_area,
    s.risk_band,
    k.incident_count,
    k.support_case_count,
    k.open_incident_count,
    k.avg_response_minutes,
    k.staffing_coverage_pct,
    k.incident_resolution_rate_pct,
    k.sla_breach_rate_pct,
    k.station_risk_score,
    k.monthly_incident_growth_pct
FROM monthly_operational_kpis k
JOIN dim_station s
    ON k.station_id = s.station_id;
