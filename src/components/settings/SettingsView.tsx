import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Key, 
  Download, 
  Upload, 
  Trash2, 
  Smartphone, 
  ShieldCheck, 
  Volume2, 
  Sparkles, 
  Check, 
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { storageService } from '../../services/storageService';
import { sounds } from '../../utils/soundEffects';
import { firePookieConfetti } from '../../utils/confetti';

export const SettingsView: React.FC = () => {
  const [notifStatus, setNotifStatus] = useState(notificationService.getPermissionStatus());
  const [groqKey, setGroqKey] = useState(storageService.getGroqApiKey());
  const [groqInput, setGroqInput] = useState(storageService.getGroqApiKey());
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.isEnabled());
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setNotifStatus(notificationService.getPermissionStatus());
  }, []);

  const handleRequestNotifs = async () => {
    sounds.playPop();
    const result = await notificationService.requestPermission();
    setNotifStatus(result);
  };

  const handleSendTestNotif = () => {
    sounds.playSparkle();
    const ok = notificationService.showNotification({
      title: '¡Prueba exitosa, pookie! 💗',
      body: 'Tus notificaciones están funcionando perfectamente con naimnecita ✨',
      id: `test-${Date.now()}`
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSaveGroqKey = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSparkle();
    storageService.setGroqApiKey(groqInput);
    setGroqKey(groqInput);
    firePookieConfetti();
    alert('¡Clave de Groq guardada de forma 100% local en tu dispositivo! 💗');
  };

  const handleRemoveGroqKey = () => {
    sounds.playPop();
    storageService.setGroqApiKey('');
    setGroqKey('');
    setGroqInput('');
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
    if (next) sounds.playPop();
  };

  const handleExportBackup = () => {
    sounds.playSparkle();
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pookie-space-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = storageService.importAllData(content);
        if (ok) {
          sounds.playSparkle();
          firePookieConfetti();
          alert('¡Copia de seguridad restaurada con éxito! 💗');
        } else {
          alert('Error al leer el archivo de copia de seguridad.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('¿Estás segura de que quieres borrar todos los datos de Pookie Space? Esta acción no se puede deshacer.')) {
      storageService.resetAllData();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-5xl glass-card border border-white/80 shadow-soft">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-rosewood-900">
          Configuración & Seguridad 🌸
        </h1>
        <p className="text-xs sm:text-sm text-rosewood-600 mt-1">
          Controla tus avisos al móvil, clave de Gemini, sonidos y copias de seguridad con presupuesto obligatorio 0 €.
        </p>
      </div>

      {/* 1. NOTIFICACIONES PUSH & PWA */}
      <section className="p-6 sm:p-8 rounded-4xl bg-white/80 backdrop-blur-xl border border-pookie-200/80 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-pookie-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pookie-100 text-pookie-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-rosewood-900">
                Notificaciones al Móvil & PWA
              </h2>
              <p className="text-xs text-rosewood-600">
                Avisos reales para que nunca olvides una cita o un recordatorio de estudio.
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              notifStatus === 'granted'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {notifStatus === 'granted' ? 'Activadas ✓' : 'Pendientes de activar'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {notifStatus !== 'granted' ? (
            <button
              onClick={handleRequestNotifs}
              className="pookie-gradient-btn px-6 py-2.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-soft flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>Permitir notificaciones</span>
            </button>
          ) : (
            <button
              onClick={handleSendTestNotif}
              className="px-5 py-2.5 rounded-full bg-white border border-pookie-200 hover:bg-pookie-50 text-rosewood-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-pookie-500" />
              <span>{testSent ? '¡Notificación enviada! 💗' : 'Probar notificación ahora'}</span>
            </button>
          )}
        </div>

        {/* Visual Installation Guide for iOS & Android */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* iOS Card */}
          <div className="p-4 rounded-3xl bg-blush-50/80 border border-blush-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-rosewood-900">
              <Smartphone className="w-4 h-4 text-pookie-600" />
              <span>Cómo activar en iPhone / iPad (iOS):</span>
            </div>
            <ol className="text-xs text-rosewood-700 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Abre esta página en <strong>Safari</strong>.</li>
              <li>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha arriba).</li>
              <li>Selecciona <strong>"Añadir a pantalla de inicio"</strong>.</li>
              <li>Abre el icono de Pookie Space desde tu inicio y pulsa "Permitir notificaciones".</li>
            </ol>
          </div>

          {/* Android Card */}
          <div className="p-4 rounded-3xl bg-lavender-50/80 border border-lavender-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-rosewood-900">
              <Smartphone className="w-4 h-4 text-lavender-600" />
              <span>Cómo activar en Android:</span>
            </div>
            <ol className="text-xs text-rosewood-700 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Abre esta página en <strong>Google Chrome</strong>.</li>
              <li>Toca el aviso inferior "Instalar aplicación" o ve al menú de 3 puntos.</li>
              <li>Selecciona <strong>"Instalar aplicación"</strong>.</li>
              <li>Acepta el permiso de notificaciones cuando te lo pregunte.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 2. GROQ API KEY (ULTRA-RÁPIDO, 100% LOCAL & PRIVADO) */}
      <section className="p-6 sm:p-8 rounded-4xl bg-white/80 backdrop-blur-xl border border-pookie-200/80 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-pookie-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lavender-100 text-lavender-600 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-rosewood-900">
                Conexión con Groq API
              </h2>
              <p className="text-xs text-rosewood-600">
                Inteligencia ultra-rápida y respuestas cariñosas. Clave y mensajes 100% locales en tu dispositivo.
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              groqKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-pookie-50 text-pookie-700 border-pookie-200'
            }`}
          >
            {groqKey ? 'Groq Conectado (Local) ✓' : 'Motor Inteligente Local Activo'}
          </span>
        </div>

        <form onSubmit={handleSaveGroqKey} className="space-y-3">
          <label className="block text-xs font-bold text-rosewood-800 uppercase tracking-wider">
            Tu clave API de Groq (gsk_...):
          </label>
          <div className="flex items-center gap-2">
            <input
              type={showGroqKey ? 'text' : 'password'}
              value={groqInput}
              onChange={(e) => setGroqInput(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 p-3 rounded-2xl border border-pookie-200 text-xs sm:text-sm text-rosewood-900 focus:outline-none focus:ring-2 focus:ring-pookie-400 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowGroqKey(!showGroqKey)}
              className="px-3 py-3 rounded-2xl bg-white border border-pookie-200 text-xs font-bold text-rosewood-600 hover:bg-pookie-50 transition"
            >
              {showGroqKey ? 'Ocultar' : 'Mostrar'}
            </button>
            <button
              type="submit"
              className="pookie-gradient-btn px-6 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-soft transition"
            >
              Guardar local
            </button>
            {groqKey && (
              <button
                type="button"
                onClick={handleRemoveGroqKey}
                className="p-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                title="Eliminar clave local"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-rosewood-600">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Privacidad absoluta:</strong> Tu clave y todos tus mensajes con naimnecita se guardan únicamente en la memoria local de este teléfono u ordenador (localStorage). Jamás se suben a ningún servidor ni repositorio.
            </span>
          </div>
        </form>
      </section>

      {/* 3. SONIDO & ACCESIBILIDAD */}
      <section className="p-6 sm:p-8 rounded-4xl bg-white/80 backdrop-blur-xl border border-pookie-200/80 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pookie-600 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-rosewood-900">
              Efectos de Sonido Hápticos
            </h3>
            <p className="text-xs text-rosewood-600">
              Campanillas, toques mágicos y aplausos al completar eventos o guardar prendas.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleSound}
          className={`w-14 h-8 rounded-full transition-colors relative ${
            soundEnabled ? 'bg-pookie-500' : 'bg-rosewood-200'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
              soundEnabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </section>

      {/* 4. COPIA DE SEGURIDAD & RESTAURACIÓN */}
      <section className="p-6 sm:p-8 rounded-4xl bg-white/80 backdrop-blur-xl border border-pookie-200/80 shadow-soft space-y-4">
        <h3 className="font-display font-bold text-base text-rosewood-900">
          Copia de Seguridad y Portabilidad de Datos
        </h3>
        <p className="text-xs text-rosewood-600">
          Descarga todos tus gustos, deseos, citas y conversaciones en un archivo JSON o restaura una copia anterior en cualquier momento.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-5 py-2.5 rounded-full bg-white border border-pookie-200 hover:bg-pookie-50 text-rosewood-800 text-xs font-bold flex items-center gap-2 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-pookie-600" />
            <span>Descargar copia de seguridad (JSON)</span>
          </button>

          <label className="px-5 py-2.5 rounded-full bg-white border border-pookie-200 hover:bg-pookie-50 text-rosewood-800 text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer">
            <Upload className="w-4 h-4 text-lavender-600" />
            <span>Restaurar copia de seguridad</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* 5. ZONA DE REINICIO */}
      <section className="p-6 rounded-4xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between">
        <div>
          <h4 className="font-display font-bold text-sm text-rose-900">
            Reiniciar la aplicación
          </h4>
          <p className="text-xs text-rose-700">
            Borra las preferencias locales y reinicia el onboarding interactivo.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-full bg-white text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition"
        >
          Reiniciar todo
        </button>
      </section>
    </div>
  );
};
