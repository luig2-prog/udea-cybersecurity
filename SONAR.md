# SonarQube analysis — Quick guide

This repository includes a `sonar-project.properties` file at the project root configured to analyze the `backend` and `frontend` source folders.

Prerequisites
- Install `sonar-scanner` on your machine or run it via the SonarCloud/GitHub Action pipeline.

Running locally (bash)

1. Set the SonarCloud token (example environment variable names):

```bash
export SONAR_TOKEN="<your-sonarcloud-token>"
```

2. Run the scanner (pass token and use SonarCloud host):

```bash
sonar-scanner \
  -Dsonar.host.url="https://sonarcloud.io" \
  -Dsonar.login="$SONAR_TOKEN"
```

3. (Recommended) Use the SonarCloud GitHub Action in CI. Example `workflow.yml` snippet:

```yaml
name: SonarCloud

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      - name: Run SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        with:
          args: >
            -Dsonar.projectKey=luig2-prog_iuvity
            -Dsonar.organization=your-org-key-here
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

Notes
- If you generate coverage reports with `jest` (or other tools), ensure the LCOV files are at the paths referenced in `sonar-project.properties` (by default `backend/coverage/lcov.info` and `frontend/coverage/lcov.info`).
- Adjust `sonar.projectKey` or other properties in `sonar-project.properties` to match your Sonar organization/project naming.
- For CI integration, supply `SONAR_TOKEN` securely (pipeline secrets).

Local token file (recommended for local usage)
- Create a local properties file that is ignored by git to avoid leaking your token.

Example: create `sonar-project.local.properties` at the repository root with the single line:

```text
sonar.login=0123456789abcdef0123456789abcdef01234567
```

You can set that value quickly from bash:

```bash
echo "sonar.login=YOUR_ACTUAL_TOKEN" > sonar-project.local.properties
```

The repository already contains a `.gitignore` entry for `sonar-project.local.properties` so the file will not be committed. Alternatively, you can keep using the `SONAR_TOKEN` environment variable (recommended for CI).
