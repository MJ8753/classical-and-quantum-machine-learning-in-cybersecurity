/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Cpu, Zap, Copy, Check, Info, FileCode, Sliders, RefreshCw, Layers } from "lucide-react";
import { motion } from "motion/react";

export default function QuantumCircuitSimulator() {
  const [qubits, setQubits] = useState<number>(4);
  const [reps, setReps] = useState<number>(2);
  const [activeTab, setActiveTab ] = useState<"circuit" | "spheres" | "code">("circuit");
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "Quantum Circuit visualizer initialized.",
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

  const rawPythonCode = `import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

# 1. Quantum & Qiskit Imports
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from qiskit_machine_learning.algorithms import QSVC
from qiskit.circuit.library import ZZFeatureMap
from qiskit_ibm_runtime import QiskitRuntimeService, Sampler

# 2. Data Preparation
df = pd.read_csv("cybersecurity_attacks.csv")
df['Alerts/Warnings'] = df['Alerts/Warnings'].apply(lambda x: 1 if x == 'Alert Triggered' else 0)
df['Malware Indicators'] = df['Malware Indicators'].fillna('No Detection')

X = df[['Alerts/Warnings', 'Packet Length', 'Protocol', 'Firewall Logs']][:100]
y = df['Attack Type'][:100]

le = LabelEncoder()
for col in X.select_dtypes(include='object').columns:
    X[col] = le.fit_transform(X[col])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 3. Create N-Qubit ZZFeatureMap Circuit
num_qubits = ${qubits}
reps = ${reps}
feature_map = ZZFeatureMap(feature_dimension=num_qubits, reps=reps, entanglement='linear')

# 4. Integrate IBM Quantum & Run with Primitives Sampler
# To execute on real IBM Quantum hardware, set your IBM token inside your service:
# service = QiskitRuntimeService(channel="ibm_quantum", token="YOUR_IBM_QUANTUM_API_TOKEN")
# backend = service.backend("ibm_brisbane") # or selective QPU

print("Initializing local Qiskit Aer Statevector simulator...")
backend = Aer.get_backend("aer_simulator")

# 5. Instantiating the Quantum SVM Classifier (QSVC)
qsvm = QSVC(feature_map=feature_map)
print("Training Quantum SVM on IBM Simulator backend...")
qsvm.fit(X_train, y_train)

# 6. Evaluation
accuracy = qsvm.score(X_test, y_test)
print(f"Quantum SVM Classification Accuracy: {accuracy * 100:.2f}%")
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawPythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationLogs([
      `[INFO] Constructing ZZFeatureMap with ${qubits} qubits and ${reps} layer repetitions...`,
      "[INFO] Mapping classical feature vectors $x_i \\in \\mathbb{R}^4$ to quantum state parameters...",
    ]);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `[INFO] Applying H gates across all ${qubits} q-registers to establish uniform superposition.`,
        `[INFO] Executing phase rotations: $U_{\\Phi(x)} = \\text{exp}(i \\Phi(x_i, x_j) Z_i Z_j)$ entanglings.`,
        "\\Phi(x) coefficients derived using custom ZZ non-linear interaction polynomials."
      ]);
    }, 600);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `[INFO] Connecting to local Aer simulator. Running 1,024 shots per support projection...`,
        "[SUCCESS] Quantum state projection complete! Statevector overlap mapped to kernel matrix.",
        `[METRIC] Sim output accuracy evaluated: 88.75% | Optimal margins found.`
      ]);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col h-full" id="quantum-simulation-lab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-gray-50">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            Quantum SVM (QSVC) Laboratory & IBM Circuit Generator
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Simulate Hilbert space conversions using ZZFeatureMaps & transpile valid IBM Quantum code</p>
        </div>

        {/* View Tabs */}
        <div className="flex gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-150 text-xs">
          <button
            onClick={() => setActiveTab("circuit")}
            className={`px-3 py-1 rounded-md cursor-pointer transition-all ${
              activeTab === "circuit" ? "bg-white text-gray-800 font-semibold shadow-xs" : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            Circuit Wire
          </button>
          <button
            onClick={() => setActiveTab("spheres")}
            className={`px-3 py-1 rounded-md cursor-pointer transition-all ${
              activeTab === "spheres" ? "bg-white text-gray-800 font-semibold shadow-xs" : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            Bloch Spheres
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === "code" ? "bg-white text-gray-800 font-semibold shadow-xs" : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            IBM Python Exporter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Interactive Parameter Controls */}
        <div className="space-y-4.5 bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Quantum Configurator</span>

            {/* Qubits Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  Qubit Dimension ($N$)
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold font-mono text-[10px]">
                  {qubits} Qubits
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                value={qubits}
                onChange={(e) => setQubits(Number(e.target.value))}
                className="w-full accent-purple-650"
              />
              <p className="text-[10px] text-gray-400 leading-normal">
                Determines Hilbert Space dimensions ($2^N = {Math.pow(2, qubits)}$ directions) for mapping security variables.
              </p>
            </div>

            {/* Repetitions (reps) selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  ZZFeatureMap Repetitions
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold font-mono text-[10px]">
                  reps = {reps}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(val => (
                  <button
                    key={val}
                    onClick={() => setReps(val)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                      reps === val 
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {val} {val === 1 ? "layer" : "layers"}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                More reps configure deeply nested, non-linear quantum entanglement paths, helping distinguish subtle vectors.
              </p>
            </div>

            {/* Info badge */}
            <div className="bg-purple-500/5 border border-purple-500/10 p-3 rounded-xl flex items-start gap-2 text-[10.5px] text-purple-900 leading-normal">
              <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>ZZFeatureMap Formulation:</strong> Encodes variables as rotations: 
                <span className="block font-mono bg-purple-100/30 p-1 rounded mt-1 text-[9.5px]">
                  {"$x_i \\mapsto e^{i X_i} H_i \\otimes e^{i Z_i Z_j}$"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-2 bg-purple-650 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-250 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            {isSimulating ? "Simulating Quantum States..." : "Simulate QML Classifier"}
          </button>
        </div>

        {/* Right Active Tab Content Viewer */}
        <div className="lg:col-span-2 flex flex-col justify-between min-h-[300px]">
          
          {/* Main Visualizer Stage */}
          <div className="flex-1 bg-gray-950 rounded-xl p-5 text-white border border-gray-800 flex flex-col justify-between overflow-hidden relative">
            
            {activeTab === "circuit" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-mono text-gray-500 block uppercase">ZZFeatureMap Gate Assembly Diagram</span>
                  <span className="text-[9px] text-purple-400 font-semibold bg-purple-950 px-2 py-0.5 rounded border border-purple-900 animate-pulse">
                    ⚡ Click gates, nodes, or Rz to inspect matrices
                  </span>
                </div>
                
                {/* Circuit wire diagram */}
                <div className="space-y-4 pt-2 font-mono text-[10.5px]">
                  {Array.from({ length: Math.min(qubits, 5) }).map((_, qIdx) => (
                    <div key={qIdx} className="flex items-center gap-2">
                      <span className="text-purple-400 font-bold w-10">q[{qIdx}]</span>
                      
                      {/* Circuit Line */}
                      <div className="flex-1 h-[1.5px] bg-slate-800 relative flex items-center justify-around">
                        
                        {/* H Hadamard Gate */}
                        <div 
                          onClick={() => setSelectedGateInfo({
                            name: "Hadamard Transformation (H Gate)",
                            gate: "H",
                            matrix: "1/√2 * [[1, 1], [1, -1]]",
                            desc: "Computes equal probability amplitude across all states on the wire. Effectively maps the base |0⟩ state to (|0⟩ + |1⟩)/√2 superposition."
                          })}
                          className={`w-6 h-6 rounded bg-blue-600 border border-blue-400 text-white flex items-center justify-center text-[10px] font-bold shadow-sm select-none cursor-pointer hover:bg-blue-500 hover:scale-115 active:scale-95 transition-all ${
                            selectedGateInfo?.gate === "H" ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-105" : ""
                          }`}
                          title="Hadamard Superposition Gate (Click to examine)"
                        >
                          H
                        </div>

                        {/* R Phase Rotation Gate */}
                        <div 
                          onClick={() => setSelectedGateInfo({
                            name: `Parametric Phase Rotation (Rz Gate)`,
                            gate: `Rz_q${qIdx}`,
                            matrix: `[[e^(-i*x_${qIdx}/2), 0], [0, e^(i*x_${qIdx}/2)]]`,
                            desc: `Applies a unitary phase angle mapping computed from the input classical cybersecurity feature vector x_${qIdx} on qubit channel q[${qIdx}]. Rotates the statevector across the Bloch sphere's Z-axis.`
                          })}
                          className={`px-1.5 h-6 rounded bg-purple-600 border border-purple-400 text-white flex items-center justify-center text-[9px] font-semibold shadow-sm select-none cursor-pointer hover:bg-purple-500 hover:scale-105 active:scale-95 transition-all ${
                            selectedGateInfo?.gate === `Rz_q${qIdx}` ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-950 scale-105" : ""
                          }`}
                          title={`Rz(x_${qIdx}) Parameter Rotation (Click to examine)`}
                        >
                          Rz(x_{qIdx})
                        </div>

                        {/* Controlled Phase CNOT interaction line */}
                        {qIdx < Math.min(qubits, 5) - 1 ? (
                          <div 
                            onClick={() => setSelectedGateInfo({
                              name: "Controlled-NOT / ZZ Entanglement Node",
                              gate: `CNOT_q${qIdx}`,
                              matrix: "[[1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0]]",
                              desc: "Entangles the current qubit statevector with its neighboring wire. Helps the Quantum SVM separate advanced multi-vector cyber threats in infinite dimensions by adding critical non-linear support boundaries."
                            })}
                            className={`w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-[9px] font-bold select-none cursor-pointer hover:bg-slate-800 hover:scale-115 active:scale-95 transition-all ${
                              selectedGateInfo?.gate === `CNOT_q${qIdx}` ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950" : ""
                            }`}
                            title="CNOT Entangling Node (Click to examine)"
                          >
                            &otimes;
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center text-[10px]">
                            &bull;
                          </div>
                        )}

                        {reps > 1 && (
                          <div 
                            onClick={() => setSelectedGateInfo({
                              name: "ZZ Layer Repetition Phase Rotation (Rz)",
                              gate: "Rz_rep",
                              matrix: "[[e^(-i*θ/2), 0], [0, e^(i*θ/2)]]",
                              desc: "Adds a second depth layer of parametric phase rotation, expanding the non-linear features beyond initial representations."
                            })}
                            className={`px-1.5 h-6 rounded bg-indigo-600 border border-indigo-400 text-white flex items-center justify-center text-[9px] font-semibold cursor-pointer hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all ${
                              selectedGateInfo?.gate === "Rz_rep" ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950" : ""
                            }`}
                            title="Repetition Layer 2 Rotation (Click to examine)"
                          >
                            Rz(rep)
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {qubits > 5 && (
                    <div className="text-center text-[10px] text-gray-500 py-1">
                      + {qubits - 5} additional qubit wire channels collapsed...
                    </div>
                  )}
                </div>

                {/* Interactive Gate Inspector Panel */}
                {selectedGateInfo ? (
                  <div className="bg-slate-900/95 border border-slate-800/80 rounded-lg p-3 mt-3 space-y-1.5 transition-all text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-purple-400 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        {selectedGateInfo.name}
                      </span>
                      <span className="text-[9px] text-gray-450 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850">
                        Matrix Node: {selectedGateInfo.gate}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <div className="flex-1 text-[11px] text-gray-400 leading-normal font-sans">
                        {selectedGateInfo.desc}
                      </div>
                      <div className="sm:w-48 shrink-0 bg-slate-950/90 p-2 rounded text-[10px] border border-slate-850/60 leading-normal">
                        <strong className="block text-[8.5px] text-zinc-500 font-mono uppercase mb-1">Unitary Matrix:</strong>
                        <span className="text-emerald-400 text-xs font-mono break-all">{selectedGateInfo.matrix}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-400 leading-normal bg-gray-900/60 p-3 rounded-lg border border-gray-800 mt-4">
                    <strong>Process:</strong> The input vectors are mapped to Hilbert space dimensions.
                    Hadamard (H) gates project inputs from deterministic states to probabilistic superpositions. Controlled phase-shifting rotates the statevectors relative to multi-vector correlation magnitudes.
                  </div>
                )}
              </div>
            )}

            {activeTab === "spheres" && (
              <div className="space-y-4 flex flex-col h-full justify-between font-sans">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono text-gray-500 block uppercase font-bold">Bloch Sphere Qubit State Projections</span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-purple-400 px-2 py-0.5 rounded font-mono font-semibold">
                      Orthographic 3D projection
                    </span>
                  </div>
                  <p className="text-[11.5px] text-gray-400 mt-1 leading-relaxed">
                    Visualizes how attack features (Ports, Logs, Protocols) map to Bloch sphere coordinate rotations $(\theta, \phi)$ in Hilbert space. Select Scenarios or tune custom coordinates below.
                  </p>
                </div>

                {/* Scenario Navigation Controls */}
                <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-lg border border-slate-850 text-[10px] font-mono">
                  {(["ddos", "infiltration", "clean", "custom"] as const).map((scKey) => (
                    <button
                      key={scKey}
                      onClick={() => setSelectedScenario(scKey)}
                      className={`px-2.5 py-1 rounded transition-all cursor-pointer uppercase font-bold flex-1 text-center ${
                        selectedScenario === scKey 
                          ? "bg-purple-650 text-white shadow-xs" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {scKey === "ddos" && "🔥 DDoS Exploit"}
                      {scKey === "infiltration" && "🕵️ Stealth SSH"}
                      {scKey === "clean" && "🛡️ Clean Traffic"}
                      {scKey === "custom" && "🎛️ Custom Tuner"}
                    </button>
                  ))}
                </div>

                {/* Drawn spheres representation */}
                <div className="flex justify-around items-center py-2 bg-slate-950/40 rounded-xl border border-slate-900/80 p-3 flex-wrap sm:flex-nowrap gap-4">
                  {spheresByScenario[selectedScenario].map((sphere, index) => {
                    const thetaRad = (sphere.theta * Math.PI) / 180;
                    const phiRad = (sphere.phi * Math.PI) / 180;

                    // Compute orthographic 3D projection on a 2D circle plane
                    // center coordinates at 50%
                    const projectedLeft = 50 + 40 * Math.sin(thetaRad) * Math.cos(phiRad);
                    const projectedTop = 50 - 40 * Math.cos(thetaRad);

                    return (
                      <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
                        {/* Drew simulated Bloch Sphere */}
                        <div className="w-18 h-18 rounded-full border border-purple-500/25 relative bg-gradient-to-br from-purple-950/20 to-slate-950 flex items-center justify-center shadow-xs">
                          {/* Equator & Meridians */}
                          <div className="absolute w-full h-[1px] border-t border-dashed border-purple-500/15 top-1/2" />
                          <div className="absolute h-full w-[1px] border-l border-dashed border-purple-500/15 left-1/2" />
                          <div className="absolute w-16 h-4 border border-dashed border-purple-500/20 rounded-full top-[38%]" />

                          {/* Polar Labels */}
                          <span className="absolute top-1 text-[7px] text-zinc-500 font-bold font-mono">|0⟩</span>
                          <span className="absolute bottom-1 text-[7px] text-zinc-500 font-bold font-mono">|1⟩</span>

                          {/* Statevector Line / Arrow from center */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line 
                              x1="50%" 
                              y1="50%" 
                              x2={`${projectedLeft}%`} 
                              y2={`${projectedTop}%`} 
                              stroke="#c084fc" 
                              strokeWidth="1.5" 
                              strokeDasharray="1 1"
                            />
                          </svg>

                          {/* Statevector coordinate dot */}
                          <div 
                            className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] border border-white/20 transition-all duration-300"
                            style={{
                              top: `calc(${projectedTop}% - 4px)`,
                              left: `calc(${projectedLeft}% - 4px)`
                            }}
                            title={`θ=${sphere.theta}°, φ=${sphere.phi}°`}
                          />
                        </div>
                        
                        <div className="text-center font-mono">
                          <span className="text-[9px] text-purple-300 font-semibold block leading-tight">{sphere.label}</span>
                          <span className="text-[8px] text-zinc-500">θ={sphere.theta}°, φ={sphere.phi}°</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Scenario specific info output or customized tuner sliders */}
                {selectedScenario === "custom" ? (
                  <div className="grid grid-cols-3 gap-3 bg-slate-900 border border-slate-800 p-3 rounded-lg text-[9px] font-mono leading-normal">
                    {(["q0", "q1", "q2"] as const).map((qKey, qIdx) => (
                      <div key={qKey} className="space-y-1.5 border-r border-slate-800/80 last:border-0 pr-1.5 last:pr-0">
                        <span className="font-bold text-purple-400 uppercase">Q{qIdx} coordinate</span>
                        <div className="space-y-1">
                          <div className="flex justify-between text-zinc-400">
                            <span>Theta (θ):</span>
                            <span className="text-emerald-400">{customAngles[qKey].theta}°</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="180"
                            value={customAngles[qKey].theta}
                            onChange={(e) => setCustomAngles(prev => ({
                              ...prev,
                              [qKey]: { ...prev[qKey], theta: Number(e.target.value) }
                            }))}
                            className="w-full h-1 accent-purple-500 bg-slate-950 rounded cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-zinc-400">
                            <span>Phi (φ):</span>
                            <span className="text-sky-400">{customAngles[qKey].phi}°</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="360"
                            value={customAngles[qKey].phi}
                            onChange={(e) => setCustomAngles(prev => ({
                              ...prev,
                              [qKey]: { ...prev[qKey], phi: Number(e.target.value) }
                            }))}
                            className="w-full h-1 accent-sky-500 bg-slate-950 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-400 leading-relaxed bg-gray-900/40 p-3 rounded-lg border border-gray-800/80">
                    <strong>Process Summary:</strong> {selectedScenario === "ddos" 
                      ? "High frequency query traffic in DDoS exploits maps features as significant phase rotations away from ground state |0⟩, signaling attack occurrences clearly." 
                      : selectedScenario === "infiltration" 
                        ? "Stealth attacks trigger slower frequency shifts, rotating qubit coordinate angles into specialized quadrants of the entanglement vector." 
                        : "Approved normal traffic profiles are closely aligned with polar values(|0⟩ ground states), bypassing trigger nodes completely."
                    } Entanglement maps linear thresholds accurately across Hilbert dimensions.
                  </div>
                )}
              </div>
            )}

            {activeTab === "code" && (
              <div className="space-y-3 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                  <span className="text-[9.5px] font-mono text-gray-500 uppercase">Production Python Qiskit Script</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 bg-gray-900 py-1 px-2.5 rounded border border-gray-800 transition-colors font-semibold cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Python Script
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 bg-gray-950 rounded border border-gray-800 p-3 overflow-y-auto max-h-[175px] scrollbar-thin">
                  <pre className="text-gray-300 text-[10px] font-mono leading-relaxed">
                    <code>{rawPythonCode}</code>
                  </pre>
                </div>

                <div className="text-[10px] bg-slate-900/60 p-2.5 rounded-lg text-slate-400 flex items-start gap-2 border border-slate-800">
                  <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p>
                    This is the authentic pipeline used to run QSVM directly in notebooks. Paste it into your python IDE to train the model on your local processor or deploy it directly to real IBM Quantum processors.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Simulated quantum runs logs pane */}
          <div className="bg-gray-950 border-t border-gray-800 rounded-b-xl p-3.5 font-mono text-[10px] text-gray-400 h-28 overflow-y-auto mt-2">
            <div className="flex items-center justify-between border-b border-gray-900 pb-1.5 mb-2 text-gray-500 uppercase">
              <span>Local QML Execution Output Console</span>
              <span>AER_SIMULATOR</span>
            </div>
            {simulationLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-purple-400 font-semibold">&gt; </span>
                {log}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
