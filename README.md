<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Classical & Quantum Machine Learning in Cybersecurity

An AI-powered cybersecurity threat detection system using classical and quantum machine learning models powered by Google Gemini AI.

## Dataset: Cybersecurity Attacks

- **Total Records:** 40,000
- **Metrics:** 25 varied metrics for comprehensive threat analysis

### Dataset Metrics

1. Timestamp
2. Source IP Address
3. Destination IP Address
4. Source Port
5. Destination Port
6. Protocol
7. Packet Length
8. Packet Type
9. Traffic Type
10. Payload Data
11. Malware Indicators
12. Anomaly Scores
13. Alerts/Warnings
14. Attack Type
15. Attack Signature
16. Action Taken
17. Severity Level
18. User Information
19. Device Information
20. Network Segment
21. Geo-location Data
22. Proxy Information
23. Firewall Logs
24. IDS/IPS Alerts
25. Log Source

## Features

- **Cyber Log Viewer** - Analyze network traffic logs and attack patterns
- **Threat Predictor AI** - Predict security threats using classical ML models
- **Quantum Circuit Simulator** - Quantum computing models for advanced threat analysis
- **Model Evaluation Stats** - Real-time performance metrics and accuracy
- **Preprocess Monitor** - Data preprocessing and feature engineering pipeline

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Deployment

Deployed on Render: https://classical-and-quantum-machine-learning.onrender.com

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Express.js + Node.js
- **AI/ML:** Google Gemini AI
- **Build Tools:** Vite, esbuild

## License

Apache 2.0
