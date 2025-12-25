# Algo-Vault

**Algo-Vault** is a dedicated revision tool for competitive programmers. It helps you save, organize, and review your LeetCode and CodeChef submissions using a Spaced Repetition System (SRS).

## 🚀 Features

-   **Chrome Extension**: Automatically captures your code, problem title, and tags when you submit a solution on LeetCode or CodeChef.
-   **Spaced Repetition Review**: A dashboard that schedules problem reviews based on your performance (Again, Hard, Good, Easy) to maximize retention.
-   **Activity Heatmap**: Visualizes your daily problem-solving consistency directly from your local database.
-   **Code Viewer**: Syntax-highlighted view of your saved solutions (Java support enabled).
-   **Secure Storage**: Local MongoDB database keeps your code private and accessible.

## 🛠 Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS
-   **Backend**: Node.js, Express, MongoDB, Mongoose
-   **Extension**: Chrome Manifest V3

## 📦 Installation & Setup

### 1. Prerequisites
-   Node.js installed.
-   MongoDB installed and running locally.

### 2. Backend (Server)
```bash
cd server
npm install
npm start
```
*Server runs on local port 5000.*

### 3. Frontend (Client)
```bash
cd client
npm install
npm run dev
```
*Client runs on http://localhost:5173.*

### 4. Chrome Extension
1.  Open Chrome and go to `chrome://extensions`.
2.  Enable **Developer mode** (top right).
3.  Click **Load unpacked**.
4.  Select the `extension` folder from this repository.

## 📖 How to Use

1.  **Save a Problem**:
    -   Solve a problem on [LeetCode](https://leetcode.com).
    -   Click **Submit**.
    -   The extension automatically sends the code to your local Algo-Vault.
    -   *Extension logs will confirm "Captured submission".*

2.  **Review Problems**:
    -   Open the Dashboard at `http://localhost:5173`.
    -   Check the **Review Session** card.
    -   Click **Reveal Solution** to see your code.
    -   Rate the problem (Again/Hard/Good/Easy) to schedule the next review.
    -   Click **Skip Session** or **Next Problem** to cycle through due reviews.

## 🤝 Contributing
Feel free to fork this repo and submit PRs for new features like:
-   Support for more platforms (HackerRank, AtCoder).
-   User Authentication.
-   Advanced SRS settings.
