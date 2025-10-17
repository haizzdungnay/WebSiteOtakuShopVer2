# Contributing to Otaku Shop

First off, thank you for considering contributing to Otaku Shop! It's people like you that make Otaku Shop such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari]
 - Node version: [e.g. 18.0.0]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Write clear commit messages**
4. **Include tests** for new features
5. **Update documentation** as needed
6. **Ensure the build passes** before submitting

## Development Process

### Setting Up Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/WebSiteOtakuShopVer2.git
cd WebSiteOtakuShopVer2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Branch Naming Convention

Use descriptive branch names:
- `feature/add-user-profile` - New features
- `fix/login-bug` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/auth-logic` - Code refactoring
- `test/add-api-tests` - Adding tests

### Commit Message Guidelines

Follow the conventional commits specification:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```bash
feat(auth): add two-factor authentication
fix(api): resolve products endpoint timeout issue
docs(readme): update installation instructions
refactor(db): optimize database query performance
```

### Coding Standards

#### TypeScript/JavaScript

```typescript
// Use TypeScript types
interface User {
  id: number
  email: string
  username: string
}

// Use const for variables that don't change
const API_URL = 'http://localhost:3000'

// Use descriptive variable names
const userProfile = getUserProfile()

// Use async/await instead of promises
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// Add JSDoc comments for complex functions
/**
 * Authenticates a user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns JWT token if successful
 */
async function login(email: string, password: string): Promise<string> {
  // Implementation
}
```

#### React Components

```tsx
// Use functional components with TypeScript
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

export function Button({ onClick, children, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-primary"
    >
      {children}
    </button>
  )
}

// Use meaningful component names
export function UserProfileCard() {
  // Implementation
}
```

#### CSS/Tailwind

```tsx
// Use Tailwind utilities consistently
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  <h2 className="text-xl font-bold">Title</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
</div>
```

### Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build project
npm run build
```

Always add tests for:
- New features
- Bug fixes
- API endpoints
- Utility functions

### Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Updating dependencies

Files to update:
- `README.md` - Overview and quick start
- `DOCUMENTATION.md` - Detailed API documentation
- `SETUP.md` - Setup instructions
- `SECURITY.md` - Security considerations
- Inline code comments

## Pull Request Process

1. **Update documentation** with details of changes
2. **Add tests** that cover your changes
3. **Ensure all tests pass** and code builds successfully
4. **Update the README.md** if needed
5. **Request review** from maintainers
6. **Address review feedback** promptly

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged

## Screenshots (if applicable)
Add screenshots to show UI changes.
```

## Security Vulnerabilities

**DO NOT** create public issues for security vulnerabilities.

Instead, email the maintainers directly at:
- security@example.com (replace with actual email)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

## Code Review Process

1. **Automated checks** run on every PR
2. **Maintainer review** - at least one approval required
3. **Address feedback** and make necessary changes
4. **Final approval** and merge

### What We Look For

- Code quality and clarity
- Test coverage
- Documentation updates
- Security considerations
- Performance impact
- Breaking changes

## Project Structure

Understanding the project structure helps with contributions:

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── products/          # Products page
├── components/            # Reusable components
├── contexts/              # React contexts
├── lib/                   # Utility functions
│   ├── db.ts             # Database utilities
│   ├── jwt.ts            # JWT utilities
│   └── sanitize.ts       # Security utilities
├── public/                # Static assets
└── tests/                 # Test files
```

## Style Guide

### File Naming

- React components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Styles: `kebab-case.css`
- Tests: `ComponentName.test.tsx`

### Import Order

```typescript
// 1. External dependencies
import React from 'react'
import { NextRequest } from 'next/server'

// 2. Internal dependencies
import { useAuth } from '@/contexts/AuthContext'
import { query } from '@/lib/db'

// 3. Types
import type { User } from '@/types'

// 4. Styles
import './styles.css'
```

## Getting Help

- **Documentation**: Read [DOCUMENTATION.md](DOCUMENTATION.md)
- **Setup Issues**: Check [SETUP.md](SETUP.md)
- **Security**: Review [SECURITY.md](SECURITY.md)
- **GitHub Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions

## Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Credited for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC License).

---

Thank you for contributing to Otaku Shop! 🎌
