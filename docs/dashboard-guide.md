# Dashboard Guide

The Qlik Sense application should feel like an internal operations report, not a marketing dashboard. Use dense, scannable layouts, concise KPI labels, station and month filters, and tables that support follow-up action.

## Global Filters

Recommended filter pane:

- Month
- Station
- Line group
- City area
- Risk band
- Incident category
- Severity
- Case category
- Shift status

## Sheet A: Executive Overview

Purpose: give senior operations users a quick view of current network health.

KPI objects:

- Total incidents
- Average response time
- Resolved support cases
- Open support cases
- SLA breach rate
- Staffing coverage percentage

Charts:

- Monthly incident trend by `month_key`
- Busiest stations by incident count
- Open incidents by station
- Station risk score ranking
- Support cases by category

Manager questions:

- Are incident levels rising?
- Which stations need immediate review?
- Is response performance inside SLA?

## Sheet B: Station Performance

Purpose: compare station operational load and risk.

Objects:

- Incidents by station
- Support cases by station
- Average resolution time
- Staffing coverage percentage
- Station risk score
- Open incident backlog

Recommended visual types:

- ranked bar chart for incidents by station
- heatmap for station risk by month
- KPI table with conditional formatting
- scatter plot: incident count versus coverage percentage

Manager questions:

- Which stations are high incident and low coverage?
- Are support cases concentrated in the same locations as incidents?
- Which station risk scores are trending upward?

## Sheet C: Incident Analytics

Purpose: understand incident mix, severity, response performance, and recurring issues.

Objects:

- Incident type breakdown
- Severity distribution
- Average response time by incident category
- SLA breach rate by incident type
- Repeat issue flag trend
- Unresolved incidents table

Recommended unresolved incident table fields:

- `incident_id`
- `opened_at`
- `station_name`
- `incident_type`
- `severity`
- `status`
- `response_minutes`
- `operational_note`

Manager questions:

- Which incident types repeatedly breach SLA?
- Are unresolved incidents aging outside expected handling windows?
- Which categories require process or asset intervention?

## Sheet D: Staffing & Shift Coverage

Purpose: identify coverage gaps and workload imbalance.

Objects:

- Staff coverage by station
- Missed coverage count
- Shift load by day and shift type
- Employee workload distribution
- Cancelled and no-show shift trend

Recommended visual types:

- station coverage table with red/amber/green thresholds
- stacked bar by shift status
- employee workload bar chart
- station-month coverage heatmap

Manager questions:

- Where are partial and cancelled shifts creating operational risk?
- Are high-risk stations receiving enough planned coverage?
- Is workload concentrated among a small group of employees?

## Sheet E: Passenger Support

Purpose: connect passenger-facing service demand to operational conditions.

Objects:

- Support cases by category
- Complaint trend by month
- Resolved versus unresolved cases
- Average handling time
- Repeat contact rate
- SLA breach rate for support cases

Recommended visual types:

- category bar chart
- monthly line trend
- case status distribution
- handling time by category
- open cases table

Manager questions:

- Which support categories are driving complaints?
- Are unresolved cases tied to specific stations or disruption patterns?
- Where should passenger communications or station processes improve?
