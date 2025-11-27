# 🎮 Pixel Souls — Roguelike Game

Pixel Souls is a fast-paced, souls-like pixel game featuring procedural world generation, and skill-based combat.
Built with Node.js, Phaser, Socket.IO, JWT auth, and MongoDB, all fully containerized with Docker Compose.

# ✨ Features
## 🕹 Gameplay

Procedurally generated worlds

Souls-like combat (attack, dodge, stamina mechanics)

Skill system with unique builds

Multiple enemy types with varied AI

# 🛠 Tech Stack

Backend: Node.js, Socket.IO

Frontend: Phaser

Auth: JWT

Database: MongoDB

Containerization: Docker & Docker Compose

# 📁 Project Structure
````
/
├── backend/          # Node.js + Socket.IO server
├── frontend/         # Phaser game client
├── shared/           # Shared utilities/types
├── docker-compose.yml
└── README.md
````

# 🚀 Quick Start

## 1. Prerequisites
### You need:

Docker

Docker Compose

## 2. Start Using Docker Compose

Build and start the entire stack:
````
docker compose up --build
````

### After startup:

Frontend (Phaser Client): http://localhost:5173

