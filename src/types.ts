/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  alertsTriggered: boolean; // 1 = Alert Triggered, 0 = Otherwise
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
