---
date: '1'
title: 'Moteur RAG (Retrieval-Augmented Generation)'
cover: './demo.PNG'
github: ''
external: ''
pdf: '/RAG_Engine_Documentation.pdf'
tech:
  - Python
  - RAG
  - Ollama
  - Qdrant
  - FastAPI
  - Docker
---

Moteur RAG production-ready, conçu pour indexer et interroger une base de connaissances documentaire via recherche vectorielle sémantique. Ce projet personnel expérimental est hébergé en local sur une architecture Docker-compose.

Il intègre **Docling** pour la conversion automatisée des documents (PDF, DOCX, HTML), le modèle d'embedding multilingue **BGE-M3** via **Ollama**, et **Qdrant** pour la recherche vectorielle fluide et persistante. L'ensemble est propulsé par une API REST sous **FastAPI**.

Un pipeline CI/CD automatisé sous **GitLab on-premise** soutient son déploiement continu, en vue d'une future connexion à un LLM métier.
