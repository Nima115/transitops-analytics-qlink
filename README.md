# TransitOps Analytics

TransitOps Analytics is a realistic BI portfolio project for public transportation and station service operations. It is designed as a Qlik Sense-style internal reporting solution for operations managers, station managers, service coordinators, and passenger support leads.

The project focuses on operational visibility: station incidents, response times, support cases, staffing coverage, service disruptions, recurring issue patterns, and monthly KPI tracking.

## Business Problem

Transit operations teams often work from separate spreadsheets, control-room logs, staffing rosters, and support exports. Managers need one trusted dashboard to answer questions such as:

- Which stations are creating the highest operational risk?
- Are incidents being acknowledged and resolved inside SLA?
- Where is staffing coverage below plan?
- Which support categories are generating repeat passenger contact?
- Are service issues improving month over month?

## Project Structure

```text
transitops-analytics-qlink/
  data/
    dim_date.csv
    dim_incident_type.csv
    dim_staff.csv
    dim_station.csv
    fact_incidents.csv
    fact_response_times.csv
    fact_service_disruptions.csv
    fact_shifts.csv
    fact_support_cases.csv
    monthly_operational_kpis.csv
  docs/
    business-case.md
    dashboard-guide.md
    data-model.md
    kpi-definitions.md
  qlik/
    transitops-load-script.qvs
  sql/
    schema.sql
  preview/
    index.html
    styles.css
  scripts/
    generate_transitops_data.mjs
```

## Dataset

The sample data covers January 2025 through April 2026 and includes realistic operational imperfections:

- delayed incident responses and SLA breaches
- open and escalated incidents from older periods
- missing resolution fields for unresolved records
- cancelled, partial, and no-show shifts
- high-risk interchange stations with heavier incident volume
- repeated issue categories such as escalator faults, platform crowding, and ticketing failures

Regenerate the CSV files with:

```bash
node scripts/generate_transitops_data.mjs
```

## Dashboard Views

The intended Qlik Sense application contains five sheets:

1. **Executive Overview**: total incidents, average response time, resolved cases, open cases, busiest stations, and monthly incident trend.
2. **Station Performance**: incident volume, support cases, resolution time, staffing coverage, and station risk score.
3. **Incident Analytics**: type breakdown, severity levels, response performance, repeated issues, and unresolved incidents.
4. **Staffing & Shift Coverage**: coverage by station, missed coverage, shift load, and employee workload distribution.
5. **Passenger Support**: case categories, complaint trends, resolved versus unresolved cases, and average handling time.

## Core KPIs

- Average response time
- Incident resolution rate
- Support case resolution rate
- Station risk score
- Staffing coverage percentage
- Monthly incident growth
- SLA breach rate

Detailed formulas are documented in [docs/kpi-definitions.md](docs/kpi-definitions.md).

## Qlik Sense Build Assets

- Use [qlik/transitops-load-script.qvs](qlik/transitops-load-script.qvs) as the app load-script starting point.
- Use [docs/dashboard-guide.md](docs/dashboard-guide.md) for sheet requirements and recommended filters.
- Use [docs/data-model.md](docs/data-model.md) for the star-schema design and table grain.
- Use [sql/schema.sql](sql/schema.sql) if loading the project into a SQL warehouse first.

## Static Preview

A lightweight static mockup is included in `preview/` to show the intended internal dashboard style. Open [preview/index.html](preview/index.html) in a browser to view it.

This preview is not meant to replace Qlik Sense. It is a portfolio artifact that communicates dashboard structure, KPI framing, and operations-reporting tone.
