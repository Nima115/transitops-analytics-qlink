# Data Model

TransitOps Analytics uses a star-schema style model. The main analytical grains are incident, support case, shift assignment, response-time event, disruption event, and station-month KPI.

## Tables

| Table | Type | Grain | Purpose |
| --- | --- | --- | --- |
| `dim_station` | Dimension | One row per station | Station attributes, network area, station type, passenger volume, risk band |
| `dim_staff` | Dimension | One row per employee | Staff role, home station, secondary station, contract type |
| `dim_date` | Dimension | One row per calendar date | Date, month, week, weekend, holiday attributes |
| `dim_incident_type` | Dimension | One row per incident type | Category, default severity, SLA targets, operational owner |
| `fact_incidents` | Fact | One row per station incident | Incident status, response time, resolution time, severity, SLA breach flags |
| `fact_support_cases` | Fact | One row per passenger support case | Case category, status, priority, channel, handling time, SLA flag |
| `fact_shifts` | Fact | One row per planned staff shift | Planned hours, actual hours, shift status, missed coverage flag |
| `fact_response_times` | Fact | One row per response event | Response stages for incident or support workflows |
| `fact_service_disruptions` | Fact | One row per disruption event | Disruption reason, impact, delay minutes, estimated passenger impact |
| `monthly_operational_kpis` | Aggregate fact | One row per station per month | Precalculated monthly KPI values for executive reporting |

## Relationship Design

Primary relationships:

- `fact_incidents.station_id` to `dim_station.station_id`
- `fact_incidents.date_key` to `dim_date.date_key`
- `fact_incidents.incident_type_id` to `dim_incident_type.incident_type_id`
- `fact_support_cases.station_id` to `dim_station.station_id`
- `fact_support_cases.date_key` to `dim_date.date_key`
- `fact_shifts.station_id` to `dim_station.station_id`
- `fact_shifts.staff_id` to `dim_staff.staff_id`
- `fact_shifts.date_key` to `dim_date.date_key`
- `fact_service_disruptions.station_id` to `dim_station.station_id`
- `fact_service_disruptions.date_key` to `dim_date.date_key`
- `monthly_operational_kpis.station_id` to `dim_station.station_id`

## Qlik Sense Modeling Notes

Qlik associates fields by identical names. To keep the model clean:

- Keep shared keys named consistently: `station_id`, `date_key`, `staff_id`, `incident_type_id`.
- Avoid loading duplicate descriptive fields into facts when they already exist in dimensions.
- Use a station-date link table when loading multiple fact tables in Qlik. Each row-level fact should carry a composite `%StationDateKey`, while the link table carries `%StationDateKey`, `station_id`, and `date_key`.
- Consider a canonical date approach only if the app needs one shared date filter across opened, closed, shift, and disruption timestamps.
- Use `monthly_operational_kpis` for executive trends where pre-aggregated station-month reporting is acceptable.
- Use row-level facts for drill-down views and SLA diagnostics.

## Known Data Quality Conditions

The sample data intentionally includes realistic issues:

- `resolved_at` is blank for open, in-progress, and many escalated incidents.
- `resolution_minutes` is blank when an incident has not been resolved.
- `closed_at` and `handling_hours` are blank for unresolved support cases.
- Some older records remain open to simulate backlog leakage.
- Cancelled and no-show shifts have zero `actual_hours`.
- Partial shifts create coverage gaps without being fully missed.

These conditions should be handled explicitly in dashboard expressions and filter design.
