/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Binary, Shield, Cpu, Minimize2, CheckCircle2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface PreprocessMonitorProps {
  onPreprocessComplete?: () => void;
}

export default function PreprocessMonitor({ onPreprocessComplete }: PreprocessMonitorProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  const steps = [
    {
      title: "Data Imputation & Alert Flagging",
      description: "Map Alerts/Warnings containing string tokens into structured bits, and fill NaN indicators.",
      actions: [
        "Mapped Alert Triggered ⮕ 1",
        "Imputed missing Malware Indicators with 'No Detection'",
        "Mapped Proxy details and resolved missing logs in sub-vectors"
      ],
      codeSnippet: "df['Alerts/Warnings'] = df['Alerts/Warnings'].apply(lambda x: 1 if x == 'Alert Triggered' else 0)\ndf['Malware Indicators'] = df['Malware Indicators'].fillna('No Detection')"
    },
    {
      title: "Temporal Splitting",
      description: "Parse Timestamp indices to extract high-resolution cyclic metrics (Hour, Day, Month).",
      actions: [
        "Converted raw timestamps to pd.to_datetime object",
        "Created df['Hour'] from timestamp.dt.hour",
        "Created df['Day'] and df['Month'] cyclic vectors"
      ],
      codeSnippet: "df['Timestamp'] = pd.to_datetime(df['Timestamp'])\ndf['Hour'] = df['Timestamp'].dt.hour\ndf['Day'] = df['Timestamp'].dt.day"
    },
    {
      title: "Dimensionality Removal",
      description: "Drop non-generalizing variables (Payload details, User IDs, Raw IPs) to prevent overfitting.",
      actions: [
        "Removed User Information block",
        "Pruned Source & Destination IP strings",
        "Dropped unstructured Payload Data raw payload hex arrays"
      ],
      codeSnippet: "df = df.drop(['Timestamp', 'Payload Data', 'User Information', 'Source IP Address', 'Destination IP Address'], axis=1)"
    },
    {
      title: "Label Encoding (Ordinal Mapping)",
      description: "Convert remaining categorical text strings to machine-readable label integers.",
      actions: [
        "Instantiated sklearn.preprocessing.LabelEncoder",
        "Encoded 'Protocol' fields",
        "Mapped categorical columns ('Firewall Logs', 'Severity', etc.)"
      ],
      codeSnippet: "le = LabelEncoder()\nfor col in df.select_dtypes(include='object').columns:\n    df[col] = le.fit_transform(df[col])"
    },
    {
      title: "Standard Feature Scaling",
      description: "Normalize the distribution of each feature to a zero-mean and unit variance scale.",
      actions: [
        "Mapped inputs to design matrix X and label vector y",
        "Fit sklearn.preprocessing.StandardScaler estimator on X",
        "Ensured standard deviation = 1 across entire array matrix"
      ],
      codeSnippet: "X = df.drop('Attack Type', axis=1)\ny = df['Attack Type']\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)"
    }
  ];

  const handleRunPreprocessing = async () => {
    setIsProcessing(true);
    setHasCompleted(false);
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 800 : 500));
    }
    setIsProcessing(false);
    setHasCompleted(true);
    if (onPreprocessComplete) {
      onPreprocessComplete();
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col h-full" id="preprocess-card">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Binary className="w-4 h-4 text-emerald-600" />
            Adaptive Feature Preprocessing System
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Cleans, slices, encodes, and normalizes high-velocity traffic feeds</p>
        </div>
        <button
          onClick={handleRunPreprocessing}
          disabled={isProcessing}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs transition-all duration-200 ${
            isProcessing
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
          }`}
          id="btn-run-preprocess"
        >
          <RefreshCw className={`w-3 h-3 ${isProcessing ? "animate-spin" : ""}`} />
          {isProcessing ? "Preprocessing..." : "Execute Preprocess"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1">
        {/* Step Cards List */}
        <div className="lg:col-span-3 space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {steps.map((step, index) => {
            const isActive = index === activeStep && (isProcessing || hasCompleted);
            const isFinished = index < activeStep || hasCompleted;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4.5 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50/20 shadow-xs"
                    : isFinished
                    ? "border-gray-100 bg-gray-50/40 opacity-90"
                    : "border-gray-100 bg-white opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white animate-pulse"
                        : isFinished
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isFinished ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-800 tracking-tight flex items-center gap-1.5">
                      {step.title}
                      {isActive && !hasCompleted && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-medium">
                          Processing
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{step.description}</p>
                    
                    {/* Render actions sub-bullets if active or completed */}
                    {(isActive || isFinished) && (
                      <ul className="mt-2 space-y-1 pl-4 list-disc text-[10px] text-gray-600 font-mono">
                        {step.actions.map((act, idx) => (
                          <li key={idx} className="leading-tight">{act}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Code Console / Pipeline Visualizer */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-gray-900 rounded-xl p-4.5 text-white font-mono text-[11px] min-h-[220px]">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="pb-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] text-gray-400 ml-1.5">pipeline_preprocess.py</span>
                </div>
                <span className="text-[9px] text-gray-500">SCIKIT-LEARN EST.</span>
              </div>

              <div className="pt-3 space-y-4">
                <div>
                  <div className="text-gray-500 text-[10px]"># ACTIVE MODULE TARGET CODE</div>
                  <pre className="text-emerald-400 bg-gray-950 p-3 rounded-lg mt-1.5 overflow-x-auto border border-gray-800/60 leading-relaxed font-medium">
                    <code>{steps[activeStep].codeSnippet}</code>
                  </pre>
                </div>

                <div className="space-y-1 text-gray-300 text-[10px]">
                  <div className="text-gray-500"># PIPELINE TRANSFORM STATS</div>
                  <div className="flex justify-between py-1 border-b border-gray-800/45">
                    <span>Input Matrix Shape:</span>
                    <span className="text-emerald-400">10,000 logs x 13 cols</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800/45">
                    <span>Cleaned Matrix Shape:</span>
                    <span className="text-blue-400">10,000 logs x 8 features</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Standard Scaling $\mu$, $\sigma$:</span>
                    <span className="text-purple-400">$\mu = 0$, $\sigma = 1$</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Data integrity validated
              </span>
              <span className="font-mono text-emerald-500">Pipeline Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
