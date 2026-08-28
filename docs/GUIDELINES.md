# Contribution Guidelines

<!--incremancer/docs/GUIDELINES.md-->

## AI/LLMslop

In this repository, any AI-generated slop contributions will result in a block.

"Slop contributions" includes issues, PRs, code, comments, etc. Using AI to understand the code is harder to police, and given how messy the game's code can be at times, that is wasteful, but is overall moot.

Plague your own repositories, not mine.

## Style

Try to write code as clearly as possible, readable code is better than magic one-liners. There is no strict style guideline, Prettier with default configuration is used for `*.ts` and `*.css`, to maintain some level of readability, avoid formatting `.html` with Prettier.

## PR Density

Avoid large PRs, as it makes it hard to review. PRs are encouraged to focus on one bug or feature at a time, or use several sensical commits for several different bugs.

Due to the old nature of Incremancer being held together with silly putty, tests are not required, but test*ing* is.
