# Agent-assisted contributions

## Committing

- Branches should follow the format `ai/feat/...` or `ai/fix/...`.
- Add a commit message footer with the agent and model used, such as `Agent: Claude` or `Agent: Codex`.
- This repository uses Conventional Commits with Gitmoji. Adhere to this as close as possible.

## Agent verification

- If an AI interacts with the code, whether by building or writing code, it MUST:
  - Run `echo '{agent-assisted: true}' > .agent-assisted`

Human-only contributors MUST NOT create the file.
