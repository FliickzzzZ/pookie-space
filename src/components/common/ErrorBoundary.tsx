import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HelloKittyFace, HelloKittyBow } from './HelloKitty';
import { Sparkles, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Pookie Space ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleResetAndReload = () => {
    try {
      // Clear localStorage cache to fix any corrupted state
      localStorage.removeItem('pookie_chat_v1');
      localStorage.removeItem('pookie_has_seen_welcome');
    } catch {}
    window.location.reload();
  };

  private handleFullReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blush-50 via-pearl-50 to-lavender-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card rounded-4xl p-8 text-center shadow-soft-lg border border-pookie-200">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-pookie-100 via-white to-lavender-100 flex items-center justify-center shadow-soft border border-pookie-200 relative p-1">
              <HelloKittyFace size={56} />
              <div className="absolute -top-1 -right-1 text-yellow-400">
                <Sparkles className="w-5 h-5 fill-yellow-300" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-2">
              <h2 className="font-display font-extrabold text-2xl text-rosewood-900">
                ¡Tranquila, pookie! 💗
              </h2>
              <HelloKittyBow size={20} />
            </div>

            <p className="text-sm text-rosewood-700 font-medium mb-6 leading-relaxed">
              Hemos detectado un pequeño detalle en la sesión. Pulsa el botón de abajo para recargar la aplicación al instante ✨
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleResetAndReload}
                className="w-full py-3.5 px-6 rounded-2xl pookie-gradient-btn text-white font-bold text-sm shadow-soft hover:shadow-glow transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recargar Pookie Space ✨</span>
              </button>

              <button
                onClick={this.handleFullReset}
                className="w-full py-2.5 px-4 rounded-xl text-rosewood-500 hover:text-rosewood-800 hover:bg-pookie-50 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reiniciar datos guardados</span>
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-[11px] font-bold text-rosewood-400 cursor-pointer hover:text-pookie-600">
                  Ver detalle técnico del error
                </summary>
                <pre className="mt-2 p-3 bg-rosewood-900/5 rounded-xl text-[10px] text-rosewood-800 font-mono overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
