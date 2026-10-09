import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/15 mx-auto flex items-center justify-center">
          <Terminal className="w-6 h-6 text-violet-400" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs text-violet-400">ERROR 404</span>
          <h1 className="text-3xl font-bold tracking-tight text-white">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            The resource you requested does not exist or has been relocated within the MEOW AI platform.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
