// API REST para gestión de asignaciones
const express = require('express');
const router = express.Router();
const { pool } = require('../config/conexion');

/**
 * GET /api/asignaciones
 * Obtiene todas las asignaciones con información completa de persona, rol, elemento y marca
 */
router.get('/asignaciones', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.pers_documento,
        p.pers_nombres,
        p.pers_apellidos,
        p.pers_telefono,
        r.rol_nombre,
        m.marc_nombre,
        e.elem_placa,
        e.elem_modelo,
        a.ambiente_amb_id,
        a.rq_persona_rq_rol_id as rq_persona_rol_rol_id
      FROM asignacion a
      JOIN persona p ON a.rq_persona_persona_pers_documento = p.pers_documento
      JOIN rol_persona rp ON a.rq_persona_rq_rol_id = rp.rq_rol_id 
        AND rp.persona_pers_documento = p.pers_documento
      JOIN rol r ON rp.rq_rol_id = r.rol_id
      JOIN elemento e ON a.elemento_elem_placa = e.elem_placa
      JOIN marca m ON e.marca_marc_id = m.marc_id
      ORDER BY p.pers_apellidos, p.pers_nombres;
    `;

    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * POST /api/asignaciones
 * Crea una nueva asignación
 */
router.post('/asignaciones', async (req, res) => {
  try {
    const { elem_placa, pers_documento, rol_id, amb_id } = req.body;

    // Validar datos recibidos
    if (!elem_placa || !pers_documento || !rol_id || !amb_id) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: elem_placa, pers_documento, rol_id, amb_id'
      });
    }

    const query = `
      INSERT INTO asignacion (elemento_elem_placa, rq_persona_persona_pers_documento, rq_persona_rq_rol_id, ambiente_amb_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await pool.query(query, [elem_placa, pers_documento, rol_id, amb_id]);

    res.json({
      success: true,
      message: 'Asignación creada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear asignación:', error);
    
    // Manejar violación de clave primaria (asignación duplicada)
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Este elemento ya tiene una asignación'
      });
    }

    // Manejar violación de integridad referencial
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        error: 'Error de integridad: verifique que la persona, rol, elemento y ambiente existan'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * PUT /api/asignaciones/:elem_placa
 * Actualiza una asignación existente
 */
router.put('/asignaciones/:elem_placa', async (req, res) => {
  try {
    const { elem_placa } = req.params;
    const { pers_documento, rol_id, amb_id } = req.body;

    // Validar datos recibidos
    if (!pers_documento || !rol_id || !amb_id) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: pers_documento, rol_id, amb_id'
      });
    }

    const query = `
      UPDATE asignacion
      SET rq_persona_persona_pers_documento = $1,
          rq_persona_rq_rol_id = $2,
          ambiente_amb_id = $3
      WHERE elemento_elem_placa = $4
      RETURNING *;
    `;

    const result = await pool.query(query, [pers_documento, rol_id, amb_id, elem_placa]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Asignación no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Asignación actualizada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar asignación:', error);
    
    // Manejar violación de integridad referencial
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        error: 'Error de integridad: verifique que la persona, rol y ambiente existan'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * DELETE /api/asignaciones/:elem_placa
 * Elimina una asignación
 */
router.delete('/asignaciones/:elem_placa', async (req, res) => {
  try {
    const { elem_placa } = req.params;

    const query = `
      DELETE FROM asignacion
      WHERE elemento_elem_placa = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [elem_placa]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Asignación no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Asignación eliminada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar asignación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * GET /api/personas
 * Obtiene lista de personas con sus roles
 */
router.get('/personas', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.pers_documento,
        p.pers_nombres,
        p.pers_apellidos,
        p.pers_telefono,
        STRING_AGG(r.rol_nombre, ', ') as roles
      FROM persona p
      LEFT JOIN rol_persona rp ON p.pers_documento = rp.persona_pers_documento
      LEFT JOIN rol r ON rp.rq_rol_id = r.rol_id
      GROUP BY p.pers_documento, p.pers_nombres, p.pers_apellidos, p.pers_telefono
      ORDER BY p.pers_apellidos, p.pers_nombres;
    `;

    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener personas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * GET /api/personas/:pers_documento/roles
 * Obtiene los roles asignados a una persona específica
 */
router.get('/personas/:pers_documento/roles', async (req, res) => {
  try {
    const { pers_documento } = req.params;

    const query = `
      SELECT 
        r.rol_id,
        r.rol_nombre
      FROM rol_persona rp
      JOIN rol r ON rp.rq_rol_id = r.rol_id
      WHERE rp.persona_pers_documento = $1
      ORDER BY r.rol_nombre;
    `;

    const result = await pool.query(query, [pers_documento]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener roles de persona:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * GET /api/roles
 * Obtiene lista de roles para selectores
 */
router.get('/roles', async (req, res) => {
  try {
    const query = `
      SELECT 
        rol_id,
        rol_nombre
      FROM rol
      ORDER BY rol_nombre;
    `;

    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * GET /api/ambientes
 * Obtiene lista de ambientes para selectores
 */
router.get('/ambientes', async (req, res) => {
  try {
    const query = `
      SELECT 
        amb_id,
        amb_nombre
      FROM ambiente
      ORDER BY amb_nombre;
    `;

    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener ambientes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * POST /api/personas
 * Crea una nueva persona y le asigna un rol
 */
router.post('/personas', async (req, res) => {
  const client = await pool.connect();
  try {
    const { pers_documento, pers_nombres, pers_apellidos, pers_telefono, rol_id } = req.body;

    // Validar datos recibidos
    if (!pers_documento || !pers_nombres || !pers_apellidos || !rol_id) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: pers_documento, pers_nombres, pers_apellidos, rol_id'
      });
    }

    await client.query('BEGIN');

    // Insertar persona
    const insertPersona = `
      INSERT INTO persona (pers_documento, pers_nombres, pers_apellidos, pers_telefono)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const personaResult = await client.query(insertPersona, [pers_documento, pers_nombres, pers_apellidos, pers_telefono]);

    // Asignar rol a la persona
    const insertRolPersona = `
      INSERT INTO rol_persona (rq_rol_id, persona_pers_documento)
      VALUES ($1, $2);
    `;
    await client.query(insertRolPersona, [rol_id, pers_documento]);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Persona creada y rol asignado exitosamente',
      data: personaResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear persona:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Ya existe una persona con ese documento'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  } finally {
    client.release();
  }
});

/**
 * PUT /api/personas/:pers_documento
 * Actualiza una persona existente
 */
router.put('/personas/:pers_documento', async (req, res) => {
  try {
    const { pers_documento } = req.params;
    const { pers_nombres, pers_apellidos, pers_telefono } = req.body;

    if (!pers_nombres || !pers_apellidos) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: pers_nombres, pers_apellidos'
      });
    }

    const query = `
      UPDATE persona
      SET pers_nombres = $1,
          pers_apellidos = $2,
          pers_telefono = $3
      WHERE pers_documento = $4
      RETURNING *;
    `;

    const result = await pool.query(query, [pers_nombres, pers_apellidos, pers_telefono, pers_documento]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Persona no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Persona actualizada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * DELETE /api/personas/:pers_documento
 * Elimina una persona
 */
router.delete('/personas/:pers_documento', async (req, res) => {
  try {
    const { pers_documento } = req.params;

    const query = `
      DELETE FROM persona
      WHERE pers_documento = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [pers_documento]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Persona no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Persona eliminada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        error: 'No se puede eliminar la persona porque tiene asignaciones o roles asociados'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * GET /api/elementos
 * Obtiene todos los elementos con información de marca
 */
router.get('/elementos', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.elem_placa,
        e.elem_descripcion,
        e.elem_modelo,
        e.elem_serial,
        e.marca_marc_id,
        m.marc_nombre
      FROM elemento e
      JOIN marca m ON e.marca_marc_id = m.marc_id
      ORDER BY e.elem_placa;
    `;

    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener elementos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * POST /api/elementos
 * Crea un nuevo elemento
 */
router.post('/elementos', async (req, res) => {
  try {
    const { elem_placa, elem_descripcion, elem_modelo, marc_id, elem_serial } = req.body;

    if (!elem_placa || !elem_modelo || !marc_id) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: elem_placa, elem_modelo, marc_id'
      });
    }

    const query = `
      INSERT INTO elemento (elem_placa, elem_descripcion, elem_modelo, marca_marc_id, elem_serial)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(query, [elem_placa, elem_descripcion, elem_modelo, marc_id, elem_serial]);

    res.json({
      success: true,
      message: 'Elemento creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear elemento:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Ya existe un elemento con esa placa'
      });
    }

    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        error: 'La marca especificada no existe'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * PUT /api/elementos/:elem_placa
 * Actualiza un elemento existente
 */
router.put('/elementos/:elem_placa', async (req, res) => {
  try {
    const { elem_placa } = req.params;
    const { elem_descripcion, elem_modelo, marc_id, elem_serial } = req.body;

    if (!elem_modelo || !marc_id) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: elem_modelo, marc_id'
      });
    }

    const query = `
      UPDATE elemento
      SET elem_descripcion = $1,
          elem_modelo = $2,
          marca_marc_id = $3,
          elem_serial = $4
      WHERE elem_placa = $5
      RETURNING *;
    `;

    const result = await pool.query(query, [elem_descripcion, elem_modelo, marc_id, elem_serial, elem_placa]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Elemento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Elemento actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar elemento:', error);
    
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        error: 'La marca especificada no existe'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * DELETE /api/elementos/:elem_placa
 * Elimina un elemento
 */
router.delete('/elementos/:elem_placa', async (req, res) => {
  try {
    const { elem_placa } = req.params;

    const query = `
      DELETE FROM elemento
      WHERE elem_placa = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [elem_placa]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Elemento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Elemento eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar elemento:', error);
    
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        error: 'No se puede eliminar el elemento porque tiene asignaciones asociadas'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

/**
 * GET /api/marcas
 * Obtiene lista de marcas para selectores
 */
router.get('/marcas', async (req, res) => {
  try {
    const query = `
      SELECT 
        marc_id,
        marc_nombre
      FROM marca
      ORDER BY marc_nombre;
    `;

    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

module.exports = router;
