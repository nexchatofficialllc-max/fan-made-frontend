Contributing to Fan Made

Thank you for helping develop Fan Made.

Before You Start

Please read the README and understand the existing project structure before making changes.

Do not rewrite working systems without first understanding why they exist.

Branches

Never develop directly on "main".

Create a branch:

git checkout main
git pull origin main
git checkout -b feature/your-feature

Use prefixes such as:

feature/
fix/
refactor/
docs/

Examples:

feature/profile-settings
feature/video-upload
feature/content-preview
fix/create-navigation
docs/update-readme

Coding Rules

- Use TypeScript.
- Keep components focused.
- Reuse existing components when appropriate.
- Avoid unnecessary dependencies.
- Do not introduce breaking changes without discussion.
- Keep navigation changes compatible with Expo Router.
- Do not commit private data.
- Do not commit development backups.
- Do not commit authentication tokens or API keys.

Testing

Before submitting a pull request:

npx tsc --noEmit

Then test the affected feature manually.

For navigation changes, verify that:

- Home opens correctly.
- Create opens correctly.
- Explore opens correctly.
- Profile opens correctly.
- Back navigation works.
- The app does not unexpectedly exit.

Pull Requests

Pull requests should contain:

Summary

Explain what was changed.

Testing

Explain how the change was tested.

Screenshots

Include screenshots when the change affects the UI.

Notes

Mention anything that still needs work.

Keep Changes Small

Avoid combining unrelated changes.

For example, a video-upload change should not also completely redesign Profile unless both changes are intentionally part of the same feature.

Respect Existing Work

Before modifying an important file:

git status
git log --oneline -5

If the file contains working code, understand it before replacing it.

Security

Never commit:

user.json
user.txt
settings.json
profile.json
uploads/
sounds/
profiles/
projects/

Never publish:

- passwords
- private tokens
- API keys
- personal account information
- private user information

If sensitive information is accidentally committed, notify the project owner immediately.

Commit Messages

Use clear commit messages.

Good:

Add profile navigation
Fix create screen navigation
Add video preview screen
Update contributor documentation

Avoid:

stuff
update
changes
fixed
test

Pull Request Principle

A PR should leave the project in a working state.

If a change introduces TypeScript errors or breaks navigation, fix it before requesting review.
