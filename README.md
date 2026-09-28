# TimeFit

## Project Description

A compact framework for constructing time-based Just-In-Time Adaptive Interventions (JITAIs): declare when to decide, who is eligible, what conditions must hold, and which (optionally randomized) intervention to deliver, with an auditable decision log for micro-randomized trials.

Note: This project is periodically updated. Watch the repository for updates.

## Citation

If you use this software, please cite it as below.
```

Hung, P-Y, & Newman, M. W. (2025). TimeFit (Version 0.0.1) [Computer software]. https://github.com/MIACollaborative/time-fit

```


## Getting started

Requires Node.js 20 or later and [Yarn](https://yarnpkg.com/) 4 (via Corepack).

```bash
corepack enable
yarn install
yarn test        # full test suite
yarn example1    # desktop reminder every 30 minutes on weekdays (no database)
```

The library is split into three packages (published under `@time-fit/*` in a later release):

| Package | Purpose |
|---|---|
| [`@time-fit/core`](packages/core/) | The time-based decision engine: tasks, checkpoints, eligibility, preconditions, randomized outcomes, and an auditable decision log. Includes an in-memory store (`/memory`) and adapter conformance checks (`/testing`). |
| [`@time-fit/storage-prisma`](packages/storage-prisma/) | Stores participants, tasks, and decisions with a Prisma client you provide (SQLite and Postgres schema fragments included). |
| [`@time-fit/integrations`](packages/integrations/) | Delivery actions for desktop notifications, Twilio SMS, and Mailjet email, using clients you provide. |

Design decisions are recorded in [`docs/adr/`](docs/adr/); the refactoring plan and progress
are in [`docs/`](docs/).

## Examples

- [Example 1: Nudge yourself to take a break every 30 minutes on weekdays](examples/example1.md)
- [Quickstart: a randomized reminder for one participant, in about 20 lines](examples/quickstart/index.mjs)
- [Prisma: the same engine backed by a SQLite database](examples/prisma/)

The original fitbit-break study (Fitbit step-count nudges) is frozen under
[`contrib/legacy/`](contrib/legacy/README.md), with its
[setup instructions](contrib/legacy/fitbit-break/docs/setup.md) and
[walkthrough](contrib/legacy/fitbit-break/docs/fitbit-step-nudge.md).

## License

This project is open-sourced under the [BSD 3-Clause License](LICENSE.txt), allowing for free use, distribution, and modification with attribution.
