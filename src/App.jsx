import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import TaskStats from './components/TaskStats';
import UserAdmin from './components/UserAdmin';
import mockService from './services/mockService';
import apiService from './services/apiService';
import './App.css';
import { Plus, User, LogOut, CheckCircle } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useMockService, setUseMockService] = useState(true);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [taskForm, setTaskForm] = useState({
    titulo: '',
    descripcion: '',
    categoriaId: '',
    estadoId: '',
    fechaVencimiento: '',
    usuarioId: null, // para Supervisor
  });

  const [isEditing, setIsEditing] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [showUserAdmin, setShowUserAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  const [userAdminForm, setUserAdminForm] = useState({
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    rol: 'User',
  });

  const [allUsers, setAllUsers] = useState([]); // para supervisor

  const currentService = useMockService ? mockService : apiService;

  // =================== LOGIN ===================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const result = await currentService.login(
        loginForm.username,
        loginForm.password
      );

      setUser(result.user);
      setIsLoggedIn(true);
      await loadTasks();

      // Si es Supervisor y está usando API real, cargamos lista de usuarios
      if (!useMockService && result.user.role === 'Supervisor') {
        try {
          const users = await apiService.getUsers();
          setAllUsers(users || []);
        } catch (err) {
          console.error('Error cargando usuarios para supervisor:', err);
        }

        // Por defecto, asignar a sí mismo
        setTaskForm((prev) => ({
          ...prev,
          usuarioId: Number(result.user.id),
        }));
      }
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =================== TAREAS ===================
  const loadTasks = async () => {
    setLoading(true);
    try {
      const taskList = await currentService.getTasks();
      setTasks(taskList || []);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        // EDITAR
        const updatedTask = await currentService.updateTask(isEditing, taskForm);
        setTasks(
          tasks.map((t) => (t.id === isEditing ? updatedTask || taskForm : t))
        );
        setIsEditing(null);
      } else {
        // CREAR
        const payload = {
          ...taskForm,
          categoriaId: Number(taskForm.categoriaId),
          estadoId: Number(taskForm.estadoId),
        };

        // Si es supervisor y seleccionó usuario destino, lo mandamos
        if (user?.role === 'Supervisor' && taskForm.usuarioId) {
          payload.usuarioId = Number(taskForm.usuarioId);
        } else {
          // Usuario normal o sin selección explícita → backend usará userId del token
          delete payload.usuarioId;
        }

        // 🔥 Crear la tarea (para user o supervisor)
        await currentService.createTask(payload);

        // 🔥 Recargamos SOLO las tareas del usuario logueado
        await loadTasks();
      }

      // Limpiar form (pero mantener usuarioId si es supervisor)
      setTaskForm((prev) => ({
        ...prev,
        titulo: '',
        descripcion: '',
        categoriaId: '',
        estadoId: '',
        fechaVencimiento: '',
        // usuarioId se queda igual para supervisor
      }));

      setShowTaskForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error procesando tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    await currentService.deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleToggleStatus = async (task) => {
    const updated = await currentService.updateTask(task.id, {
      ...task,
      estadoId: task.estadoId,
    });

    setTasks(tasks.map((t) => (t.id === task.id ? updated || task : t)));
  };

  const handleEditTask = (task) => {
    setTaskForm({
      titulo: task.titulo,
      descripcion: task.descripcion,
      categoriaId: task.categoriaId,
      estadoId: task.estadoId,
      fechaVencimiento: task.fechaVencimiento,
      usuarioId: task.usuarioId ?? taskForm.usuarioId ?? null,
    });
    setIsEditing(task.id);
    setShowTaskForm(true);
  };

  // =================== ADMIN USUARIOS ===================
  const loadAdminUsers = async () => {
    if (useMockService || user?.role !== 'Admin') return;
    try {
      const users = await apiService.getUsers();
      setAdminUsers(users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showUserAdmin) loadAdminUsers();
  }, [showUserAdmin]);

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUserId) {
        await apiService.updateUser(editingUserId, userAdminForm);
      } else {
        await apiService.registerUser(userAdminForm);
      }

      setUserAdminForm({
        nombreUsuario: '',
        correo: '',
        contrasena: '',
        rol: 'User',
      });

      setEditingUserId(null);
      loadAdminUsers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEditUserClick = (u) => {
    setUserAdminForm({
      nombreUsuario: u.nombreUsuario,
      correo: u.correo,
      contrasena: '',
      rol: u.rol,
    });
    setEditingUserId(u.id);
  };

  const handleDeleteUserClick = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;

    await apiService.deleteUser(id);
    loadAdminUsers();
  };

  // =================== LOGOUT ===================
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setTasks([]);
    setShowUserAdmin(false);
    setAllUsers([]);
    setTaskForm({
      titulo: '',
      descripcion: '',
      categoriaId: '',
      estadoId: '',
      fechaVencimiento: '',
      usuarioId: null,
    });
  };

  // =================== RENDER ===================
  if (!isLoggedIn) {
    return (
      <Login
        useMockService={useMockService}
        setUseMockService={setUseMockService}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        loading={loading}
        loginError={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Todo App</h1>
          </div>

          <div className="flex items-center space-x-3">
            {!useMockService && user?.role === 'Admin' && (
              <button
                onClick={() => setShowUserAdmin((prev) => !prev)}
                className="px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
              >
                {showUserAdmin ? 'Volver a Tareas' : 'Gestionar Usuarios'}
              </button>
            )}

            <User className="w-5 h-5 text-white" />
            <span className="text-white font-medium">{user?.username}</span>

            <span className="px-2 py-1 bg-blue-500/30 text-blue-200 text-xs rounded-lg">
              {user?.role}
            </span>

            <button
              onClick={handleLogout}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showUserAdmin ? (
          <UserAdmin
            adminUsers={adminUsers}
            userAdminForm={userAdminForm}
            editingUserId={editingUserId}
            setUserAdminForm={setUserAdminForm}
            handleUserFormSubmit={handleUserFormSubmit}
            handleEditUserClick={handleEditUserClick}
            handleDeleteUserClick={handleDeleteUserClick}
            loading={loading}
          />
        ) : (
          <>
            <TaskStats tasks={tasks} />

            {user?.role === 'Supervisor' && !useMockService && (
              <div className="mb-4">
                <label className="block text-white text-sm mb-1">
                  Asignar tareas a:
                </label>
                <select
                  value={taskForm.usuarioId ?? user.id}
                  onChange={(e) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      usuarioId: Number(e.target.value),
                    }))
                  }
                  className="w-full max-w-xs px-4 py-2 rounded-xl bg-black/30 text-white"
                >
                  <option value={user.id}>A mí mismo</option>
                  {allUsers
                    .filter((u) => u.id !== user.id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombreUsuario} ({u.rol})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <button
                onClick={() => {
                  setShowTaskForm(!showTaskForm);
                  setIsEditing(null);
                  setTaskForm((prev) => ({
                    ...prev,
                    titulo: '',
                    descripcion: '',
                    categoriaId: '',
                    estadoId: '',
                    fechaVencimiento: '',
                  }));
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Tarea</span>
              </button>
            </div>

            {showTaskForm && (
              <TaskForm
                isEditing={isEditing}
                taskForm={taskForm}
                setTaskForm={setTaskForm}
                handleTaskSubmit={handleTaskSubmit}
                setShowTaskForm={setShowTaskForm}
                setIsEditing={setIsEditing}
                loading={loading}
              />
            )}

            <div className="space-y-4">
              {(tasks?.$values ?? tasks).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={() => handleDeleteTask(task.id)}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
