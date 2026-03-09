// app/register/page.tsx
"use client";
import React from 'react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Access Request</h2>
        <p className="text-sm text-slate-500 mb-8">Register your credentials for the blockchain evidence audit trail.</p>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Official Email ID</label>
              <input type="email" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" title="Minimum 8 characters" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            
            <hr className="my-2 border-slate-100" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Organization</label>
                <input type="text" placeholder="e.g. FBI, Police" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Department</label>
                <input type="text" placeholder="e.g. Cyber Cell" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Designation</label>
              <input type="text" placeholder="e.g. Senior Investigator" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800 transition-all font-bold shadow-md">
            Request for Access
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have access? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}