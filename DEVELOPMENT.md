Fan Made Development Workflow

Main Branch

"main" is the protected stable branch.

Developers should not push feature work directly to "main".

Standard Workflow

Start from the latest main branch:

git checkout main
git pull origin main

Create a feature branch:

git checkout -b feature/your-feature

Develop and test the feature.

Check the project:

npx tsc --noEmit

Check changed files:

git status

Review the changes:

git diff

Commit:

git add <files>
git commit -m "Add your feature"

Push:

git push -u origin feature/your-feature

Open a pull request on GitHub.

Pull Request

The project owner reviews the PR before merging it into "main".

After merging:

git checkout main
git pull origin main

Delete the local feature branch if it is no longer needed:

git branch -d feature/your-feature

Safety Checkpoints

Before major changes, create a Git checkpoint:

git add .
git commit -m "Checkpoint before <feature>"

For risky experimental work, use a separate branch instead of modifying the stable branch.

Never Force Push Main

Do not use:

git push --force origin main

unless the project owner explicitly decides it is necessary.

Before Asking for Help

Provide:

git status
git branch --show-current
npx tsc --noEmit

Also explain:

- What you were trying to change
- What happened
- The exact error
- Which files were changed

UI Development

When changing the UI:

1. Preserve existing navigation.
2. Preserve working screens.
3. Test Android behavior.
4. Check back navigation.
5. Check empty/loading states.
6. Check buttons and touch targets.
7. Avoid creating duplicate navigation routes.

Feature Development

For a new feature:

Plan
 ↓
Create branch
 ↓
Backup/checkpoint
 ↓
Implement
 ↓
TypeScript check
 ↓
Manual test
 ↓
Commit
 ↓
Push
 ↓
Pull Request
 ↓
Review
 ↓
Merge

Principle

Small changes are safer than large rewrites.

Working code should be preserved whenever possible.
