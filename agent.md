# Agent Definitions — HerStep Online Shop

---

## Agent 1: Builder

### Role
Builder creates and iterates on the HerStep website prototype based on the requirements and Tester feedback.

### Responsibilities
- Read the **Requirements** section at the bottom of this file before starting any work.
- Build a fully functional website prototype that satisfies every testable requirement.
- Organize code clearly (HTML, CSS, JavaScript separated where appropriate).
- Ensure the prototype runs locally via `index.html` or a local dev server after every build.
- Before each new iteration, read `Mistakes.md` and fix **every listed issue** before writing new features.
- Do not consider a cycle complete until all items in `Mistakes.md` are resolved.

### Inputs
| File | Purpose |
|------|---------|
| `agent.md` (Requirements section) | Source of truth for what to build |
| `Mistakes.md` | Issues from Tester that must be fixed each iteration |

### Outputs
| File / Folder | Purpose |
|---------------|---------|
| `index.html` (+ assets) | Website prototype delivered for testing |

### Workflow
1. Read the Requirements section below.
2. If `Mistakes.md` exists, read it and plan all fixes first.
3. Build or update the prototype.
4. Self-review against each requirement before handing off.
5. Notify Tester that the build is ready.

---

## Agent 2: Tester

### Role
Tester validates the prototype against requirements and writes `Mistakes.md` so Builder knows exactly what to fix.

### Responsibilities
- Use only the **Tester Checklist** in the Requirements section below — it lists only what can be visually or interactively verified in a browser prototype.
- **Skip** any requirement marked `[OUT OF SCOPE]` — these cannot be proved in a frontend prototype (e.g., encryption, load testing, data retention policies).
- **Skip** any requirement that has no corresponding UI or use case in the prototype scope.
- Open and interact with every page and feature of the prototype.
- For each checklist item, mark it **Pass** or **Fail** with a short reason.
- Write `Mistakes.md` using the standard format below.
- Re-test after each Builder fix cycle and update `Mistakes.md` (mark resolved items, add any new findings).
- Set **Overall Status: PASSED** only when every in-scope checklist item passes.

### Inputs
| File | Purpose |
|------|---------|
| `agent.md` (Tester Checklist) | The exact list of things to test |
| `index.html` (+ assets) | The prototype to test |

### Outputs
| File | Purpose |
|------|---------|
| `Mistakes.md` | Structured issue report for Builder |

### Workflow
1. Read the Tester Checklist in the Requirements section.
2. Load the prototype in a browser.
3. Go through each checklist item one by one.
4. Write `Mistakes.md` for every item that fails.
5. Return `Mistakes.md` to Builder.
6. Repeat from step 2 after each Builder iteration.

---

## Mistakes.md Format

Tester must always write `Mistakes.md` using this structure:

```markdown
# Mistakes Report

**Date:** YYYY-MM-DD
**Iteration:** #N
**Overall Status:** IN PROGRESS | PASSED

---

## Failed Items

### [ISSUE-001] <Short title>
- **Checklist Item:** Copy the item ID and text from the Tester Checklist (e.g. C-02)
- **Expected:** What should happen
- **Actual:** What currently happens
- **Severity:** Critical | High | Medium | Low
- **Steps to Reproduce:** (if applicable)

### [ISSUE-002] <Short title>
...

---

## Resolved Issues
- [ISSUE-XXX] <Title> — Fixed in iteration #N
```

---

## Agent Interaction Loop

```
┌─────────────┐       builds prototype        ┌─────────────┐
│             │ ────────────────────────────> │             │
│   Builder   │                               │   Tester    │
│             │ <──────────────────────────── │             │
└─────────────┘      returns Mistakes.md      └─────────────┘
       │                                              │
       │  reads Tester Checklist & Mistakes.md        │  runs through Tester Checklist
       │  fixes all listed issues                     │  writes Mistakes.md
       └──────────────────────────────────────────────┘
                 repeats until PASSED
```

---

---

