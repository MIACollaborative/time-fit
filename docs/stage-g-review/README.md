# Stage G review record

## Section 1: fix known issues first (2026-09-28): done
| Run | File(s) | Summary |
|---|---|---|
| 0 | [run-0-codex-implementation.md](run-0-codex-implementation.md) | Flake reproduced (shared SQLite file), isolated per-run DB, alert classification |
| 1 | [review](run-1-claude-review.md) · [response](run-1-codex-response.md) | 119-line client guard replaced by plain `prisma generate`; legacy advisories documented; `@babel/core` refreshed |
| 2 | [review](run-2-claude-review.md) · [response](run-2-codex-response.md) | 8 more dev-tooling families refreshed lockfile-only (implemented by Claude; Codex at its usage limit) |
| 3 | [final review](run-3-claude-review.md) | Approved |

Outcome: 0 advisories in the publishable packages' production trees; 9 of 10 affected
dev-tooling families patched; `tar` 6.2.1 accepted as legacy-only. The storage test flake is
eliminated at its cause.

Sections 2–5 (docs, policy files, release tooling, owner decisions) are still to do.
