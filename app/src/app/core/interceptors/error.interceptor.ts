import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = resolveErrorMessage(error);
      console.error(`[HTTP ${error.status}] ${req.url}:`, message);
      return throwError(() => error);
    }),
  );

function resolveErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) return 'Connexion au serveur impossible. Vérifiez votre réseau.';
  if (error.status === 401) return 'Session expirée. Veuillez vous reconnecter.';
  if (error.status === 403) return 'Accès non autorisé.';
  if (error.status === 404) return 'Ressource introuvable.';
  if (error.status >= 500) return 'Erreur serveur. Réessayez plus tard.';
  return error.message || 'Une erreur inattendue est survenue.';
}
