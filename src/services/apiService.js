// apiService.js
const apiService = {
  baseUrl: 'http://localhost:5220/api',
  token: null,

  // 🔑 Login
  login: async (nombreUsuario, contrasena) => {
    const response = await fetch(`${apiService.baseUrl}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreUsuario, contrasena }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Error al iniciar sesión: ' + errorText);
    }

    const data = await response.json();
    apiService.token = data.token;
    return data;
  },

  mapTask: (t) => ({
    id: t.id,
    name: t.titulo,
    description: t.descripcion,
    status: t.estadoId === 1 ? 0 : 1, // 0 = pendiente, 1 = completada
    category: t.categoria?.nombre ?? null,
    dueDate: t.fechaVencimiento,
  }),

  getTasks: async () => {
    const response = await fetch(`${apiService.baseUrl}/tareas`, {
      headers: { Authorization: `Bearer ${apiService.token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Error al obtener las tareas: ' + errorText);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('La respuesta del backend no es un arreglo de tareas.');
    }

    return data.map(apiService.mapTask);
  },

  createTask: async (task) => {
    const response = await fetch(`${apiService.baseUrl}/tareas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiService.token}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear la tarea: ${errorText}`);
    }

    const data = await response.json();
    return apiService.mapTask(data);
  },

  // ✏ Actualizar tarea
  updateTask: async (id, task) => {
    const response = await fetch(`${apiService.baseUrl}/tareas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiService.token}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Error al actualizar la tarea: ' + errorText);
    }

    const text = await response.text();
    return text ? apiService.mapTask(JSON.parse(text)) : {};
  },

  // 🗑 Eliminar tarea
  deleteTask: async (id) => {
    const response = await fetch(`${apiService.baseUrl}/tareas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiService.token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Error al eliminar la tarea: ' + errorText);
    }
  },
};

export default apiService;
