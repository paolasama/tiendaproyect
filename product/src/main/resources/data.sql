-- Datos de ejemplo para el sistema de salud personal

-- Insertar medicaciones de ejemplo
INSERT INTO medicacion (nombre, dosis, frecuencia, fecha_inicio, fecha_fin, indicaciones, medico_prescriptor, observaciones, activo, fecha_creacion, fecha_actualizacion) VALUES
('Paracetamol', '500mg', 'Cada 8 horas', '2024-01-15 08:00:00', '2024-01-22 08:00:00', 'Para dolor de cabeza y fiebre', 'Dr. García López', 'Tomar con alimentos', true, NOW(), NOW()),
('Omeprazol', '20mg', 'Una vez al día', '2024-01-10 09:00:00', '2024-02-10 09:00:00', 'Protector gástrico', 'Dr. Martínez Ruiz', 'Tomar en ayunas', true, NOW(), NOW()),
('Vitamina D3', '1000 UI', 'Una vez al día', '2024-01-01 10:00:00', '2024-06-01 10:00:00', 'Suplemento vitamínico', 'Dr. Fernández Silva', 'Tomar con comida grasa', true, NOW(), NOW()),
('Ibuprofeno', '400mg', 'Cada 12 horas si es necesario', '2024-01-20 12:00:00', '2024-01-27 12:00:00', 'Antiinflamatorio para dolor muscular', 'Dr. García López', 'No exceder 3 días consecutivos', true, NOW(), NOW());

-- Insertar alergias de ejemplo
INSERT INTO alergia (alergeno, tipo, severidad, sintomas, tratamiento, observaciones, fecha_diagnostico, activo, fecha_creacion, fecha_actualizacion) VALUES
('Penicilina', 'MEDICINAL', 'SEVERA', 'Erupción cutánea, dificultad respiratoria', 'Evitar antibióticos beta-lactámicos, usar antihistamínicos en caso de exposición', 'Llevar siempre identificación médica', '2020-03-15', true, NOW(), NOW()),
('Mariscos', 'ALIMENTARIA', 'MODERADA', 'Urticaria, hinchazón facial', 'Evitar consumo, llevar epinefrina de emergencia', 'Especial cuidado en restaurantes', '2019-07-22', true, NOW(), NOW()),
('Polen de gramíneas', 'AMBIENTAL', 'LEVE', 'Estornudos, ojos llorosos, congestión nasal', 'Antihistamínicos durante temporada primaveral', 'Síntomas más intensos en abril-junio', '2021-04-10', true, NOW(), NOW()),
('Ácaros del polvo', 'AMBIENTAL', 'MODERADA', 'Asma, rinitis, eczema', 'Fundas antiácaros, aspirado frecuente, humedad controlada', 'Peor en dormitorio, mejorar ventilación', '2018-11-05', true, NOW(), NOW());

-- Insertar notas médicas de ejemplo
INSERT INTO nota_medica (titulo, contenido, tipo_nota, prioridad, fecha_consulta, medico_tratante, centro_medico, diagnostico, tratamiento, proxima_cita, recordatorios, archivado, fecha_creacion, fecha_actualizacion) VALUES
('Consulta Medicina General', 'Paciente acude por dolor de cabeza recurrente. Exploración física normal. Tensión arterial 120/80. Se recomienda hidratación y descanso.', 'CONSULTA', 'BAJA', '2024-01-15 10:30:00', 'Dr. García López', 'Centro de Salud Norte', 'Cefalea tensional', 'Paracetamol 500mg cada 8h, hidratación, descanso', '2024-02-15 10:30:00', 'Recordar tomar medicación con alimentos', false, NOW(), NOW()),

('Análisis de Sangre - Resultados', 'Resultados de analítica completa:\n- Glucosa: 95 mg/dl (Normal)\n- Colesterol total: 180 mg/dl (Normal)\n- HDL: 55 mg/dl (Normal)\n- LDL: 110 mg/dl (Normal)\n- Triglicéridos: 120 mg/dl (Normal)\n- Hemoglobina: 14.2 g/dl (Normal)', 'LABORATORIO', 'MEDIA', '2024-01-10 09:00:00', 'Dr. Martínez Ruiz', 'Laboratorio Central', 'Analítica normal', 'Continuar con dieta equilibrada y ejercicio', '2024-07-10 09:00:00', 'Repetir analítica en 6 meses', false, NOW(), NOW()),

('Cita Cardiología', 'Revisión cardiológica anual. ECG normal. Ecocardiograma sin alteraciones. Función cardíaca conservada.', 'ESPECIALISTA', 'MEDIA', '2024-01-08 11:00:00', 'Dr. Rodríguez Cardio', 'Hospital Universitario', 'Corazón sano', 'Mantener actividad física regular', '2025-01-08 11:00:00', 'Próxima revisión en 12 meses', false, NOW(), NOW()),

('Vacunación COVID-19', 'Administrada tercera dosis de vacuna COVID-19 (Pfizer). Sin reacciones adversas inmediatas. Observación 15 minutos post-vacunación.', 'VACUNACION', 'BAJA', '2024-01-05 16:00:00', 'Enfermera Sánchez', 'Centro de Vacunación', 'Vacunación completada', 'Observación domiciliaria 24-48h', NULL, 'Certificado de vacunación actualizado', false, NOW(), NOW()),

('Urgencia - Esguince Tobillo', 'Paciente acude por dolor en tobillo derecho tras caída. Exploración: inflamación moderada, dolor a la palpación. Radiografía sin fracturas.', 'URGENCIA', 'ALTA', '2024-01-12 22:30:00', 'Dr. Urgencias Pérez', 'Hospital de Urgencias', 'Esguince grado II tobillo derecho', 'Reposo, hielo, elevación, ibuprofeno 400mg/12h', '2024-01-19 10:00:00', 'Revisión en 7 días, fisioterapia si persiste dolor', false, NOW(), NOW());