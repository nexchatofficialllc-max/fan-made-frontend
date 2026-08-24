Fan Made

Fan Made is a social platform for anime fans and creators to create, share, discover, and interact with fan-made content.

The platform is being built with React Native and Expo, with Expo Router handling application navigation.

Current Focus

The current development focus is the Fan Made frontend.

Planned content types include:

- Video
- Drawing
- Animation
- Comics
- Stories
- Creator content

Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- Native Tabs
- Git + GitHub

Project Structure

fan-made/
├── fanmade-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── explore.tsx
│   │   │   │   ├── create.tsx
│   │   │   │   └── profile.tsx
│   │   │   ├── create/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── video/
│   │   │   │   └── story/
│   │   │   ├── settings.tsx
│   │   │   ├── intro.tsx
│   │   │   └── _layout.tsx
│   │   └── components/
│   │       └── BackButton.tsx
│   ├── app.json
│   ├── package.json
│   └── package-lock.json
└── README.md

Getting Started

Clone the repository:

git clone https://github.com/nexchatofficialllc-max/fan-made-frontend.git
cd fan-made-frontend

Install dependencies:

npm install

Start the Expo development server:

npx expo start

Development Rules

Do not make changes directly on "main".

Create a branch for every feature or fix:

git checkout -b feature/feature-name

Examples:

feature/profile
feature/video-upload
feature/drawing-preview
fix/navigation
fix/create-button

Before opening a pull request:

npx tsc --noEmit
git status

Make sure TypeScript has no errors and that only intended files have changed.

Important

Do not commit:

- Passwords
- API keys
- Authentication tokens
- Personal account data
- User data
- Uploaded media
- Local databases
- Private configuration
- Development backups

Check ".gitignore" before adding new files.

Pull Requests

Every feature or bug fix should be submitted through a pull request.

A pull request should explain:

- What changed
- Why it changed
- How it was tested
- Any known limitations

Small, focused pull requests are preferred.

Current Development Philosophy

Fan Made should be developed carefully and incrementally.

Existing working features should not be replaced unnecessarily.

Before changing an important system:

1. Understand the existing implementation.
2. Create a backup or Git checkpoint.
3. Make the smallest reasonable change.
4. Run TypeScript checks.
5. Test the affected feature.
6. Commit the change.
7. Push the branch.
8. Open a pull request.

License

Project licensing will be added later.
