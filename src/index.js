const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'rotot',
    password: '',
    database: 'sistemafinal',
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Middleware para procesar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para obtener datos de la base de datos
app.get('/api/juegos', (req, res) => {
    db.query('SELECT * FROM juegos', (err, results) => {
        if (err) return res.status(500).send('Error al obtener datos de Juegos');
        res.json(results);
    });
});

// Ruta para obtener un juego por ID
app.get('/api/juegos/:id', (req, res) => {
    const juegoId = req.params.id;

    // Consultar la base de datos por el ID del juego
    db.query('SELECT * FROM juegos WHERE id = ?', [juegoId], (err, results) => {
        if (err) return res.status(500).send('Error al obtener el juego');
        
        // Si no se encuentra el juego
        if (results.length === 0) {
            return res.status(404).send('Juego no encontrado');
        }

        res.json(results[0]);
    });
});
app.get('/api/dev/:id', (req, res) => {
    const devId = req.params.id;
    db.query('SELECT * FROM desarrolladores WHERE id = ?', [devId], (err, results) => {
        if (err) return res.status(500).send('Error al obtener datos del desarrollador');
        if (results.length === 0) return res.status(404).send('Desarrollador no encontrado');
        res.json(results[0]); // Enviar solo el primer resultado ya que se espera solo uno
    });
});
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).send('Error al obtener datos de Usuarios');
        res.json(results);
    });
});



// Ruta para agregar un nuevo juego
app.post('/api/juegos', (req, res) => {
    const { nombre, lanzamiento, plataforma, desarrollador_id } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !lanzamiento || !plataforma || !desarrollador_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Insertar en la base de datos
    const query = 'INSERT INTO juegos (nombre, lanzamiento, plataforma, desarrollador_id) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, lanzamiento, plataforma, desarrollador_id], (err, results) => {
        if (err) {
            console.error('Error al insertar juego:', err);
            return res.status(500).send('Error al guardar el juego');
        }

        res.status(201).json({ id: results.insertId, nombre, lanzamiento, plataforma, desarrollador_id });
    });
});

// Ruta para actualizar un juego
app.put('/api/juegos/:id', (req, res) => {
    const juegoId = req.params.id;
    const { nombre, lanzamiento, plataforma, desarrollador_id } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !lanzamiento || !plataforma || !desarrollador_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Actualizar en la base de datos
    const query = 'UPDATE juegos SET nombre = ?, lanzamiento = ?, plataforma = ?, desarrollador_id = ? WHERE id = ?';
    db.query(query, [nombre, lanzamiento, plataforma, desarrollador_id, juegoId], (err, results) => {
        if (err) {
            console.error('Error al actualizar el juego:', err);
            return res.status(500).send('Error al actualizar el juego');
        }

        res.status(200).json({ id: juegoId, nombre, lanzamiento, plataforma, desarrollador_id });
    });
});
// Ruta para eliminar un juego
app.delete('/api/juegos/:id', (req, res) => {
    const juegoId = req.params.id;

    // Consulta para eliminar el juego con el id correspondiente
    const sql = 'DELETE FROM juegos WHERE id = ?';
    
    db.query(sql, [juegoId], (err, results) => { // Cambié connection.execute por db.query
        if (err) {
            console.error('Error al eliminar el juego:', err);
            return res.status(500).send('Error al eliminar el juego');
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).send('Juego no encontrado');
        }

        res.send('Juego eliminado correctamente');
    });
});

// Ruta para obtener todos los desarrolladores
app.get('/api/dev', (req, res) => {
    db.query('SELECT * FROM desarrolladores', (err, results) => {
        if (err) return res.status(500).send('Error al obtener datos de Desarrolladores');
        res.json(results);
    });
});

// Ruta para agregar un nuevo desarrollador
app.post('/api/dev', (req, res) => {
    const { nombre, fundacion, motorGrafico } = req.body;

    if (!nombre || !fundacion || !motorGrafico) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const query = 'INSERT INTO desarrolladores (nombre, fundacion, motorGrafico) VALUES (?, ?, ?)';
    db.query(query, [nombre, fundacion, motorGrafico], (err, results) => {
        if (err) {
            console.error('Error al insertar desarrollador:', err);
            return res.status(500).send('Error al guardar el desarrollador');
        }
        res.status(201).json({ id: results.insertId, nombre, fundacion, motorGrafico });
    });
});


app.put('/api/dev/:id', (req, res) => {
    const devId = req.params.id;
    const { nombre, fundacion, motorGrafico } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !fundacion || !motorGrafico) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Actualizar en la base de datos
    const query = 'UPDATE desarrolladores SET nombre = ?, fundacion = ?, motorGrafico = ? WHERE id = ?';
    db.query(query, [nombre, fundacion, motorGrafico, devId], (err, results) => {
        if (err) {
            console.error('Error al actualizar el desarrollador:', err);
            return res.status(500).send('Error al actualizar el desarrollador');
        }

        res.status(200).json({ id: devId, nombre, fundacion, motorGrafico });
    });
});



// Ruta para eliminar un desarrollador
app.delete('/api/dev/:id', (req, res) => {
    const devId = req.params.id;

    // Consulta para eliminar el desarrollador con el id correspondiente
    const sql = 'DELETE FROM desarrolladores WHERE id = ?';
    
    db.query(sql, [devId], (err, results) => { 
        if (err) {
            console.error('Error al eliminar el desarrollador:', err);
            return res.status(500).json({ error: 'Error al eliminar el desarrollador' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Desarrollador no encontrado' });
        }

        res.json({ message: 'Desarrollador eliminado correctamente' });
    });
});


// Ruta para obtener un usuario por su ID
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;

    // Consultar la base de datos por el ID del usuario
    db.query('SELECT * FROM usuarios WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).send('Error al obtener el usuario');
        
        // Si no se encuentra el usuario
        if (results.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.json(results[0]); // Enviar solo el primer resultado
    });
});

// Ruta para actualizar los datos de un usuario
app.put('/api/users/:userId', (req, res) => {
    console.log("Ruta PUT alcanzada");  // Verifica que la ruta PUT esté siendo alcanzada
    const userId = req.params.userId;
    const { nombre, apPaterno, apMaterno, nacimiento, usuario, clave } = req.body;

    console.log('Datos recibidos:', req.body); // Verifica los datos que recibes

    // Validar que todos los campos requeridos estén presentes, excepto "clave"
    if (!nombre || !apPaterno || !apMaterno || !nacimiento || !usuario) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const checkQuery = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(checkQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error al comprobar el usuario:', err);
            return res.status(500).send('Error al comprobar el usuario');
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si el campo "clave" no se proporciona, lo mantenemos igual (no lo actualizamos)
        let updateQuery = 'UPDATE usuarios SET nombre = ?, apPaterno = ?, apMaterno = ?, nacimiento = ?, usuario = ? WHERE id = ?';
        const params = [nombre, apPaterno, apMaterno, nacimiento, usuario, userId];

        // Si se pasó un valor para "clave", también lo actualizamos
        if (clave !== undefined && clave !== null) {
            updateQuery = 'UPDATE usuarios SET nombre = ?, apPaterno = ?, apMaterno = ?, nacimiento = ?, usuario = ?, clave = ? WHERE id = ?';
            params.push(clave);
        }

        db.query(updateQuery, params, (err, results) => {
            if (err) {
                console.error('Error al actualizar el usuario:', err);
                return res.status(500).send('Error al actualizar el usuario');
            }

            // Verificar si se actualizaron filas
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'No se pudo actualizar el usuario, puede que no haya cambios.' });
            }

            // Si se actualizó correctamente
            res.status(200).json({ id: userId, nombre, apPaterno, apMaterno, nacimiento, usuario });
        });
    });
});

app.post('/api/users', (req, res) => {
    const { nombre, apPaterno, apMaterno, nacimiento, usuario, clave } = req.body;

    console.log('Datos recibidos:', req.body); // Verifica los datos que recibes

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !apPaterno || !apMaterno || !nacimiento || !usuario || !clave) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Insertar el nuevo usuario en la base de datos
    const insertQuery = 'INSERT INTO usuarios (nombre, apPaterno, apMaterno, nacimiento, usuario, clave) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [nombre, apPaterno, apMaterno, nacimiento, usuario, clave];

    db.query(insertQuery, params, (err, results) => {
        if (err) {
            console.error('Error al agregar el usuario:', err);
            return res.status(500).send('Error al agregar el usuario');
        }

        // Responder con los datos del usuario recién creado
        res.status(201).json({
            id: results.insertId, // El ID generado por la base de datos
            nombre,
            apPaterno,
            apMaterno,
            nacimiento,
            usuario
        });
    });
});


app.delete('/api/users/:userId', (req, res) => {
    const userId = req.params.userId; // Obtener el ID del usuario a eliminar
    /*console.log('ID del usuario a eliminar:', userId);
    const loggedInUserId = req.user.id; // Suponiendo que usas algún mecanismo para obtener el ID del usuario logueado
*/

   /* if (userId === loggedInUserId) {
        return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
    }*/

    console.log('ID del usuario a eliminar:', userId);

    const checkQuery = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(checkQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error al comprobar el usuario:', err);
            return res.status(500).send('Error al comprobar el usuario');
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const deleteQuery = 'DELETE FROM usuarios WHERE id = ?';
        db.query(deleteQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error al eliminar el usuario:', err);
                return res.status(500).send('Error al eliminar el usuario');
            }

            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        });
    });
});


// Ruta para el login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Lógica para validar las credenciales
    db.query('SELECT * FROM usuarios WHERE usuario = ? AND clave = ?', [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        res.json({ success: true });
    });
});




// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3003');
});
