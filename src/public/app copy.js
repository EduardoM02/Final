document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en las credenciales');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showModal(data.error || 'Error al iniciar sesión');
            } else {
                // Guarda el nombre de usuario en sessionStorage
                sessionStorage.setItem('username', username);

                // Redirige al usuario a la página de inicio
                window.location.href = '/index.html';
            }
        })
        .catch(error => {
            console.error('Error en la conexión o solicitud:', error);
            showModal('Datos Incorrectos. Acceso denegado');
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const username = sessionStorage.getItem('username');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutLink = document.getElementById('logout');
    const isLoginPage = window.location.pathname.includes('login.html');

    if (!username && !isLoginPage) {
        // Redirigir al login si no hay sesión activa
        window.location.href = '/login.html';
        return;
    }

    // Mostrar el nombre del usuario
    if (username && welcomeMessage) {
        welcomeMessage.textContent = username;
    }

    // Manejo del logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('username'); // Elimina la sesión
            window.location.href = '/login.html'; // Redirige al login
        });
    }
});


// Esperamos a que el DOM se cargue completamente
// Obtener el formulario y agregar el event listener
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
    
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
    
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                // Si la respuesta no es correcta, muestra el modal con el error
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                // Si la respuesta tiene un error, mostrar el modal
                showModal(data.error || 'Error al iniciar sesión');
            } else {
                // Guardar el nombre de usuario en localStorage
                localStorage.setItem('username', username);
    
                // Redirigir a la página principal (cambiar ruta según necesidad)
                window.location.href = '/index.html';
            }
        })
        .catch(error => {
            console.error('Error en la conexión o solicitud:', error); // Mostrar el error en la consola para depuración
            showModal('Datos Incorrectos. Acceso denegado');
        });
    });
    
    // Función para mostrar el modal con el mensaje de error
    function showModal(message) {
        const modal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        const closeModal = document.getElementById('closeModal');
    
        errorMessage.textContent = message; // Coloca el mensaje de error en el modal
        modal.style.display = "block"; // Muestra el modal
    
        // Cerrar el modal cuando se haga clic en la 'x'
        closeModal.addEventListener("click", function() {
            modal.style.display = "none";
        });
    
        // Cerrar el modal si se hace clic fuera del contenido del modal
        window.addEventListener("click", function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }
    
    // Mostrar el nombre del usuario en el <h2> en todas las páginas
    document.addEventListener('DOMContentLoaded', () => {
        const username = localStorage.getItem('username'); // Recupera el nombre del usuario
        const welcomeMessage = document.querySelector('h2#welcomeMessage'); // Selecciona el H2 con id welcomeMessage
    
        if (username) {
            welcomeMessage.textContent = username; // Muestra el nombre del usuario
        } else {
            welcomeMessage.textContent = 'Usuario no identificado'; // Mensaje alternativo
        }
    });
    
});


document.addEventListener('DOMContentLoaded', function () {
    cargarDatosJuegos('/api/juegos', 'juegos-tbody', 6, '/api/dev');
    cargarDatosDesarrolladores('/api/dev', 'devs-tbody', 5);
    cargarDatosUsuarios('/api/users', 'users-tbody', 8);

    // Llenar el select con los desarrolladores cuando cargue la página
    cargarDesarrolladores('/api/dev');
  
    // Manejar el envío del formulario
    const form = document.getElementById('gameForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        agregarJuego();
    });
});

$(document).ready(function() {
    $('#editUserModal').on('show.bs.modal', function (e) {
        console.log('Modal abierto');
        $('#saveUserChanges').off('click').on('click', function() {
            console.log("Botón de Guardar cambios presionado");

            // Obtener el ID del usuario desde el formulario
            const userId = document.getElementById('editUserForm').dataset.userId;
            console.log("Usuario ID al enviar PUT:", userId); // Esto debería mostrar el ID correcto
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('nameEdit') ? document.getElementById('nameEdit').value : '';
            const apPaterno = document.getElementById('aPaternoEdit') ? document.getElementById('aPaternoEdit').value : '';
            const apMaterno = document.getElementById('aMaternoEdit') ? document.getElementById('aMaternoEdit').value : '';
            const nacimiento = document.getElementById('nacimienoEdit') ? document.getElementById('nacimienoEdit').value : '';
            const usuario = document.getElementById('userEdit') ? document.getElementById('userEdit').value : '';
            const clave = document.getElementById('claveEdit') ? document.getElementById('claveEdit').value : '';
            
            // Validar los campos antes de enviar
            if (!nombre || !apPaterno || !apMaterno || !nacimiento || !usuario) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Crear el objeto de datos para enviar al servidor
            const usuarioEditado = {
                nombre,
                apPaterno,
                apMaterno,
                nacimiento,
                usuario,
                clave // Se incluye la clave si es necesario
            };

            // Enviar datos al servidor mediante PUT
            fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioEditado)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al guardar los cambios.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Usuario actualizado:', data);
                alert('Cambios guardados exitosamente.');
                
                // Actualiza la lista de usuarios o refresca la página
                cargarDatosUsuarios('/api/users', 'usuarios-tbody');

                // Cierra el modal (Bootstrap)
                $('#editUserModal').modal('hide');
            })
            .catch(error => {
                console.error('Error al guardar los cambios:', error);
                alert('Ocurrió un error al guardar los cambios.');
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username'); // Recupera el nombre del usuario
    const welcomeMessage = document.getElementById('welcomeMessage'); // Selecciona el H2

    if (username) {
        welcomeMessage.textContent = username; // Muestra el nombre del usuario
    } else {
        welcomeMessage.textContent = 'Usuario no identificado'; // Mensaje alternativo
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modalSaveButton = document.getElementById('saveEditUser'); // Botón en el modal

    if (modalSaveButton) {
        modalSaveButton.addEventListener('click', () => {
            // Obtener el ID del usuario desde el modal
            const editUserModal = document.getElementById('editUserModal');
            if (!editUserModal) {
                console.error('No se encontró el modal de edición.');
                return;
            }

            const userId = editUserModal.dataset.userId; // Supongamos que el modal tiene el ID en un atributo "data-user-id"
            console.log("User ID al enviar PUT:", userId);

            // Obtener los valores del formulario
            const nombre = document.getElementById('nameEdit').value;
            const nacimiento = document.getElementById('nacimienoEdit').value;
            const aPaterno = document.getElementById('aPaternoEdit').value;
            const aMaterno = document.getElementById('aMaternoEdit').value;
            const usuario = document.getElementById('userEdit').value;

            // Validar campos
            if (!nombre || !nacimiento || !aPaterno || !aMaterno || !usuario) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Crear el objeto de datos
            const usuarioEditado = {
                nombre,
                nacimiento,
                apPaterno: aPaterno,
                apMaterno: aMaterno,
                usuario
            };
            console.log('Datos enviados:', usuarioEditado);

            // Enviar datos al servidor mediante PUT
            fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioEditado)
            })
            .then(response => {
                if (!response.ok) throw new Error('Error al guardar los cambios.');
                return response.json();
            })
            .then(data => {
                console.log('Usuario actualizado:', data);
                alert('Cambios guardados exitosamente.');

                // Recargar los datos de la tabla
                cargarDatosUsuarios('/api/users', 'users-tbody', 8);

                // Cerrar el modal
                $('#editUserModal').modal('hide');
            })
            .catch(error => {
                console.error('Error al guardar los cambios:', error);
                alert('Ocurrió un error al guardar los cambios.');
            });
        });
    } else {
        console.error('No se encontró el botón "Guardar Cambios".');
    }
});


document.addEventListener('DOMContentLoaded', function () {
    // Asegúrate de que el botón de guardar cambios tiene un listener de evento
    const saveButton = document.getElementById('saveDevChanges');
    if (saveButton) {
        saveButton.addEventListener('click', function () {
            console.log("Botón de Guardar cambios presionado");
            
            const devId = document.getElementById('editDevForm').dataset.devId;
            const nombre = document.getElementById('devNameEdit').value;
            const fundacion = document.getElementById('foundationDateEdit').value;
            const motorGrafico = document.getElementById('mGraphicEdit').value;
            
            if (!nombre || !fundacion || !motorGrafico) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            
            const desarrolladorEditado = { nombre, fundacion, motorGrafico };
            
            // Enviar datos al servidor mediante PUT
            fetch(`/api/dev/${devId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(desarrolladorEditado)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Desarrollador actualizado:', data);
                alert('Cambios guardados exitosamente.');
                // Actualizar la lista de desarrolladores (puedes implementar una función que lo haga)
                cargarDatosDesarrolladores('/api/dev', 'devs-tbody', 4);
                // Cerrar el modal
                $('#editDevmodal').modal('hide');
            })
            .catch(error => {
                console.error('Error al guardar los cambios:', error);
                alert('Ocurrió un error al guardar los cambios.');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Agregar un nuevo usuario
    document.getElementById('saveUserAdd').addEventListener('click', () => {
        // Obtener los valores del formulario
        const nombre = document.getElementById('nameAdd').value;
        const apPaterno = document.getElementById('aPaternoAdd').value;
        const apMaterno = document.getElementById('aMaternoAdd').value;
        const nacimiento = document.getElementById('nacimienoAdd').value;
        const usuario = document.getElementById('userAdd').value;
        const clave = document.getElementById('claveAdd').value;

        // Validar los campos antes de enviar
        if (!nombre || !apPaterno || !apMaterno || !nacimiento || !usuario || !clave) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Crear el objeto de datos para enviar al servidor
        const usuarioNuevo = {
            nombre,
            apPaterno,
            apMaterno,
            nacimiento,
            usuario,
            clave
        };

        // Enviar datos al servidor mediante POST
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioNuevo)
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                console.log('Usuario agregado:', data);

                // Recargar la tabla de usuarios

                cargarDatosUsuarios('/api/users', 'users-tbody', 8);
                // Cerrar el modal
                $('#addUserModal').modal('hide');
            } else {
                alert('Hubo un error al agregar el usuario');
            }
        })
        .catch(error => {
            console.error('Error al agregar el usuario:', error);
            alert('Ocurrió un error al agregar el usuario.');
        });
    });
});


// Asegúrate de que solo afecten los botones de la tabla de juegos
const tableBody = document.getElementById('juegos-tbody'); // Suponiendo que esta es el id del tbody de la tabla de juegos

tableBody.querySelectorAll('.deleteBtn').forEach(button => {
    button.addEventListener('click', () => {
        const juegoId = button.dataset.id; // Obtenemos el ID del juego desde el data-id del botón
        
        fetch(`/api/juegos/${juegoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el juego.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Juego eliminado:', data);
            alert('Juego eliminado correctamente.');

            // Actualiza la tabla de juegos o refresca la página
            cargarDatosJuegos(); // Aquí recargarías la tabla de juegos
        })
        .catch(error => {
            console.error('Error al eliminar el juego:', error);
            alert('Ocurrió un error al eliminar el juego.');
        });
    });
});


document.getElementById('saveEditBtn').addEventListener('click', () => {
    // Obtener el ID del juego desde el formulario
    const juegoId = document.getElementById('editGameForm').dataset.juegoId;
    console.log("Juego ID al enviar PUT:", juegoId); // Esto debería mostrar el ID correcto

    // Obtener los valores del formulario
    const nombre = document.getElementById('gameNameEdit').value;
    const lanzamiento = document.getElementById('launchDate').value;
    const plataforma = document.getElementById('platformEdit').value;
    const desarrolladorId = document.getElementById('dev-select-edit').value;

    // Validar los campos antes de enviar
    if (!nombre || !lanzamiento || !plataforma || !desarrolladorId) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Crear el objeto de datos para enviar al servidor
    const juegoEditado = {
        nombre,
        lanzamiento,
        plataforma,
        desarrollador_id: desarrolladorId
    };

    // Enviar datos al servidor mediante PUT
    fetch(`/api/juegos/${juegoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(juegoEditado)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar los cambios.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Juego actualizado:', data);
        alert('Cambios guardados exitosamente.');
        
        // Actualiza la lista de juegos o refresca la página
   
        cargarDatosUsuarios('/api/users', 'users-tbody', 8);

        // Cierra el modal (Bootstrap)
        $('#editUsermodal').modal('hide');
    })
    .catch(error => {
        console.error('Error al guardar los cambios:', error);
        alert('Ocurrió un error al guardar los cambios.');
    });
});

document.getElementById('saveDevChanges').addEventListener('click', () => {
    const devId = document.getElementById('editDevForm').dataset.devId;
    console.log("Desarrollador ID al enviar PUT:", devId);

    const nombre = document.getElementById('devNameEdit').value;
    const fundacion = document.getElementById('foundationDateEdit').value;
    const motorGrafico = document.getElementById('mGraphicEdit').value;

    if (!nombre || !fundacion || !motorGrafico) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const desarrolladorEditado = {
        nombre,
        fundacion,
        motorGrafico
    };

    fetch(`/api/dev/${devId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(desarrolladorEditado)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar los cambios.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Desarrollador actualizado:', data);
        alert('Cambios guardados exitosamente.');
        
        cargarDatosDesarrolladores('/api/dev', 'devs-tbody', 4); // Reemplaza este con tu función de carga de datos
        $('#editDevmodal').modal('hide');
    })
    .catch(error => {
        console.error('Error al guardar los cambios:', error);
        alert('Ocurrió un error al guardar los cambios.');
    });
});






function cargarDatosDesarrolladores(apiEndpoint, tableBodyId, columnCount) {
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById(tableBodyId);
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            if (data.length === 0) {
                const noDataRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.colSpan = columnCount;
                noDataCell.textContent = 'No hay datos disponibles';
                noDataCell.style.textAlign = 'center';
                noDataRow.appendChild(noDataCell);
                tableBody.appendChild(noDataRow);
            } else {
                data.forEach(item => {
                    const row = document.createElement('tr');

                    // Columna ID
                    const idCell = document.createElement('td');
                    idCell.className = 'first';
                    idCell.textContent = item.id;
                    row.appendChild(idCell);

                    // Columna Nombre del Desarrollador
                    const nameCell = document.createElement('td');
                    nameCell.textContent = item.nombre || 'N/A';
                    row.appendChild(nameCell);

                    // Columna Fundación (formatear fecha)
                    const foundationCell = document.createElement('td');
                    foundationCell.textContent = item.fundacion ? formatDate(item.fundacion) : 'Fecha no disponible';
                    row.appendChild(foundationCell);

                    // Columna Motor Gráfico
                    const engineCell = document.createElement('td');
                    engineCell.textContent = item.motorGrafico || 'Motor no disponible';
                    row.appendChild(engineCell);

                    // Última columna (botones de acción)
                    const actionCell = document.createElement('td');
                    actionCell.className = 'last';

                    // Botón de editar
                    const editButton = document.createElement('button');
                    editButton.type = 'button';
                    editButton.className = 'editBtn';
                    editButton.dataset.toggle = 'modal';
                    editButton.dataset.target = '#editmodal';
                    const editIcon = document.createElement('ion-icon');
                    editIcon.name = 'create';
                    editButton.appendChild(editIcon);
                    actionCell.appendChild(editButton);

                    // Agregar evento para abrir el modal de edición
                    editButton.addEventListener('click', function () {
                        abrirModalEdicionDesarrollador(item.id); // Pasamos el ID del desarrollador a la función para cargar los datos
                    });

                    // Botón de eliminar
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'deleteBtn';
                    const deleteIcon = document.createElement('ion-icon');
                    deleteIcon.name = 'trash';
                    deleteButton.appendChild(deleteIcon);
                    actionCell.appendChild(deleteButton);

                    row.appendChild(actionCell);

                    // Agregar la fila al tbody
                    tableBody.appendChild(row);
                });

                // Si la tabla ya tiene una instancia de DataTable, actualizamos los datos
                if ($.fn.dataTable.isDataTable('#tableDesarrolladores')) {
                    $('#tableDesarrolladores').DataTable().clear().rows.add($(tableBody).children()).draw();
                } else {
                    // Si no está inicializado, lo inicializamos por primera vez
                    $('#tableDesarrolladores').DataTable({
                        "paging": true, // Activar la paginación
                        "pageLength": 5, // Número de registros por página
                        "language": {
                            "emptyTable": "No hay datos disponibles"
                        }
                    });
                }
            }
        })
        .catch(error => console.error(`Error al cargar datos desde ${apiEndpoint}:`, error));
}



// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Agregar un 0 si el día es menor a 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato dd/mm/yyyy
}

// Función para cargar los desarrolladores
function cargarDatosDesarrolladores(apiEndpoint, tableBodyId, columnCount) {
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById(tableBodyId);
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            if (data.length === 0) {
                const noDataRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.colSpan = columnCount;
                noDataCell.textContent = 'No hay datos disponibles';
                noDataCell.style.textAlign = 'center';
                noDataRow.appendChild(noDataCell);
                tableBody.appendChild(noDataRow);
            } else {
                data.forEach(item => {
                    const row = document.createElement('tr');

                    // Columna ID
                    const idCell = document.createElement('td');
                    idCell.className = 'first';
                    idCell.textContent = item.id;
                    row.appendChild(idCell);

                    // Columna Nombre del Desarrollador
                    const nameCell = document.createElement('td');
                    nameCell.textContent = item.nombre || 'N/A';
                    row.appendChild(nameCell);

                    // Columna Fundación (formatear fecha)
                    const foundationCell = document.createElement('td');
                    foundationCell.textContent = item.fundacion ? formatDate(item.fundacion) : 'Fecha no disponible';
                    row.appendChild(foundationCell);

                    // Columna Motor Gráfico
                    const engineCell = document.createElement('td');
                    engineCell.textContent = item.motorGrafico || 'Motor no disponible';
                    row.appendChild(engineCell);

                    // Última columna (botones de acción)
                    const actionCell = document.createElement('td');
                    actionCell.className = 'last';

                   // Crear el botón de editar
                    const editButton = document.createElement('button');
                    editButton.type = 'button';
                    editButton.className = 'addGbtn';
                    editButton.dataset.toggle = 'modal';
                    editButton.dataset.target = '#editDevmodal';
                    editButton.setAttribute('data-id', item.id);
                    const editIcon = document.createElement('ion-icon');
                    editIcon.name = 'create';
                    editButton.appendChild(editIcon);
                    actionCell.appendChild(editButton);

                    // Añadir el evento 'click' para pasar el ID del desarrollador al abrir el modal
                    editButton.addEventListener('click', function () {
                        const devId = editButton.getAttribute('data-id'); // Obtener el ID del desarrollador
                        abrirModalEdicionDesarrollador(devId); // Pasar el ID al modal
                    });

                    

                    // Este código se coloca después de que agregues el botón de eliminar a la celda de acciones
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'deleteDev';
                    deleteButton.dataset.id = item.id; // Asignamos el ID del desarrollador al botón de eliminar
                    const deleteIcon = document.createElement('ion-icon');
                    deleteIcon.name = 'trash';
                    deleteButton.appendChild(deleteIcon);

                    // Aquí agregas el botón de eliminar a la celda de acciones
                    actionCell.appendChild(deleteButton);

                    // Agregar el evento de clic al botón de eliminar
                    deleteButton.addEventListener('click', function () {
                        const devId = deleteButton.dataset.id; // Obtener el ID del desarrollador
                        eliminarDesarrollador(devId, '/api/dev', row); // Pasar el ID y la fila para eliminar
                        
                    });



                    row.appendChild(actionCell);

                    // Agregar la fila al tbody
                    tableBody.appendChild(row);
                });

                // Si la tabla ya tiene una instancia de DataTable, actualizamos los datos
                if ($.fn.dataTable.isDataTable('#tableDesarrolladores')) {
                    const table = $('#tableDesarrolladores').DataTable();
                    table.clear(); // Limpiar la tabla
                    table.rows.add($(tableBody).children()); // Agregar las nuevas filas
                    table.draw(); // Redibujar la tabla
                } else {
                    // Si no está inicializado, lo inicializamos por primera vez
                    $('#tableDesarrolladores').DataTable({
                        "paging": true, // Activar la paginación
                        "pageLength": 5, // Número de registros por página
                        "language": {
                            "emptyTable": "No hay datos disponibles"
                        }
                    });
                }
            }
        })
        .catch(error => console.error(`Error al cargar datos desde ${apiEndpoint}:`, error));
}



// Función para abrir el modal y cargar los datos del juego
function abrirModalEdicion(juegoId) {
    console.log("Juego ID:", juegoId); // Verifica que se pase correctamente el ID del juego
    
    // Fetch para obtener los datos del juego por ID
    fetch(`/api/juegos/${juegoId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Datos del juego:", data); // Verifica que los datos del juego se obtengan correctamente
            
            if (data) {
                // Establecer el ID del juego en el formulario
                document.getElementById('editGameForm').dataset.juegoId = juegoId; // Establecer el ID del juego en el formulario
                
                // Llenar los campos del modal con los datos del juego
                document.getElementById('gameNameEdit').value = data.nombre || ''; // Campo Nombre
                document.getElementById('launchDate').value = data.lanzamiento ? new Date(data.lanzamiento).toISOString().split('T')[0] : ''; // Campo Lanzamiento
                document.getElementById('platformEdit').value = data.plataforma || ''; // Campo Plataforma
                
                // Llenar el select con los desarrolladores y seleccionar el adecuado
                const select = document.getElementById('dev-select-edit');
                select.innerHTML = ''; // Limpiar el select antes de agregar nuevas opciones

                // Agregar opción por defecto
                const defaultOption = document.createElement('option');
                defaultOption.textContent = 'Seleccione un desarrollador';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);

                // Llamar a la API para obtener los desarrolladores
                fetch('/api/dev')
                    .then(response => response.json())
                    .then(devData => {
                        console.log("Datos de los desarrolladores:", devData); // Verifica que los desarrolladores se obtengan correctamente
                        
                        devData.forEach(dev => {
                            const option = document.createElement('option');
                            option.value = dev.id;
                            option.textContent = dev.nombre;

                            // Si el ID del desarrollador coincide con el del juego, seleccionarlo
                            if (dev.id === data.desarrollador_id) {
                                option.selected = true;
                            }

                            select.appendChild(option);
                        });
                    })
                    .catch(error => console.error('Error al cargar los desarrolladores:', error));

                // Mostrar el modal
                $('#editmodal').modal('show');
            }
        })
        .catch(error => console.error('Error al cargar datos del juego para edición:', error));
}



// Función para cargar los datos de los juegos
// Función para cargar los datos de juegos
function cargarDatosJuegos(apiEndpoint, tableBodyId, columnCount, devApiEndpoint) {
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById(tableBodyId);
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            if (data.length === 0) {
                const noDataRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.colSpan = columnCount;
                noDataCell.textContent = 'No hay datos disponibles';
                noDataCell.style.textAlign = 'center';
                noDataRow.appendChild(noDataCell);
                tableBody.appendChild(noDataRow);
            } else {
                // Cargar los desarrolladores
                fetch(devApiEndpoint)
                    .then(response => response.json())
                    .then(devData => {
                        data.forEach(item => {
                            const row = document.createElement('tr');

                            // Columna ID
                            const idCell = document.createElement('td');
                            idCell.className = 'first';
                            idCell.textContent = item.id;
                            row.appendChild(idCell);

                            // Columna Nombre del Juego
                            const nameCell = document.createElement('td');
                            nameCell.textContent = item.nombre || 'N/A';
                            row.appendChild(nameCell);

                            // Columna Lanzamiento
                            const releaseCell = document.createElement('td');
                            releaseCell.textContent = item.lanzamiento
                                ? formatDate(item.lanzamiento)
                                : 'Fecha no disponible';
                            row.appendChild(releaseCell);

                            // Columna Plataforma
                            const platformCell = document.createElement('td');
                            platformCell.textContent = item.plataforma || 'Plataforma no disponible';
                            row.appendChild(platformCell);

                            // Columna Desarrolladora
                            const developerCell = document.createElement('td');
                            const developer = devData.find(dev => dev.id === item.desarrollador_id);
                            developerCell.textContent = developer
                                ? developer.nombre
                                : 'Desarrolladora no disponible';
                            row.appendChild(developerCell);

                            // Columna de Acciones (Editar y Eliminar)
                            const actionCell = document.createElement('td');
                            actionCell.className = 'last';

                            // Botón de editar
                            const editButton = document.createElement('button');
                            editButton.type = 'button';
                            editButton.className = 'addGbtn';
                            editButton.dataset.toggle = 'modal';
                            editButton.dataset.target = '#editmodal';
                            editButton.setAttribute('data-id', item.id); // Asignamos el ID del juego al botón de editar
                            const editIcon = document.createElement('ion-icon');
                            editIcon.name = 'create';
                            editButton.appendChild(editIcon);
                            actionCell.appendChild(editButton);

                            // Botón de eliminar
                            const deleteButton = document.createElement('button');
                            deleteButton.className = 'deleteBtn';
                            deleteButton.dataset.id = item.id; // Asignamos el ID del juego al botón de eliminar
                            const deleteIcon = document.createElement('ion-icon');
                            deleteIcon.name = 'trash';
                            deleteButton.appendChild(deleteIcon);
                            actionCell.appendChild(deleteButton);

                            row.appendChild(actionCell);

                            // Agregar la fila al tbody
                            tableBody.appendChild(row);

                            // Agregar evento para abrir el modal de edición
                            editButton.addEventListener('click', function () {
                                abrirModalEdicion(item.id); // Pasamos el ID del juego a la función para cargar los datos
                            });

                            // Agregar evento para eliminar el registro
                            deleteButton.addEventListener('click', function () {
                                eliminarRegistro(item.id, apiEndpoint, row);
                            });
                        });

                        // Si la tabla ya tiene una instancia de DataTable, la volvemos a dibujar para actualizar los datos
                        if ($.fn.dataTable.isDataTable('#tableJuegos')) {
                            $('#tableJuegos').DataTable().clear().rows.add($(tableBody).children()).draw();
                        } else {
                            // Si no está inicializado, lo inicializamos por primera vez
                            $('#tableJuegos').DataTable({
                                "paging": true, // Activar la paginación
                                "pageLength": 5, // Número de registros por página
                                "language": {
                                    "emptyTable": "No hay datos disponibles"
                                }
                            });
                        }
                    })
                    .catch(error =>
                        console.error(`Error al cargar los desarrolladores desde ${devApiEndpoint}:`, error)
                    );
            }
        })
        .catch(error => console.error(`Error al cargar datos desde ${apiEndpoint}:`, error));
}



// Función para eliminar un registro
function eliminarRegistro(id, apiEndpoint, row) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
        // Realizamos la petición DELETE al backend
        fetch(`${apiEndpoint}/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                // El registro fue eliminado correctamente, eliminamos la fila de la tabla
                row.remove();
                alert('Juego eliminado exitosamente');
            } else {
                return response.text().then(errorMessage => {
                    alert(errorMessage || 'No se pudo eliminar el juego');
                });
            }
        })
        .catch(error => {
            console.error('Error al eliminar el registro:', error);
            alert('Hubo un problema al eliminar el juego');
        });
    }
}





function agregarJuego() {
    const juegoData = {
        nombre: document.getElementById('gameName').value,
        plataforma: document.getElementById('platform').value,
        lanzamiento: document.getElementById('releaseDate').value,
        desarrollador_id: document.getElementById('dev-select').value
    };

    fetch('/api/juegos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(juegoData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) { // Verifica si el juego se creó con un ID válido
            cargarDatosJuegos('/api/juegos', 'juegos-tbody', 6, '/api/dev');
            //location.reload();
            $('#gameModal').modal('hide'); // Si usas Bootstrap
        } else {
            alert('Hubo un error al agregar el juego');
        }
    })
    .catch(error => console.error('Error al agregar el juego:', error));
    
}
function agregarDesarrollador() {
    const desarrolladorData = {
        nombre: document.getElementById('devName').value,
        fundacion: document.getElementById('foundationDate').value,
        motorGrafico: document.getElementById('mGraphic').value
    };

    fetch('/api/dev', {  // Asegúrate de que la URL sea /api/dev
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(desarrolladorData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) { // Verifica si el desarrollador se creó con un ID válido
            cargarDatosDesarrolladores('/api/dev', 'devs-tbody', 4); // Carga la tabla de desarrolladores
            $('#addDevModal').modal('hide'); // Cierra el modal después de agregar
        } else {
            alert('Hubo un error al agregar el desarrollador');
        }
    })
    .catch(error => console.error('Error al agregar el desarrollador:', error));
}

function cargarDesarrolladores(apiEndpoint) {
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('dev-select');
            select.innerHTML = ''; // Limpiar antes de agregar opciones

            if (data.length === 0) {
                const option = document.createElement('option');
                option.textContent = 'No hay desarrolladores disponibles';
                option.disabled = true;
                select.appendChild(option);
            } else {
                // Agregar opción por defecto
                const defaultOption = document.createElement('option');
                defaultOption.textContent = 'Seleccione un desarrollador';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);

                // Agregar las opciones de los desarrolladores
                data.forEach(dev => {
                    const option = document.createElement('option');
                    option.value = dev.id;
                    option.textContent = dev.nombre;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar desarrolladores:', error));
}

// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Agregar un 0 si el día es menor a 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato dd/mm/yyyy
}



// Supongamos que tienes una tabla donde quieres mostrar las fechas
const tableRows = document.querySelectorAll('.gameRow'); // Selecciona las filas de la tabla

tableRows.forEach(row => {
    const fechaCell = row.querySelector('.fecha'); // Selecciona la celda que contiene la fecha
    if (fechaCell) {
        const originalDate = fechaCell.textContent; // Obtener el valor de la celda
        fechaCell.textContent = formatDate(originalDate); // Formatear y actualizar el texto
    }
});

// Función para eliminar un desarrollador
// Función para eliminar un desarrollador
function eliminarDesarrollador(id, apiEndpoint, row) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
        // Realizamos la petición DELETE al backend
        fetch(`${apiEndpoint}/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el desarrollador.');
            }
            return response.json(); // Asegúrate de leer la respuesta como JSON
        })
        .then(data => {
            console.log('Desarrollador eliminado:', data);
            alert(data.message || 'Desarrollador eliminado correctamente.');

            // Recargar los datos de la tabla después de eliminar
            cargarDatosDesarrolladores(apiEndpoint, 'devs-tbody', 5); // Asegúrate de recargar los datos aquí
        })
        .catch(error => {
            console.error('Error al eliminar el desarrollador:', error);
            alert('Ocurrió un error al eliminar el desarrollador.');
        });
    }
}

function cargarDatosUsuarios(apiEndpoint, tableBodyId, columnCount) {
    fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById(tableBodyId);
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        // Si no hay datos, mostrar mensaje
        if (!data || data.length === 0) {
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = columnCount;
            noDataCell.textContent = 'No hay datos disponibles';
            noDataCell.style.textAlign = 'center';
            noDataRow.appendChild(noDataCell);
            tableBody.appendChild(noDataRow);
        } else {
            // Iterar sobre los datos
            data.forEach(item => {
                const row = document.createElement('tr');

                // Columna ID
                const idCell = document.createElement('td');
                idCell.className = 'first';
                idCell.textContent = item.id || 'ID no disponible';
                row.appendChild(idCell);

                // Columna Nombre
                const nameCell = document.createElement('td');
                nameCell.textContent = item.nombre || 'N/A';
                row.appendChild(nameCell);

                // Columna Usuario
                const userCell = document.createElement('td');
                userCell.textContent = item.usuario || 'Usuario no disponible';
                row.appendChild(userCell);

                // Columna Apellido Paterno
                const lastNameCell = document.createElement('td');
                lastNameCell.textContent = item.apPaterno || 'Apellido no disponible';
                row.appendChild(lastNameCell);

                // Columna Apellido Materno
                const motherLastNameCell = document.createElement('td');
                motherLastNameCell.textContent = item.apMaterno || 'Apellido no disponible';
                row.appendChild(motherLastNameCell);

                // Columna Fecha de Nacimiento (formatear fecha)
                const birthDateCell = document.createElement('td');
                birthDateCell.textContent = item.nacimiento
                    ? formatDate(item.nacimiento)
                    : 'Fecha no disponible';
                row.appendChild(birthDateCell);

                // Última columna (botones de acción)
                const actionCell = document.createElement('td');
                actionCell.className = 'last';

                // Botón de editar
                const editButton = document.createElement('button');
                editButton.type = 'button';
                editButton.className = 'addGbtn';
                editButton.dataset.toggle = 'modal';
                editButton.dataset.target = '#editUserModal';
                editButton.dataset.id = item.id; // Almacenar el ID del usuario
                const editIcon = document.createElement('ion-icon');
                editIcon.name = 'create';
                editButton.appendChild(editIcon);
                actionCell.appendChild(editButton);

                // Añadir evento al botón
                editButton.addEventListener('click', function () {
                    abrirModalEdicionUsuario(item.id); // Pasar el ID al abrir el modal
                });

                // Botón de eliminar
                const deleteButton = document.createElement('button');
                const deleteIcon = document.createElement('ion-icon');
                deleteButton.dataset.id = item.id;
                deleteIcon.name = 'trash';
                deleteButton.appendChild(deleteIcon);
                actionCell.appendChild(deleteButton);

                deleteButton.addEventListener('click', function () {
                    const userId = deleteButton.dataset.id; // Obtener el ID del usuario
                    eliminarUsuario(userId, '/api/users', row); // Pasar el ID y la fila para eliminar
                });
                row.appendChild(actionCell);

                // Agregar la fila al tbody
                tableBody.appendChild(row);
            });

            // Si la tabla ya tiene una instancia de DataTable, la volvemos a dibujar para actualizar los datos
            if ($.fn.dataTable.isDataTable('#usuariosTable')) {
                $('#usuariosTable').DataTable().clear().rows.add($(tableBody).children()).draw();
            } else {
                // Si no está inicializado, lo inicializamos por primera vez
                $('#usuariosTable').DataTable({
                    "paging": true, // Activar la paginación
                    "pageLength": 5, // Número de registros por página
                    "language": {
                        "emptyTable": "No hay datos disponibles"
                    }
                });
            }
        }
    })
    .catch(error => console.error(`Error al cargar datos desde ${apiEndpoint}:`, error));
}



function abrirModalEdicionUsuario(userId) {
    console.log("User ID:", userId); // Verifica que se pase correctamente el ID del usuario
    
    // Verificar si el modal existe
    const editUserModal = document.getElementById('editUserModal');
    if (!editUserModal) {
        console.error('El modal con ID "editUserModal" no existe en el DOM.');
        return;
    }

    // Fetch para obtener los datos del usuario por ID
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Datos del usuario:", data);
            
            if (data) {
                // Establecer el ID del usuario en el modal
                editUserModal.dataset.userId = userId;
                
                // Llenar los campos del modal
                document.getElementById('nameEdit').value = data.nombre || '';
                document.getElementById('nacimienoEdit').value = data.nacimiento ? new Date(data.nacimiento).toISOString().split('T')[0]: '';
                document.getElementById('aPaternoEdit').value = data.apPaterno || '';
                document.getElementById('aMaternoEdit').value = data.apMaterno || '';
                document.getElementById('userEdit').value = data.usuario || '';
                
                // Mostrar el modal
                $('#editUserModal').modal('show');
            }
        })
        .catch(error => console.error('Error al cargar datos del usuario:', error));
}
document.addEventListener('DOMContentLoaded', () => {
    const modalSaveButton = document.getElementById('saveEditUser'); // Botón en el modal

    if (modalSaveButton) {
        modalSaveButton.addEventListener('click', () => {
            // Obtener el ID del usuario desde el modal
            const editUserModal = document.getElementById('editUserModal');
            if (!editUserModal) {
                console.error('No se encontró el modal de edición.');
                return;
            }

            const userId = editUserModal.dataset.userId; // Supongamos que el modal tiene el ID en un atributo "data-user-id"
            console.log("User ID al enviar PUT:", userId);

            // Obtener los valores del formulario
            const nombre = document.getElementById('nameEdit').value;
            const nacimiento = document.getElementById('nacimientoEdit').value;
            const aPaterno = document.getElementById('aPaternoEdit').value;
            const aMaterno = document.getElementById('aMaternoEdit').value;
            const usuario = document.getElementById('userEdit').value;

            // Validar campos
            if (!nombre || !nacimiento || !aPaterno || !aMaterno || !usuario) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Crear el objeto de datos
            const usuarioEditado = {
                nombre,
                nacimiento,
                apPaterno: aPaterno,
                apMaterno: aMaterno,
                usuario
            };

            // Enviar datos al servidor mediante PUT
            fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioEditado)
            })
            .then(response => {
                if (!response.ok) throw new Error('Error al guardar los cambios.');
                return response.json();
            })
            .then(data => {
                console.log('Usuario actualizado:', data);
                alert('Cambios guardados exitosamente.');

                // Recargar los datos de la tabla
                cargarDatosUsuarios('/api/users', 'usuarios-tbody', 6);

                // Cerrar el modal
                $('#editUserModal').modal('hide');
            })
            .catch(error => {
                console.error('Error al guardar los cambios:', error);
                alert('Ocurrió un error al guardar los cambios.');
            });
        });
    } else {
        console.error('No se encontró el botón "Guardar Cambios".');
    }
});

function eliminarUsuario(id, apiEndpoint, row) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        // Realizamos la petición DELETE al backend
        fetch(`${apiEndpoint}/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario.');
            }
            return response.json(); // Asegúrate de leer la respuesta como JSON
        })
        .then(data => {
            console.log('Usuario eliminado:', data);
            alert(data.message || 'Usuario eliminado correctamente.');

            // Recargar los datos de la tabla después de eliminar
            cargarDatosUsuarios(apiEndpoint, 'users-tbody', 8); // O lo que sea necesario para recargar los datos
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
            alert('Ocurrió un error al eliminar el usuario.');
        });
    }
}

