import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");

let seed = 4217;
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function int(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function choice(items) {
  return items[int(0, items.length - 1)];
}

function weighted(items, weightKey = "weight") {
  const total = items.reduce((sum, item) => sum + item[weightKey], 0);
  let point = rand() * total;
  for (const item of items) {
    point -= item[weightKey];
    if (point <= 0) return item;
  }
  return items[items.length - 1];
}

function normal(mean, sd) {
  const u = 1 - rand();
  const v = rand();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function dateKey(d) {
  return Number(d.toISOString().slice(0, 10).replaceAll("-", ""));
}

function monthKey(d) {
  return d.toISOString().slice(0, 7);
}

function addDays(d, days) {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function addMinutes(d, minutes) {
  const next = new Date(d);
  next.setUTCMinutes(next.getUTCMinutes() + minutes);
  return next;
}

function addHours(d, hours) {
  return addMinutes(d, hours * 60);
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function isoDateTime(d) {
  if (!d) return "";
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function csvValue(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(fileName, rows) {
  if (!rows.length) throw new Error(`No rows generated for ${fileName}`);
  fs.mkdirSync(dataDir, { recursive: true });
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvValue(row[header])).join(","));
  }
  fs.writeFileSync(path.join(dataDir, fileName), `${lines.join("\n")}\n`, "utf8");
}

const stations = [
  ["ST001", "Central Terminal", "Blue / Red", "Downtown", "Interchange", 1978, 8, 126000, "High", 2.4],
  ["ST002", "Harbor Exchange", "Blue", "Waterfront", "Interchange", 1986, 6, 88000, "High", 1.8],
  ["ST003", "Northgate Junction", "Green / Red", "North Corridor", "Interchange", 1994, 5, 71000, "Medium", 1.45],
  ["ST004", "Riverside Market", "Green", "Riverside", "Urban", 2002, 3, 43000, "Medium", 1.1],
  ["ST005", "Oak Park", "Green", "West District", "Neighborhood", 1998, 2, 26000, "Low", 0.65],
  ["ST006", "Airport Connector", "Silver", "Airport Zone", "Terminal", 2011, 4, 65000, "High", 1.7],
  ["ST007", "Eastbridge", "Red", "East District", "Urban", 1990, 4, 52000, "Medium", 1.25],
  ["ST008", "University Square", "Red", "Campus", "Urban", 2007, 3, 57000, "Medium", 1.2],
  ["ST009", "South Ferry", "Blue", "South Waterfront", "Terminal", 1982, 4, 49000, "Medium", 1.2],
  ["ST010", "Civic Center", "Blue / Gold", "Downtown", "Interchange", 1975, 7, 98000, "High", 2.0],
  ["ST011", "Maple Yard", "Gold", "Maintenance Belt", "Depot Adjacent", 1969, 2, 18000, "Low", 0.5],
  ["ST012", "Westbrook", "Gold", "West District", "Neighborhood", 2001, 2, 22000, "Low", 0.6],
  ["ST013", "Medical District", "Silver", "Hospital Zone", "Urban", 2014, 3, 46000, "Medium", 1.0],
  ["ST014", "Old Town", "Gold", "Historic Core", "Urban", 1958, 2, 34000, "Medium", 0.95],
  ["ST015", "Expo Grounds", "Silver", "Events District", "Event Station", 2017, 4, 39000, "Medium", 1.05],
  ["ST016", "Lakeside", "Green", "North Waterfront", "Neighborhood", 2009, 2, 21000, "Low", 0.55],
].map(([station_id, station_name, line_group, city_area, station_type, opened_year, platform_count, daily_passenger_volume, risk_band, weight]) => ({
  station_id,
  station_name,
  line_group,
  city_area,
  station_type,
  opened_year,
  platform_count,
  daily_passenger_volume,
  risk_band,
  weight,
}));

const incidentTypes = [
  ["IT001", "Safety", "Platform crowding", "Major", 12, 4, "Station Operations", 1.4],
  ["IT002", "Safety", "Medical assistance", "Critical", 6, 2, "Station Operations", 0.8],
  ["IT003", "Security", "Anti-social behaviour", "Major", 10, 6, "Security Control", 1.2],
  ["IT004", "Security", "Suspicious package", "Critical", 5, 3, "Security Control", 0.25],
  ["IT005", "Asset", "Escalator out of service", "Moderate", 30, 24, "Facilities", 1.4],
  ["IT006", "Asset", "Lift unavailable", "Major", 20, 18, "Facilities", 1.1],
  ["IT007", "Service", "Train holding at platform", "Moderate", 15, 3, "Service Control", 1.35],
  ["IT008", "Service", "Bus replacement queueing", "Major", 12, 5, "Service Control", 0.55],
  ["IT009", "Customer", "Ticketing gate failure", "Moderate", 25, 12, "Revenue Protection", 1.0],
  ["IT010", "Customer", "Passenger information display fault", "Minor", 45, 24, "Digital Operations", 0.95],
  ["IT011", "Cleaning", "Spill or biohazard", "Moderate", 20, 8, "Station Cleaning", 0.9],
  ["IT012", "Weather", "Water ingress", "Major", 15, 10, "Facilities", 0.45],
].map(([incident_type_id, incident_category, incident_type, default_severity, sla_response_minutes, sla_resolution_hours, operational_owner, weight]) => ({
  incident_type_id,
  incident_category,
  incident_type,
  default_severity,
  sla_response_minutes,
  sla_resolution_hours,
  operational_owner,
  weight,
}));

function buildDates(start, end) {
  const rows = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    const day = d.getUTCDay();
    const month = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();
    const quarter = Math.floor((month - 1) / 3) + 1;
    rows.push({
      date_key: dateKey(d),
      date: isoDate(d),
      year,
      quarter: `Q${quarter}`,
      month,
      month_name: d.toLocaleString("en-US", { month: "long", timeZone: "UTC" }),
      month_key: monthKey(d),
      week: Math.ceil((((d - new Date(Date.UTC(year, 0, 1))) / 86400000) + new Date(Date.UTC(year, 0, 1)).getUTCDay() + 1) / 7),
      day_of_week: d.toLocaleString("en-US", { weekday: "long", timeZone: "UTC" }),
      is_weekend: day === 0 || day === 6 ? "Y" : "N",
      is_public_holiday: ["01-01", "05-01", "12-25", "12-26"].includes(isoDate(d).slice(5)) ? "Y" : "N",
    });
  }
  return rows;
}

function buildStaff() {
  const first = ["Maya", "Jonas", "Priya", "Elias", "Noah", "Amina", "Sofia", "Liam", "Nora", "Oskar", "Hanna", "Theo", "Leila", "Erik", "Clara", "Samir"];
  const last = ["Andersson", "Patel", "Lind", "Khan", "Berg", "Svensson", "Nordin", "Ali", "Johansson", "Muller", "Hassan", "Nyberg", "Larsson", "Dahl", "Sharma", "Costa"];
  const roles = [
    { role: "Station Manager", weight: 8 },
    { role: "Service Coordinator", weight: 18 },
    { role: "Customer Support Officer", weight: 22 },
    { role: "Platform Assistant", weight: 24 },
    { role: "Security Liaison", weight: 12 },
    { role: "Maintenance Technician", weight: 10 },
    { role: "Revenue Protection Officer", weight: 6 },
  ];
  const rows = [];
  for (let i = 1; i <= 64; i++) {
    const primary = choice(stations);
    let secondary = choice(stations);
    while (secondary.station_id === primary.station_id) secondary = choice(stations);
    const hired = addDays(new Date(Date.UTC(2016, 0, 1)), int(0, 3300));
    rows.push({
      staff_id: `EMP${String(i).padStart(4, "0")}`,
      staff_name: `${choice(first)} ${choice(last)}`,
      role: weighted(roles).role,
      home_station_id: primary.station_id,
      secondary_station_id: secondary.station_id,
      contract_type: weighted([{ value: "Full-time", weight: 60 }, { value: "Part-time", weight: 22 }, { value: "Agency", weight: 10 }, { value: "Relief", weight: 8 }]).value,
      hire_date: isoDate(hired),
      active_flag: rand() > 0.06 ? "Y" : "N",
    });
  }
  return rows;
}

function buildShifts(start, end, staff) {
  const rows = [];
  const byStation = new Map(stations.map((s) => [s.station_id, []]));
  for (const person of staff) {
    byStation.get(person.home_station_id).push(person);
    byStation.get(person.secondary_station_id).push(person);
  }
  const shiftTemplates = [
    ["Early", "05:30", "13:30", 8],
    ["Day", "09:00", "17:00", 8],
    ["Late", "14:30", "22:30", 8],
    ["Night", "22:00", "06:00", 8],
  ];
  let id = 1;
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    for (const station of stations) {
      const templates = shiftTemplates.slice(0, 3);
      if (station.risk_band === "High" || rand() < 0.22) templates.push(shiftTemplates[3]);
      for (const [shiftType, scheduledStart, scheduledEnd, plannedHours] of templates) {
        let slots = 1;
        if (station.daily_passenger_volume > 80000 && ["Day", "Late"].includes(shiftType)) slots = 2;
        if (d.getUTCDay() === 6 && shiftType === "Day" && station.station_type === "Event Station") slots = 2;
        for (let slot = 0; slot < slots; slot++) {
          const status = weighted([
            { value: "Completed", weight: 85 },
            { value: "Partial", weight: 8 },
            { value: "Cancelled", weight: 5 },
            { value: "No Show", weight: 2 },
          ]).value;
          const actualHours = status === "Completed" ? plannedHours : status === "Partial" ? Number((3 + rand() * 3.5).toFixed(1)) : 0;
          const pool = byStation.get(station.station_id);
          rows.push({
            shift_id: `SH${String(id++).padStart(6, "0")}`,
            date_key: dateKey(d),
            shift_date: isoDate(d),
            station_id: station.station_id,
            staff_id: choice(pool).staff_id,
            shift_type: shiftType,
            scheduled_start: scheduledStart,
            scheduled_end: scheduledEnd,
            planned_hours: plannedHours,
            actual_hours: actualHours,
            shift_status: status,
            missed_coverage_flag: actualHours < plannedHours ? "Y" : "N",
          });
        }
      }
    }
  }
  return rows;
}

function buildIncidents(start, end) {
  const rows = [];
  const locations = ["northbound platform", "ticket hall", "main concourse", "lift lobby", "bus interchange", "staffed gate line", "platform stairs", "customer help point"];
  const notes = ["repeat complaint from morning peak", "linked to crowd control plan", "requires facilities follow-up", "temporary signage installed", "passenger assistance team notified", "manual log entry from station desk", "reported by service controller", "seen in previous two weeks"];
  const endTime = end.getTime();
  let id = 1;
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    const weekdayFactor = d.getUTCDay() >= 1 && d.getUTCDay() <= 5 ? 1.25 : 0.78;
    const winterFactor = [0, 1, 10, 11].includes(d.getUTCMonth()) ? 1.15 : 1;
    const count = Math.round(weighted([{ value: 1, weight: 18 }, { value: 2, weight: 25 }, { value: 3, weight: 22 }, { value: 4, weight: 15 }, { value: 5, weight: 10 }, { value: 6, weight: 6 }, { value: 7, weight: 4 }]).value * weekdayFactor * winterFactor);
    for (let i = 0; i < count; i++) {
      const station = weighted(stations);
      const type = weighted(incidentTypes);
      const openedAt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), int(5, 23), int(0, 59)));
      let severity = weighted([{ value: "Minor", weight: 18 }, { value: "Moderate", weight: 48 }, { value: "Major", weight: 27 }, { value: "Critical", weight: 7 }]).value;
      if (type.default_severity === "Critical" && rand() < 0.65) severity = "Critical";
      if (station.risk_band === "High" && rand() < 0.14) severity = choice(["Major", "Critical"]);
      let responseMinutes = Math.max(1, Math.round(normal(type.sla_response_minutes * 0.95, type.sla_response_minutes * 0.55)));
      if (rand() < (station.risk_band === "High" ? 0.18 : 0.1)) responseMinutes += int(10, 75);
      let resolutionMinutes = Math.max(20, Math.round(normal(type.sla_resolution_hours * 60 * 0.88, type.sla_resolution_hours * 60 * 0.65)));
      if (rand() < 0.16) resolutionMinutes += int(120, 1400);
      let status = weighted([{ value: "Resolved", weight: 87 }, { value: "In Progress", weight: 6 }, { value: "Open", weight: 5 }, { value: "Escalated", weight: 2 }]).value;
      if (openedAt.getTime() < endTime - 120 * 86400000 && rand() < 0.012) status = choice(["Open", "Escalated"]);
      if (openedAt.getTime() > endTime - 14 * 86400000 && rand() < 0.2) status = choice(["Open", "In Progress"]);
      const resolvedAt = status === "Resolved" ? addMinutes(openedAt, resolutionMinutes) : "";
      rows.push({
        incident_id: `INC${String(id++).padStart(6, "0")}`,
        date_key: dateKey(openedAt),
        station_id: station.station_id,
        incident_type_id: type.incident_type_id,
        opened_at: isoDateTime(openedAt),
        first_response_at: isoDateTime(addMinutes(openedAt, responseMinutes)),
        resolved_at: resolvedAt ? isoDateTime(resolvedAt) : "",
        status,
        severity,
        response_minutes: responseMinutes,
        resolution_minutes: resolvedAt ? resolutionMinutes : "",
        sla_response_breached_flag: responseMinutes > type.sla_response_minutes ? "Y" : "N",
        sla_resolution_breached_flag: resolvedAt && resolutionMinutes > type.sla_resolution_hours * 60 ? "Y" : "N",
        reported_channel: choice(["Station Desk", "Control Room", "Mobile Radio", "Passenger Help Point", "Supervisor Walkthrough"]),
        location_detail: choice(locations),
        operational_note: choice(notes),
        repeat_issue_flag: rand() < (station.risk_band === "High" ? 0.18 : 0.09) ? "Y" : "N",
      });
    }
  }
  return rows;
}

function buildSupportCases(start, end) {
  const categories = [
    ["Ticketing / Refund", 1.35, 48],
    ["Accessibility Assistance", 0.85, 12],
    ["Lost Property", 1.0, 72],
    ["Delay Compensation", 1.15, 96],
    ["Staff Conduct", 0.42, 72],
    ["Information Request", 1.05, 24],
    ["Cleanliness Complaint", 0.55, 36],
    ["Service Disruption Complaint", 1.2, 72],
  ].map(([category, weight, target]) => ({ category, weight, target }));
  const endTime = end.getTime();
  const rows = [];
  let id = 1;
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    let count = weighted([{ value: 2, weight: 10 }, { value: 3, weight: 18 }, { value: 4, weight: 22 }, { value: 5, weight: 20 }, { value: 6, weight: 14 }, { value: 7, weight: 10 }, { value: 8, weight: 6 }]).value;
    if (d.getUTCDay() === 1) count += 2;
    for (let i = 0; i < count; i++) {
      const station = weighted(stations);
      const category = weighted(categories);
      const openedAt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), int(6, 22), int(0, 59)));
      let status = weighted([{ value: "Resolved", weight: 76 }, { value: "Pending Customer", weight: 10 }, { value: "Open", weight: 10 }, { value: "Escalated", weight: 4 }]).value;
      if (openedAt.getTime() < endTime - 90 * 86400000 && rand() < 0.01) status = choice(["Open", "Escalated"]);
      let handlingHours = Math.max(1, Math.round(normal(category.target * 0.8, category.target * 0.5)));
      if (rand() < 0.14) handlingHours += int(24, 160);
      const closedAt = status === "Resolved" ? addHours(openedAt, handlingHours) : "";
      rows.push({
        support_case_id: `CASE${String(id++).padStart(6, "0")}`,
        date_key: dateKey(openedAt),
        station_id: station.station_id,
        opened_at: isoDateTime(openedAt),
        closed_at: closedAt ? isoDateTime(closedAt) : "",
        case_category: category.category,
        case_status: status,
        priority: weighted([{ value: "Low", weight: 28 }, { value: "Medium", weight: 48 }, { value: "High", weight: 19 }, { value: "Urgent", weight: 5 }]).value,
        channel: choice(["Web Form", "Contact Centre", "Station Desk", "Mobile App", "Email"]),
        handling_hours: closedAt ? handlingHours : "",
        sla_target_hours: category.target,
        sla_breached_flag: closedAt && handlingHours > category.target ? "Y" : "N",
        repeat_contact_flag: rand() < 0.16 ? "Y" : "N",
      });
    }
  }
  return rows;
}

function buildDisruptions(start, end) {
  const reasons = [
    ["Signal failure", "Infrastructure"],
    ["Rolling stock fault", "Fleet"],
    ["Staff shortage", "Operations"],
    ["Police attendance", "External"],
    ["Severe weather", "Weather"],
    ["Track obstruction", "Infrastructure"],
    ["Power supply restriction", "Infrastructure"],
    ["Planned engineering overrun", "Engineering"],
  ];
  const rows = [];
  let id = 1;
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    if (rand() > 0.42) continue;
    const count = weighted([{ value: 1, weight: 74 }, { value: 2, weight: 21 }, { value: 3, weight: 5 }]).value;
    for (let i = 0; i < count; i++) {
      const station = weighted(stations);
      const [reason, owner] = choice(reasons);
      const startedAt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), int(5, 22), int(0, 59)));
      let duration = Math.max(8, Math.round(normal(42, 38)));
      if (rand() < 0.11) duration += int(90, 360);
      rows.push({
        disruption_id: `DIS${String(id++).padStart(5, "0")}`,
        date_key: dateKey(startedAt),
        station_id: station.station_id,
        line_group: station.line_group,
        started_at: isoDateTime(startedAt),
        ended_at: isoDateTime(addMinutes(startedAt, duration)),
        disruption_reason: reason,
        owner_group: owner,
        service_impact: weighted([{ value: "Minor delay", weight: 44 }, { value: "Moderate delay", weight: 34 }, { value: "Severe delay", weight: 17 }, { value: "Partial closure", weight: 5 }]).value,
        delay_minutes: duration,
        passengers_estimated_impacted: Math.round((duration * station.daily_passenger_volume) / int(1800, 3600)),
      });
    }
  }
  return rows;
}

function buildResponseTimes(incidents, supportCases) {
  const rows = [];
  let id = 1;
  for (const incident of incidents) {
    rows.push({
      response_id: `RT${String(id++).padStart(6, "0")}`,
      source_type: "Incident",
      source_id: incident.incident_id,
      station_id: incident.station_id,
      date_key: incident.date_key,
      acknowledged_minutes: Math.max(1, Math.round(incident.response_minutes * (0.25 + rand() * 0.3))),
      dispatch_minutes: Math.max(1, Math.round(incident.response_minutes * (0.45 + rand() * 0.4))),
      site_arrival_minutes: incident.response_minutes,
      resolution_minutes: incident.resolution_minutes,
      sla_breached_flag: incident.sla_response_breached_flag,
    });
  }
  for (const supportCase of supportCases.filter(() => rand() < 0.32)) {
    const acknowledge = int(1, 36) * 60;
    rows.push({
      response_id: `RT${String(id++).padStart(6, "0")}`,
      source_type: "Support Case",
      source_id: supportCase.support_case_id,
      station_id: supportCase.station_id,
      date_key: supportCase.date_key,
      acknowledged_minutes: acknowledge,
      dispatch_minutes: "",
      site_arrival_minutes: "",
      resolution_minutes: supportCase.handling_hours === "" ? "" : supportCase.handling_hours * 60,
      sla_breached_flag: supportCase.sla_breached_flag,
    });
  }
  return rows;
}

function byMonth(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = `${row.station_id}|${String(row.date_key).slice(0, 6)}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return map;
}

function buildMonthlyKpis(incidents, supportCases, shifts) {
  const incidentMap = byMonth(incidents);
  const supportMap = byMonth(supportCases);
  const shiftMap = byMonth(shifts);
  const months = [...new Set([...incidents, ...supportCases, ...shifts].map((row) => String(row.date_key).slice(0, 6)))].sort();
  const rows = [];
  const previous = new Map();
  for (const station of stations) {
    for (const rawMonth of months) {
      const key = `${station.station_id}|${rawMonth}`;
      const stationIncidents = incidentMap.get(key) ?? [];
      const stationCases = supportMap.get(key) ?? [];
      const stationShifts = shiftMap.get(key) ?? [];
      const resolvedIncidents = stationIncidents.filter((row) => row.status === "Resolved");
      const resolvedCases = stationCases.filter((row) => row.case_status === "Resolved");
      const planned = stationShifts.reduce((sum, row) => sum + Number(row.planned_hours), 0);
      const actual = stationShifts.reduce((sum, row) => sum + Number(row.actual_hours), 0);
      const responseValues = stationIncidents.map((row) => Number(row.response_minutes)).filter(Boolean);
      const slaBreaches = stationIncidents.filter((row) => row.sla_response_breached_flag === "Y").length;
      const openIncidents = stationIncidents.filter((row) => ["Open", "Escalated", "In Progress"].includes(row.status)).length;
      const coverage = planned ? Number(((actual / planned) * 100).toFixed(1)) : 0;
      const incidentResolution = stationIncidents.length ? Number(((resolvedIncidents.length / stationIncidents.length) * 100).toFixed(1)) : 0;
      const slaBreachRate = stationIncidents.length ? Number(((slaBreaches / stationIncidents.length) * 100).toFixed(1)) : 0;
      const repeatRate = stationIncidents.length ? stationIncidents.filter((row) => row.repeat_issue_flag === "Y").length / stationIncidents.length : 0;
      const riskScore = Math.min(100, Number((stationIncidents.length * 0.55 + openIncidents * 2.4 + slaBreachRate * 0.35 + (100 - coverage) * 0.5 + repeatRate * 28).toFixed(1)));
      const prior = previous.get(station.station_id);
      const growth = prior ? Number((((stationIncidents.length - prior) / prior) * 100).toFixed(1)) : "";
      previous.set(station.station_id, stationIncidents.length);
      rows.push({
        month_key: `${rawMonth.slice(0, 4)}-${rawMonth.slice(4)}`,
        station_id: station.station_id,
        incident_count: stationIncidents.length,
        support_case_count: stationCases.length,
        resolved_incident_count: resolvedIncidents.length,
        resolved_support_case_count: resolvedCases.length,
        open_incident_count: openIncidents,
        avg_response_minutes: responseValues.length ? Number((responseValues.reduce((a, b) => a + b, 0) / responseValues.length).toFixed(1)) : "",
        staffing_coverage_pct: coverage,
        incident_resolution_rate_pct: incidentResolution,
        sla_breach_rate_pct: slaBreachRate,
        station_risk_score: riskScore,
        monthly_incident_growth_pct: growth,
      });
    }
  }
  return rows;
}

const start = new Date(Date.UTC(2025, 0, 1));
const end = new Date(Date.UTC(2026, 3, 30));
const staff = buildStaff();
const dates = buildDates(start, end);
const shifts = buildShifts(start, end, staff);
const incidents = buildIncidents(start, end);
const supportCases = buildSupportCases(start, end);
const disruptions = buildDisruptions(start, end);
const responseTimes = buildResponseTimes(incidents, supportCases);
const monthlyKpis = buildMonthlyKpis(incidents, supportCases, shifts);

writeCsv("dim_station.csv", stations.map(({ weight, ...row }) => row));
writeCsv("dim_incident_type.csv", incidentTypes.map(({ weight, ...row }) => row));
writeCsv("dim_staff.csv", staff);
writeCsv("dim_date.csv", dates);
writeCsv("fact_shifts.csv", shifts);
writeCsv("fact_incidents.csv", incidents);
writeCsv("fact_support_cases.csv", supportCases);
writeCsv("fact_service_disruptions.csv", disruptions);
writeCsv("fact_response_times.csv", responseTimes);
writeCsv("monthly_operational_kpis.csv", monthlyKpis);

console.log("Generated TransitOps Analytics sample data");
console.table({
  stations: stations.length,
  staff: staff.length,
  dates: dates.length,
  shifts: shifts.length,
  incidents: incidents.length,
  support_cases: supportCases.length,
  service_disruptions: disruptions.length,
  response_time_records: responseTimes.length,
  monthly_kpi_rows: monthlyKpis.length,
});
