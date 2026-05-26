# Business Case

## Context

TransitOps Analytics simulates a regional transportation operations company managing multi-line rail, metro, and bus interchange stations. The operations team is responsible for passenger safety, station readiness, incident response, customer support, staffing coverage, and service disruption coordination.

Current reporting is fragmented across manual station logs, shift rosters, support exports, incident spreadsheets, and monthly performance packs. The result is slow reporting, inconsistent KPI definitions, and limited visibility into recurring operational issues.

## Operational Pain Points

- Station managers cannot easily compare incident volume, staffing coverage, and support demand across stations.
- Response-time performance is tracked manually, making SLA breach patterns hard to detect.
- Passenger support cases are reviewed as individual tickets rather than operational trends.
- Repeated asset and crowding issues are not consistently linked to station risk.
- Open incidents and unresolved support cases can remain hidden in spreadsheet tabs.
- Staffing shortages are visible locally but not compared across the full network.

## Target Users

- **Operations Manager**: needs network-level visibility, trends, risk ranking, and SLA performance.
- **Station Manager**: needs station-specific incident, support, staffing, and disruption context.
- **Service Coordinator**: needs daily workload, unresolved cases, and recurring issue patterns.
- **Passenger Support Lead**: needs complaint categories, handling time, repeat contact, and resolution rates.

## Decisions Supported

- Reallocate relief staff to stations with persistent coverage gaps.
- Prioritize facilities work orders at stations with repeated escalator, lift, or water-ingress issues.
- Escalate stations with high open incident counts and repeated SLA breaches.
- Identify passenger support categories that require process fixes or better station communication.
- Review monthly performance packs using consistent, documented KPI definitions.

## Portfolio Value

This project demonstrates:

- SQL table design and analytical modeling
- star-schema thinking for BI tools
- realistic KPI design
- Qlik Sense load scripting and master-measure planning
- dashboard requirements writing
- operational business understanding
- data quality awareness
