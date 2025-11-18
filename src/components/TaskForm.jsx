import React from 'react';

export default function TaskForm({
  isEditing,
  taskForm,
  setTaskForm,
  handleTaskSubmit,
  loading,
  setShowTaskForm,
  setIsEditing
}) {
  // Función para evitar inputs no controlados
  const safeValue = (value, fallback = '') => (value === undefined || value === null ? fallback : value);

  return (
    <form
      onSubmit={handleTaskSubmit}
      className="mb-6 p-6 bg-white/10 rounded-2xl border border-white/20 space-y-4"
    >
      <div>
        <label className="block text-white text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={safeValue(taskForm.titulo)}
          onChange={(e) => setTaskForm({ ...taskForm, titulo: e.target.value })}
          className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50"
          placeholder="Título de la tarea"
          required
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={safeValue(taskForm.descripcion)}
          onChange={(e) => setTaskForm({ ...taskForm, descripcion: e.target.value })}
          className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50"
          placeholder="Descripción de la tarea"
          required
        />
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-1">Categoría</label>
        <select
          value={safeValue(taskForm.categoriaId, '')}
          onChange={(e) => setTaskForm({ ...taskForm, categoriaId: Number(e.target.value) })}
          className="w-full px-4 py-2 rounded-xl bg-black/20 text-white"
          required
        >
          <option value="" disabled>Seleccione una categoría</option>
          <option value={1}>Personal</option>
          <option value={2}>Trabajo</option>
          <option value={3}>Estudios</option>
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-1">Estado</label>
        <select
          value={safeValue(taskForm.estadoId, '')}
          onChange={(e) => setTaskForm({ ...taskForm, estadoId: Number(e.target.value) })}
          className="w-full px-4 py-2 rounded-xl bg-black/20 text-white"
          required
        >
          <option value="" disabled>Seleccione un estado</option>
          <option value={1}>Pendiente</option>
          <option value={2}>En Proceso</option>
          <option value={3}>Completado</option>
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-1">Fecha de Vencimiento</label>
        <input
          type="datetime-local"
          value={safeValue(taskForm.fechaVencimiento)?.slice(0, 16) || ''}
          onChange={(e) => setTaskForm({ ...taskForm, fechaVencimiento: new Date(e.target.value).toISOString() })}
          className="w-full px-4 py-2 rounded-xl bg-white/20 text-white"
          required
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          {isEditing ? 'Actualizar' : 'Crear'} Tarea
        </button>

        <button
          type="button"
          onClick={() => {
            setShowTaskForm(false);
            setIsEditing(null);
          }}
          className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
