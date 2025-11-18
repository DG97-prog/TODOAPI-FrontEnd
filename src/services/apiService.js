const apiService = {
  baseUrl: 'http://localhost:5220/api',
  token: null,

  // Login para obtener token
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

  // Obtener tareas
getTasks: async () => {
  const response = await fetch(`${apiService.baseUrl}/tareas`, {
    headers: { Authorization: `Bearer ${apiService.token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Error al obtener las tareas: ' + errorText);
  }

  const data = await response.json();

  // 🔥 Normalización robusta (SOLO aquí)
  if (Array.isArray(data)) return data;

  if (data?.$values) return data.$values;

  if (data?.items) return data.items;

  if (data?.tareas) return data.tareas;

  // Si llega un objeto extraño, lo convertimos a array vacío
  console.warn("Formato inesperado en GET /tareas:", data);
  return [];
},

  // Crear tarea
  createTask: async (task) => {
    const requiredFields = ['titulo', 'descripcion', 'categoriaId', 'estadoId', 'fechaVencimiento'];
    const isValid = requiredFields.every(field => task[field] !== undefined && task[field] !== null);

    if (!isValid) {
      throw new Error('El objeto task enviado no tiene el formato esperado');
    }

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

    return await response.json();
  },

  // Actualizar tarea
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

    // El back ahora devuelve la tarea actualizada en JSON
    const text = await response.text();

    if (!text) {
      // Si por alguna razón no hay body, devolvemos la misma task que enviamos
      return task;
    }

    try {
      return JSON.parse(text);
    } catch {
      return task;
    }
  },

  // Eliminar tarea
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
