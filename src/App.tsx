/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Zap,
  ShieldCheck,
  Cpu,
  Terminal,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Search,
  Sun,
  Moon,
  Command,
  Sparkles,
  ChevronRight,
  Gauge,
  FileText,
  TrendingUp,
  Check,
  X,
  Eye,
  Maximize2,
  Download,
  Layers,
  Award,
  Phone,
  MapPin,
  Building2,
  UserCheck,
  Copy,
  ExternalLink,
  Shield,
  BadgeCheck
} from 'lucide-react';

// Types
interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface CommandAction {
  id: string;
  name: string;
  category: 'Navigation' | 'Diagnostics' | 'System' | 'Theme' | 'Contact';
  shortcut?: string;
  action: () => void;
}

interface PlantAsset {
  id: string;
  title: string;
  subTitle: string;
  category: 'Circular Loom' | 'VFD Inverter Panel' | 'Power Supply & Calibration' | 'Yarn & Creel';
  image: string;
  pdfUrl?: string;
  healthScore: number;
  nominalStatus: string;
  lastInspection: string;
  telemetry: {
    key: string;
    val: string;
    status: 'normal' | 'warning' | 'optimal';
  }[];
  detectedAnomalies: {
    id: string;
    component: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    remediationAction: string;
  }[];
}

interface RateItem {
  id: string;
  size: string;
  classification: string;
  ratePaisa: number; // e.g. 0.0215
  rateRupeeStr: string;
  benchmarkUnit: string;
}

/**
 * Normalizes static asset paths.
 * In Vite and static hosts (Vercel, Cloud Run), /public is stripped from the served URL.
 */
export const resolveAsset = (path: string): string => {
  if (!path) return '';
  let clean = path.trim();
  if (clean.startsWith('/public/')) {
    clean = clean.replace('/public/', '/');
  } else if (clean.startsWith('public/')) {
    clean = '/' + clean.replace('public/', '');
  }
  return clean;
};

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'person' | 'seal' | 'machine' | 'document';
  fallbackText?: string;
}

/**
 * Resilient image renderer that automatically resolves paths and displays
 * an elegant domain fallback badge if the file cannot be reached.
 */
function SafeImage({ src, alt, className, fallbackType, fallbackText, ...rest }: SafeImageProps) {
  const [errorCount, setErrorCount] = useState<number>(0);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const cleanPath = resolveAsset(src || '');

  // Calculate URL to try (first absolute /assets/..., then relative ./assets/...)
  const currentSrc = useMemo(() => {
    if (!cleanPath) return '';
    if (errorCount === 0) return cleanPath;
    if (errorCount === 1) {
      return cleanPath.startsWith('/') ? '.' + cleanPath : '/' + cleanPath;
    }
    return '';
  }, [cleanPath, errorCount]);

  if (hasFailed || !currentSrc) {
    if (fallbackType === 'person') {
      return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 text-cyan-400 p-3 select-none ${className}`}>
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/40 flex items-center justify-center font-bold text-lg text-cyan-200 shadow-inner">
            AT
          </div>
          <span className="text-[11px] font-bold text-slate-100 mt-2">Arun Tiwari</span>
          <span className="text-[9px] text-cyan-300 font-mono tracking-wide">Authorized Proprietor</span>
        </div>
      );
    }
    if (fallbackType === 'seal') {
      return (
        <div className={`flex flex-col items-center justify-center bg-slate-950 text-cyan-400 p-1 border border-cyan-500/40 select-none ${className}`}>
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span className="text-[7px] font-mono font-bold text-cyan-300 text-center uppercase tracking-tighter">SEAL</span>
        </div>
      );
    }
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900/90 text-slate-400 p-3 text-center select-none ${className}`}>
        <Cpu className="w-6 h-6 text-cyan-400/70 mb-1" />
        <span className="text-[10px] font-mono text-slate-300 truncate max-w-full px-1">{fallbackText || alt || 'Plant Unit'}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (errorCount < 1) {
          setErrorCount((prev) => prev + 1);
        } else {
          setHasFailed(true);
        }
      }}
      referrerPolicy="no-referrer"
      {...rest}
    />
  );
}

const RATE_SCHEDULE: RateItem[] = [
  { id: 'rate-1', size: 'Size 12 to 16', classification: 'Standard Quality Production', ratePaisa: 0.0215, rateRupeeStr: '0.0215 Paisa (₹0.215 / mtr)', benchmarkUnit: '1,200 units' },
  { id: 'rate-2', size: 'Size 19 to 22', classification: 'Standard Quality Production', ratePaisa: 0.0225, rateRupeeStr: '0.0225 Paisa (₹0.225 / mtr)', benchmarkUnit: '1,200 units' },
  { id: 'rate-3', size: 'Cement Grade 19 & 20', classification: 'Cement Grade Fabric Production', ratePaisa: 0.0215, rateRupeeStr: '0.0215 Paisa (₹0.215 / mtr)', benchmarkUnit: '1,200 units' },
  { id: 'rate-4', size: 'Size 23 to 26', classification: 'Standard Quality Production', ratePaisa: 0.0245, rateRupeeStr: '0.0245 Paisa (₹0.245 / mtr)', benchmarkUnit: '1,200 units' },
  { id: 'rate-5', size: 'Size 27 to 30', classification: 'High Specification Production', ratePaisa: 0.0265, rateRupeeStr: '0.0265 Paisa (₹0.265 / mtr)', benchmarkUnit: '1,200 units' },
];

const PLANT_ASSETS: PlantAsset[] = [
  {
    id: 'asset-loom-nova6',
    title: 'Lohia Nova 6-HS Circular Weaving Loom',
    subTitle: 'Section B // Ring Assembly #04 (6-Shuttle Weft Matrix)',
    category: 'Circular Loom',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-13_at_12.04.34_a007a261.jpeg',
    healthScore: 97.4,
    nominalStatus: 'Continuous Weaving Nominal',
    lastInspection: '4 mins ago',
    telemetry: [
      { key: 'Linear Weaving Speed', val: '860 ppm', status: 'optimal' },
      { key: 'Weft Tape Tension', val: '14.2 cN/tex', status: 'normal' },
      { key: 'Ring Bearing Vibration', val: '0.82 mm/s', status: 'normal' },
      { key: 'Operating Temp', val: '41.8 °C', status: 'normal' },
    ],
    detectedAnomalies: [
      {
        id: 'anom-1',
        component: 'Cam Track Cam Follower #3',
        issue: 'Micro-frictional harmonic resonance detected at 850 RPM',
        severity: 'low',
        confidence: 94.6,
        remediationAction: 'Trigger automated micro-lubrication pulse and recalibrate tension motor.',
      },
      {
        id: 'anom-2',
        component: 'Shuttle Tape Guide Eyelet',
        issue: 'Wear index reaching 78% threshold (pre-rupture forecast)',
        severity: 'medium',
        confidence: 91.2,
        remediationAction: 'Schedule wear-compensating position offset & queue preventative swap.',
      }
    ]
  },
  {
    id: 'asset-vfd-mitsu',
    title: 'Mitsubishi Electric D700 VFD Array',
    subTitle: 'Control Cabinet 4U // Units 4U3, 4U4, 4U5 (25.05 Hz Inverter Bus)',
    category: 'VFD Inverter Panel',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-13_at_12.04.48_f5f2bf82.jpeg',
    healthScore: 94.2,
    nominalStatus: 'Active Frequency Modulation',
    lastInspection: 'Just now',
    telemetry: [
      { key: 'Inverter Output Freq', val: '25.05 Hz', status: 'optimal' },
      { key: 'DC Bus Voltage', val: '312.4 V DC', status: 'normal' },
      { key: 'Heat Sink Temp', val: '46.1 °C', status: 'normal' },
      { key: 'Motor Current Draw', val: '2.84 A', status: 'normal' },
    ],
    detectedAnomalies: [
      {
        id: 'anom-3',
        component: 'Inverter 4U5 Carrier Frequency',
        issue: 'Sub-harmonic ripple detected at low-speed torque step (±0.04 Hz)',
        severity: 'medium',
        confidence: 96.8,
        remediationAction: 'Execute soft PWM phase-modulation rebalance to null harmonic vibration.',
      }
    ]
  },
  {
    id: 'asset-dc-calib',
    title: 'DC Power Supply Calibration Unit DH1715A-5',
    subTitle: 'NABL Certified Lab Standard CC-3071 // 0-35V / 0-3A DC Bench',
    category: 'Power Supply & Calibration',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-13_at_12.05.00_d46c687e.jpeg',
    pdfUrl: '/assets/aistudio/Final_Global_Calibration_Certificate_Generator_89f754e1.pdf',
    healthScore: 99.8,
    nominalStatus: 'NABL Traceable (GC-074 Multimeter)',
    lastInspection: 'Today 08:30',
    telemetry: [
      { key: 'Voltage Tolerance Error', val: '+0.112 V (0.32%)', status: 'optimal' },
      { key: 'Expanded Uncertainty (k=2)', val: '±0.00013 V', status: 'optimal' },
      { key: 'Current Error Tolerance', val: '+0.101 A', status: 'optimal' },
      { key: 'Certification Validity', val: 'Active till Oct 2027', status: 'normal' },
    ],
    detectedAnomalies: [
      {
        id: 'anom-4',
        component: 'Voltage Sensing Bridge 30V Tap',
        issue: '0.004V drift observed relative to NPL traceable standard',
        severity: 'low',
        confidence: 98.1,
        remediationAction: 'Auto-apply polynomial DAC offset calibration table.',
      }
    ]
  },
  {
    id: 'asset-bobbin-creel',
    title: 'High-Density Bobbin Feed Tension Rig',
    subTitle: 'Circular Weft Supply Rack // 64 Bobbin Station (0.03% Wastage Guard)',
    category: 'Yarn & Creel',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-13_at_12.05.42_7efaa08b.jpeg',
    healthScore: 96.1,
    nominalStatus: 'Zero Tangling // High Uniformity',
    lastInspection: '12 mins ago',
    telemetry: [
      { key: 'Creel Package Density', val: '0.91 g/cm³', status: 'optimal' },
      { key: 'Tape Friction Coefficient', val: '0.18 μ', status: 'normal' },
      { key: 'Bobbin Supply Buffer', val: '14 Bobbins Ready', status: 'normal' },
      { key: 'Wastage Rate Benchmark', val: '0.019% (Cap: 0.03%)', status: 'optimal' },
    ],
    detectedAnomalies: [
      {
        id: 'anom-5',
        component: 'Creel Snub Guide #14',
        issue: 'Uneven yarn payout drag detected on inner bobbin rim',
        severity: 'low',
        confidence: 89.9,
        remediationAction: 'Trigger stepper-motor tension compensation to equalize thread draw.',
      }
    ]
  }
];

export default function App() {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState<boolean>(true);

  // Command palette state
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [commandSearch, setCommandSearch] = useState<string>('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState<number>(0);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Telemetry real-time ticking
  const [isTelemetryStreaming, setIsTelemetryStreaming] = useState<boolean>(true);
  const [telemetryTimeRange, setTelemetryTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [activeTelemetryMetric, setActiveTelemetryMetric] = useState<'throughput' | 'vfd' | 'thermal' | 'power'>('throughput');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ x: number; y: number; label: string; value: string } | null>(null);

  // Dashboard preview tabs
  const [activeDashTab, setActiveDashTab] = useState<'telemetry' | 'rates' | 'diagnostics' | 'nodes' | 'compliance'>('telemetry');
  const [nodeFilter, setNodeFilter] = useState<'all' | 'looms' | 'vfd' | 'compliance'>('all');

  // Selected rate tier for calculator
  const [selectedRateId, setSelectedRateId] = useState<string>('rate-1');

  // Command Center Card state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; time: string; output: string[]; status: 'success' | 'warn' | 'info' }>>([
    {
      cmd: 'synapse-infra init --cluster=shrishti-medak-01',
      time: '14:22:01',
      output: [
        '✓ Connected to Shrishti Enterprises Plant (Proprietor: Arun Tiwari)',
        '✓ Telangana Commercial Reg SEA/MDK/ACL/PC/1405045/2026 validated',
        '✓ GSTIN: 36AYPPT5754R1Z3 (State Code 36 - Telangana) active',
        '✓ Mitsubishi D700 VFD Array link established on port 4U [25.05 Hz Locked]',
        '✓ AI Predictive Health Engine loaded with zero latency overhead',
      ],
      status: 'success'
    }
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [isTerminalExecuting, setIsTerminalExecuting] = useState<boolean>(false);

  // Security & Compliance switches
  const [complianceChecks, setComplianceChecks] = useState({
    nablTraceability: true,
    wastageGuard: true,
    edgeEncryption: true,
    statutoryAuditSync: true,
  });

  // Automated Workflow pipeline state
  const [activePipelineStep, setActivePipelineStep] = useState<number>(2);
  const [isSimulatingPipeline, setIsSimulatingPipeline] = useState<boolean>(false);

  // Performance Gauge sliders
  const [concurrencyLoad, setConcurrencyLoad] = useState<number>(140);
  const [harmonicDamping, setHarmonicDamping] = useState<number>(25);

  // ROI Calculator sliders
  const [monthlyMtr, setMonthlyMtr] = useState<number>(1606030); // 1.6M MTR from real tax invoice
  const [downtimeHours, setDowntimeHours] = useState<number>(16);
  const [numLooms, setNumLooms] = useState<number>(12);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Interactive Modals
  const [inspectionAsset, setInspectionAsset] = useState<PlantAsset | null>(null);
  const [isLiveDemoModalOpen, setIsLiveDemoModalOpen] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; subtitle: string; image: string; pdfUrl?: string } | null>(null);
  const [activeHeatmapLayer, setActiveHeatmapLayer] = useState<'thermal' | 'vibration' | 'stress'>('thermal');
  const [remediatingAnomId, setRemediatingAnomId] = useState<string | null>(null);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to Clipboard', `${label}: ${text}`, 'success');
  };

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
        setInspectionAsset(null);
        setIsLiveDemoModalOpen(false);
        setPreviewDoc(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Spotlight mouse effect on Bento cards
  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Simulated live telemetry tick
  const [liveThroughput, setLiveThroughput] = useState<number>(1606030);
  const [liveVfdFreq, setLiveVfdFreq] = useState<number>(25.05);
  const [liveWastage, setLiveWastage] = useState<number>(0.021);

  useEffect(() => {
    if (!isTelemetryStreaming) return;
    const interval = setInterval(() => {
      setLiveThroughput((prev) => prev + Math.floor(Math.random() * 8) + 2);
      setLiveVfdFreq((prev) => {
        const jitter = (Math.random() - 0.5) * 0.04;
        return Number((25.05 + jitter).toFixed(2));
      });
      setLiveWastage((prev) => {
        const delta = (Math.random() - 0.5) * 0.002;
        return Number(Math.max(0.012, Math.min(0.028, prev + delta)).toFixed(3));
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [isTelemetryStreaming]);

  // Dynamic calculations
  const readinessScore = useMemo(() => {
    let score = 70;
    if (complianceChecks.nablTraceability) score += 9;
    if (complianceChecks.wastageGuard) score += 7;
    if (complianceChecks.edgeEncryption) score += 6.5;
    if (complianceChecks.statutoryAuditSync) score += 5.9;
    return Number(score.toFixed(1));
  }, [complianceChecks]);

  // Active rate calculation
  const currentRateItem = useMemo(() => {
    return RATE_SCHEDULE.find((r) => r.id === selectedRateId) || RATE_SCHEDULE[0];
  }, [selectedRateId]);

  // Terminal command executor
  const executeTerminalCommand = (rawCommand: string) => {
    if (!rawCommand.trim()) return;
    const cmd = rawCommand.trim();
    setIsTerminalExecuting(true);

    const now = new Date().toTimeString().split(' ')[0];

    setTimeout(() => {
      let output: string[] = [];
      let status: 'success' | 'warn' | 'info' = 'success';

      if (cmd.includes('diagnose') || cmd.includes('vision')) {
        output = [
          '⚡ Running Deep Multimodal Diagnostic on Inverter 4U5 & Loom Ring 04...',
          '✓ Optical matrix: Shuttle track alignment within ±0.012mm tolerance',
          '✓ Inverter 4U5 Carrier Frequency: 25.05 Hz (Sub-harmonic phase jitter 0.02%)',
          '✓ NABL Calibration Traceability Certificate CC-3071: ACTIVE & CERTIFIED',
          '✓ Shrishti Plant Operations authorized: Arun Tiwari (Proprietor)',
          '➔ Conclusion: Optimal operating health index 97.4%. No critical stoppage predicted.',
        ];
        status = 'success';
        showToast('Vision Diagnostics Complete', 'Inverter 4U5 and Loom Ring 04 validated at 97.4% health.');
      } else if (cmd.includes('rebalance') || cmd.includes('remediate')) {
        output = [
          '🔧 Executing Automated System Remediation Workflow...',
          '➔ Step 1: Modulating PWM switching dead-time from 2.4μs to 2.1μs',
          '➔ Step 2: Compensating bobbin creel stepper tension by +0.3 cN/tex',
          '➔ Step 3: Zeroing DAC DC-voltage offset relative to NPL traceable standard',
          '✓ Remediation deployed in 38ms. Harmonic ripple suppressed to <0.005%.',
        ];
        status = 'success';
        showToast('Remediation Workflow Applied', 'PWM frequency and bobbin tension auto-balanced in 38ms.');
      } else if (cmd.includes('calibrate') || cmd.includes('nabl')) {
        output = [
          '📋 Verifying NABL ISO/IEC 17025 Calibration Certificate CC-3071...',
          '✓ Laboratory: Global Calibration (Accreditation CC-3071 / Reg GC-074)',
          '✓ Standard Reference: 8½ Digit Multimeter AIPL/171023/1-1',
          '✓ DC Voltage Deviation: 0.112V (Acceptance window ±0.500V)',
          '✓ Next Calibration Due: October 03, 2027. Status: FULL COMPLIANCE',
        ];
        status = 'info';
        showToast('NABL Audit Passed', 'Calibration valid through Oct 2027 with ±0.00013V uncertainty.');
      } else if (cmd.includes('clear')) {
        setTerminalHistory([]);
        setIsTerminalExecuting(false);
        setTerminalInput('');
        return;
      } else {
        output = [
          `Executing: ${cmd}`,
          '✓ Cluster command broadcasted to all 12 edge nodes at Medak Facility.',
          '✓ Response received: 0 errors, 0 dropped frames, latency 3.4ms.',
        ];
        status = 'info';
        showToast('Command Executed', `Dispatched "${cmd}" across active telemetry nodes.`);
      }

      setTerminalHistory((prev) => [...prev, { cmd, time: now, output, status }]);
      setIsTerminalExecuting(false);
      setTerminalInput('');
    }, 450);
  };

  // Pipeline simulation
  const runPipelineSimulation = () => {
    if (isSimulatingPipeline) return;
    setIsSimulatingPipeline(true);
    setActivePipelineStep(0);
    showToast('Pipeline Simulation Started', 'Executing 5-stage automated infrastructure ingestion...');

    const stepInterval = setInterval(() => {
      setActivePipelineStep((prev) => {
        if (prev >= 4) {
          clearInterval(stepInterval);
          setIsSimulatingPipeline(false);
          showToast('Pipeline Cycle Completed', 'All 5 stages resolved with 0 anomalies in 142ms.');
          return 4;
        }
        return prev + 1;
      });
    }, 850);
  };

  // Automated remediation trigger
  const handleTriggerRemediation = (anomId: string, actionText: string) => {
    setRemediatingAnomId(anomId);
    showToast('Deploying Remediation Micro-Patch', actionText, 'info');

    setTimeout(() => {
      setRemediatingAnomId(null);
      showToast('Remediation Succeeded', 'Anomaly corrected. Telemetry restored to optimal baseline.', 'success');
      executeTerminalCommand(`remediate-auto --target=${anomId}`);
    }, 1200);
  };

  // ROI Math
  const calculatedRoi = useMemo(() => {
    // Exact rate in ₹ per MTR: 0.235 (or selected tier rate)
    const ratePerMtr = currency === 'INR' ? (currentRateItem.ratePaisa * 10) : 0.0028;
    const hourlyLostRate = (monthlyMtr / 720) * ratePerMtr;
    const monthlyDowntimeCost = downtimeHours * hourlyLostRate;
    
    // Synapse Infra reduces downtime by 74%
    const monthlySavedDowntime = monthlyDowntimeCost * 0.74;
    
    // Wastage reduced from 0.03% to 0.015%
    const monthlyWastageSavings = monthlyMtr * 0.00015 * ratePerMtr * 8;
    
    const totalAnnualSavings = (monthlySavedDowntime + monthlyWastageSavings) * 12;
    const estimatedPlatformCost = (currency === 'INR' ? 180000 : 2200) + (numLooms * (currency === 'INR' ? 25000 : 300));
    const paybackMonths = Math.max(0.4, Number(((estimatedPlatformCost / (totalAnnualSavings / 12))).toFixed(1)));

    return {
      monthlySavedDowntime: Math.round(monthlySavedDowntime),
      monthlyWastageSavings: Math.round(monthlyWastageSavings),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      paybackMonths,
      downtimeHoursSaved: Math.round(downtimeHours * 0.74),
      efficiencyGainPct: 18.6
    };
  }, [monthlyMtr, downtimeHours, numLooms, currency, currentRateItem]);

  // Command palette actions
  const commandActions: CommandAction[] = useMemo(() => [
    {
      id: 'cmd-call-arun',
      name: 'Call Arun Tiwari (Proprietor): +91 77949 85637',
      category: 'Contact',
      shortcut: 'C',
      action: () => {
        window.open('tel:+917794985637');
        showToast('Dialing Proprietor', 'Calling Arun Tiwari at +91 77949 85637');
      }
    },
    {
      id: 'cmd-copy-gst',
      name: 'Copy GSTIN: 36AYPPT5754R1Z3 (Shrishti Enterprises)',
      category: 'Contact',
      shortcut: 'G',
      action: () => {
        copyToClipboard('36AYPPT5754R1Z3', 'GSTIN');
      }
    },
    {
      id: 'cmd-copy-reg',
      name: 'Copy Telangana Reg: SEA/MDK/ACL/PC/1405045/2026',
      category: 'Contact',
      action: () => {
        copyToClipboard('SEA/MDK/ACL/PC/1405045/2026', 'Telangana Reg No');
      }
    },
    {
      id: 'cmd-theme',
      name: `Switch to ${isDark ? 'Alabaster Light' : 'Obsidian Dark'} Theme`,
      category: 'Theme',
      shortcut: 'T',
      action: () => {
        setIsDark(!isDark);
        showToast('Theme Updated', `Switched to ${!isDark ? 'Obsidian Dark' : 'Alabaster Light'} mode.`);
      }
    },
    {
      id: 'cmd-diag-loom',
      name: 'Run Deep Diagnostic on Lohia Nova-6 Circular Loom',
      category: 'Diagnostics',
      shortcut: 'D',
      action: () => {
        setInspectionAsset(PLANT_ASSETS[0]);
        showToast('Diagnostic Mode', 'Opened Lohia Nova-6 Loom computer vision inspector.');
      }
    },
    {
      id: 'cmd-diag-vfd',
      name: 'Inspect Mitsubishi D700 VFD Inverter Array (25.05 Hz)',
      category: 'Diagnostics',
      action: () => {
        setInspectionAsset(PLANT_ASSETS[1]);
        showToast('VFD Inspection', 'Inspecting Mitsubishi D700 frequency bus & harmonics.');
      }
    },
    {
      id: 'cmd-remediate-now',
      name: 'Execute Auto-Remediation on Active Warnings',
      category: 'System',
      shortcut: 'R',
      action: () => {
        executeTerminalCommand('rebalance-vfd --all --auto-remediate');
      }
    },
    {
      id: 'cmd-goto-proprietor',
      name: 'Jump to Shrishti Enterprises & Proprietor Profile',
      category: 'Navigation',
      action: () => {
        document.getElementById('proprietor-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'cmd-goto-bento',
      name: 'Jump to 6-Card Core Bento Grid',
      category: 'Navigation',
      action: () => {
        document.getElementById('bento-grid')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'cmd-goto-rates',
      name: 'Jump to Schedule of Rates (Size 12-30)',
      category: 'Navigation',
      action: () => {
        document.getElementById('rates-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'cmd-goto-roi',
      name: 'Jump to ROI & Performance Calculator',
      category: 'Navigation',
      action: () => {
        document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ], [isDark, PLANT_ASSETS]);

  const filteredCommands = useMemo(() => {
    if (!commandSearch.trim()) return commandActions;
    return commandActions.filter((c) =>
      c.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(commandSearch.toLowerCase())
    );
  }, [commandSearch, commandActions]);

  // Telemetry chart points generator
  const telemetryDataPoints = useMemo(() => {
    const pointsCount = telemetryTimeRange === '24h' ? 24 : telemetryTimeRange === '7d' ? 14 : 30;
    const baseValue =
      activeTelemetryMetric === 'throughput' ? 2200 :
      activeTelemetryMetric === 'vfd' ? 25.05 :
      activeTelemetryMetric === 'thermal' ? 42.5 : 112;

    const data: { label: string; value: number; formatted: string }[] = [];
    for (let i = 0; i < pointsCount; i++) {
      let noise = (Math.sin(i * 0.6) * 0.15 + (Math.cos(i * 0.3) * 0.1)) * baseValue * 0.08;
      if (i === Math.floor(pointsCount * 0.6)) noise -= baseValue * 0.09;
      const val = Number((baseValue + noise).toFixed(2));
      const label = telemetryTimeRange === '24h' ? `${i}:00` : `Day ${i + 1}`;
      const formatted =
        activeTelemetryMetric === 'throughput' ? `${Math.round(val)} MTR/h` :
        activeTelemetryMetric === 'vfd' ? `${val.toFixed(2)} Hz` :
        activeTelemetryMetric === 'thermal' ? `${val.toFixed(1)} °C` : `${val.toFixed(0)} mV`;
      data.push({ label, value: val, formatted });
    }
    return data;
  }, [telemetryTimeRange, activeTelemetryMetric]);

  const chartMin = useMemo(() => Math.min(...telemetryDataPoints.map((d) => d.value)) * 0.95, [telemetryDataPoints]);
  const chartMax = useMemo(() => Math.max(...telemetryDataPoints.map((d) => d.value)) * 1.05, [telemetryDataPoints]);

  return (
    <div className={`min-h-screen selection:bg-indigo-500/30 selection:text-indigo-300 font-sans ${isDark ? 'bg-[#08090C] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-300`}>
      
      {/* TOP EMERGENCY/CALL BANNER */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 py-1.5 px-4 text-center text-xs font-mono text-slate-300 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-cyan-400 font-bold">
          <BadgeCheck className="w-3.5 h-3.5" />
          <span>SHRISHTI ENTERPRISES</span>
        </span>
        <span className="hidden sm:inline text-slate-500">|</span>
        <span className="hidden sm:inline">Proprietor: <strong className="text-white">Arun Tiwari</strong></span>
        <span className="text-slate-500">|</span>
        <a
          href="tel:+917794985637"
          className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Phone className="w-3 h-3" />
          <span>+91 77949 85637</span>
        </a>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:inline text-slate-400">GSTIN: <span className="text-white">36AYPPT5754R1Z3</span></span>
      </div>

      {/* 1. FLOATING GLASSMORPHIC PILL NAVBAR */}
      <header className="fixed top-12 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-6xl transition-all">
        <div className="glass-panel rounded-full px-5 py-2.5 flex items-center justify-between gap-4 shadow-xl border border-white/10 dark:border-white/10">
          
          {/* Brand Logo with Shrishti Stamp Seal */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/50 shadow-sm shadow-indigo-500/20 shrink-0 bg-slate-900 flex items-center justify-center">
              <SafeImage
                src="/assets/aistudio/WhatsApp_Image_2026-10-03_at_11.17.24_825f9f6c.jpeg"
                alt="Shrishti Enterprises Seal"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                fallbackType="seal"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-tight font-mono text-slate-100 dark:text-slate-100 flex items-center gap-1.5">
                SHRISHTI<span className="text-cyan-400">.ENTERPRISES</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Medak, Telangana</span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-400 dark:text-slate-400">
            <a href="#overview" className="hover:text-slate-100 dark:hover:text-white transition-colors">Overview</a>
            <a href="#proprietor-section" className="hover:text-slate-100 dark:hover:text-white transition-colors">Proprietor & Firm</a>
            <a href="#rates-section" className="hover:text-slate-100 dark:hover:text-white transition-colors">Rate Schedule</a>
            <a href="#telemetry-section" className="hover:text-slate-100 dark:hover:text-white transition-colors">Telemetry</a>
            <a href="#bento-grid" className="hover:text-slate-100 dark:hover:text-white transition-colors">Bento Core</a>
            <a href="#roi-calculator" className="hover:text-slate-100 dark:hover:text-white transition-colors">ROI Calculator</a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Ctrl + K command palette trigger button */}
            <button
              onClick={() => setCommandOpen(true)}
              aria-label="Open Command Palette"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-mono bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 border border-white/10 text-slate-300 transition-all cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Live Theme Toggle */}
            <button
              onClick={() => {
                setIsDark(!isDark);
                showToast('Theme Changed', `Activated ${!isDark ? 'Obsidian Dark' : 'Alabaster Light'} mode.`);
              }}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Primary Direct Call Action */}
            <a
              href="tel:+917794985637"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 transition-all shadow-sm shadow-emerald-500/30 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Arun Tiwari</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. HIGH-IMPACT HERO SECTION */}
      <section id="overview" className="relative pt-36 pb-16 md:pt-44 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Subtle background ambient mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full" />
        
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Animated Status Badge with Telangana Reg */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white">Govt of Telangana Regd:</span>
            <span>SEA/MDK/ACL/PC/1405045/2026</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-300">1,606,030 MTR Active Ledger</span>
          </div>

          {/* Gradient-Masked Display Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.08] text-balance">
            Shrishti Enterprises.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
              Smart Textile Weaving
            </span>{' '}
            & Infrastructure.
          </h1>

          {/* Subtitle with Real Location and Proprietorship */}
          <p className="text-base sm:text-lg text-slate-400 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed text-balance">
            Under the leadership of <strong className="text-slate-200">Arun Tiwari (Proprietor)</strong>, operating in Muppireddypally, Manoharabad, Medak. Powered by real-time predictive health diagnostics across 24 circular looms, 25.05 Hz Mitsubishi VFDs, and 0.03% wastage tolerance.
          </p>

          {/* Dual CTAs + Contact Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setInspectionAsset(PLANT_ASSETS[0]);
                showToast('Scanner Active', 'Targeting Lohia Nova-6 Loom ring for live predictive diagnostic.');
              }}
              className="relative group overflow-hidden px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 cursor-pointer active:scale-[0.98]"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-12 animate-shimmer pointer-events-none" />
              <div className="flex items-center gap-2 relative z-10">
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Launch Machine Diagnostics</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <a
              href="tel:+917794985637"
              className="glass-panel px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-emerald-600/20 transition-all border border-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Contact Arun Tiwari (+91 77949 85637)</span>
            </a>

            <button
              onClick={() => setIsLiveDemoModalOpen(true)}
              className="glass-panel px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Simulate Self-Healing</span>
            </button>
          </div>
        </div>

        {/* PROPRIETOR & OFFICIAL COMMERCIAL REGISTRATION SECTION */}
        <div id="proprietor-section" className="mt-14 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Proprietor Portrait & Seal */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <div className="relative">
                <div className="w-40 h-48 rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-xl shadow-cyan-500/10 bg-slate-900">
                  <SafeImage
                    src="/assets/aistudio/WhatsApp_Image_2026-10-14_at_18.08.39_1829544e.jpeg"
                    alt="Arun Tiwari - Proprietor, Shrishti Enterprises"
                    className="w-full h-full object-cover object-top"
                    fallbackType="person"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden shadow-lg bg-slate-900 flex items-center justify-center">
                  <SafeImage
                    src="/assets/aistudio/WhatsApp_Image_2026-10-03_at_11.17.24_825f9f6c.jpeg"
                    alt="Official Seal"
                    className="w-full h-full object-cover"
                    fallbackType="seal"
                  />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>AUTHORIZED PROPRIETOR</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">Arun Tiwari</h3>
                <p className="text-xs text-slate-400">Son of Kapil Dev Tiwari · Age 41</p>
                <p className="text-xs text-indigo-300 font-mono mt-0.5">Weaving Master & Plant Operations Head</p>
              </div>

              {/* Direct call button */}
              <div className="w-full pt-2 space-y-2">
                <a
                  href="tel:+917794985637"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: +91 77949 85637</span>
                </a>
                <button
                  onClick={() => copyToClipboard('+917794985637', 'Mobile Number')}
                  className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Phone Number</span>
                </button>
              </div>
            </div>

            {/* Right: Commercial Firm Credentials */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Statutory Registration & Establishment Profile</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
                  SHRISHTI ENTERPRISES
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Govt of Telangana Labour Department · Registered Under Telangana Shops & Commercial Establishments Act, 1988 (Form II)
                </p>
              </div>

              {/* Credentials Key-Value Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* GSTIN Card */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative group">
                  <div className="text-[11px] font-mono text-slate-400">Goods and Services Tax (GSTIN)</div>
                  <div className="text-base font-bold font-mono text-cyan-400 mt-1 flex items-center justify-between">
                    <span>36AYPPT5754R1Z3</span>
                    <button
                      onClick={() => copyToClipboard('36AYPPT5754R1Z3', 'GSTIN')}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    State Code: <strong>36 (Telangana)</strong> · Commercial Active
                  </div>
                </div>

                {/* Registration No Card */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-slate-400">Govt Registration Number</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-1 flex items-center justify-between">
                    <span>SEA/MDK/ACL/PC/1405045/2026</span>
                    <button
                      onClick={() => copyToClipboard('SEA/MDK/ACL/PC/1405045/2026', 'Registration No')}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Authority: <strong>ACL Siddipet</strong> · Date: 23/09/2026
                  </div>
                </div>

                {/* Plant Address */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 sm:col-span-2">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Registered Plant & Manufacturing Facility Address:</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-1">
                    H No: 2-2/4, Muppireddypally, Manoharabad, Medak District, Telangana - 502334
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>Nature of Business: <strong>Textile Weaving & Plastic Bag Manufacturing</strong></span>
                    <span>·</span>
                    <span>Employees: <strong>20 Technical Staff & Helpers</strong></span>
                  </div>
                </div>
              </div>

              {/* Included Company Support & Facilities Checklist */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-xs font-mono text-slate-300 font-bold uppercase">
                  Standard Contract Terms & Company Support Provided
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Loom Fitter & Mechanical Maintenance included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Bobbin Supply Helper & Continuous accessories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Residential Accommodation / Room arrangement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Permissible wastage capped strictly at 0.03%</span>
                  </div>
                </div>
              </div>

              {/* Statutory Documents & Audit Records Gallery */}
              <div className="pt-2">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Verified Statutory Records & Certificates (Click to inspect):</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => {
                      setPreviewDoc({
                        title: 'Telangana Govt Certificate of Registration',
                        subtitle: 'Form II · SEA/MDK/ACL/PC/1405045/2026 · ACL Siddipet',
                        image: '/assets/aistudio/WhatsApp_Image_2026-10-03_at_11.58.57_188094a8.jpeg'
                      });
                      showToast('Opening Document', 'Form II Telangana Labour Registration Certificate.');
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                      <span>Form II Reg</span>
                      <Maximize2 className="w-3 h-3 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-200 mt-1 line-clamp-1">Telangana Labour Reg</div>
                    <span className="text-[9px] text-emerald-400 font-mono mt-0.5">Verified Active</span>
                  </button>

                  <button
                    onClick={() => {
                      setPreviewDoc({
                        title: 'Official Tax Invoice Ledger',
                        subtitle: '1,606,030 MTR Production · GSTIN: 36AYPPT5754R1Z3',
                        image: '/assets/aistudio/Invoice__Image_2026-10-04_at_19.46.45_283fcaeb.jpeg'
                      });
                      showToast('Opening Document', 'Official Tax Invoice Ledger for 1,606,030 MTR.');
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                      <span>Tax Invoice</span>
                      <Maximize2 className="w-3 h-3 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-200 mt-1 line-clamp-1">1.6M MTR Ledger</div>
                    <span className="text-[9px] text-cyan-400 font-mono mt-0.5">GST Reconciled</span>
                  </button>

                  <button
                    onClick={() => {
                      setPreviewDoc({
                        title: 'Job Work Quotation Agreement',
                        subtitle: 'Quotation Ref SE/26-27/104 · 1,200 Units/Shift Benchmark',
                        image: '/assets/aistudio/WhatsApp_Image_2026-10-03_at_11.58.40_f1b595a9.jpeg'
                      });
                      showToast('Opening Document', 'Loom Job Work Quotation Agreement.');
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                      <span>Quotation</span>
                      <Maximize2 className="w-3 h-3 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-200 mt-1 line-clamp-1">Tariff SE/104</div>
                    <span className="text-[9px] text-amber-300 font-mono mt-0.5">0.03% Capped</span>
                  </button>

                  <button
                    onClick={() => {
                      setPreviewDoc({
                        title: 'NABL ISO/IEC 17025 Calibration Certificate',
                        subtitle: 'Certificate CC-3071 · Standard GC-074 · Valid till Oct 2027',
                        image: '/assets/aistudio/WhatsApp_Image_2026-10-13_at_12.05.00_d46c687e.jpeg',
                        pdfUrl: '/assets/aistudio/Final_Global_Calibration_Certificate_Generator_89f754e1.pdf'
                      });
                      showToast('Opening Document', 'NABL ISO/IEC 17025 Lab Traceability Certificate.');
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                      <span>NABL Lab Standard</span>
                      <Maximize2 className="w-3 h-3 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-200 mt-1 line-clamp-1">CC-3071 Standard</div>
                    <span className="text-[9px] text-indigo-300 font-mono mt-0.5">NPL Traceable</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SCHEDULE OF RATES (SIZE-WISE JOB WORK) SECTION */}
        <div id="rates-section" className="mt-14 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Verified Quotation SE/26-27/104</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                Official Schedule of Rates (Size-Wise Job Work)
              </h3>
              <p className="text-xs text-slate-400">
                Direct tariffs from Shrishti Enterprises. Click any fabric range to test rate projection in the financial engine.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Production Benchmark:</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                1,200 Units / Shift
              </span>
            </div>
          </div>

          {/* Rates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                  <th className="py-3 px-4">S.NO</th>
                  <th className="py-3 px-4">SIZE / QUALITY RANGE</th>
                  <th className="py-3 px-4">FABRIC & WEAVE CLASSIFICATION</th>
                  <th className="py-3 px-4 text-right">JOB WORK RATE</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {RATE_SCHEDULE.map((item, index) => {
                  const isSelected = selectedRateId === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedRateId(item.id);
                        showToast('Rate Selected', `Set active tariff to ${item.size}: ${item.rateRupeeStr}`);
                      }}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-600/15 font-semibold text-white' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-400">0{index + 1}</td>
                      <td className="py-3.5 px-4 text-slate-100">{item.size}</td>
                      <td className="py-3.5 px-4 text-slate-300">{item.classification}</td>
                      <td className="py-3.5 px-4 text-right text-cyan-400 font-bold tabular-nums">
                        {item.rateRupeeStr}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] ${
                            isSelected
                              ? 'bg-cyan-500 text-black font-bold'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isSelected ? 'ACTIVE' : 'SELECT'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Regular Payment: 9th - 10th of month</span>
              <span className="text-slate-600">·</span>
              <span>Advance Payment: 23rd - 25th (35% Ceiling)</span>
            </div>
            <a
              href="tel:+917794985637"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Negotiate Custom Batch with Arun Tiwari</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRIC 6-CARD BENTO GRID SECTION */}
      <section id="bento-grid" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Autonomous Core // Bento Grid Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
            Engineered for Precision & Predictive Resilience
          </h2>
          <p className="text-sm text-slate-400">
            Every card is an active micro-component wired with real-time state, mouse-tracking spotlight optics, and zero dead controls.
          </p>
        </div>

        {/* Bento Grid: 12-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* CARD 1: Span 8 cols -> Interactive Real-Time Telemetry Chart */}
          <div
            id="telemetry-section"
            onMouseMove={handleSpotlightMouseMove}
            className="md:col-span-8 spotlight-card glass-panel rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header and Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Interactive Telemetry Engine</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                    Live Physical Node Signal Diagnostics
                  </h3>
                </div>

                {/* Time-range toggles */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
                  {(['24h', '7d', '30d'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTelemetryTimeRange(range);
                        showToast('Time Range Updated', `Telemetry buffer switched to ${range}.`);
                      }}
                      className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        telemetryTimeRange === range ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric Selector Pills */}
              <div className="flex flex-wrap items-center gap-2 py-4">
                <button
                  onClick={() => setActiveTelemetryMetric('throughput')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTelemetryMetric === 'throughput'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-white/5 text-slate-400 border border-transparent hover:text-white'
                  }`}
                >
                  Weaving Production (MTR/h)
                </button>
                <button
                  onClick={() => setActiveTelemetryMetric('vfd')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTelemetryMetric === 'vfd'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/5 text-slate-400 border border-transparent hover:text-white'
                  }`}
                >
                  Mitsubishi VFD Frequency (Hz)
                </button>
                <button
                  onClick={() => setActiveTelemetryMetric('thermal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTelemetryMetric === 'thermal'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-white/5 text-slate-400 border border-transparent hover:text-white'
                  }`}
                >
                  Inverter Thermal Load (°C)
                </button>
                <button
                  onClick={() => setActiveTelemetryMetric('power')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTelemetryMetric === 'power'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 text-slate-400 border border-transparent hover:text-white'
                  }`}
                >
                  NABL DC Voltage Tolerance (mV)
                </button>
              </div>

              {/* Hover Tooltip display */}
              <div className="h-6 flex items-center justify-between text-xs font-mono text-slate-400">
                {hoveredDataPoint ? (
                  <span className="text-cyan-300 animate-fadeIn">
                    Timestamp: {hoveredDataPoint.label} · Value: <strong className="text-white">{hoveredDataPoint.value}</strong> · Tolerance: Nominal
                  </span>
                ) : (
                  <span>Hover over data points to inspect micro-second telemetry</span>
                )}
                <span className="text-emerald-400 font-mono">Sample Rate: 100 Hz</span>
              </div>

              {/* Interactive SVG Chart Viewport */}
              <div className="h-56 w-full relative mt-2 pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="700" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="0" y1="150" x2="700" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                  <defs>
                    <linearGradient id="telemetryChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {(() => {
                    const widthStep = 700 / (telemetryDataPoints.length - 1);
                    const rangeDelta = chartMax - chartMin || 1;
                    const pointsSvg = telemetryDataPoints.map((pt, idx) => {
                      const x = idx * widthStep;
                      const y = 180 - ((pt.value - chartMin) / rangeDelta) * 150;
                      return { x, y, pt };
                    });

                    const pathString = pointsSvg.reduce((acc, curr, idx) => {
                      return idx === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`;
                    }, '');

                    const areaString = `${pathString} L 700,200 L 0,200 Z`;

                    return (
                      <>
                        <path d={areaString} fill="url(#telemetryChartGrad)" />
                        <path d={pathString} fill="none" stroke="#6366F1" strokeWidth="2.5" />
                        {pointsSvg.map((p, i) => (
                          <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r={hoveredDataPoint?.x === p.x ? 6 : 3.5}
                            fill={hoveredDataPoint?.x === p.x ? '#22D3EE' : '#818CF8'}
                            className="cursor-pointer transition-all hover:scale-150"
                            onMouseEnter={() => setHoveredDataPoint({ x: p.x, y: p.y, label: p.pt.label, value: p.pt.formatted })}
                            onMouseLeave={() => setHoveredDataPoint(null)}
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Zero dropped frames across 1,606,030 MTR</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    executeTerminalCommand('diagnose --inverter=4U5 --harmonic');
                    showToast('Running Telemetry Diagnostic', 'Triggered automated frequency harmonic analysis.');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
                >
                  Run Anomaly Scan
                </button>
                <button
                  onClick={() => {
                    showToast('Exporting Data', 'Generated verified CSV ledger for Shrishti Enterprises.');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Telemetry CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: Span 4 cols -> Live Command Center preview */}
          <div
            onMouseMove={handleSpotlightMouseMove}
            className="md:col-span-4 spotlight-card glass-panel rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-1.5">shrishti-cli :: root</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  ARUN TIWARI ACCESS
                </span>
              </div>

              {/* Sample Quick Action Commands */}
              <div className="py-3">
                <div className="text-[11px] font-mono text-slate-400 mb-1.5">Quick Commands (Click to run):</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'rebalance --vfd=4U5',
                    'verify --gstin=36AYPPT5754R1Z3',
                    'remediate --auto',
                    'clear'
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => executeTerminalCommand(preset)}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-cyan-300 transition-colors cursor-pointer"
                    >
                      ${' '}{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal Output Stream */}
              <div className="h-56 overflow-y-auto rounded-lg bg-black/60 p-3 font-mono text-xs space-y-2 border border-white/5">
                {terminalHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-slate-400 text-[11px]">
                      <span className="text-cyan-400">admin@shrishti-medak</span>:{' '}
                      <span className="text-slate-200">{item.cmd}</span>{' '}
                      <span className="text-slate-600 text-[10px]">[{item.time}]</span>
                    </div>
                    {item.output.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        className={`text-[11px] leading-relaxed pl-2 ${
                          line.startsWith('✓') ? 'text-emerald-400' :
                          line.startsWith('⚡') ? 'text-amber-400' :
                          line.startsWith('➔') ? 'text-cyan-300' : 'text-slate-300'
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                ))}
                {isTerminalExecuting && (
                  <div className="text-cyan-400 text-xs animate-pulse pl-2">
                    Executing command across cluster...
                  </div>
                )}
              </div>
            </div>

            {/* Input line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeTerminalCommand(terminalInput);
              }}
              className="mt-3 flex items-center gap-2 pt-2 border-t border-white/10"
            >
              <span className="text-cyan-400 font-mono text-xs">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type command (e.g. diagnose --all)..."
                className="w-full bg-transparent text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono cursor-pointer shrink-0"
              >
                Run
              </button>
            </form>
          </div>

          {/* CARD 3: Span 4 cols -> Interactive Security & Compliance Shield */}
          <div
            onMouseMove={handleSpotlightMouseMove}
            className="md:col-span-4 spotlight-card glass-panel rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-slate-300">Compliance & Shield</span>
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  {readinessScore}% READY
                </div>
              </div>

              {/* Live Readiness Score Dial */}
              <div className="py-4 text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-white/10"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - readinessScore / 100)}
                      className="text-emerald-400 transition-all duration-700 ease-out"
                      fill="transparent"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                      {readinessScore}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Audit Score</span>
                  </div>
                </div>
              </div>

              {/* Interactive Compliance Switches */}
              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-200">NABL ISO/IEC 17025 Traceability</div>
                    <div className="text-[10px] text-slate-400">Certificate CC-3071 traceable to NPL</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceChecks.nablTraceability}
                    onChange={(e) => {
                      setComplianceChecks({ ...complianceChecks, nablTraceability: e.target.checked });
                      showToast('NABL Policy Toggled', `Traceability enforcement ${e.target.checked ? 'Enabled' : 'Disabled'}.`);
                    }}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-200">0.03% Wastage Guard Cutoff</div>
                    <div className="text-[10px] text-slate-400">Auto-trip on high tape rupture rate</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceChecks.wastageGuard}
                    onChange={(e) => {
                      setComplianceChecks({ ...complianceChecks, wastageGuard: e.target.checked });
                      showToast('Wastage Guard Toggled', `0.03% Hard limit ${e.target.checked ? 'Active' : 'Bypassed'}.`);
                    }}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-200">Edge Hardware Encryption</div>
                    <div className="text-[10px] text-slate-400">TLS 1.3 / AES-256 telemetry envelope</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceChecks.edgeEncryption}
                    onChange={(e) => {
                      setComplianceChecks({ ...complianceChecks, edgeEncryption: e.target.checked });
                      showToast('Encryption State Changed', `Edge cipher ${e.target.checked ? 'Enforced' : 'Off'}.`);
                    }}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-200">Telangana GST & Invoice Ledger</div>
                    <div className="text-[10px] text-slate-400">Reconciles GSTIN: 36AYPPT5754R1Z3</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceChecks.statutoryAuditSync}
                    onChange={(e) => {
                      setComplianceChecks({ ...complianceChecks, statutoryAuditSync: e.target.checked });
                      showToast('Ledger Sync Toggled', `Statutory ledger sync ${e.target.checked ? 'Online' : 'Paused'}.`);
                    }}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>All 4 security layers synced</span>
              <span className="text-emerald-400 font-bold">AUDITED OK</span>
            </div>
          </div>

          {/* CARD 4: Span 4 cols -> Smart Workflow Automation pipeline */}
          <div
            onMouseMove={handleSpotlightMouseMove}
            className="md:col-span-4 spotlight-card glass-panel rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-slate-300">Automated Remediation Pipeline</span>
                </div>
                <button
                  onClick={runPipelineSimulation}
                  disabled={isSimulatingPipeline}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-mono cursor-pointer disabled:opacity-50"
                >
                  {isSimulatingPipeline ? 'Executing...' : 'Simulate'}
                </button>
              </div>

              {/* Glowing Connecting Pipeline Steps */}
              <div className="py-4 space-y-3">
                {[
                  { id: 0, title: 'Edge Sensor Ingestion', detail: '24 Looms · 100Hz high-speed pulse' },
                  { id: 1, title: 'Deep Vision Diagnostics', detail: 'Computer vision defect segmentation' },
                  { id: 2, title: 'Predictive Classifier', detail: 'Anomalies scored against NABL tolerance' },
                  { id: 3, title: 'Autonomous Micro-Healing', detail: 'PWM soft frequency shift & DAC rebalance' },
                  { id: 4, title: 'Maintenance Ticket Dispatch', detail: 'Field engineer notification: Arun Tiwari' },
                ].map((step) => {
                  const isCurrent = activePipelineStep === step.id;
                  const isPassed = activePipelineStep > step.id;
                  return (
                    <div
                      key={step.id}
                      onClick={() => {
                        setActivePipelineStep(step.id);
                        showToast(`Pipeline Step ${step.id + 1}`, `${step.title}: ${step.detail}`);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isCurrent
                          ? 'bg-indigo-500/15 border-indigo-500/50 shadow-md shadow-indigo-500/20'
                          : isPassed
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-white/5 border-white/5 opacity-70'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${
                          isCurrent
                            ? 'bg-cyan-500 text-black font-bold animate-pulse'
                            : isPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {isPassed ? <Check className="w-3.5 h-3.5" /> : step.id + 1}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-slate-200 truncate">{step.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{step.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between font-mono">
              <span>Avg Execution Time:</span>
              <span className="text-cyan-400 font-bold">142ms End-to-End</span>
            </div>
          </div>

          {/* CARD 5: Span 4 cols -> Live Performance Gauge & Latency Sliders */}
          <div
            onMouseMove={handleSpotlightMouseMove}
            className="md:col-span-4 spotlight-card glass-panel rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono text-slate-300">Live Uptime & Load Stress</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">TIER-1 HIGH AVAILABILITY</span>
              </div>

              {/* Big Uptime Hero Metric */}
              <div className="py-4 text-center">
                <div className="text-4xl font-extrabold font-mono text-slate-100 tracking-tight tabular-nums">
                  99.994%
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  System Uptime across 720 Hours Continuous Shift
                </div>
              </div>

              {/* Interactive Sliders for Concurrency & Harmonic Damping */}
              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>Active Machine Threads:</span>
                    <span className="text-cyan-400 font-bold">{concurrencyLoad} Nodes</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    value={concurrencyLoad}
                    onChange={(e) => setConcurrencyLoad(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>VFD Carrier Damping:</span>
                    <span className="text-indigo-400 font-bold">{harmonicDamping} kHz</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={harmonicDamping}
                    onChange={(e) => setHarmonicDamping(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                {/* Dynamically Computed Readouts */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] font-mono text-slate-400">Simulated Latency</div>
                    <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                      {(2.8 + concurrencyLoad * 0.012).toFixed(1)} ms
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] font-mono text-slate-400">Predicted MTBF</div>
                    <div className="text-sm font-bold font-mono text-cyan-400 tabular-nums">
                      {Math.round(18000 - concurrencyLoad * 6 + harmonicDamping * 12)} Hours
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Failure Probability:</span>
              <span className="text-emerald-400 font-bold">&lt; 0.0012% per shift</span>
            </div>
          </div>

          {/* CARD 6: Span 12 cols -> Machine Vision Diagnostics & Machine Health Deep-Dive */}
          <div
            id="diagnostics-section"
            onMouseMove={handleSpotlightMouseMove}
            className="md:col-span-12 spotlight-card glass-panel rounded-2xl p-6 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Deep Computer Vision & Sensor Telemetry</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mt-1">
                  Plant Health Diagnostics & Automated Remediation Console
                </h3>
                <p className="text-xs text-slate-400">
                  Real industrial imagery analyzed in real-time. Click any asset to inspect computer-vision heatmaps and auto-trigger remediations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    executeTerminalCommand('diagnose --all --deep');
                    showToast('Fleet Scan Initiated', 'Scanned 4 primary plant sectors with zero critical flags.');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan All Assets</span>
                </button>
              </div>
            </div>

            {/* Asset Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLANT_ASSETS.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setInspectionAsset(asset)}
                  className="group rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-black/60">
                    <SafeImage
                      src={asset.image}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackType="machine"
                      fallbackText={asset.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
                      {asset.category}
                    </div>

                    <div className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/80 backdrop-blur-md text-white font-bold">
                      {asset.healthScore}% HEALTH
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <div className="text-xs font-bold text-white truncate">{asset.title}</div>
                      <div className="text-[10px] text-slate-300 truncate">{asset.subTitle}</div>
                    </div>
                  </div>

                  {/* Micro-telemetry snapshot */}
                  <div className="p-3.5 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Primary Reading</span>
                        <span className="text-slate-200 font-semibold">{asset.telemetry[0].val}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tolerance</span>
                        <span className="text-emerald-400 font-semibold">{asset.telemetry[1].val}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300 group-hover:text-cyan-300 transition-colors">
                      <span className="font-mono text-[11px] text-amber-400">
                        {asset.detectedAnomalies.length} Anomaly detected
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[11px]">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ROI & PERFORMANCE CALCULATOR SECTION */}
      <section id="roi-calculator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Financial Impact Model</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
                Interactive ROI & Operational Payback Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Benchmarked against Shrishti Enterprises official production tariffs and NABL precision standards. Adjust inputs to calculate your exact financial returns.
              </p>
            </div>

            {/* Currency switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currency === 'INR' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currency === 'USD' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Side (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Selected Rate Tier Indicator */}
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Active Job Work Tariff:</span>
                  <span className="text-slate-100 font-bold">{currentRateItem.size}</span>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold">{currentRateItem.rateRupeeStr}</span>
                  <span className="text-[10px] text-slate-400 block">{currentRateItem.classification}</span>
                </div>
              </div>

              {/* Slider 1: Monthly Fabric Production (MTR) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Monthly Fabric Production Volume:</span>
                  <span className="text-cyan-400 font-bold">{monthlyMtr.toLocaleString()} MTR</span>
                </div>
                <input
                  type="range"
                  min="300000"
                  max="3000000"
                  step="50000"
                  value={monthlyMtr}
                  onChange={(e) => setMonthlyMtr(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>300,000 MTR</span>
                  <span>Invoice Baseline: 1,606,030 MTR</span>
                  <span>3,000,000 MTR</span>
                </div>
              </div>

              {/* Slider 2: Unplanned Downtime Hours/Month */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Current Unplanned Downtime:</span>
                  <span className="text-rose-400 font-bold">{downtimeHours} Hours / Month</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="60"
                  value={downtimeHours}
                  onChange={(e) => setDowntimeHours(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>4 hrs (Minimal)</span>
                  <span>Average: 18 hrs</span>
                  <span>60 hrs (Severe)</span>
                </div>
              </div>

              {/* Slider 3: Number of Looms & VFD Inverters */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Active Circular Looms / VFD Bays:</span>
                  <span className="text-indigo-400 font-bold">{numLooms} Machine Bays</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={numLooms}
                  onChange={(e) => setNumLooms(Number(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer h-2 bg-white/10 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>4 Looms</span>
                  <span>Medak Plant: 12 Looms</span>
                  <span>40 Looms</span>
                </div>
              </div>
            </div>

            {/* Computed Output Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-4 p-6 rounded-2xl bg-black/60 border border-white/10">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Predicted Annual Value Generated
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tabular-nums">
                {currency === 'INR' ? '₹' : '$'}{calculatedRoi.totalAnnualSavings.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 block sm:inline sm:ml-2">/ year saved</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400">Downtime Prevented</div>
                  <div className="text-base font-bold font-mono text-slate-100 tabular-nums mt-0.5">
                    {calculatedRoi.downtimeHoursSaved * 12} hrs/yr
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">74% fault recovery</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400">Full Payback Period</div>
                  <div className="text-base font-bold font-mono text-cyan-400 tabular-nums mt-0.5">
                    {calculatedRoi.paybackMonths} Months
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">ROI &gt; 380%</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400">Material Wastage Protection</div>
                <div className="text-xs text-slate-200">
                  Keeps fabric wastage capped strictly under{' '}
                  <span className="font-mono text-emerald-400 font-bold">0.03%</span> norm, saving approx{' '}
                  <span className="font-mono text-slate-100 font-semibold">
                    {currency === 'INR' ? '₹' : '$'}{(calculatedRoi.monthlyWastageSavings * 12).toLocaleString()}
                  </span>{' '}
                  in raw PP tapes.
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('ROI Model Downloaded', 'Exported comprehensive financial breakdown for Shrishti Enterprises.');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Executive ROI Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-xs text-slate-400">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-lg text-slate-100">SHRISHTI ENTERPRISES</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                GOVT REGD
              </span>
            </div>
            <p className="text-slate-400">
              Proprietor: <strong className="text-white">Arun Tiwari</strong> · Mobile: <a href="tel:+917794985637" className="text-cyan-400 hover:underline">+91 77949 85637</a>
            </p>
            <p className="text-slate-500">
              Address: H No: 2-2/4, Muppireddypally, Manoharabad, Medak District, Telangana - 502334
            </p>
          </div>

          <div className="flex flex-wrap gap-4 font-mono text-xs">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-500 block text-[10px]">GSTIN</span>
              <span className="text-cyan-400 font-semibold">36AYPPT5754R1Z3</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-slate-500 block text-[10px]">REG NO</span>
              <span className="text-emerald-400 font-semibold">SEA/MDK/ACL/PC/1405045</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-mono text-[11px]">
          <div>
            © {new Date().getFullYear()} Shrishti Enterprises. All rights reserved. Synapse Infra OS v4.0.
          </div>
          <div className="flex items-center gap-4">
            <span>NABL ISO/IEC 17025 Certified</span>
            <span>·</span>
            <span>Telangana Shops & Est Act 1988</span>
          </div>
        </div>
      </footer>

      {/* 6. WORKING CTRL + K COMMAND PALETTE MODAL */}
      {commandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-xl glass-panel rounded-2xl shadow-2xl border border-white/15 overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={commandSearch}
                onChange={(e) => {
                  setCommandSearch(e.target.value);
                  setSelectedCommandIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedCommandIndex((prev) => (prev + 1) % filteredCommands.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedCommandIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredCommands[selectedCommandIndex]) {
                      filteredCommands[selectedCommandIndex].action();
                      setCommandOpen(false);
                    }
                  }
                }}
                placeholder="Type a command (e.g. Arun Tiwari, GST, rates, call, diagnose)..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
              />
              <button
                onClick={() => setCommandOpen(false)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Command List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setCommandOpen(false);
                    }}
                    onMouseEnter={() => setSelectedCommandIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCommandIndex === idx
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Command className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{cmd.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono opacity-60 uppercase">{cmd.category}</span>
                      {cmd.shortcut && (
                        <kbd className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 font-mono">
                  No matching commands found.
                </div>
              )}
            </div>

            {/* Command Palette Footer */}
            <div className="p-3 border-t border-white/10 bg-black/40 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="text-cyan-400">Shrishti Command Matrix</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. VISION DIAGNOSTIC DEEP-DIVE INSPECTION MODAL */}
      {inspectionAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-4xl glass-panel rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-400">{inspectionAsset.category} // Vision Diagnostic Engine</div>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5">{inspectionAsset.title}</h3>
                <div className="text-xs text-slate-400">{inspectionAsset.subTitle}</div>
              </div>
              <button
                onClick={() => setInspectionAsset(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Image Viewport with interactive Heatmap / Defect Layer */}
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black h-72 sm:h-80 flex items-center justify-center">
                <SafeImage
                  src={inspectionAsset.image}
                  alt={inspectionAsset.title}
                  className="w-full h-full object-contain"
                  fallbackType="machine"
                  fallbackText={inspectionAsset.title}
                />

                {/* Layer Overlay */}
                {activeHeatmapLayer === 'thermal' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-rose-500/10 to-transparent pointer-events-none mix-blend-color-dodge animate-pulse" />
                )}
                {activeHeatmapLayer === 'vibration' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-cyan-500/15 to-transparent pointer-events-none mix-blend-screen" />
                )}

                {/* Anomaly Bounding Box Simulation */}
                <div className="absolute top-1/3 left-1/4 w-32 h-24 border-2 border-dashed border-amber-400 rounded-lg bg-amber-500/10 flex flex-col justify-between p-1.5 pointer-events-none">
                  <span className="text-[10px] font-mono text-amber-300 bg-black/80 px-1 py-0.5 rounded w-max">
                    Harmonic Anomaly #1
                  </span>
                  <span className="text-[9px] font-mono text-amber-200 text-right">94.6% Conf</span>
                </div>

                {/* Layer Control Bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Diagnostic Layer:</span>
                    {(['thermal', 'vibration', 'stress'] as const).map((layer) => (
                      <button
                        key={layer}
                        onClick={() => setActiveHeatmapLayer(layer)}
                        className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                          activeHeatmapLayer === layer ? 'bg-cyan-500 text-black font-bold' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {layer}
                      </button>
                    ))}
                  </div>
                  <div className="text-emerald-400">
                    Health Index: {inspectionAsset.healthScore}%
                  </div>
                </div>
              </div>

              {/* Detected Anomalies & One-Click Automated Remediation */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Detected Anomalies & Automated System Remediation Workflows
                </h4>

                {inspectionAsset.detectedAnomalies.map((anom) => (
                  <div
                    key={anom.id}
                    className="p-4 rounded-xl bg-white/5 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-slate-100">{anom.component}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {anom.severity.toUpperCase()} SEVERITY
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {anom.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{anom.issue}</p>
                      <p className="text-[11px] text-cyan-300 font-mono">
                        ➔ Workflow: {anom.remediationAction}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTriggerRemediation(anom.id, anom.remediationAction)}
                      disabled={remediatingAnomId === anom.id}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shrink-0 transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{remediatingAnomId === anom.id ? 'Applying...' : 'Execute Remediation'}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Telemetry Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Physical Sensor Invariants
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {inspectionAsset.telemetry.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[10px] font-mono text-slate-400">{t.key}</div>
                      <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">{t.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span>Shrishti Enterprises · Medak, Telangana</span>
                {inspectionAsset.pdfUrl && (
                  <a
                    href={inspectionAsset.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View NABL CC-3071 PDF Certificate</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <button
                onClick={() => setInspectionAsset(null)}
                className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. INTERACTIVE LIVE SIMULATION SANDBOX MODAL */}
      {isLiveDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-2xl glass-panel rounded-2xl shadow-2xl border border-white/20 p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Interactive Fault Injection & Healing Simulation</h3>
              </div>
              <button
                onClick={() => setIsLiveDemoModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Experience self-healing across Shrishti Enterprises plant floor. Inject an artificial physical anomaly into the simulated industrial mesh, watch the predictive detection engine flag the drift in milliseconds, and witness the automated system remediation workflow restore nominal baseline.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  showToast('Fault Injected: Inverter Frequency Spike', 'Simulated 28.4 Hz harmonic distortion on Mitsubishi Bay 4U5.', 'warning');
                  setTimeout(() => {
                    executeTerminalCommand('rebalance-vfd --inverter=4U5');
                    setIsLiveDemoModalOpen(false);
                  }, 1200);
                }}
                className="p-4 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-mono text-amber-400 group-hover:text-amber-300 font-bold">
                  ⚡ Inject VFD Harmonic Spike
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Simulate carrier wave disturbance at 25.05 Hz. Watch auto-PWM compensation trigger.
                </div>
              </button>

              <button
                onClick={() => {
                  showToast('Fault Injected: Bobbin Creel Yarn Drag', 'Simulated uneven tension on 64-bobbin creel rack.', 'warning');
                  setTimeout(() => {
                    executeTerminalCommand('optimize-tension --unit=creel-rack');
                    setIsLiveDemoModalOpen(false);
                  }, 1200);
                }}
                className="p-4 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-mono text-cyan-400 group-hover:text-cyan-300 font-bold">
                  🧶 Inject Yarn Tension Imbalance
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Simulate tape friction excursion approaching 0.03% wastage threshold.
                </div>
              </button>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsLiveDemoModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8.5 STATUTORY DOCUMENT LIGHTBOX MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-3xl glass-panel rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">{previewDoc.title}</h3>
                <p className="text-xs text-slate-400 font-mono">{previewDoc.subtitle}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex items-center justify-center bg-black/70 min-h-[300px]">
              <SafeImage
                src={previewDoc.image}
                alt={previewDoc.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg border border-white/10 shadow-lg"
                fallbackType="document"
                fallbackText={previewDoc.title}
              />
            </div>

            <div className="p-3 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="text-slate-400">Authenticated Document · Shrishti Enterprises</span>
              <div className="flex items-center gap-2">
                {previewDoc.pdfUrl && (
                  <a
                    href={previewDoc.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. SLEEK TOAST NOTIFICATIONS (BOTTOM-RIGHT CORNER) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-xl animate-slideInRight ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : toast.type === 'warning'
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
                : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold leading-tight">{toast.title}</div>
              <div className="text-[11px] opacity-80 leading-normal mt-0.5">{toast.message}</div>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
