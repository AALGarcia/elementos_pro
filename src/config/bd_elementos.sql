-- Crear tablas base
CREATE TABLE PERSONA (
    pers_documento BIGINT PRIMARY KEY,
    pers_nombres VARCHAR(45),
    pers_apellidos VARCHAR(45),
    pers_direccion VARCHAR(45),
    pers_telefono BIGINT,
    pers_tipodoc VARCHAR(5)
);

CREATE TABLE ROL (
    rol_id SERIAL PRIMARY KEY,
    rol_nombre VARCHAR(45)
);

CREATE TABLE ROL_PERSONA (
    rq_rol_id INT,
    persona_pers_documento BIGINT,
    PRIMARY KEY (rq_rol_id, persona_pers_documento),
    FOREIGN KEY (rq_rol_id) REFERENCES ROL(rol_id),
    FOREIGN KEY (persona_pers_documento) REFERENCES PERSONA(pers_documento)
);

CREATE TABLE MARCA (
    marc_id SERIAL PRIMARY KEY,
    marc_nombre VARCHAR(45)
);

CREATE TABLE ELEMENTO (
    elem_placa BIGINT PRIMARY KEY,
    elem_descripcion VARCHAR(45),
    elem_modelo VARCHAR(45),
    marca_marc_id INT,
    elem_serial VARCHAR(45),
    elem_fecha_compra TIMESTAMP,
    elem_vida_util INT,
    elem_costo BIGINT,
    FOREIGN KEY (marca_marc_id) REFERENCES MARCA(marc_id)
);

CREATE TABLE SEDE (
    sede_id SERIAL PRIMARY KEY,
    sede_nombre VARCHAR(45)
);

CREATE TABLE AMBIENTE (
    amb_id SERIAL PRIMARY KEY,
    amb_nombre VARCHAR(45),
    sede_sede_id INT,
    FOREIGN KEY (sede_sede_id) REFERENCES SEDE(sede_id)
);

CREATE TABLE ASIGNACION (
    elemento_elem_placa BIGINT,
    ambiente_amb_id INT,
    rq_persona_rq_rol_id INT,
    rq_persona_persona_pers_documento BIGINT,
    PRIMARY KEY (elemento_elem_placa, ambiente_amb_id, rq_persona_rq_rol_id, rq_persona_persona_pers_documento),
    FOREIGN KEY (elemento_elem_placa) REFERENCES ELEMENTO(elem_placa),
    FOREIGN KEY (ambiente_amb_id) REFERENCES AMBIENTE(amb_id),
    FOREIGN KEY (rq_persona_rq_rol_id, rq_persona_persona_pers_documento) REFERENCES ROL_PERSONA(rq_rol_id, persona_pers_documento)
);

CREATE TABLE MOVIMIENTO (
    mov_id SERIAL PRIMARY KEY,
    asignacion_elemento_elem_placa BIGINT,
    asignacion_persona_pers_documento BIGINT,
    mov_fecha_ini TIMESTAMP,
    mov_fecha_fin TIMESTAMP,
    FOREIGN KEY (asignacion_elemento_elem_placa) REFERENCES ELEMENTO(elem_placa),
    FOREIGN KEY (asignacion_persona_pers_documento) REFERENCES PERSONA(pers_documento)
);