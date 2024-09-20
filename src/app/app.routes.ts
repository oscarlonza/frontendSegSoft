import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./modules/login/login.component')
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component'),
        children: [
            {
                path: '',
                redirectTo: 'download-file',
                pathMatch: 'full'
            },
            {
                path: 'download-file',
                loadComponent: () => import('./modules/download-file/download-file.component')
            },
            {
                path: 'cryptography',
                loadComponent: () => import('./modules/cryptography/cryptography.component')
            },
            {
                path: 'not-found',
                loadComponent: () => import('./pages/not-found/not-found.component') // Asegura que tienes un componente para manejar 404 dentro del dashboard
            },
            {
                path: '**',
                redirectTo: 'not-found' // Redirige cualquier ruta no reconocida dentro del dashboard a not-found
            }
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component') // Componente de página no encontrada para el resto de la aplicación
    },
];
