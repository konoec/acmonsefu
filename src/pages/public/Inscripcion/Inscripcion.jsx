import React from "react";
import { useRegistration } from "./useRegistration";
import StepModalidad from "./StepModalidad";
import StepCategoria from "./StepCategoria";
import StepTipo from "./StepTipo";
import ParticipantList from "./ParticipantList";
import SuccessState from "./SuccessState";
import logoFestival from "../../../assets/images/logos/logo_festival.webp";
import RunningStamp from "../../../components/RunningStamp";

export default function Inscripcion() {
  const {
    modalidades,
    tiposParticipacion,
    categorias,
    selectedModalidad,
    selectedTipo,
    selectedCategoriaId,
    academia,
    setAcademia,
    participants,
    loadingModalidades,
    loadingTipos,
    loadingCategorias,
    submitting,
    success,
    errorMessage,
    lastInscripcionData,
    handleModalidadChange,
    handleTipoChange,
    handleCategoriaChange,
    addParticipant,
    removeParticipant,
    handleParticipantChange,
    handleSubmit,
    handleReset,
  } = useRegistration();

  return (
    <section id="inscripcion" className="py-24 lg:py-32 bg-[#FDFBF7] font-body relative overflow-hidden">
      <RunningStamp />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header Hero Layout */}
        <div className="text-center mb-16 space-y-6">
          <div className="flex flex-col items-center justify-center gap-6">
            <img src={logoFestival} alt="Logo Festival" className="h-24 sm:h-32 w-auto object-contain" />
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.3em] text-orange-600 uppercase opacity-80 block">
                2026 - REGISTRO OFICIAL
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Ficha de Inscripción
              </h2>
            </div>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg font-normal leading-relaxed">
            Tradición de nuestros pueblos, completa tu registro para participar en el festival golpe tierra.
          </p>
        </div>

        {/* Contenedor Paper Editorial Técnico */}
        <div className="bg-white p-8 md:p-16 rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100 relative min-h-[500px]">
          {success ? (
            <SuccessState
              lastInscripcionData={lastInscripcionData}
              onReset={handleReset}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* --- STEP 1: Modalidad --- */}
              <div className="relative z-20">
                <StepModalidad
                  modalidades={modalidades}
                  selectedModalidad={selectedModalidad}
                  onChange={handleModalidadChange}
                  loading={loadingModalidades}
                />
              </div>

              {/* --- CONTENT (Only visible when modalida selected) --- */}
              {selectedModalidad ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">

                  {/* --- STEP 2: Categoría --- */}
                  <StepCategoria
                    categorias={categorias}
                    selectedCategoriaId={selectedCategoriaId}
                    onChange={handleCategoriaChange}
                    loading={loadingCategorias}
                  />

                  {/* --- STEP 3: Tipo Participación --- */}
                  {tiposParticipacion.length > 1 && (
                    <StepTipo
                      tipos={tiposParticipacion}
                      selectedTipoId={selectedTipo?.id}
                      onChange={handleTipoChange}
                      loading={loadingTipos}
                    />
                  )}

                  {/* --- STEP 4: Academia --- */}
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-[0.2em] font-heading">
                      4. Nombre de la Academia / Agrupación
                    </label>
                    <input
                      type="text"
                      value={academia}
                      onChange={(e) => setAcademia(e.target.value)}
                      placeholder="Nombre oficial de tu academia"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-orange-500 focus:bg-white font-body text-sm text-gray-800 placeholder:text-gray-300"
                    />
                  </div>

                  {/* --- STEP 5: Participants --- */}
                  <div className="pt-4 border-t border-gray-100">
                    <ParticipantList
                      participants={participants}
                      selectedTipo={selectedTipo}
                      onAdd={addParticipant}
                      onRemove={removeParticipant}
                      onChange={handleParticipantChange}
                      showTitle={true}
                    />
                  </div>

                  {/* --- Error Message --- */}
                  {errorMessage && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-3 border border-red-100">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errorMessage}
                    </div>
                  )}

                  {/* --- Submit Button --- */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting || !selectedTipo || !selectedCategoriaId || !academia.trim() || participants.length === 0}
                      className="w-full relative flex items-center justify-center px-8 py-5 text-base font-bold tracking-wider text-white bg-gray-900 rounded-sm overflow-hidden hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-3">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-xs uppercase tracking-[0.2em] font-bold">Procesando...</span>
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold">
                          Confirmar Inscripción
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* --- Advertencia de Consistencia de Datos --- */}
                  <div className="p-4 bg-orange-50/70 border border-orange-100 rounded-sm flex gap-3 items-start">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-orange-900 tracking-widest leading-none">IMPORTANTE: Verificación de Datos</p>
                      <p className="text-[11px] text-orange-800/80 font-medium leading-relaxed">
                        Asegúrate de que los nombres y apellidos coincidan exactamente con tu DNI. Recuerda usar <strong>siempre el mismo nombre</strong> en todas tus inscripciones para evitar duplicidad de registros o rechazos.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* --- EMPTY STATE / PLACEHOLDER --- */
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-sm bg-gray-50/30 animate-in fade-in duration-500">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2 font-heading">Comienza tu registro</h4>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm font-body">
                    Selecciona una modalidad arriba para desplegar el formulario completo.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
