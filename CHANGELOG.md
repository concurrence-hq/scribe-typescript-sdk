# Changelog

All notable changes to `@concurrence-hq/scribe-typescript-sdk` (published as
`@amigo-ai/scribe-typescript-sdk` through `0.15.1`) are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Breaking:** `createSession` (and `ServerScribeClient.createSession`) now
  require an `input` argument carrying the new required `timezone` field — the
  session's IANA local timezone, which the Scribe API persists and renders the
  AMD writeback times/dates in. The field is typed
  from the OpenAPI schema as the IANA timezone-name union (e.g. the browser's
  `Intl.DateTimeFormat().resolvedOptions().timeZone`), so a plain `string` needs
  a cast. `ZoomSessionRequest` gains the same required `timezone`.

### Added

- `listSessions` status filter (Scribe API phase 156): `ListSessionsParams`
  gains an optional `status` array (`in-progress` | `in-review` | `completed` |
  `failed`), serialized as a repeated query param
  (`?status=in-review&status=completed`). Omitting it (or passing an empty
  array) keeps today's unfiltered request. The HTTP query builder now
  serializes array values as repeated params.
- Clinician-editable session times (Scribe API phase 114): `SessionResponse`
  and `AppointmentSession` gain `effective_started_at`,
  `effective_started_at_edited`, `effective_ended_at` and
  `effective_ended_at_edited` (required on the response types; the resolved
  visit times the EHR note uses). `UpdateSessionRequest` / `updateSession`
  accept `effective_started_at` / `effective_ended_at` (timezone-aware
  ISO-8601; `null` resets to the recorded time). New error codes on
  `updateSession`: `422 invalid_effective_start` / `invalid_effective_end`
  (`ValidationError`) and `409 invalid_session_state` once the note is finalized
  (`ConflictError`). Code that builds `SessionResponse` / `AppointmentSession`
  literals (fixtures, mocks) must add the four fields.
- `NoteReadResponse.carry_forward_status` and the exported `CarryForwardStatus`
  (`'ok' | 'unavailable' | 'not_applicable'`).
- `WritebackStatus` gains `skipped_unlinked` (writeback enabled, session has no
  linked EHR appointment). Exhaustive `switch`es / `Record<WritebackStatus, …>`
  maps need the new case.

- `writeback_status` — a new required `WritebackStatus`
  (`'succeeded' | 'pending' | 'disabled' | 'not_attempted'`) field on
  `FinalizeNoteResponse` (finalize-note) and `NoteReadResponse` (get-note),
  reporting the state of the note's EHR writeback. `WritebackStatus` is now
  exported as a named public type. It is **not** present on the shared
  `NoteResponse` / generate-note response. Additive to the read/finalize shapes.
- `SessionResponse.local_timezone` — the IANA zone persisted on the session.
- `NoteReadResponse.prior_diagnoses` — optional list of `PriorDiagnosisResponse`
  (`code`, `description`, `last_signed_at`): diagnoses on the patient's signed
  prior EHR notes, newest first, each code once; empty unless the EHR
  carry-forward was fetched. `PriorDiagnosisResponse` is exported as a named
  public type. Additive.

### Removed

- The unauthenticated `/health` and `/readiness` probe paths no longer appear in
  the generated `paths` / `operations` types (the upstream public spec dropped
  them). The client never called them.

## [0.16.0]

### Changed

- The package is now published as `@concurrence-hq/scribe-typescript-sdk`.
  `@amigo-ai/scribe-typescript-sdk` is deprecated and receives no further
  releases; existing installs keep working at their pinned versions. To migrate,
  run `npm uninstall @amigo-ai/scribe-typescript-sdk && npm i @concurrence-hq/scribe-typescript-sdk`
  and replace `'@amigo-ai/scribe-typescript-sdk'` with
  `'@concurrence-hq/scribe-typescript-sdk'` in imports. No API changes.

## [0.14.0]

### Removed

- `UpdateNoteRequest` (the `putNote` request body) no longer has the deprecated
  optional `body` field, matching the Scribe API. The server already rejected a
  `body` write with `422 deprecated_field`, so no working caller sent it; the
  `putNote` docs no longer mention `deprecated_field`. Compile-time only — send
  `{ base_version, structured }` as before. `NoteReadResponse.body` (the read
  side) is unchanged.

## [0.13.0]

### Added

- `listSessions` now accepts and forwards the optional `created_after` (inclusive)
  and `created_before` (exclusive) ISO date-time filters to
  `GET /v1/{workspace_id}/sessions`, forming a half-open created-at window
  `[created_after, created_before)`. Either bound may be given alone; omitting
  both preserves the previous behavior. Additive and backward compatible.
