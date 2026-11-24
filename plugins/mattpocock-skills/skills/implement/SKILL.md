---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

If the user passes a ticket reference, fetch it from the issue tracker and state its title before starting. If the reference is ambiguous, ask.

Activate the `tdd` skill (read its `SKILL.md` from your Available Skills list or sibling `../tdd/SKILL.md` with `read_file`) where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, activate the `code-review` skill (read its `SKILL.md` from your Available Skills list or sibling `../code-review/SKILL.md` with `read_file`) to review the work.

Commit your work to the current branch.
