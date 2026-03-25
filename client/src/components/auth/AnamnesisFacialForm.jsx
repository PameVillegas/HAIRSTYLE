import { useState } from "react";

export default function AnamnesisFacialForm({ cliente, tratamiento, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    
    datosPersonales: {
      nombre: cliente?.nombre || '',
      fechaNacimiento: '',
      telefono: cliente?.telefono || '',
      email: cliente?.email || '',
      direccion: '',
      ocupacion: ''
    },
    
    saludGeneral: {
      enfermedadCronica: '',
      medicacionActual: '',
      cirugiasPrevias: '',
      embarazoLactancia: '',
      alergias: '',
      problemasDermatologicos: '',
      corticoidesHormonales: ''
    },
    
    habitos: {
      alimentacion: '',
      consumoAgua: '',
      fuma: '',
      alcohol: '',
      nivelEstres: '',
      horasSuenio: '',
      actividadFisica: '',
      exposicionSol: ''
    },
    
    rutinaCosmetica: {
      rutinaDiaria: '',
      productosActuales: '',
      protectorSolar: '',
      usaMaquillaje: '',
      ultimoTratamiento: '',
      reaccionesAdversas: ''
    },
    
    evaluacionProfesional: {
      tipoPiel: '',
      fototipo: '',
      biotipoCutaneo: '',
      estadoActualPiel: '',
      alteracionesObservadas: '',
      diagnostico: ''
    },
    
    planTratamiento: {
      objetivoPrincipal: '',
      protocoloSugerido: '',
      frecuenciaRecomendada: '',
      indicacionesDomiciliarias: ''
    },
    
    consentimiento: false
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSimpleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.consentimiento) {
      alert('Debe aceptar el consentimiento informado para continuar');
      return;
    }

    setLoading(true);
    try {
      const datosCompletos = {
        fecha: formData.fecha,
        datosPersonales: formData.datosPersonales,
        saludGeneral: formData.saludGeneral,
        habitos: formData.habitos,
        rutinaCosmetica: formData.rutinaCosmetica,
        evaluacionProfesional: formData.evaluacionProfesional,
        planTratamiento: formData.planTratamiento
      };

      const res = await fetch('/api/legajos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: cliente.id,
          tratamiento: tratamiento?.nombre || 'Tratamiento Facial',
          tipo: 'facial',
          fecha: formData.fecha,
          datos: datosCompletos
        })
      });

      if (res.ok) {
        const legajo = await res.json();
        onSubmit(legajo);
      } else {
        throw new Error('Error al guardar');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al guardar la planilla');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
              📋 Datos Personales
            </h3>
            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                className="form-control"
                value={formData.fecha}
                onChange={(e) => handleSimpleChange('fecha', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Nombre y Apellido *</label>
              <input
                type="text"
                className="form-control"
                value={formData.datosPersonales.nombre}
                onChange={(e) => handleChange('datosPersonales', 'nombre', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha de Nacimiento / Edad</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: 15/03/1990 (35 años)"
                value={formData.datosPersonales.fechaNacimiento}
                onChange={(e) => handleChange('datosPersonales', 'fechaNacimiento', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={formData.datosPersonales.telefono}
                onChange={(e) => handleChange('datosPersonales', 'telefono', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.datosPersonales.email}
                onChange={(e) => handleChange('datosPersonales', 'email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                className="form-control"
                value={formData.datosPersonales.direccion}
                onChange={(e) => handleChange('datosPersonales', 'direccion', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Ocupación</label>
              <input
                type="text"
                className="form-control"
                value={formData.datosPersonales.ocupacion}
                onChange={(e) => handleChange('datosPersonales', 'ocupacion', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
              🏥 Salud General
            </h3>
            <div className="form-group">
              <label>¿Padece alguna enfermedad crónica? ¿Cuál?</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.saludGeneral.enfermedadCronica}
                onChange={(e) => handleChange('saludGeneral', 'enfermedadCronica', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>¿Toma medicación actualmente? (especificar)</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.saludGeneral.medicacionActual}
                onChange={(e) => handleChange('saludGeneral', 'medicacionActual', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>¿Ha tenido intervenciones quirúrgicas?</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.saludGeneral.cirugiasPrevias}
                onChange={(e) => handleChange('saludGeneral', 'cirugiasPrevias', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>¿Está embarazada, amamantando o en menopausia?</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.saludGeneral.embarazoLactancia}
                onChange={(e) => handleChange('saludGeneral', 'embarazoLactancia', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>¿Presenta alergias? (medicamentos, cosméticos, alimentos)</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.saludGeneral.alergias}
                onChange={(e) => handleChange('saludGeneral', 'alergias', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>¿Problemas dermatológicos diagnosticados?</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.saludGeneral.problemasDermatologicos}
                onChange={(e) => handleChange('saludGeneral', 'problemasDermatologicos', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>¿Usa corticoides o medicación hormonal?</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.saludGeneral.corticoidesHormonales}
                onChange={(e) => handleChange('saludGeneral', 'corticoidesHormonales', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
              🌿 Hábitos y Estilo de Vida
            </h3>
            <div className="form-group">
              <label>Alimentación</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Describa su alimentación habitual"
                value={formData.habitos.alimentacion}
                onChange={(e) => handleChange('habitos', 'alimentacion', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Consumo de agua diario</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: 2 litros, 8 vasos..."
                value={formData.habitos.consumoAgua}
                onChange={(e) => handleChange('habitos', 'consumoAgua', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Fuma / fumó</label>
              <input
                type="text"
                className="form-control"
                placeholder="Sí / No / Fumé anteriormente"
                value={formData.habitos.fuma}
                onChange={(e) => handleChange('habitos', 'fuma', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Alcohol</label>
              <input
                type="text"
                className="form-control"
                placeholder="Frecuencia de consumo"
                value={formData.habitos.alcohol}
                onChange={(e) => handleChange('habitos', 'alcohol', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Nivel de estrés</label>
              <select
                className="form-control"
                value={formData.habitos.nivelEstres}
                onChange={(e) => handleChange('habitos', 'nivelEstres', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="Bajo">Bajo</option>
                <option value="Moderado">Moderado</option>
                <option value="Alto">Alto</option>
              </select>
            </div>
            <div className="form-group">
              <label>Horas de sueño promedio</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: 7 horas"
                value={formData.habitos.horasSuenio}
                onChange={(e) => handleChange('habitos', 'horasSuenio', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Actividad física</label>
              <input
                type="text"
                className="form-control"
                placeholder="Tipo y frecuencia de ejercicio"
                value={formData.habitos.actividadFisica}
                onChange={(e) => handleChange('habitos', 'actividadFisica', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Exposición frecuente a sol / calor / viento</label>
              <input
                type="text"
                className="form-control"
                placeholder="Describa la exposición"
                value={formData.habitos.exposicionSol}
                onChange={(e) => handleChange('habitos', 'exposicionSol', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
              💄 Cuidados y Rutina Cosmética
            </h3>
            <div className="form-group">
              <label>Rutina diaria (mañana y noche)</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describa su rutina de cuidado facial"
                value={formData.rutinaCosmetica.rutinaDiaria}
                onChange={(e) => handleChange('rutinaCosmetica', 'rutinaDiaria', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Productos que utiliza actualmente</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Liste los productos que usa"
                value={formData.rutinaCosmetica.productosActuales}
                onChange={(e) => handleChange('rutinaCosmetica', 'productosActuales', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Usa protector solar (marca / frecuencia)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: La Roche-Posay, todos los días"
                value={formData.rutinaCosmetica.protectorSolar}
                onChange={(e) => handleChange('rutinaCosmetica', 'protectorSolar', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Usa maquillaje diariamente</label>
              <select
                className="form-control"
                value={formData.rutinaCosmetica.usaMaquillaje}
                onChange={(e) => handleChange('rutinaCosmetica', 'usaMaquillaje', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="Sí, todos los días">Sí, todos los días</option>
                <option value="Sí, occasionally">Sí, ocasionalmente</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Último tratamiento facial realizado</label>
              <input
                type="text"
                className="form-control"
                placeholder="¿Cuándo y qué tratamiento?"
                value={formData.rutinaCosmetica.ultimoTratamiento}
                onChange={(e) => handleChange('rutinaCosmetica', 'ultimoTratamiento', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Reacciones adversas previas</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="¿Ha tenido reacciones alérgicas o adversas a tratamientos?"
                value={formData.rutinaCosmetica.reaccionesAdversas}
                onChange={(e) => handleChange('rutinaCosmetica', 'reaccionesAdversas', e.target.value)}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
              🩺 Evaluación Profesional (Completar en consulta)
            </h3>
            <div className="form-group">
              <label>Tipo de piel</label>
              <select
                className="form-control"
                value={formData.evaluacionProfesional.tipoPiel}
                onChange={(e) => handleChange('evaluacionProfesional', 'tipoPiel', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="Normal">Normal</option>
                <option value="Seca">Seca</option>
                <option value="Grasa">Grasa</option>
                <option value="Mixta">Mixta</option>
                <option value="Sensible">Sensible</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fototipo (Fitzpatrick)</label>
              <select
                className="form-control"
                value={formData.evaluacionProfesional.fototipo}
                onChange={(e) => handleChange('evaluacionProfesional', 'fototipo', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="I - Muy clara, siempre se quema">I - Muy clara, siempre se quema</option>
                <option value="II - Clara, usualmente se quema">II - Clara, usualmente se quema</option>
                <option value="III - Media, a veces se quema">III - Media, a veces se quema</option>
                <option value="IV - Oliva, raramente se quema">IV - Oliva, raramente se quema</option>
                <option value="V - Morena, casi nunca se quema">V - Morena, casi nunca se quema</option>
                <option value="VI - Muy oscura, nunca se quema">VI - Muy oscura, nunca se quema</option>
              </select>
            </div>
            <div className="form-group">
              <label>Biotipo cutáneo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Describa el biotipo"
                value={formData.evaluacionProfesional.biotipoCutaneo}
                onChange={(e) => handleChange('evaluacionProfesional', 'biotipoCutaneo', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Estado actual de la piel</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Describa el estado actual"
                value={formData.evaluacionProfesional.estadoActualPiel}
                onChange={(e) => handleChange('evaluacionProfesional', 'estadoActualPiel', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Alteraciones observadas</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Liste las alteraciones encontradas"
                value={formData.evaluacionProfesional.alteracionesObservadas}
                onChange={(e) => handleChange('evaluacionProfesional', 'alteracionesObservadas', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Diagnóstico cosmíátrico</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Diagnóstico del profesional"
                value={formData.evaluacionProfesional.diagnostico}
                onChange={(e) => handleChange('evaluacionProfesional', 'diagnostico', e.target.value)}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-section">
            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>
              📝 Plan de Tratamiento
            </h3>
            <div className="form-group">
              <label>Objetivo principal</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="¿Qué espera lograr con el tratamiento?"
                value={formData.planTratamiento.objetivoPrincipal}
                onChange={(e) => handleChange('planTratamiento', 'objetivoPrincipal', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Protocolo sugerido</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describa el protocolo de tratamiento"
                value={formData.planTratamiento.protocoloSugerido}
                onChange={(e) => handleChange('planTratamiento', 'protocoloSugerido', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Frecuencia recomendada</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Semanal, quincenal, mensual..."
                value={formData.planTratamiento.frecuenciaRecomendada}
                onChange={(e) => handleChange('planTratamiento', 'frecuenciaRecomendada', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Indicaciones domiciliarias</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Cuidados a seguir en casa"
                value={formData.planTratamiento.indicacionesDomiciliarias}
                onChange={(e) => handleChange('planTratamiento', 'indicacionesDomiciliarias', e.target.value)}
              />
            </div>

            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              background: '#fce4ec', 
              borderRadius: '12px',
              border: '2px solid var(--primary)'
            }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--primary-dark)' }}>
                ⚠️ Consentimiento Informado
              </h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.6' }}>
                Declaro que la información brindada en esta planilla es verídica y autorizo 
                la realización del tratamiento estético correspondiente. Entiendo que los 
                resultados pueden variar y que es importante comunicar cualquier reacción 
                adversa que pueda experimentar.
              </p>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                <input
                  type="checkbox"
                  checked={formData.consentimiento}
                  onChange={(e) => handleSimpleChange('consentimiento', e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                He leído y acepto el consentimiento informado
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const totalSteps = 6;

  return (
    <div className="card">
      <div className="card-header">
        <h2>📋 Planilla de Anamnesis Facial</h2>
        <p className="card-subtitle">
          Completá tus datos para el tratamiento: {tratamiento?.nombre || 'Tratamiento Facial'}
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          {[1, 2, 3, 4, 5, 6].map(s => (
            <div
              key={s}
              onClick={() => setStep(s)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: '600',
                background: step === s ? 'var(--primary)' : step > s ? 'var(--success)' : '#ddd',
                color: step === s || step > s ? 'white' : '#666',
                transition: 'all 0.3s'
              }}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>

        <div style={{ 
          background: 'var(--light)', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--gray)' }}>
            Paso {step} de {totalSteps}
          </p>
        </div>

        {renderStep()}

        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '30px',
          justifyContent: 'space-between'
        }}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              ← Anterior
            </button>
          )}
          
          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Guardando...' : '✅ Guardar y Continuar'}
            </button>
          )}
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="btn-secondary"
            style={{ 
              width: '100%', 
              marginTop: '15px',
              background: '#f5f5f5'
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
