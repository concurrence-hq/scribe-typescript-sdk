# Contributing to the Scribe SDK

Use Node.js 22 for local development to match CI. The public package supports Node.js 20+ and modern browsers with the required Web APIs; it is ESM-only.

## Reproduce the checks

```bash
npm ci
npm run generate:schema
npm run format
npm run lint
npm run build
npm run typecheck
npm test
npm run validate
```

`generate:schema` uses the committed `openapi/scribe.json`; building does not require a private repository or credentials. CI rejects generated drift. Run `npm run openapi:sync` only when deliberately reviewing a newer public Scribe schema, then regenerate and review the resulting contract changes.

Unit tests use mock HTTP, WebSocket, and audio boundaries. Live tests require a designated Scribe workspace and separately provisioned credentials; follow [the E2E guide](tests/e2e/README.md). Skipped suites do not establish a live deployment result. Never use real patient data in fixtures or issues.

## Changes and releases

Keep backend provider credentials separate from browser attach tickets. Add behavior tests for changed HTTP contracts, streaming state transitions, reconnect, or recording cleanup. Update the README and customer integration guide when their examples change.

Open a PR and include the reader or runtime problem, compatibility impact, and checks performed. Maintainers review source changes before the release workflow calculates the version and publishes the immutable tag. Do not manually bump package versions in source PRs. See [release details](README.md#versioning--releases).

Report vulnerabilities through [SECURITY.md](SECURITY.md). Use GitHub issues for bugs and feature requests with synthetic reproductions.
