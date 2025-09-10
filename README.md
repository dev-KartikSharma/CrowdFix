# CrowdFix - Crowdsourced Issue Reporting Webapp

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

CrowdFix is a modern web application designed to empower citizens by providing a platform to report, track, and prioritize local civic issues. Users can submit problems like potholes, garbage overflow, or streetlight outages, and upvote existing reports to highlight their urgency.

This project leverages the power of AI through the Gemini API to enhance user-submitted content, generate summaries, and draft formal communications, turning simple reports into actionable items for municipal authorities.

## Features

-   **User Authentication**: Secure sign-up and login functionality.
-   **Issue Reporting**: An intuitive form for users to submit detailed reports on civic problems.
-   **Community Prioritization**: Upvote system to help identify the most pressing issues in a community.
-   ✨ **AI-Enhanced Descriptions**: Automatically rewrite user descriptions into formal, detailed reports.
-   ✨ **AI-Powered Summaries**: Get a high-level overview of all reported issues at the click of a button.
-   ✨ **AI Complaint Drafting**: Instantly generate a formal complaint email for any issue, ready to be sent to local authorities.

## Tech Stack

-   **Frontend**: React.js
-   **Styling**: Tailwind CSS
-   **AI Integration**: Google Gemini API

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js and npm installed on your machine.
-   A Google Gemini API key.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/crowdfix.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd crowdfix
    ```

3.  **Install NPM packages:**

    ```bash
    npm install
    ```

4.  **Set up your environment variables:**
    *   Create a `.env` file in the root of the project.
    *   Add your Gemini API key to the file:

    ```
    REACT_APP_GEMINI_API_KEY='your-api-key-here'
    ```

5.  **Run the application:**

    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

-   `npm start`
    Runs the app in the development mode. Open `http://localhost:3000` to view it in your browser. The page will reload when you make changes.

-   `npm test`
    Launches the test runner in the interactive watch mode. See the section about running tests for more information.

-   `npm run build`
    Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. Your app is ready to be deployed!

## Contributing

We welcome contributions to CrowdFix! If you'd like to contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/your-feature-name`
3.  **Make your changes and commit them:** `git commit -m 'feat: Add your feature'`
4.  **Push to the branch:** `git push origin feature/your-feature-name`
5.  **Open a pull request.**
