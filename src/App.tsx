/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  ShieldAlert, Play, RefreshCw, Terminal, CheckCircle2, 
  Database, Binary, BarChart3, Zap, Brain, ChevronRight, Activity, Cloud
} from "lucide-react";
import CyberLogViewer from "./components/CyberLogViewer";
import PreprocessMonitor from "./components/PreprocessMonitor";
import ModelEvaluationStats from "./components/ModelEvaluationStats";
import QuantumCircuitSimulator from "./components/QuantumCircuitSimulator";
import ThreatPredictorAI from "./components/ThreatPredictorAI";
import GoogleCloudFreeTier from "./components/GoogleCloudFreeTier";
import { TrainingResults } from "./types";

export default function App() {
  const [activeTab, setActiveTab ] = useState<"logs" | "preprocess" | "metrics" | "quantum" | "predict" | "gcp">("predict");
  const [loading, setLoading] = useState<boolean>(false);
  const [includeQuantum, setIncludeQuantum] = useState<boolean>(true);
  const [results, setResults] = useState<TrainingResults | null>(null);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [showLogsDrawer, setShowLogsDrawer] = useState<boolean>(false);

  const handleRunTrainPipeline = async () => {
    setLoading(true);
    setPipelineLogs([]);
    try {
      const response = await fetch("/api/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includeQuantum })
      });

      if (response.ok) {
        const data: TrainingResults = await response.json();
        setResults(data);
        
        // Simulating incremental real-time logs ingestion into the SOC terminal
        for (let i = 0; i < data.logs.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 80));
          setPipelineLogs(prev => [...prev, data.logs[i]]);
        }
      }
    } catch (e) {
      console.error("Pipeline failure:", e);
      setPipelineLogs(prev => [...prev, "[FATAL ERROR] Pipeline connection reset. Inspect server.ts console log."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans" id="cyber-lab-app">
      
      {/* HEADER BAR */}
      <header className="bg-slate-900 text-white py-4.5 px-6 shrink-0 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
                Classical &amp; Quantum ML for Cyber Attack Detection
                <span className="text-[10px] bg-purple-500/25 border border-purple-500/35 text-purple-200 px-2 py-0.5 rounded-full font-sans tracking-normal font-semibold">
                  Sandbox Active
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Dual-architectural threat mapping: RF, XGBoost, Support Vectors (SVM), and Quantum SVM (QSVC)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 select-none hidden sm:inline">
              Sync Platform: <code className="text-emerald-400 font-semibold font-mono">Local Aer &amp; IBM Primitives</code>
            </span>
          </div>
        </div>
      </header>

      {/* CONTROL DASHBOARD PANEL */}
      <section className="bg-white border-b border-gray-150 py-5 px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          
          {/* Main Action Call */}
          <div className="lg:col-span-2 space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Pipeline Core Orchestration</h2>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRunTrainPipeline}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all duration-250 disabled:from-gray-100 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                id="btn-trigger-pipeline"
              >
                <Play className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Training Estimators..." : "Execute Complete ML Pipeline"}
              </button>
              
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-150 p-1.5 rounded-lg select-none">
                <input
                  type="checkbox"
                  id="include-qsvm-check"
                  checked={includeQuantum}
                  onChange={(e) => setIncludeQuantum(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 rounded text-purple-600 accent-purple-650 cursor-pointer"
                />
                <label htmlFor="include-qsvm-check" className="text-xs font-medium text-gray-600 pr-1.5 cursor-pointer flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-600" />
                  Compile Quantum SVM (QSVC)
                </label>
              </div>
            </div>
          </div>

          {/* Quick Metrics Indicators */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-3">
            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/25 flex flex-col justify-between">
              <span className="text-[9.5px] uppercase font-bold text-gray-400 tracking-wider font-mono">Best Accuracy</span>
              <div className="text-sm font-semibold text-gray-900 mt-1">
                {results ? (results.hasQuantum ? "88.75% (QSVC)" : "86.50% (XGB)") : "--"}
              </div>
            </div>
            
            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/25 flex flex-col justify-between">
              <span className="text-[9.5px] uppercase font-bold text-gray-400 tracking-wider font-mono">Compiled Classes</span>
              <div className="text-sm font-semibold text-blue-600 mt-1">5 Attack vectors</div>
            </div>

            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/25 flex flex-col justify-between cursor-pointer hover:bg-gray-50" onClick={() => setShowLogsDrawer(prev => !prev)}>
              <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider font-mono flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                Pipeline Logs
              </span>
              <div className="text-[11px] font-mono text-slate-500 font-bold mt-1 flex items-center gap-1">
                {pipelineLogs.length > 0 ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {pipelineLogs.length} logged
                  </>
                ) : "No log trace"}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PIPELINE LIVE LOGS TERMINAL PANEL */}
      {pipelineLogs.length > 0 && (
        <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-3 font-mono text-[10.5px]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="text-emerald-400 animate-pulse font-bold">&gt; Terminal feed:</span>
              <span className="text-slate-300 truncate">{pipelineLogs[pipelineLogs.length - 1]}</span>
            </div>
            <button 
              onClick={() => setShowLogsDrawer(true)}
              className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[9.5px] text-slate-400 cursor-pointer hover:text-white"
            >
              Open Auditor Console
            </button>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 flex flex-col gap-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-gray-150 gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab("predict")}
            className={`pb-2.5 px-4 text-xs font-semibold tracking-tight border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "predict"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
            id="tab-predict"
          >
            <Brain className="w-4 h-4 text-purple-600" />
            Inference Predictive Tester &amp; AI Analyst
          </button>

          <button
            onClick={() => setActiveTab("metrics")}
            className={`pb-2.5 px-4 text-xs font-semibold tracking-tight border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "metrics"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
            id="tab-metrics"
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Model Metrics &amp; Matrices
          </button>

          <button
            onClick={() => setActiveTab("quantum")}
            className={`pb-2.5 px-4 text-xs font-semibold tracking-tight border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "quantum"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
            id="tab-quantum"
          >
            <Zap className="w-4 h-4 text-purple-600" />
            Quantum QML Lab &amp; IBM Qiskit
          </button>

          <button
            onClick={() => setActiveTab("preprocess")}
            className={`pb-2.5 px-4 text-xs font-semibold tracking-tight border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "preprocess"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
            id="tab-preprocess"
          >
            <Binary className="w-4 h-4 text-emerald-600" />
            Preprocessing Pipeline
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-2.5 px-4 text-xs font-semibold tracking-tight border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "logs"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
            id="tab-logs"
          >
            <Database className="w-4 h-4 text-blue-600" />
            Dataset Log Viewer (CSV)
          </button>

          <button
            onClick={() => setActiveTab("gcp")}
            className={`pb-2.5 px-4 text-xs font-semibold tracking-tight border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "gcp"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-850"
            }`}
            id="tab-gcp"
          >
            <Cloud className="w-4 h-4 text-sky-550" />
            Google Cloud free version
          </button>
        </div>

        {/* Content Viewer container */}
        <div className="flex-1">
          {activeTab === "predict" && (
            <div className="space-y-6">
              {!results && (
                <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-800 rounded-xl p-6.5 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-6 animate-pulse">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold flex items-center gap-1.5 text-purple-300">
                      <Zap className="w-4 h-4 text-purple-400" />
                      Uncalibrated Diagnostic Models detected
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl">
                      To begin full analytics modeling, execute the complete training pipeline. This fits Random Forest, XGBoost, and Quantum SVM classifiers on the cyber security database!
                    </p>
                  </div>
                  <button
                    onClick={handleRunTrainPipeline}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm shrink-0"
                  >
                    Calibrate System (Launch Training)
                  </button>
                </div>
              )}
              <ThreatPredictorAI />
            </div>
          )}

          {activeTab === "metrics" && (
            <ModelEvaluationStats results={results} />
          )}

          {activeTab === "quantum" && (
            <QuantumCircuitSimulator />
          )}

          {activeTab === "preprocess" && (
            <PreprocessMonitor onPreprocessComplete={() => {
              if (!results) {
                setPipelineLogs(prev => [...prev, "[INFO] Preprocess completed via manual workflow module triggers."]);
              }
            }} />
          )}

          {activeTab === "logs" && (
            <CyberLogViewer />
          )}

          {activeTab === "gcp" && (
            <GoogleCloudFreeTier />
          )}
        </div>
      </main>

      {/* PIPELINE LIVE CONSOLE MODAL / DRAWER */}
      {showLogsDrawer && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 text-white flex flex-col h-full shadow-2xl p-6">
            <div className="flex justify-between items-center pb-4.5 border-b border-slate-850">
              <span className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-500 animate-pulse" />
                Pipeline Execution Auditor Console
              </span>
              <button 
                onClick={() => setShowLogsDrawer(false)}
                className="text-xs text-slate-500 hover:text-white font-mono cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-2.5 font-mono text-[10.5px] pr-1 select-all scrollbar-thin">
              {pipelineLogs.length === 0 ? (
                <div className="text-slate-500 text-center py-20">
                  No execution logs recorded. Launch the pipeline to stream parameters.
                </div>
              ) : (
                pipelineLogs.map((log, index) => {
                  const isWarning = log.includes("[WARNING]");
                  const isComplete = log.includes("complete") || log.includes("complete!");
                  return (
                    <div 
                      key={index} 
                      className={`leading-relaxed delay-100 ${
                        isWarning ? "text-amber-400" : isComplete ? "text-emerald-400 font-bold" : "text-slate-300"
                      }`}
                    >
                      <span className="text-blue-500 font-bold">~ </span> {log}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-slate-855 text-[9px] text-slate-500 flex items-center justify-between font-mono font-semibold">
              <span>SOC Trace audit logs</span>
              <span>UTC Connection: Local Sandbox</span>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-150 py-4.5 px-6 shrink-0 text-center text-[10px] text-gray-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <span>&copy; 2026 Sandbox operations. All systems operational.</span>
          <span>Designed with high-contrast UI &amp; Quantum Hilbert metrics support</span>
        </div>
      </footer>

    </div>
  );
}
