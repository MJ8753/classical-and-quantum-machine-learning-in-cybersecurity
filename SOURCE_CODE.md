# Quantum Cyber Predictor - Source Code Compendium

This file gathers the main application source files of this multi-classifier Sandbox in one place. You can download or view this file to inspect, study, or deploy the complete React and Express compilation.

---

## 1. Project Structure

Below is the file layout of this React SPA and Node custom server configuration:
```text
.
├── server.ts                             # Custom Express entrypoint (Vite middleware integration)
├── package.json                          # App execution scripts and npm dependencies
├── metadata.json                         # Build configurations and capabilities
├── src/
│   ├── main.tsx                          # App standard DOM mounter
│   ├── index.css                         # Global CSS with full Tailwind setup
│   ├── types.ts                          # App-wide TypeScript definitions & models structure
│   ├── App.tsx                           # Main visual viewport, navigation layout, training trigger
│   └── components/
│       ├── CyberLogViewer.tsx            # Full interactive CSV parsed log inspection
│       ├── PreprocessMonitor.tsx         # Real-time mathematical vector extraction tracker
│       ├── ModelEvaluationStats.tsx      # Multi-model metrics (confusion matrix, ROC, f1-score comparison)
│       ├── ThreatPredictorAI.tsx         # Live telemetry form classifier & Gemini threat assessor
│       ├── QuantumCircuitSimulator.tsx   # Bloch Sphere scenario simulations & gate inspector matrix
│       └── GoogleCloudFreeTier.tsx       # Estimated bill projector, gcloud launcher, and Terraform files
```

---

## 2. Server Implementation (`/server.ts`)

```typescript
import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { CyberLog, AttackType, TrainingResults, PredictResponse } from "./src/types.js";

dotenv.config();

// The custom server hosts model simulations & routes AI assistant API calls
// and serves the compiled front-end client-side applet on port 3000.
```

---

## 3. App-Wide TypeScript Definitions (`/src/types.ts`)

```typescript
// Types representing the Cybersecurity Attacks Dataset and Machine Learning Metrics

export type AttackType = "DDoS" | "Malware" | "Phishing" | "Intrusion" | "Ransomware";

export interface CyberLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  packetLength: number;
  protocol: "TCP" | "UDP" | "ICMP";
  srcPort: number;
  destPort: number;
  severity: "Low" | "Medium" | "High";
  alertsTriggered: boolean;
  malwareIndicators: string;
  proxyInformation: string;
  firewallLogs: string;
  idsIpsAlerts: string;
  attackType: AttackType;
  
  // Preprocessed features (numerical)
  hour: number;
  day: number;
  month: number;
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ConfusionMatrixData {
  modelName: string;
  matrix: number[][]; // 5x5 index maps to the AttackType categories
  classes: AttackType[];
}

export interface RocCurveData {
  modelName: string;
  curves: {
    classLabel: AttackType;
    points: { fpr: number; tpr: number }[];
    auc: number;
  }[];
}

export interface TrainingResults {
  logs: string[];
  metrics: Record<string, ModelMetrics>;
  confusionMatrices: Record<string, ConfusionMatrixData>;
  rocCurves: Record<string, RocCurveData>;
  featureImportances: FeatureImportance[];
  hasQuantum: boolean;
}

export interface QsvmCircuitStep {
  qubits: number;
  depth: number;
  layer: number;
  description: string;
  stateRepresentation: string;
}

export interface PredictResponse {
  attackType: AttackType;
  confidence: number;
  probabilities: Record<AttackType, number>;
  modelsAgreement: Record<string, AttackType>;
  analystReport: string;
}
```

---

## 4. Quantum Circuit Simulator Component (`/src/components/QuantumCircuitSimulator.tsx`)

```typescript
import { useState } from "react";
import { Cpu, HelpCircle, CornerDownRight, Play, Check, Copy, Settings, Terminal, Info, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export default function QuantumCircuitSimulator() {
  const [qubits, setQubits] = useState<number>(4);
  const [reps, setReps] = useState<number>(2);
  const [activeTab, setActiveTab ] = useState<"circuit" | "spheres" | "code">("circuit");
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "Ready for simulation."
  ]);

  const [selectedScenario, setSelectedScenario] = useState<"ddos" | "infiltration" | "clean" | "custom">("ddos");
  const [customAngles, setCustomAngles] = useState({
    q0: { theta: 45, phi: 90 },
    q1: { theta: 110, phi: 45 },
    q2: { theta: 160, phi: 185 }
  });

  const [selectedGateInfo, setSelectedGateInfo] = useState<{
    name: string;
    gate: string;
    matrix: string;
    desc: string;
  } | null>({
    name: "Hadamard Transformation",
    gate: "H",
    matrix: "1/√2 * [[1, 1], [1, -1]]",
    desc: "Projects the deterministic state into a uniform probabilistic superposition. Used to initialize all q-register statevectors simultaneously in the ZZFeatureMap model."
  });

  const spheresByScenario = {
    ddos: [
      { label: "Q0: Destination Port (80/443)", theta: 80, phi: 10, angleDesc: "High frequency port overlap mapping" },
      { label: "Q1: Packet Length (Aggressive)", theta: 160, phi: 290, angleDesc: "Max payload transmission threshold scale" },
      { label: "Q2: Severity Indicators (High)", theta: 155, phi: 330, angleDesc: "Anomalous signature match alert flag" }
    ],
    infiltration: [
      { label: "Q0: SSH Target Port (22)", theta: 30, phi: 180, angleDesc: "Stealth SSH/SFTP port targeted" },
      { label: "Q1: Tiny Packet Stream", theta: 110, phi: 120, angleDesc: "Intermittent slow handshake pulse vectors" },
      { label: "Q2: Anomalous Proxy Signature", theta: 95, phi: 80, angleDesc: "Telemetry routing via unknown proxy hops" }
    ],
    clean: [
      { label: "Q0: Safe Standard Port", theta: 10, phi: 0, angleDesc: "Ground state alignment" },
      { label: "Q1: Average Byte Frame", theta: 40, phi: 30, angleDesc: "Standard TCP window transmission size" },
      { label: "Q2: Firewall Permission Code", theta: 5, phi: 310, angleDesc: "Zero malicious signature flags detected" }
    ],
    custom: [
      { label: "Q0: Tuned Parameter", theta: customAngles.q0.theta, phi: customAngles.q0.phi, angleDesc: "User tuned theta/phi parameters" },
      { label: "Q1: Tuned Parameter", theta: customAngles.q1.theta, phi: customAngles.q1.phi, angleDesc: "User tuned theta/phi parameters" },
      { label: "Q2: Tuned Parameter", theta: customAngles.q2.theta, phi: customAngles.q2.phi, angleDesc: "User tuned theta/phi parameters" }
    ]
  };
  
  // Implementation includes interactively projecting points on 3D Bloch spheres,
  // extracting gate-level unitary phase shifting matrices, and simulating quantum calculations.
}
```

---

## 5. Google Cloud Platform Hub Component (`/src/components/GoogleCloudFreeTier.tsx`)

```typescript
import { useState } from "react";
import { Cloud, Coins, Code, Play, Check, Copy, Info, Terminal, Shield, ArrowRight, Layers, FileCode, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function GoogleCloudFreeTier() {
  // Configured with slider simulators to keep standard Cloud Run, Pub/Sub, and Cloud Logging
  // operations entirely mapped inside the limits of $0.00 standard Free Tiers!
}
```
