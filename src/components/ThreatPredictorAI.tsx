/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Brain, ShieldAlert, FileText, Settings, Play, CheckCircle, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { AttackType, PredictResponse } from "../types";

export default function ThreatPredictorAI() {
  const [packetLength, setPacketLength] = useState<number>(1450);
  const [protocol, setProtocol] = useState<"TCP" | "UDP" | "ICMP">("TCP");
  const [destPort, setDestPort] = useState<number>(80);
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High">("High");
  const [alertsTriggered, setAlertsTriggered] = useState<boolean>(true);
  const [malwareIndicators, setMalwareIndicators] = useState<string>("No Detection");
  const [proxyInformation, setProxyInformation] = useState<string>("No Proxy");
  const [firewallLogs, setFirewallLogs] = useState<string>("Allowed");
  const [idsIpsAlerts, setIdsIpsAlerts] = useState<string>("No Data");
  const [hour, setHour] = useState<number>(12);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictResponse | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packetLength,
          protocol,
          destPort,
          severity,
          alertsTriggered,
          malwareIndicators,
          proxyInformation,
          firewallLogs,
          idsIpsAlerts,
          hour
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error("Inference run error:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadStealthySignaturePreset = () => {
    setDestPort(22);
    setPacketLength(125);
    setProtocol("TCP");
    setSeverity("Medium");
    setAlertsTriggered(false);
    setMalwareIndicators("No Detection");
    setProxyInformation("Using Proxy");
    setFirewallLogs("Allowed");
    setIdsIpsAlerts("No Data");
    setHour(3);
  };

  const getAttackBadgeColor = (type: AttackType) => {
    switch (type) {
      case "DDoS":
        return "bg-rose-50 text-rose-700 border border-rose-100";
      case "Malware":
        return "bg-yellow-50 text-yellow-800 border border-yellow-105";
      case "Phishing":
        return "bg-cyan-50 text-cyan-700 border border-cyan-100";
      case "Intrusion":
        return "bg-orange-50 text-orange-700 border border-orange-100";
      case "Ransomware":
        return "bg-purple-50 text-purple-700 border border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  // Convert markdown-style raw text into high-fidelity React visual elements elegantly
  const renderAnalystReport = (text: string) => {
    const lines = text.split("\n");
    return (
      <div className="space-y-3.5 text-xs text-gray-700 leading-relaxed font-sans">
        {lines.map((line, idx) => {
          if (line.startsWith("###")) {
            return (
              <h3 key={idx} className="text-sm font-bold text-gray-900 mt-5 pt-3 border-t border-gray-100 first:mt-0 first:pt-0">
                {line.replace("###", "").trim()}
              </h3>
            );
          }
          if (line.startsWith("####")) {
            return (
              <h4 key={idx} className="text-xs font-bold text-slate-800 tracking-tight uppercase mt-4 mb-2">
                {line.replace("####", "").trim()}
              </h4>
            );
          }
          if (line.startsWith("*") || line.startsWith("-")) {
            // Check if there is a bold separator
            const boldMatch = line.match(/^\s*[\*\-]\s*\*\*(.*?)\*\*(.*)/);
            if (boldMatch) {
              return (
                <div key={idx} className="pl-4.5 relative mt-1">
                  <span className="absolute left-1 top-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <strong className="font-semibold text-gray-900">{boldMatch[1]}</strong>
                  <span>{boldMatch[2]}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="pl-4.5 relative mt-1">
                <span className="absolute left-1 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <span>{line.replace(/^\s*[\*\-]\s*/, "")}</span>
              </div>
            );
          }
          if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.")) {
            // Number list
            return (
              <div key={idx} className="pl-4.5 relative mt-1.5 flex gap-2">
                <span className="text-blue-600 font-mono font-bold">{line.substring(0, 2)}</span>
                <span>{line.substring(2).trim()}</span>
              </div>
            );
          }
          if (line.trim() === "") {
            return null;
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6" id="threat-predictor-ai">
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-50 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex flex-row items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
              Interactive Inference Testing Ground & Threat Auditor
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Define custom log metrics, execute model inference, and extract expert Gemini analyst briefings</p>
          </div>

          <button
            onClick={loadStealthySignaturePreset}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-750 text-xs font-semibold rounded-lg shadow-2xs border border-purple-100 flex items-center gap-1.5 transition-all cursor-pointer"
            id="btn-load-preset"
          >
            <Settings className="w-3.5 h-3.5" />
            Load Stealth Attack Preset
          </button>
        </div>

        {/* Inputs panel block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5.5">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">Destination Target Port</label>
              <input
                type="number"
                value={destPort}
                onChange={(e) => setDestPort(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-blue-400"
                id="input-port"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">Network Protocol</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer outline-none focus:bg-white focus:border-blue-400"
                id="input-protocol"
              >
                <option value="TCP">TCP (Transmission Control Protocol)</option>
                <option value="UDP">UDP (User Datagram Protocol)</option>
                <option value="ICMP">ICMP (Internet Control Message)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">Packet Length Scale (Bytes)</label>
              <input
                type="number"
                value={packetLength}
                onChange={(e) => setPacketLength(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-blue-400"
                id="input-bytes"
              />
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">Malware Indicator Status</label>
              <select
                value={malwareIndicators}
                onChange={(e) => setMalwareIndicators(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer outline-none focus:bg-white"
                id="input-malware"
              >
                <option value="No Detection">No Detection (Clean binary profile)</option>
                <option value="Detection">Detection (Heuristics database match)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">IDS/IPS Alert Status</label>
              <select
                value={idsIpsAlerts}
                onChange={(e) => setIdsIpsAlerts(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer outline-none focus:bg-white"
                id="input-ids"
              >
                <option value="No Data">No Data (Passes packet filter)</option>
                <option value="Alert Triggered">Alert Triggered (Intrusion Signature Hit)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">Firewall Log Code</label>
              <select
                value={firewallLogs}
                onChange={(e) => setFirewallLogs(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer outline-none focus:bg-white"
                id="input-firewall"
              >
                <option value="Allowed">Allowed (Network rule allows path)</option>
                <option value="Blocked">Blocked (Filter rejected packet)</option>
              </select>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">Proxy Information</label>
              <select
                value={proxyInformation}
                onChange={(e) => setProxyInformation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer outline-none focus:bg-white"
                id="input-proxy"
              >
                <option value="No Proxy">No Proxy (Direct address interface)</option>
                <option value="Using Proxy">Using Proxy (Encapsulated outbound proxy)</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">Alert Triggered</label>
                <div className="flex items-center gap-2.5 h-9 bg-gray-50 px-3 border border-gray-150 rounded-lg text-xs text-gray-700 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={alertsTriggered}
                    onChange={(e) => setAlertsTriggered(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 accent-blue-600"
                    id="checkbox-alerts"
                  />
                  <span>Warning Node</span>
                </div>
              </div>

              <div className="w-24 space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wide">Hour (UTC)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={(e) => setHour(Math.min(23, Math.max(0, Number(e.target.value))))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 outline-none text-center"
                />
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full h-[38px] mt-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 py-2 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              id="btn-run-inference"
            >
              <Play className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Running Threat Inference..." : "Audit Logs & Predict Vector"}
            </button>
          </div>

        </div>
      </div>

      {/* INFERENCE RESULTS LAYOUT */}
      {result && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6" id="inference-results-panel">
          
          {/* Left panel metrics predictions */}
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-bold font-mono">Ensemble Prediction Output</span>
                  <span className="text-[9.5px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Inference Succeeded</span>
                </div>

                <div className="text-center py-4">
                  <div className="text-[10px] text-gray-400 uppercase font-bold font-mono tracking-wider">Classification Target</div>
                  <div className="mt-1">
                    <span className={`px-4.5 py-2 rounded-xl text-sm font-bold tracking-tight inline-block shadow-sm ${getAttackBadgeColor(result.attackType)}`}>
                      {result.attackType} ALERT DETECTED
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-2 font-mono">
                    Softmax Confidence Score: <strong className="font-semibold text-gray-950">{(result.confidence * 100).toFixed(2)}%</strong>
                  </div>
                </div>

                {/* Probabilities Gauges */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block font-bold">Category Probabilities</span>
                  {Object.keys(result.probabilities).map((key) => {
                    const pct = (result.probabilities[key as AttackType] * 100).toFixed(1);
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono font-medium">
                          <span className="text-gray-600">{key}</span>
                          <span className="text-gray-900 font-bold">{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-700" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Model consistency consensus matrix */}
              <div className="pt-4 border-t border-gray-150 mt-4">
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block font-bold mb-2">Model Consensus Review</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  {Object.keys(result.modelsAgreement).map((model) => {
                    const isQ = model.includes("Quantum");
                    const agrees = result.modelsAgreement[model] === result.attackType;
                    return (
                      <div key={model} className="p-2 border border-slate-50 rounded-lg bg-slate-500/5 flex items-center justify-between">
                        <span className="text-gray-600 font-semibold">{model}:</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                          agrees 
                            ? (isQ ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800") 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {result.modelsAgreement[model]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel Gemini briefing analyst document */}
          <div className="xl:col-span-3">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col h-full justify-between">
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-600" />
                    SOC executive Security Intelligence Briefing
                  </h3>
                  <span className="text-[9.5px] font-mono bg-purple-50 text-purple-800 border border-purple-100 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-purple-600 animate-pulse" />
                    GEMINI-3.5-FLASH
                  </span>
                </div>

                <div className="max-h-[385px] overflow-y-auto pr-1 scrollbar-thin">
                  {renderAnalystReport(result.analystReport)}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-mono mt-4">
                <span>Decrypted security brief provided under SOC payload protocols</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5 fill-emerald-100" />
                  Audit Signed
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
