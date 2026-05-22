/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Database, Search, ShieldAlert, SlidersHorizontal, ArrowUpDown, Server, Eye } from "lucide-react";
import { CyberLog, AttackType } from "../types";

export default function CyberLogViewer() {
  const [logs, setLogs] = useState<CyberLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchLogs();
  }, [search, typeFilter, severityFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        search,
        type: typeFilter,
        severity: severityFilter
      });
      const res = await fetch(`/api/logs?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Error retrieving simulation logs:", e);
    } finally {
      setLoading(false);
    }
  };

  const getAttackBadgeColor = (type: AttackType) => {
    switch (type) {
      case "DDoS":
        return "bg-rose-50 text-rose-700 border border-rose-100";
      case "Malware":
        return "bg-yellow-50 text-yellow-800 border border-yellow-100";
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

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case "High":
        return "text-red-700 font-semibold";
      case "Medium":
        return "text-amber-700";
      case "Low":
        return "text-emerald-700";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col h-full" id="log-viewer">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            cybersecurity_attacks.csv Log Record Viewer
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Live view and querying of the raw cyber metrics dataset structure</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search IPs, Protocol, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs w-52 focus:outline-none focus:border-blue-400 font-mono"
              id="log-search-input"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-600 border-none outline-none pr-1.5 cursor-pointer"
              id="log-type-filter"
            >
              <option value="ALL">All Attack Types</option>
              <option value="DDoS">DDoS</option>
              <option value="Malware">Malware</option>
              <option value="Phishing">Phishing</option>
              <option value="Intrusion">Intrusion</option>
              <option value="Ransomware">Ransomware</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-600 border-none outline-none pr-1.5 cursor-pointer"
              id="log-severity-filter"
            >
              <option value="ALL">All Severities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dataset quick summaries */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
        <div className="bg-gray-50/40 border border-gray-50 p-3 rounded-xl">
          <span className="text-[10px] text-gray-400 uppercase font-mono">Simulated Dataset Size</span>
          <div className="text-sm font-semibold text-gray-800 mt-1">10,000 Total Logs</div>
        </div>
        <div className="bg-gray-50/40 border border-gray-50 p-3 rounded-xl">
          <span className="text-[10px] text-gray-400 uppercase font-mono">Current Query Match</span>
          <div className="text-sm font-semibold text-blue-600 mt-1">{loading ? "..." : `${logs.length} Matches`}</div>
        </div>
        <div className="bg-gray-50/40 border border-gray-50 p-3 rounded-xl">
          <span className="text-[10px] text-gray-400 uppercase font-mono">Most Active Class</span>
          <div className="text-sm font-semibold text-gray-800 mt-1">DDoS / Malware</div>
        </div>
        <div className="bg-gray-50/40 border border-gray-50 p-3 rounded-xl">
          <span className="text-[10px] text-gray-400 uppercase font-mono">Features Present</span>
          <div className="text-sm font-semibold text-emerald-600 mt-1">8 Core Features</div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="flex-1 overflow-x-auto border border-gray-50 rounded-xl max-h-[420px] scrollbar-thin">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Filtering threat logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-20 text-center text-xs text-gray-400">
            <ShieldAlert className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            No security logs matching search parameter found in database.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-mono text-gray-400 tracking-wider">
                <th className="py-2.5 px-4">Event ID</th>
                <th className="py-2.5 px-4">Source &rarr; Dest IP</th>
                <th className="py-2.5 px-4">Bytes</th>
                <th className="py-2.5 px-4">Protocol</th>
                <th className="py-2.5 px-3 text-center">Firewall Log</th>
                <th className="py-2.5 px-3 text-center">Malware Detection</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4 text-right">Target Threat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[11px] font-mono text-gray-600">
              {logs.slice(0, 40).map((log) => (
                <tr key={log.id} className="hover:bg-gray-1000/10 transition-colors">
                  <td className="py-3 px-4 text-blue-600 font-semibold">{log.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-gray-700">{log.sourceIp}</div>
                    <div className="text-[9px] text-gray-400 font-semibold mt-0.5">
                      port {log.srcPort} &rarr; proxy {log.destIp}:{log.destPort}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-700">{log.packetLength.toLocaleString()} B</td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-500">{log.protocol}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                      log.firewallLogs === "Blocked" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                    }`}>
                      {log.firewallLogs}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      log.malwareIndicators === "Detection" ? "bg-amber-100 text-amber-800 font-bold" : "bg-gray-100 text-gray-400"
                    }`}>
                      {log.malwareIndicators === "Detection" ? "DETECTED" : "Safe"}
                    </span>
                  </td>
                  <td className={`py-3 px-4 ${getSeverityBadgeColor(log.severity)}`}>
                    {log.severity}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-semibold tracking-tight ${getAttackBadgeColor(log.attackType)}`}>
                      {log.attackType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-mono mt-3">
        <span className="flex items-center gap-1">
          <Server className="w-3.5 h-3.5 text-gray-400" />
          Displaying first 40 rows of dataset queries 
        </span>
        <span>Local Time: 2026-05-21 10:54 UTC</span>
      </div>
    </div>
  );
}
