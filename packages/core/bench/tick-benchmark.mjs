import { performance } from "node:perf_hooks";
import { createTimeEngine } from "../src/index.js";
import { createMemoryStore } from "../src/memory/index.js";

const TICK_AT = new Date("2026-09-22T09:00:00.000Z");
const ZONES = Object.freeze(["UTC", "Etc/GMT", "Africa/Abidjan", "Africa/Accra", "Atlantic/Reykjavik"]);
const SIZES = Object.freeze([
  Object.freeze({ participants: 1_000, tasks: 5 }),
  Object.freeze({ participants: 10_000, tasks: 20 }),
]);
const CONCURRENCIES = Object.freeze([1, 8]);
const alwaysMetCondition = Object.freeze({
  type: "benchmark-met",
  evaluate: async () => Object.freeze({ ok: true, met: true }),
});
const alwaysUnavailableCondition = Object.freeze({
  type: "benchmark-not-met",
  evaluate: async () => Object.freeze({ ok: true, met: false }),
});

for (const size of SIZES) {
  for (const concurrency of CONCURRENCIES) {
    const measurement = await measureTick(size, concurrency);
    printMeasurement(measurement);
  }
}

async function measureTick(size, concurrency) {
  const participants = buildParticipants(size.participants);
  const tasks = buildTasks(size.tasks);
  // A tick never repeats a decision ID. Retaining one record exercises the real memory port
  // while avoiding an artificial O(N²) retention scan for this single-pass throughput probe.
  const store = createMemoryStore({ participants, tasks, maxRecords: 1 });
  const timedDecisionLog = measureDecisionLog(store.decisionLog);
  const engine = createTimeEngine({
    participants: store.participants,
    decisionLog: timedDecisionLog.port,
    tasks,
    conditions: [alwaysMetCondition, alwaysUnavailableCondition],
    options: {
      concurrency,
      pageSize: 1_000,
      maxParticipants: size.participants,
      maxTasks: size.tasks,
    },
  });
  const startedAt = performance.now();
  const summary = await engine.tick(TICK_AT);
  const elapsedMilliseconds = performance.now() - startedAt;
  const decisions = summary.counts.occurrence;
  assertExpectedDecisionCount(decisions, size);
  return Object.freeze({
    ...size,
    concurrency,
    decisions,
    elapsedMilliseconds,
    ticksPerSecond: 1_000 / elapsedMilliseconds,
    decisionsPerSecond: (decisions * 1_000) / elapsedMilliseconds,
    decisionLogMilliseconds: timedDecisionLog.totalMilliseconds(),
    unavailableClaimMilliseconds: timedDecisionLog.unavailableClaimMilliseconds(),
  });
}

function assertExpectedDecisionCount(decisions, { participants, tasks }) {
  const expected = participants * tasks;
  if (decisions !== expected) throw new Error(`benchmark expected ${expected} decisions, received ${decisions}`);
}

function buildParticipants(count) {
  return Array.from({ length: count }, (_unused, index) => Object.freeze({
    id: `participant-${String(index).padStart(6, "0")}`,
    timeZone: ZONES[index % ZONES.length],
  }));
}

function buildTasks(count) {
  return Array.from({ length: count }, (_unused, index) => createBenchmarkTask(index));
}

function createBenchmarkTask(index) {
  const checkpoint = index % 2 === 0
    ? { id: "at-nine", time: "09:00" }
    : { id: "at-nine", cron: "0 9 * * *" };
  return Object.freeze({
    id: `benchmark-task-${String(index).padStart(3, "0")}`,
    scope: "participant",
    checkpoints: [checkpoint],
    outcomes: [{ id: "control", probability: 1, action: null }],
    ...benchmarkPrecondition(index),
  });
}

function benchmarkPrecondition(index) {
  if (index % 4 === 0) return { precondition: { condition: { type: "benchmark-met" } } };
  if (index % 4 === 1) return { precondition: { condition: { type: "benchmark-not-met" } } };
  return {};
}

function measureDecisionLog(decisionLog) {
  let totalMilliseconds = 0;
  let unavailableClaimMilliseconds = 0;
  const measure = async (operation) => {
    const startedAt = performance.now();
    try {
      return await operation();
    } finally {
      totalMilliseconds += performance.now() - startedAt;
    }
  };
  return Object.freeze({
    port: Object.freeze({
      claim: async (record, claimOptions) => {
        const startedAt = performance.now();
        try {
          return await decisionLog.claim(record, claimOptions);
        } finally {
          const elapsedMilliseconds = performance.now() - startedAt;
          totalMilliseconds += elapsedMilliseconds;
          if (record.state === "unavailable") unavailableClaimMilliseconds += elapsedMilliseconds;
        }
      },
      complete: (decisionId, result) => measure(() => decisionLog.complete(decisionId, result)),
      fail: (decisionId, error) => measure(() => decisionLog.fail(decisionId, error)),
    }),
    totalMilliseconds: () => totalMilliseconds,
    unavailableClaimMilliseconds: () => unavailableClaimMilliseconds,
  });
}

function printMeasurement(measurement) {
  const fields = [
    `${measurement.participants} participants x ${measurement.tasks} tasks`,
    `concurrency=${measurement.concurrency}`,
    `decisions=${measurement.decisions}`,
    `ticks/sec=${measurement.ticksPerSecond.toFixed(3)}`,
    `decisions/sec=${measurement.decisionsPerSecond.toFixed(1)}`,
    `ms/tick=${measurement.elapsedMilliseconds.toFixed(1)}`,
    `decision-log-ms=${measurement.decisionLogMilliseconds.toFixed(1)}`,
    `unavailable-claim-ms=${measurement.unavailableClaimMilliseconds.toFixed(1)}`,
  ];
  process.stdout.write(`${fields.join(" | ")}\n`);
}
