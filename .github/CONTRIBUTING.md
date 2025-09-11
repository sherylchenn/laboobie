# Contributing to ElevenLabs Showcase

Welcome to the ElevenLabs Showcase. We're excited to feature amazing projects built with our AI audio technology. Featured projects are eligible to receive exclusive ElevenLabs swag!

## How to Submit Your Project

### Prerequisites

- Your project must use ElevenLabs technology (API, SDK, or services)
- Project should be functional with a demo, repository, or video
- You must have rights to share the project publicly
- Project must be open source & free to use

### Step 1: Fork and Clone

1. Fork this repository to your GitHub account
2. Clone your fork locally:
   ```bash
   git clone https://github.com/elevenlabs/showcase.git
   cd showcase
   ```

### Step 2: Create Your Author Profile (if new)

If you're a first-time contributor, create your author profile:

1. Create a new file in `/authors/` named `your-name.yml` (use kebab-case)
2. Use this template:

```yaml
name: Your Full Name
avatar: "https://github.com/yourusername.png" # or any avatar URL
url: "https://yourwebsite.com" # Optional: your website
bio: "Brief description about yourself"
location: "City, Country"
isElevenLabs: false # Set to true if you work at ElevenLabs
socials:
  - label: X
    url: "https://x.com/yourusername"
  - label: GitHub
    url: "https://github.com/yourusername"
  - label: LinkedIn
    url: "https://linkedin.com/in/yourusername" # Optional
```

### Step 3: Create Your Project File

1. Create a new MDX file in `/projects/` named `your-project-name.mdx` (use kebab-case)
2. Use this template:

````mdx
---
title: Your Project Name
description: Brief description of what your project does (max 160 chars)
authorIds:
  - your-name # Must match your author file name (without .yml)
categories:
  - agents # Choose from: agents, text-to-speech, speech-to-text, music, voices
isFeatured: false # Leave as false, we'll feature exceptional projects
date: "2025-01-31" # Today's date in YYYY-MM-DD format
image: /images/your-project.png # Upload image to /public/images/
demoUrl: https://your-demo.com # Optional: Live demo
repoUrl: https://github.com/you/project # Optional: Repository
videoUrl: https://youtube.com/watch?v=... # Optional: Demo video
xUrl: https://x.com/you/status/... # Optional: X/Twitter post
---

# Your Project Name

## Overview

Describe what your project does and why it's interesting. Mention how you use ElevenLabs technology.

## Key Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## How It Works

Explain the technical implementation, architecture, or interesting challenges you solved.

## Technologies Used

- ElevenLabs API (specify which features: TTS, STS, Voice Cloning, etc.)
- Other key technologies
- Frameworks and libraries

## Getting Started

```bash
# Installation instructions
npm install your-project

# Usage example
import { YourProject } from 'your-project'
```
````

## Demo

Include screenshots, GIFs, or embed your demo video here.

## Future Plans

What's next for your project? Any upcoming features or improvements?

## Acknowledgments

Credit any collaborators, inspiration, or resources that helped.

````

### Step 4: Add Your Project Image

1. Add a cover image for your project to `/projects/images/`
2. Recommended: 1200x630px (16:9 ratio) for best display
3. Format: PNG or JPG

### Step 5: Submit Your Pull Request

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Add [Your Project Name] to showcase"
````

2. Push to your fork:

   ```bash
   git push origin main
   ```

3. Open a Pull Request from your fork to our main repository

4. In your PR description, include:
   - Brief summary of your project
   - Link to live demo or video
   - Confirmation that you have rights to share the project
   - Your X/Twitter handle (for announcement if featured)

## Project Categories

Choose the most relevant categories for your project:

- **agents** - Conversational AI, voice assistants, AI agents
- **text-to-speech** - TTS applications, narration, accessibility
- **speech-to-text** - Transcription, voice commands, dictation
- **music** - Music generation, audio production, sound design
- **voices** - Voice cloning, custom voices, voice transformation

## Review Process

1. **Automated Checks**: We verify file formats and required fields
2. **Content Review**: Team reviews project quality and ElevenLabs integration
3. **Feedback**: We may suggest improvements or request clarifications
4. **Approval**: Approved projects are merged and appear on the showcase
5. **Swag**: Featured projects receive information about claiming swag!

## Quality Guidelines

To increase your chances of being featured:

- **Clear Documentation**: Explain what your project does and how to use it
- **Working Demo**: Provide a live demo, video, or detailed screenshots
- **Innovation**: Show creative use of ElevenLabs technology
- **Code Quality**: If sharing code, ensure it's well-structured and documented
- **Visual Appeal**: Include high-quality images and good UI/UX

## Example Projects

Check out these excellent submissions for inspiration:

- [GibberLink](/projects/gibberlink) - AI agents communicating via acoustic protocols
- [Talk to Santa](/projects/talk-to-santa) - Interactive voice experience

## Need Help?

- Check existing projects in `/projects/` for examples
- Open an issue for questions or problems
- Join our [Discord community](https://discord.gg/elevenlabs) for support

## Code of Conduct

- Be respectful and constructive
- Only submit projects you have rights to share
- No spam, malicious code, or inappropriate content
- Follow our [Community Guidelines](https://elevenlabs.io/community)

---

Thank you for contributing to the ElevenLabs Showcase! We can't wait to see what you've built!
