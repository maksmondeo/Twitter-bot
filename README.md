# Twitter/X Bot – Fullstack Edition

A fully-automated Twitter/X bot.

![Image](https://github.com/user-attachments/assets/a22484fe-38b7-4b0f-a4b4-01795bed4cc6)

---

## ✨ Features

- 📝 Custom tweet input with media support
- ⟳ Auto-tweeting every `n` seconds
- 💾 Export & import API keys as `.json`
- 📺 Real-time frontend logging with countdown
- 🐳 Dockerized: 1 command to run frontend + backend

---

## 📦 Technologies

- **Frontend**: React + Tailwind CSS
- **Backend**: Django + Django REST Framework
- **API**: Tweepy
- **Containers**: Docker & Docker Compose

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/maksmondeo/Twitter-bot.git
cd twitter-bot
```

### 2. Set up environment variables

Create a `.env` file for your Twitter/X credentials with template:

```bash
cp .env-template .env
```

---

### 3. Start the app with Docker 🐳

```bash
docker-compose up --build
```

- React UI will be available at [**http://localhost:3000**](http://localhost:3000)
- Django backend API runs at [**http://localhost:8000**](http://localhost:8000)

---

## ⚠️ Notes

- A random string is added at the end of each tweet to avoid shadowbanning for duplicate content.
- You must have a Twitter Developer account and elevated access to use the Twitter API.
- The free tier currently allows **100 tweets per day** (Twitter's API policy may change).
