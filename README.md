# Pixel Souls — Roguelike Game

Pixel Souls is a fast-paced, souls-like pixel game featuring procedural world generation and skill-based combat. Built with Node.js, Phaser, Socket.IO, JWT auth, and MongoDB, all fully containerized with Docker Compose.


## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Start Using Docker Compose

Build and start the entire stack:

```bash
docker compose up --build
```

After startup, the frontend (Phaser client) is available at `http://localhost:5173`.



## Features

### Gameplay

- Procedurally generated worlds
- Souls-like combat (attack, dodge, stamina mechanics)
- Skill system with unique builds
- Multiple enemy types with varied AI

## Tech Stack

| Layer             | Technology              |
|-------------------|-------------------------|
| Backend           | Node.js, Socket.IO      |
| Frontend          | Phaser                  |
| Authentication    | JWT                     |
| Database          | MongoDB                 |
| Containerization  | Docker & Docker Compose |

## Project Structure

```
/
├── backend/            # Node.js + Socket.IO server
├── frontend/           # Phaser game client
├── shared/             # Shared utilities/types
├── docker-compose.yml
└── README.md
```

## Screenshots

<img width="1275" height="671" alt="Gameplay screenshot 1" src="https://github.com/user-attachments/assets/ce0c2d2d-6762-4837-96ea-b7a10d71034d" />
<img width="1280" height="671" alt="Gameplay screenshot 2" src="https://github.com/user-attachments/assets/8e34409a-d0b9-42ea-8074-1e7d8af63776" />
<img width="1268" height="676" alt="Gameplay screenshot 3" src="https://github.com/user-attachments/assets/d6b3e36d-744b-4f27-b5af-86437a9464bc" />
