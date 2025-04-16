# Mini CI/CD Job Monitor

## Overview
Mini CI/CD Job Monitor is a simple system designed to manage and monitor CI/CD jobs with a user-friendly interface. This project combines **React.js**, **GraphQL**, **RabbitMQ**, and **Node.js** to create a system for triggering, monitoring, and managing build/test jobs in a CI/CD pipeline.

With this system, users can trigger CI/CD jobs, view job statuses, and watch real-time logs as jobs execute. The backend uses RabbitMQ to queue job requests and Node.js workers to process them, while the GraphQL API serves as the bridge between the frontend and the backend.

---

## Features
- **React.js Frontend**: An interactive UI to trigger jobs, view logs, and monitor the status of jobs in real-time.
- **GraphQL API**: Provides flexible and efficient querying and mutation capabilities for job management, including real-time updates through subscriptions.
- **RabbitMQ**: Acts as a reliable message queue to manage job execution.
- **Node.js Worker**: Executes build commands such as `npm run build` and `npm test`, and publishes status updates back to the frontend.
- **Docker Compose**: A `docker-compose.yml` file is provided to easily set up RabbitMQ, the GraphQL server, and the worker.

---

## Architecture

### Components
1. **React.js Frontend**
   - Provides a dashboard to trigger jobs, view logs, and monitor the status of jobs in real-time using GraphQL subscriptions.

2. **GraphQL API (Node.js + Apollo Server)**
   - A GraphQL server handles queries, mutations, and subscriptions, allowing users to interact with job data and trigger jobs.

3. **RabbitMQ**
   - A message broker to queue job requests (e.g., build tasks). Workers pull messages from the queue and execute the corresponding tasks.

4. **Node.js Worker**
   - A worker listens for job messages from RabbitMQ, executes the required commands (such as build or test commands), and sends job status updates via GraphQL subscriptions.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mini-ci-cd-job-monitor.git
cd mini-ci-cd-job-monitor

```

### Architecture

```bash
               ┌──────────────────────────┐
               │      React.js UI         │
               │ - Trigger Jobs           │
               │ - View Logs & Pipelines  │
               └─────────▲────────────────┘
                         │ GraphQL Query/Mutation
                         ▼
               ┌──────────────────────────┐
               │    Node.js + Apollo      │
               │  - GraphQL API Layer     │
               │  - Trigger Job Publisher │
               └─────────▲────────────────┘
                         │ RabbitMQ (Job Queue)
                         ▼
               ┌──────────────────────────┐
               │  Worker (Node.js)        │
               │ - Job Consumer           │
               │ - Executes build scripts │
               │ - Publishes job updates  │
               └─────────▲────────────────┘
                         │
                         ▼
              Job logs/status updated via GraphQL Subscription

```

### Working Images

![s1](https://github.com/blackhat955/Minicicdmonitor/blob/main/Screenshot%202025-04-16%20at%2017.27.36.png)
![s2](https://github.com/blackhat955/Minicicdmonitor/blob/main/Screenshot%202025-04-16%20at%2017.29.13.png)
![s3](https://github.com/blackhat955/Minicicdmonitor/blob/main/Screenshot%202025-04-16%20at%2017.37.52.png)
![s4](https://github.com/blackhat955/Minicicdmonitor/blob/main/Screenshot%202025-04-16%20at%2017.29.58.png)


