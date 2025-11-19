const apiService = {
  baseUrl: 'http://localhost:5220/api',
  token: null,

  // Helper para leer claims del JWT sin librerías
  parseJwt(token) {
    if (!token) return {};
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  },

  // Login para obtener token y usuario (id, username, role)
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

    const claims = apiService.parseJwt(data.token);

    const user = {
      id:
        claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        claims['nameid'] ||
        claims['sub'],
      username:
        claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        claims['unique_name'] ||
        claims['name'],
      role:
        claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        claims['role'],
    };

    return { token: data.token, user };
  },

  // Obtener tareas (del usuario logueado)
  getTasks: async () => {
    const response = await fetch(`${apiService.baseUrl}/tareas`, {
      headers: { Authorization: `Bearer ${apiService.token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Error al obtener las tareas: ' + errorText);
    }

    const data = await response.json();

    if (data && typeof data === 'object' && '$values' in data && Array.isArray(data.$values)) {
      return data.$values;
    }

    return data;
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

    const text = await response.text();
    return text ? JSON.parse(text) : task;
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

  // Listar usuarios (Admin y Supervisor)
  getUsers: async () => {
    const response = await fetch(`${apiService.baseUrl}/account`, {
      headers: { Authorization: `Bearer ${apiService.token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Error al obtener usuarios: ' + errorText);
    }

    return await response.json();
  },

  // Registrar usuario (solo Admin)
  registerUser: async (newUser) => {
    const response = await fetch(`${apiService.baseUrl}/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiService.token}`,
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Error al registrar usuario: ' + text);
    }

    return await response.json();
  },

  // Actualizar usuario (solo Admin)
  updateUser: async (id, user) => {
    const response = await fetch(`${apiService.baseUrl}/account/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiService.token}`,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Error al actualizar usuario: ' + text);
    }

    return await response.json();
  },

  // Eliminar usuario (solo Admin)
  deleteUser: async (id) => {
    const response = await fetch(`${apiService.baseUrl}/account/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiService.token}` },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Error al eliminar usuario: ' + text);
    }
  },

  //REPORTE DE TAREAS EN EXCEL (Solo Supervisor) 
  downloadTasksReportExcel: async () => {
    const response = await fetch(`${apiService.baseUrl}/tareas/report`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiService.token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error('Error al descargar reporte: ' + text);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    const fileName = `reporte_tareas_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-')}.xlsx`;

    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default apiService;
