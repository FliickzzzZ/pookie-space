import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Repeat, 
  Tag,
  X,
  ListFilter
} from 'lucide-react';
import { CalendarEvent, EventCategory } from '../../types';
import { storageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';
import { firePookieConfetti } from '../../utils/confetti';
import { geminiService } from '../../services/geminiService';
import { notificationService } from '../../services/notificationService';
import { HelloKittyFace, HelloKittyBow } from '../common/HelloKitty';

export const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(storageService.getEvents());
  const [viewMode, setViewMode] = useState<'mes' | 'semana' | 'dia'>('mes');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [naturalInput, setNaturalInput] = useState('');
  const [parsingNlp, setParsingNlp] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [listMode, setListMode] = useState<'dia' | 'todos'>('dia');

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:00');
  const [category, setCategory] = useState<EventCategory>('Cita');
  const [notes, setNotes] = useState('');
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [reminderMinutes, setReminderMinutes] = useState(15);

  const reload = () => {
    setEvents(storageService.getEvents());
  };

  useEffect(() => {
    window.addEventListener('pookie_storage_update', reload);
    return () => window.removeEventListener('pookie_storage_update', reload);
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  // Category Colors
  const categoryPills: Record<EventCategory, { bg: string; text: string; border: string }> = {
    'Cita': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
    'Estudio': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    'Belleza & Self-care': { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
    'Social': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    'Compras': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    'Importante': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
  };

  // Natural Language Handler (Section 8: "Pookie, recuérdame mañana a las 5 que tengo que estudiar")
  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalInput.trim()) return;

    sounds.playPop();
    setParsingNlp(true);

    setTimeout(() => {
      const response = geminiService.smartLocalEngine(naturalInput.trim());
      setParsingNlp(false);
      setNaturalInput('');
      sounds.playSparkle();
      firePookieConfetti();
      reload();

      if (response.actionCard && response.actionCard.type === 'event_created') {
        const ev = response.actionCard.data;
        setSelectedDateStr(ev.date);
        setCurrentDate(new Date(ev.date + 'T00:00:00'));
        triggerToast(`¡Agendado con éxito! "${ev.title}" para el ${ev.date} a las ${ev.startTime} ✨`);
      } else {
        triggerToast(response.text);
      }
    }, 300);
  };

  // Month navigation helpers
  const nextMonth = () => {
    sounds.playPop();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    sounds.playPop();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Generate calendar days for the current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startingDayIndex = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const calendarDays = [];
  for (let i = 0; i < startingDayIndex; i++) {
    calendarDays.push({ dayNumber: null, dateStr: '' });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ dayNumber: i, dateStr: dStr });
  }

  const handleDayClick = (dStr: string) => {
    if (!dStr) return;
    sounds.playPop();
    setSelectedDateStr(dStr);
    setListMode('dia');
  };

  const handleToggleComplete = (id: string) => {
    sounds.playSparkle();
    firePookieConfetti();
    storageService.toggleEventCompleted(id);
  };

  const handleDeleteEvent = (id: string, evTitle: string) => {
    sounds.playPop();
    if (confirm(`¿Eliminar evento "${evTitle}"?`)) {
      storageService.removeEvent(id);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playSparkle();
    firePookieConfetti();

    const created = storageService.addEvent({
      title: title.trim(),
      date,
      startTime,
      endTime,
      category,
      notes: notes.trim(),
      recurrence,
      reminderMinutes,
      isCompleted: false
    });

    // Auto navigate to the newly created event date!
    setSelectedDateStr(date);
    setCurrentDate(new Date(date + 'T00:00:00'));
    triggerToast(`¡Evento agendado! "${title}" para el ${date} a las ${startTime} 💗`);

    // Reset
    setTitle('');
    setNotes('');
    setShowModal(false);
  };

  const eventsForSelectedDay = events.filter(e => e.date === selectedDateStr);
  const allEventsSorted = [...events].sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    return dateComp !== 0 ? dateComp : a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 md:right-8 z-50 p-4 rounded-3xl bg-white/95 border-2 border-pookie-400 shadow-soft-lg flex items-center gap-3 text-rosewood-900"
          >
            <HelloKittyFace size={34} />
            <div>
              <h4 className="text-xs font-bold text-pookie-600">¡Confirmado por naimnecita! ✨</h4>
              <p className="text-xs font-medium">{successToast}</p>
            </div>
            <button onClick={() => setSuccessToast(null)} className="p-1 text-rosewood-400 hover:text-rosewood-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner & Header */}
      <div className="p-6 sm:p-8 rounded-5xl glass-card border border-white/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Hello Kitty Header Decoration */}
        <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none select-none">
          <HelloKittyFace size={160} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-100 text-lavender-700 text-xs font-bold mb-2">
            <HelloKittyBow size={18} />
            <span>Calendario Chic & Recordatorios con naimnecita</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-rosewood-900 flex items-center gap-2">
            <span>Tu Agenda Pookie 💗</span>
          </h1>
          <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
            Zona horaria local sincronizada. Agrega compromisos con lenguaje natural o con el botón nuevo.
          </p>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => {
              sounds.playPop();
              setDate(selectedDateStr || new Date().toISOString().split('T')[0]);
              setShowModal(true);
            }}
            className="pookie-gradient-btn px-6 py-3 rounded-3xl text-white font-bold text-xs sm:text-sm shadow-glow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Evento 🎀</span>
          </button>
        </div>
      </div>

      {/* Natural Language Prompt Input Bar */}
      <form onSubmit={handleNaturalSubmit} className="p-4 sm:p-5 rounded-4xl bg-white/85 backdrop-blur-xl border border-pookie-200/90 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pookie-400 to-lavender-400 flex items-center justify-center text-white shrink-0 shadow-soft">
            <HelloKittyFace size={26} />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-rosewood-500 uppercase tracking-wider mb-0.5">
              Dile a naimnecita en lenguaje natural:
            </label>
            <input
              type="text"
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              placeholder='Ej: "Pookie, recuérdame mañana a las 5 que tengo que estudiar"'
              className="w-full py-1.5 px-0 bg-transparent text-xs sm:text-sm text-rosewood-900 placeholder:text-rosewood-400 font-semibold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={parsingNlp || !naturalInput.trim()}
            className="px-5 py-2.5 rounded-full bg-pookie-500 hover:bg-pookie-600 text-white text-xs font-bold transition shadow-soft flex items-center gap-1.5 shrink-0 disabled:opacity-40"
          >
            <span>{parsingNlp ? 'Agendando...' : 'Agendar con IA ✨'}</span>
          </button>
        </div>
      </form>

      {/* Main Calendar Matrix & Event List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 p-6 rounded-4xl glass-card border border-white/90 shadow-soft">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <HelloKittyBow size={20} />
              <h2 className="font-display font-bold text-xl text-rosewood-900 capitalize">
                {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-pookie-100 text-rosewood-600 transition"
                title="Mes anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  const todayStr = new Date().toISOString().split('T')[0];
                  setCurrentDate(new Date());
                  setSelectedDateStr(todayStr);
                }}
                className="px-3 py-1 text-xs font-bold rounded-full bg-pookie-100 text-pookie-700 hover:bg-pookie-200 transition"
              >
                Hoy
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-pookie-100 text-rosewood-600 transition"
                title="Mes siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-rosewood-500 uppercase tracking-wider">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell, idx) => {
              if (!cell.dayNumber) {
                return <div key={`empty-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-transparent" />;
              }

              const dayEvents = events.filter(e => e.date === cell.dateStr);
              const isSelected = selectedDateStr === cell.dateStr;
              const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => handleDayClick(cell.dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-pookie-500 bg-pookie-50/90 shadow-soft ring-2 ring-pookie-300'
                      : isToday
                      ? 'border-pookie-300 bg-white shadow-xs'
                      : 'border-pookie-100/70 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-pookie-500 text-white shadow-xs'
                          : isSelected
                          ? 'text-pookie-700 font-bold'
                          : 'text-rosewood-800'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-pookie-500 animate-pulse" />
                    )}
                  </div>

                  {/* Tiny Event Pills */}
                  <div className="space-y-1 overflow-hidden w-full">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate ${
                          ev.isCompleted
                            ? 'line-through opacity-50 bg-gray-100 text-gray-500'
                            : `${categoryPills[ev.category].bg} ${categoryPills[ev.category].text}`
                        }`}
                      >
                        {ev.startTime} {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-pookie-600 font-bold block pl-1">
                        +{dayEvents.length - 2} más
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda & Complete List Tab */}
        <div className="space-y-5">
          <div className="p-6 rounded-4xl glass-card border border-white/90 shadow-soft">
            {/* Tab switch between Day Events vs All Events */}
            <div className="flex items-center justify-between border-b border-pookie-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setListMode('dia')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    listMode === 'dia'
                      ? 'bg-pookie-500 text-white shadow-xs'
                      : 'text-rosewood-600 hover:bg-pookie-100'
                  }`}
                >
                  Día ({selectedDateStr})
                </button>
                <button
                  onClick={() => setListMode('todos')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    listMode === 'todos'
                      ? 'bg-pookie-500 text-white shadow-xs'
                      : 'text-rosewood-600 hover:bg-pookie-100'
                  }`}
                >
                  Todos ({events.length})
                </button>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  setDate(selectedDateStr);
                  setShowModal(true);
                }}
                className="p-2 rounded-xl bg-pookie-100 text-pookie-700 hover:bg-pookie-200 transition"
                title="Añadir evento en este día"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List rendered based on listMode */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {listMode === 'dia' ? (
                eventsForSelectedDay.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <HelloKittyFace size={48} className="mx-auto opacity-70" />
                    <p className="text-xs text-rosewood-600 font-medium">
                      No hay eventos agendados para el <strong>{selectedDateStr}</strong>.
                    </p>
                    <button
                      onClick={() => setListMode('todos')}
                      className="text-xs font-bold text-pookie-600 hover:underline"
                    >
                      Ver todos tus eventos agendados ({events.length}) →
                    </button>
                  </div>
                ) : (
                  eventsForSelectedDay.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-2 ${
                        ev.isCompleted
                          ? 'bg-gray-50/70 border-gray-200 opacity-60'
                          : 'bg-white border-pookie-100 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleToggleComplete(ev.id)}
                          className={`mt-0.5 transition ${
                            ev.isCompleted ? 'text-emerald-500' : 'text-rosewood-300 hover:text-emerald-500'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div>
                          <h4 className={`text-xs font-bold text-rosewood-900 ${ev.isCompleted ? 'line-through' : ''}`}>
                            {ev.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-rosewood-500 mt-1">
                            <span className="flex items-center gap-1 font-semibold">
                              <Clock className="w-3 h-3" />
                              {ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ''}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${categoryPills[ev.category].bg} ${categoryPills[ev.category].text}`}>
                              {ev.category}
                            </span>
                          </div>
                          {ev.notes && (
                            <p className="text-[11px] text-rosewood-600 mt-1.5 italic">
                              "{ev.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="p-1.5 rounded-lg text-rosewood-300 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )
              ) : (
                /* All events list */
                allEventsSorted.length === 0 ? (
                  <p className="text-xs text-rosewood-500 py-6 text-center italic">
                    Aún no tienes ningún evento agendado. ¡Dile a naimnecita que te agende algo! 🎀
                  </p>
                ) : (
                  allEventsSorted.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-3 rounded-2xl border transition flex items-start justify-between gap-2 ${
                        ev.isCompleted
                          ? 'bg-gray-50/70 border-gray-200 opacity-60'
                          : 'bg-white border-pookie-100 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleToggleComplete(ev.id)}
                          className={`mt-0.5 transition ${
                            ev.isCompleted ? 'text-emerald-500' : 'text-rosewood-300 hover:text-emerald-500'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div>
                          <h4 className={`text-xs font-bold text-rosewood-900 ${ev.isCompleted ? 'line-through' : ''}`}>
                            {ev.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-rosewood-500 mt-1">
                            <span className="font-bold text-pookie-600">{ev.date}</span>
                            <span>•</span>
                            <span>{ev.startTime}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${categoryPills[ev.category].bg} ${categoryPills[ev.category].text}`}>
                              {ev.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="p-1 rounded-lg text-rosewood-300 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Crear Evento */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-lg bg-white rounded-5xl p-6 sm:p-8 shadow-soft-lg border border-pookie-200 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelloKittyFace size={28} />
                  <h3 className="font-display font-bold text-xl text-rosewood-900">
                    Agendar nuevo evento ✨
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-pookie-100 text-rosewood-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                    Título del evento o compromiso *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Estudiar para el examen, merienda con amigas..."
                    className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Hora Fin
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Categoría
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 bg-white"
                    >
                      <option value="Cita">Cita 🍷</option>
                      <option value="Estudio">Estudio 📚</option>
                      <option value="Belleza & Self-care">Belleza & Self-care 🧴</option>
                      <option value="Social">Social 🥂</option>
                      <option value="Compras">Compras 🛍️</option>
                      <option value="Importante">Importante 🌟</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                      Avisarme con
                    </label>
                    <select
                      value={reminderMinutes}
                      onChange={(e) => setReminderMinutes(Number(e.target.value))}
                      className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 bg-white"
                    >
                      <option value={0}>Sin aviso</option>
                      <option value={5}>5 minutos antes</option>
                      <option value={15}>15 minutos antes</option>
                      <option value={30}>30 minutos antes</option>
                      <option value={60}>1 hora antes</option>
                      <option value={1440}>1 día antes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                    Repetir evento
                  </label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 bg-white"
                  >
                    <option value="none">No repetir</option>
                    <option value="daily">Todos los días</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="monthly">Mensualmente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rosewood-800 uppercase mb-1">
                    Notas adicionales
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detalles sobre qué llevar, recordatorios..."
                    className="w-full p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-rosewood-600 hover:bg-pookie-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="pookie-gradient-btn px-6 py-2.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-soft"
                  >
                    Guardar compromiso 🎀
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
