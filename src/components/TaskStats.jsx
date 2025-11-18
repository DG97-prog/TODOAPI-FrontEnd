import React from 'react';
import { CheckCircle, Check, Clock, AlertCircle } from 'lucide-react';
import '../index.css';

export default function TaskStats({ tasks }) {
  const total = tasks.length;

  const pending = tasks.filter(t => Number(t.estadoId) === 1).length;
  const inProgress = tasks.filter(t => Number(t.estadoId) === 2).length;
  const completed = tasks.filter(t => Number(t.estadoId) === 3).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Total Tareas</p>
            <p className="text-3xl font-bold text-white">{total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Completadas</p>
            <p className="text-3xl font-bold text-white">{completed}</p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
            <Check className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">En progreso</p>
            <p className="text-3xl font-bold text-white">{inProgress}</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Pendientes</p>
            <p className="text-3xl font-bold text-white">{pending}</p>
          </div>
          <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
