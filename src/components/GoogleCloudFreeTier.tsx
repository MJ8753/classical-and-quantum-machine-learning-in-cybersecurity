/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Cloud, Coins, Code, Play, Check, Copy, Info, Terminal, Shield, ArrowRight, Layers, FileCode, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface GCPLogTemplate {
  source: string;
  payload: string;
  severity: "Low" | "Medium" | "High";
  protocol: "TCP" | "UDP" | "ICMP";
  bytes: number;
  port: number;
}

export default function GoogleCloudFreeTier() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [logInflowRate, setLogInflowRate] = useState<number>(350); // Thousands of logs per month
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"blueprint" | "sandbox" | "terraform">("blueprint");
  const [ingestedLogs, setIngestedLogs] = useState<string[]>([
    "Initialized GCP Logging Sandbox subscription topic: 'projects/free-tier-sandbox/topics/cyber-threat-logs'",
    "Ready to stream Google Cloud VPC Firewall & Audit logs..."
  ]);

  // Log templates to simulate
  const logTemplates: GCPLogTemplate[] = [
    {
      source: "Google Compute Engine VPC Firewall Sink",
      payload: "VPC_FLOW_LOG: SRC=192.168.1.43 DST=10.128.0.2 PROTOCOL=TCP PORT=22 BYTES=125 STATE=ALLOWED ACTION=ACCEPT",
      severity: "Medium",
      protocol: "TCP",
      bytes: 125,
      port: 22
    },
    {
      source: "Google Cloud DNS Query Threat Logs",
      payload: "DNS_QUERY: SRC=10.128.0.5 DST=8.8.8.8 QUERY=update.malicious-cryptomining-pool.xyz TYPE=A ACTION=BLOCKED",
      severity: "High",
      protocol: "UDP",
      bytes: 512,
      port: 53
    },
    {
      source: "Google Kubernetes Engine (GKE) Audit Log",
      payload: "GKE_AUDIT: USER=admin-sa@free-gpc-project REGION=us-central1 OPERATION=pods/exec PASS=true",
      severity: "Low",
      protocol: "TCP",
      bytes: 1450,
      port: 443
    },
    {
      source: "Google Cloud IDS (Intrusion Detection System)",
      payload: "CLOUD_IDS: THREAT_ID=2015099 SRC=203.0.113.88 DST=10.12.0.100 RULE=brute_force_ssh VALUE=98",
      severity: "High",
      protocol: "ICMP",
      bytes: 64,
      port: 22
    }
  ];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const simulateGCPLogIngestion = () => {
    setIsIngesting(true);
    setIngestedLogs([
      "[GCP Pub/Sub] Establishing secure pipeline payload subscriber context...",
      "[GCP Cloud Logging Sink] Filtering security events matching: resource.type=\"gce_instance\" OR resource.type=\"gke_cluster\""
    ]);

    let logCounter = 0;
    const interval = setInterval(() => {
      if (logCounter >= logTemplates.length) {
        clearInterval(interval);
        setIngestedLogs(prev => [
          ...prev,
          "[SUCCESS] Batch cloud event mapping process finished.",
          "🎉 Local inference pipelines calibrated with real Google Cloud Audit JSON payloads!"
        ]);
        setIsIngesting(false);
        return;
      }

      const template = logTemplates[logCounter];
      setIngestedLogs(prev => [
        ...prev,
        `[SUBSCRIPTION SINK - ${template.source}] Severity: ${template.severity} | Protocol: ${template.protocol} | Ingesting parsed payload metadata...`,
        `  -> Raw Log: "${template.payload}"`,
        `  -> Normalized feature vector: { Port: ${template.port}, Protocol: ${template.protocol}, Bytes: ${template.bytes} } mapped to prediction queue.`
      ]);

      logCounter++;
    }, 750);
  };

  // Google Cloud Free Tier calculation parameters
  const computeRunRequestsPrice = () => {
    // Cloud run gets 2M free requests
    const simulatedRequests = logInflowRate * 1000;
    if (simulatedRequests <= 2000000) return { cost: 0, status: "FREE" };
    const excess = simulatedRequests - 2000000;
    return { cost: excess * 0.0000004, status: "PAID" };
  };

  const computeCloudLoggingPrice = () => {
    // Cloud Logging gets 50 GB free
    const avgLogSizeKb = 0.5; // average cloud log size is half a KB
    const simulatedGb = (logInflowRate * 1000 * avgLogSizeKb) / (1024 * 1024);
    if (simulatedGb <= 50) return { gb: simulatedGb, cost: 0, status: "FREE" };
    const excess = simulatedGb - 50;
    return { gb: simulatedGb, cost: excess * 0.50, status: "PAID" }; // $0.50 per GB list price
  };

  const computePubSubPrice = () => {
    // Pub/Sub gets 10 GB free messages
    const avgLogSizeKb = 0.5;
    const simulatedGb = (logInflowRate * 1000 * avgLogSizeKb) / (1024 * 1024);
    if (simulatedGb <= 10) return { gb: simulatedGb, cost: 0, status: "FREE" };
    const excess = simulatedGb - 10;
    return { gb: simulatedGb, cost: excess * 0.06, status: "PAID" }; // $0.06 per GB
  };

  const runCalc = computeRunRequestsPrice();
  const loggingCalc = computeCloudLoggingPrice();
  const pubSubCalc = computePubSubPrice();
  const totalCost = runCalc.cost + loggingCalc.cost + pubSubCalc.cost;

  // Code snippets for free tier setup
  const gcloudDeployScript = `# Step 1: Securely authenticate your terminal
gcloud auth login

# Step 2: Set your active Google Cloud Free Project
gcloud config set project [YOUR-FREE-GCP-PROJECT-ID]

# Step 3: Deploy this Machine Learning Sandbox directly to Google Cloud Run
# Cloud Run includes 2 million FREE requests, 180,000 vCPU-seconds and 360,000 GiB-seconds monthly!
gcloud run deploy cyber-attack-sandbox \\
  --source . \\
  --port 3000 \\
  --allow-unauthenticated \\
  --region us-central1 \\
  --memory 512Mi \\
  --cpu 1

# Step 4: Hook up VPC Firewall logs dynamically (Free logging sandbox)
gcloud logging sinks create firewall-alert-sink \\
  pubsub.googleapis.com/projects/[YOUR-FREE-GCP-PROJECT-ID]/topics/firewall-events \\
  --log-filter="resource.type=\\"gce_subnetwork\\" AND jsonPayload.connection.dest_port=22"`;

  const terraformGcpCode = `provider "google" {
  project = "your-gcp-free-project"
  region  = "us-central1"
}

# Free Tier Cloud Run Service
resource "google_cloud_run_service" "model_service" {
  name     = "classical-quantum-sandbox"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/your-gcp-free-project/cyber-sandbox:latest"
        resources {
          limits = {
            memory = "512Mi"
            cpu    = "1000m" # 1 vCPU stays in Free Tier during runtime requests
          }
        }
        ports {
          container_port = 3000
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}`;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col h-full" id="gcp-free-tier-workspace">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-gray-50">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Cloud className="w-4 h-4 text-sky-500" />
            Google Cloud Platform Free Version Architecture Hub
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Learn how to run this multi-model ML classifier sandbox entirely for $0/month on GCP serverless</p>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-150 text-xs">
          <button
            onClick={() => setActiveSubTab("blueprint")}
            className={`px-3 py-1 rounded-md cursor-pointer transition-all ${
              activeSubTab === "blueprint" ? "bg-white text-gray-800 font-semibold shadow-xs" : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            Cost Planner
          </button>
          <button
            onClick={() => setActiveSubTab("sandbox")}
            className={`px-3 py-1 rounded-md cursor-pointer transition-all ${
              activeSubTab === "sandbox" ? "bg-white text-gray-800 font-semibold shadow-xs" : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            Logging Ingestion Sandbox
          </button>
          <button
            onClick={() => setActiveSubTab("terraform")}
            className={`px-3 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1 ${
              activeSubTab === "terraform" ? "bg-white text-gray-800 font-semibold shadow-xs" : "text-gray-500 hover:text-gray-800 font-medium"
            }`}
          >
            <Code className="w-3.5 h-3.5 text-slate-500" />
            gcloud &amp; Terraform Scripts
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeSubTab === "blueprint" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Slider controls column */}
          <div className="lg:col-span-5 bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] text-gray-450 font-mono uppercase tracking-wider block font-semibold">Simulate Cloud Scale</span>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-sky-500" />
                    Security Logs Volume / Month
                  </span>
                  <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full font-bold font-mono text-[10.5px]">
                    {(logInflowRate * 1000).toLocaleString()} security logs
                  </span>
                </div>
                
                <input
                  type="range"
                  min="10"
                  max="2500"
                  value={logInflowRate}
                  onChange={(e) => setLogInflowRate(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-ew-resize"
                />
                
                <p className="text-[10px] text-gray-400 leading-normal">
                  Varying the monthly logs volume predicts resources occupied in Google Cloud Run + Pub/Sub queue topologies before crossing premium thresholds.
                </p>
              </div>

              {/* Free Tier Threshold details */}
              <div className="space-y-2 text-[11px] text-gray-600 bg-white p-3 rounded-lg border border-gray-150">
                <div className="flex items-center gap-1.5 font-bold text-gray-800 pb-1.5 border-b border-gray-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Google Cloud Standard Free Tier Limits (Per Month)
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                  <div>• Google Cloud Run:</div>
                  <div className="text-right text-emerald-600 font-bold">2,000,000 requests</div>
                  <div>• Cloud Logging:</div>
                  <div className="text-right text-emerald-600 font-bold">50.00 GB storage</div>
                  <div>• GCP Pub/Sub:</div>
                  <div className="text-right text-emerald-600 font-bold">10.00 GB traffic</div>
                </div>
              </div>
            </div>

            {/* Simulated Live Cost Result */}
            <div className="mt-5 pt-3.5 border-t border-gray-150 flex flex-col items-center text-center">
              <span className="text-[10.5px] text-gray-400 font-mono font-bold uppercase tracking-wide">ESTIMATED GOOGLE CLOUD BILL</span>
              <span className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
                ${totalCost.toFixed(2)} <span className="text-xs font-semibold text-gray-500">/ mo</span>
              </span>
              <p className="text-[9.5px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold mt-1.5 flex items-center gap-1">
                <Check className="w-3 h-3" />
                100% Covered under Google Cloud Free Tier Sandbox!
              </p>
            </div>
          </div>

          {/* Breakdown cards column */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] text-gray-450 font-mono uppercase tracking-wider block font-semibold">Service Coverage Breakdown</span>
            
            {/* Google Cloud Run Card */}
            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                  Google Cloud Run (Compute Engine Core)
                </div>
                <p className="text-xs text-gray-500 max-w-sm">
                  Deploys this sandbox container, scaling to 0 when inactive. No charge unless parsing live webhook data flows.
                </p>
                <div className="text-[10.5px] font-mono text-gray-400">
                  Simulated requests: <strong className="text-gray-700">{(logInflowRate * 1000).toLocaleString()}</strong> / 2,000,000 free
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10.5px] font-bold font-mono uppercase">
                  $0.00 (FREE)
                </span>
              </div>
            </div>

            {/* Google Cloud Logging Card */}
            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Google Cloud Logging (VPC Sink Stream)
                </div>
                <p className="text-xs text-gray-500 max-w-sm">
                  Logs are routed from routers directly to our analyzer endpoint. Includes first 50GB storage free.
                </p>
                <div className="text-[10.5px] font-mono text-gray-400">
                  Simulated storage occupied: <strong className="text-gray-700">{loggingCalc.gb.toFixed(4)} GB</strong> / 50.00 GB free
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10.5px] font-bold font-mono uppercase">
                  $0.00 (FREE)
                </span>
              </div>
            </div>

            {/* Google Cloud Pub/Sub Card */}
            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  GCP Pub/Sub Queue System
                </div>
                <p className="text-xs text-gray-500 max-w-sm">
                  Ingests multi-region cluster logs dynamically. Delivers payloads securely using standard JSON structures.
                </p>
                <div className="text-[10.5px] font-mono text-gray-400">
                  Simulated throughput volume: <strong className="text-gray-700">{pubSubCalc.gb.toFixed(4)} GB</strong> / 10.00 GB free
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10.5px] font-bold font-mono uppercase">
                  $0.00 (FREE)
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeSubTab === "sandbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          {/* Subscription explanation */}
          <div className="lg:col-span-4 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
            <div className="space-y-3.5">
              <span className="text-[10px] text-gray-450 font-mono uppercase block font-semibold">Pub/Sub Payload Streaming</span>
              
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-800">Dynamic Google Cloud Log Parsing</h3>
                <p className="text-[11.5px] text-gray-500 leading-normal">
                  Simulate the exact API telemetry that links your live Google Cloud infrastructure to our Python or Quantum SV Classifiers.
                </p>
              </div>

              <div className="space-y-2 text-[10.5px] text-gray-600 bg-white p-3 rounded-lg border border-gray-150">
                <div className="font-semibold text-slate-800">Available Simulation Sources:</div>
                <ul className="space-y-1 list-disc pl-4 text-gray-500">
                  <li>VPC Router connection flows</li>
                  <li>Kubernetes Cluster audit events</li>
                  <li>Identity access authorization logs</li>
                  <li>Intrusion Detection (IDS) events</li>
                </ul>
              </div>
            </div>

            <button
              onClick={simulateGCPLogIngestion}
              disabled={isIngesting}
              className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed mt-4"
            >
              <Play className={`w-3.5 h-3.5 ${isIngesting ? "animate-spin" : ""}`} />
              {isIngesting ? "Streaming GCP logs..." : "Trigger GCP Log Simulation"}
            </button>
          </div>

          {/* Interactive logs monitor */}
          <div className="lg:col-span-8 flex flex-col h-full justify-between min-h-[250px]">
            <div className="bg-slate-950 font-mono text-[10px] text-slate-300 rounded-xl p-4.5 border border-slate-800 flex flex-col flex-1 h-64 overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="text-sky-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-sky-400" />
                  gcloud PubSub Subscriber Session
                </span>
                <span className="text-slate-500 uppercase text-[9.5px]">Project: sandbox-free-tier</span>
              </div>
              <div className="space-y-1.5 flex-1 overflow-y-auto">
                {ingestedLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    <span className="text-sky-500 font-bold">&gt; </span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "terraform" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* gcloud commands card */}
          <div className="flex flex-col justify-between bg-gray-50/50 rounded-xl border border-gray-150 p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-gray-150 pb-2 mb-2">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-sky-500" />
                  Automated Deployment Command (gcloud CLI)
                </span>
                <button
                  onClick={() => handleCopy(gcloudDeployScript, "gcloud")}
                  className="flex items-center gap-1 text-[10px] text-sky-600 hover:text-sky-500 bg-white py-1 px-2.5 rounded border border-gray-150 transition-colors font-semibold cursor-pointer shadow-2xs"
                >
                  {copiedCode === "gcloud" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy commands
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal">
                These commands pack this full-stack interactive cyber detector into an production container and deploys it effortlessly inside Google Cloud's official Free Tier Serverless compute layers.
              </p>
              <div className="bg-slate-900 text-[10px] font-mono text-slate-300 p-3.5 rounded-lg border border-slate-850 overflow-x-auto max-h-[180px] scrollbar-thin">
                <pre>{gcloudDeployScript}</pre>
              </div>
            </div>
            
            <div className="text-[10px] bg-sky-50 border border-sky-100 p-2.5 rounded text-sky-950 flex items-start gap-1.5 mt-3 leading-relaxed">
              <Info className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Pro-tip:</strong> When deploying, set the port to 3000 to perfectly route incoming telemetry. Because Cloud Run scales to zero instances, empty pipeline cycles won't allocate compute charges!
              </p>
            </div>
          </div>

          {/* Terraform provisioning card */}
          <div className="flex flex-col justify-between bg-gray-50/50 rounded-xl border border-gray-150 p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-gray-150 pb-2 mb-2">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5 text-purple-500" />
                  Terraform Infrastructure-as-Code (IaC)
                </span>
                <button
                  onClick={() => handleCopy(terraformGcpCode, "terraform")}
                  className="flex items-center gap-1 text-[10px] text-purple-600 hover:text-purple-500 bg-white py-1 px-2.5 rounded border border-gray-150 transition-colors font-semibold cursor-pointer shadow-2xs"
                >
                  {copiedCode === "terraform" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Terraform
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal">
                Need automated provisioning? Copy this Terraform script to configure your Google Cloud Free Tier resources cleanly, complete with hardware scale limits.
              </p>
              <div className="bg-slate-900 text-[10px] font-mono text-slate-300 p-3.5 rounded-lg border border-slate-800 overflow-x-auto max-h-[180px] scrollbar-thin">
                <pre>{terraformGcpCode}</pre>
              </div>
            </div>

            <div className="text-[10px] bg-purple-50 border border-purple-100 p-2.5 rounded text-purple-950 flex items-start gap-1.5 mt-3 leading-relaxed">
              <Info className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <p>
                <strong>No database needed:</strong> Local storage models &amp; local memory state are sufficient. Running completely serverless keeps operations entirely within the static $0.00 limits forever.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
