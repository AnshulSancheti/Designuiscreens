# Sync Workflow

## Repositories

### Designuiscreens

GitHub:

- `https://github.com/AnshulSancheti/Designuiscreens`

Local checkout used by Codex:

- `/home/intelligentape/Life/08-PlacedOn/.external/Designuiscreens`

Purpose:

- Figma-generated frontend code
- Figma-facing instructions in `figma-context/`

### Main PlacedOn Repo

Local checkout:

- `/home/intelligentape/Life/08-PlacedOn`

Frontend destination:

- `PlacedOn/frontend`

Purpose:

- Main product repo
- Backend
- Research/product docs
- Synced frontend from `Designuiscreens`

## Operating Rule

When Codex creates frontend direction, specs, prompts, or visual requirements, write them into:

- `Designuiscreens/figma-context/`

When Figma AI generates or changes visual frontend code, it should modify:

- `Designuiscreens/src/`

Then push `Designuiscreens`.

The main PlacedOn sync script can pull `Designuiscreens` and copy generated frontend files into:

- `PlacedOn/frontend`

## Do Not

- Do not keep Figma-facing specs only in the main PlacedOn repo, because Figma will not see them.
- Do not place long-term Codex planning files only inside `PlacedOn/frontend` if the sync script overwrites that folder.
- Do not make visual React edits in Codex unless explicitly requested.

## Recommended Flow

1. Codex updates `figma-context/`.
2. Codex commits and pushes `Designuiscreens`.
3. Figma AI reads `figma-context/` and generates UI in `src/`.
4. Figma-generated code is pushed to `Designuiscreens`.
5. Main PlacedOn sync pulls `Designuiscreens` into `PlacedOn/frontend`.
6. Main PlacedOn repo is tested and pushed separately.
