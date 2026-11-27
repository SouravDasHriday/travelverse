# TravelVerse

A cloud-native 3-tier web application (React + Vite frontend, Node.js + Express backend, and PostgreSQL 16 database) deployed on a single-node **k3s** cluster running on an Oracle Cloud Infrastructure (OCI) micro VM (`VM.Standard.E2.1.Micro`, 1 OCPU, 952 MiB RAM) with a host-level Nginx reverse proxy and GitHub Actions CI.

## Architecture Overview

* **Frontend:** React 18 + Vite built in a multi-stage Docker image and served via Nginx (`NodePort 30080`).
* **Backend:** Node.js + Express REST API (`/health`, `/api/destinations`) backed by `pg` connection pooling (`NodePort 30500`).
* **Database:** PostgreSQL 16 (`ClusterIP 5432`) with a `1Gi` `PersistentVolumeClaim` (`local-path`) and schema/seed initialization via ConfigMap mounted at `/docker-entrypoint-initdb.d`.
* **Ingress / Reverse Proxy:** Host-level Nginx on the Ubuntu VM routing `/` to `127.0.0.1:30080` and `/api` to `127.0.0.1:30500`.
* **CI Pipeline:** GitHub Actions (`.github/workflows/ci.yml`) building multi-stage images with Docker Buildx and GitHub Actions cache (`type=gha`), pushing tags `:latest` and `${{ github.sha }}` to Docker Hub (`souravdasdocker/`).

## Repository Layout

```text
travelverse-gitops/
├── .github/workflows/ci.yml
├── backend/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── src/App.jsx
├── k8s/
│   ├── 00-namespace.yaml
│   ├── 01-configmap-secrets.yaml
│   ├── 02-init-sql.yaml
│   ├── 03-postgres.yaml
│   ├── 04-backend.yaml
│   └── 05-frontend.yaml
└── README.md
