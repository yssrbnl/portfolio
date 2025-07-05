---
date: '1'
title: 'SAE 15 – Gestion énergétique via capteurs IoT'
cover: './demo.PNG'
github: ''
external: ''
pdf: '/BOULOUIHA_Rapport_Technique_SAE_15.docx.pdf'
tech:
  - Bash
  - HTML5/CSS3
  - MQTT
  - JSON
  - Linux
  - Crontab
  - FTP
---

Système de gestion énergétique d'un bâtiment via capteurs connectés avec interface web automatisée. Les scripts Bash récupèrent, traitent et stockent les données de capteurs IoT (via MQTT/JSON), calculent des métriques (moyenne, min, max horodatés), puis génèrent une interface web de suivi publiée automatiquement sur un serveur via FTP. L'ensemble du processus est automatisé grâce à la crontab sous Linux.
