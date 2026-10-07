import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Share2,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TrophyBadge3D from '../components/3d/TrophyBadge3D';
import { certificateService } from '../services/certificateService';

export default function CertificatePage() {
  const { id } = useParams();
  const certRef = useRef(null);

  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        setLoading(true);
        const res = await certificateService.getCertificate(id);
        if (res.success) {
          setCert(res.certificate);
        }
      } catch (err) {
        console.error('Failed to load certificate:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCert();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);

    try {
      const element = certRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0b0f19',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`AuraLMS_Certificate_${cert?.certificateId || 'verified'}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Retrieving official certificate registry...</p>
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen pt-36 text-center space-y-4">
        <Award className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold">Certificate Record Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested certificate identifier could not be verified in the Aura LMS blockchain-grade registry.
        </p>
        <Link to="/courses" className="text-brand-500 underline text-xs font-semibold">
          Browse Verified Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Verified Authentic Digital Credential
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Rendering PDF...' : 'Download PDF Certificate'}
          </button>
        </div>
      </div>

      {/* 3D Interactive Trophy Badge Viewer */}
      <div className="text-center space-y-2">
        <TrophyBadge3D />
        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 block">
          Honors Accreditation Trophy
        </span>
      </div>

      {/* PRINTABLE OFFICIAL CERTIFICATE CONTAINER */}
      <div
        ref={certRef}
        className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 text-white border-4 border-amber-500/40 shadow-2xl space-y-8 select-none"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/80 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/80 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/80 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/80 rounded-br-xl" />

        {/* Certificate Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-300 text-xs font-bold tracking-widest uppercase mb-1">
            <Sparkles className="w-4 h-4" /> Aura Learning Management System
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-gradient-gold tracking-tight uppercase">
            Certificate of Mastery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 tracking-widest uppercase">
            This certifies official technical competency and successful curriculum completion
          </p>
        </div>

        {/* Recipient Details */}
        <div className="text-center space-y-4 py-4">
          <span className="text-xs text-slate-400 uppercase tracking-widest block">
            Proudly Conferred Upon
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight underline decoration-amber-500/50 underline-offset-8">
            {cert.student?.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-2">
            For successfully mastering all modules, practical implementations, and passing the comprehensive examination for
          </p>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-brand-300">
            {cert.course?.title}
          </h3>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            {cert.grade || 'Graduated with Distinction'}
          </span>
        </div>

        {/* Signatures & Seal Footer */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center sm:text-left">
          {/* Instructor Signature */}
          <div className="space-y-1">
            <div className="font-serif italic text-xl text-amber-200 tracking-wide pb-1">
              {cert.instructor?.name || 'Dr. Sarah Jenkins'}
            </div>
            <div className="h-px bg-white/20 w-36 mx-auto sm:mx-0" />
            <p className="text-xs font-bold text-white">{cert.instructor?.name}</p>
            <p className="text-[10px] text-slate-400">Master Course Instructor</p>
          </div>

          {/* Official Gold Seal (Center) */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center p-1 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex flex-col items-center justify-center text-dark-950 font-black text-[9px] uppercase tracking-tighter text-center leading-none">
                <Award className="w-5 h-5 mb-0.5 text-dark-950" />
                <span>Verified</span>
                <span>Registry</span>
              </div>
            </div>
          </div>

          {/* Verification Meta & Serial (Right) */}
          <div className="text-center sm:text-right space-y-1">
            <p className="text-[11px] text-slate-400">
              Issued On: <span className="font-bold text-white">{new Date(cert.issueDate).toLocaleDateString()}</span>
            </p>
            <p className="text-[11px] font-mono text-amber-400 font-bold">
              ID: {cert.certificateId}
            </p>
            <p className="text-[9px] text-slate-500">
              Cryptographically verified via Aura LMS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
