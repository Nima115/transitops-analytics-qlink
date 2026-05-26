# KPI Definitions

This document defines the main KPIs for TransitOps Analytics. Qlik expressions are examples and may be adjusted to match final field naming conventions.

## Average Response Time

Measures how long it takes from incident open time to first response.

```qlik
Avg(response_minutes)
```

Recommended format: minutes with one decimal place.

## Incident Resolution Rate

Percentage of incidents resolved out of all recorded incidents.

```qlik
Count({<status={'Resolved'}>} DISTINCT incident_id)
/
Count(DISTINCT incident_id)
```

## Support Case Resolution Rate

Percentage of passenger support cases closed as resolved.

```qlik
Count({<case_status={'Resolved'}>} DISTINCT support_case_id)
/
Count(DISTINCT support_case_id)
```

## Staffing Coverage Percentage

Actual staff hours delivered divided by planned staff hours.

```qlik
Sum(actual_hours) / Sum(planned_hours)
```

Use a percentage format. Values below 90% should be highlighted for station review.

## SLA Breach Rate

Percentage of incidents where first response exceeded the incident-type SLA target.

```qlik
Count({<sla_response_breached_flag={'Y'}>} DISTINCT incident_id)
/
Count(DISTINCT incident_id)
```

## Monthly Incident Growth

Month-over-month change in incident volume.

```qlik
(
  Count(DISTINCT incident_id)
  - Above(Count(DISTINCT incident_id))
)
/
Above(Count(DISTINCT incident_id))
```

Use this in a monthly trend chart sorted by `month_key`.

## Station Risk Score

Composite score from 0 to 100 combining incident volume, unresolved work, SLA breaches, repeat issues, and staffing coverage gap.

Recommended logic:

```qlik
RangeMin(
  100,
  Count(DISTINCT incident_id) * 0.55
  + Count({<status={'Open','Escalated','In Progress'}>} DISTINCT incident_id) * 2.4
  + (
      Count({<sla_response_breached_flag={'Y'}>} DISTINCT incident_id)
      / Count(DISTINCT incident_id)
    ) * 100 * 0.35
  + (100 - ((Sum(actual_hours) / Sum(planned_hours)) * 100)) * 0.5
  + (
      Count({<repeat_issue_flag={'Y'}>} DISTINCT incident_id)
      / Count(DISTINCT incident_id)
    ) * 100 * 0.28
)
```

Risk score interpretation:

| Score | Band | Operational Meaning |
| --- | --- | --- |
| 0-39 | Low | Stable station performance |
| 40-69 | Medium | Monitor for recurring issues or coverage gaps |
| 70-100 | High | Requires manager review and action plan |

## Open Case Count

Support cases still requiring action.

```qlik
Count({<case_status={'Open','Escalated','Pending Customer'}>} DISTINCT support_case_id)
```

## Average Handling Time

Average passenger support handling time for resolved cases.

```qlik
Avg({<case_status={'Resolved'}>} handling_hours)
```

## Missed Coverage Count

Number of shifts where planned hours were not fully delivered.

```qlik
Count({<missed_coverage_flag={'Y'}>} DISTINCT shift_id)
```
