import React from 'react';
import { Check, Trash2, Edit3, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  // Intentamos sacar el estado de varias formas por si cambia el back
  const estadoId = Number(
    task.estadoId ??
    (task.estado && task.estado.id) ??
    0
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: return <Clock className="w-4 h-4 text-red-500" />;
      case 2: return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 3: return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Pendiente';
      case 2: return 'En progreso';
      case 3: return 'Completada';
      default: return 'Desconocido';
    }
  };

  const handleToggle = () => {
    if (estadoId === 1) onToggleStatus({ ...task, estadoId: 2 });
    else if (estadoId === 2) onToggleStatus({ ...task, estadoId: 3 });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {getStatusIcon(estadoId)}
            <h3 className={`text-lg font-semibold ${estadoId === 3 ? 'text-white line-through' : 'text-white'}`}>
              {task.titulo}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-lg ${
              estadoId === 3
                ? 'bg-green-500/20 text-green-200'
                : estadoId === 2
                  ? 'bg-amber-500/20 text-amber-200'
                  : 'bg-red-500/20 text-red-200'
            }`}>
              {getStatusText(estadoId)}
            </span>
          </div>
          {task.descripcion && <p className="text-white/70 mb-4">{task.descripcion}</p>}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleToggle}
            className={`p-2 rounded-xl transition-colors ${
              estadoId === 3
                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                : estadoId === 2
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            }`}
            title={
              estadoId === 1 ? 'Marcar como en progreso' :
              estadoId === 2 ? 'Marcar como completada' :
              'Tarea completada'
            }
            disabled={estadoId === 3}
          >
            {estadoId === 1 ? <AlertCircle className="w-4 h-4" /> :
             estadoId === 2 ? <Check className="w-4 h-4" /> :
             <CheckCircle className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onEdit(task)}
            className="p-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
            title="Editar tarea"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
            title="Eliminar tarea"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
