# Sync Code: Realtime Collaborative Code Editor

## Introduction

Are you tired of sending code snippets back and forth, struggling to debug and collaborate with your team? Look no further! **Sync Code** is here to revolutionize the way you code together. This powerful and intuitive collaborative code editor empowers developers and teams to work seamlessly in real time, regardless of location. With **Sync Code**, you can code, debug, and ship faster.

## Features

Real-Time Code Collaboration
Multiple users can edit code simultaneously in real time, with changes instantly visible to all participants.

Built-in Compiler Integration
Code compilation directly within the editor, supporting multiple programming languages through RapidAPI for online code execution.

Syntax Highlighting
Language-specific syntax highlighting for enhanced readability and easier debugging.

Code Autocompletion
Intelligent code suggestions that speed up the coding process and improve productivity.

Multi-Language Support
Supports various programming languages (e.g., Python, Java, C++, JavaScript) for flexibility in coding projects.

User Authentication
Secure sign-in and registration system to allow personalized user sessions and maintain user privacy.

Session Persistence
Automatically saves user sessions and code state, so users can resume where they left off.

Error and Output Display
Shows compiler errors and execution output in a dedicated output console for easy debugging.

Customizable Themes
Multiple editor themes are available to cater to different user preferences.

Responsive Design: Fully responsive layout, making the editor accessible from various devices, including desktops, tablets, and mobile phones.
### Prerequisites

#### For running via Docker

- Docker (25.0.4)
- Docker Compose (1.29.2)

#### For running locally

- Node.js (v20.11.1)
- npm (10.2.4)
- pm2 (5.3.1) : run `npm i -g pm2` to install pm2 globally

**Note:** I have used nvm (v0.39.7) to manage my node versions. 
## Tech Stack

- React.js
- Node.js
- Express.js
- Socket.io
- CodeMirror
- React-Toastify

## Installation

### Running Locally

1. Clone this repository and cd into it
2. Run `npm install` to install the dependencies
3. Create .env file in the root folder and copy paste the content of example.env, and add necessary credentials.
4. To start the react app client run `npm start` in one terminal
5. To start the server run `npm server:dev` or `pm2 start server.js` in another terminal
6. Go to `http://localhost:3000` to view the app

**Note:** To stop your server, press `Ctrl+c` or if you used "pm2", then use `pm2 stop server.js` in the terminal.

## Future Scope

1. [x] Added syntax highlighting for multiple languages
2. [x] Added support for multiple themes
3. [x] Added support for saving the last theme and language selected by the user in local storage
4. [x] Add support to accept or reject new users trying to join the room
5. [ ] Add to implement video and voice chat feature inside the editor
6. [ ] Add support for local code file uploading
