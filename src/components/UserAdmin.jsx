import React from "react";
import { Edit3, Trash2 } from "lucide-react";

export default function UserAdmin({
  adminUsers,
  userAdminForm,
  editingUserId,
  setUserAdminForm,
  handleUserFormSubmit,
  handleEditUserClick,
  handleDeleteUserClick,
  loading
}) {
  return (
    <div className="p-6 bg-white/10 rounded-2xl border border-white/20 space-y-6">

      <form onSubmit={handleUserFormSubmit} className="space-y-4">
        <h2 className="text-white text-lg font-semibold">
          {editingUserId ? "Editar usuario" : "Crear nuevo usuario"}
        </h2>

        <div>
          <label className="block text-white text-sm mb-1">Nombre de usuario</label>
          <input
            type="text"
            value={userAdminForm.nombreUsuario}
            onChange={e => setUserAdminForm({ ...userAdminForm, nombreUsuario: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm mb-1">Correo</label>
          <input
            type="email"
            value={userAdminForm.correo}
            onChange={e => setUserAdminForm({ ...userAdminForm, correo: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm mb-1">
            Contraseña {editingUserId && "(opcional)"}
          </label>
          <input
            type="password"
            value={userAdminForm.contrasena}
            onChange={e => setUserAdminForm({ ...userAdminForm, contrasena: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white"
            placeholder={editingUserId ? "Nueva contraseña (opcional)" : ""}
          />
        </div>

        <div>
          <label className="block text-white text-sm mb-1">Rol</label>
          <select
            value={userAdminForm.rol}
            onChange={e => setUserAdminForm({ ...userAdminForm, rol: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-black/20 text-white"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          {editingUserId ? "Actualizar usuario" : "Crear usuario"}
        </button>
      </form>

      <div>
        <h3 className="text-white text-lg font-semibold mb-3">Lista de usuarios</h3>

        {adminUsers.length === 0 ? (
          <p className="text-white/70 text-sm">No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/90">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 pr-2">ID</th>
                  <th className="py-2 pr-2">Usuario</th>
                  <th className="py-2 pr-2">Correo</th>
                  <th className="py-2 pr-2">Rol</th>
                  <th className="py-2 pr-2">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {adminUsers.map(u => (
                  <tr key={u.id} className="border-b border-white/10">
                    <td className="py-2 pr-2">{u.id}</td>
                    <td className="py-2 pr-2">{u.nombreUsuario}</td>
                    <td className="py-2 pr-2">{u.correo}</td>
                    <td className="py-2 pr-2">{u.rol}</td>
                    <td className="py-2 pr-2 space-x-2">
                      <button
                        onClick={() => handleEditUserClick(u)}
                        className="inline-flex items-center px-2 py-1 bg-blue-500/30 rounded-lg hover:bg-blue-500/50"
                      >
                        <Edit3 className="w-4 h-4 mr-1" /> Editar
                      </button>

                      <button
                        onClick={() => handleDeleteUserClick(u.id)}
                        className="inline-flex items-center px-2 py-1 bg-red-500/30 rounded-lg hover:bg-red-500/50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
