// // src/pages/Unauthorized.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Shield, ArrowLeft } from 'lucide-react';

// const Unauthorized = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="card bg-white/95 backdrop-blur-sm shadow-2xl">
//           <div className="card-body text-center p-8">
//             <div className="flex justify-center mb-6">
//               <div className="bg-red-100 p-4 rounded-full">
//                 <Shield className="h-12 w-12 text-red-600" />
//               </div>
//             </div>
            
//             <h1 className="text-2xl font-bold text-gray-900 mb-4">
//               Accès Non Autorisé
//             </h1>
            
//             <p className="text-gray-600 mb-2">
//               Vous n'avez pas les permissions nécessaires pour accéder à cette page.
//             </p>
            
//             <p className="text-gray-500 text-sm mb-6">
//               Votre rôle actuel ne vous permet pas d'accéder à cette ressource.
//               Contactez votre administrateur si vous pensez que c'est une erreur.
//             </p>
            
//             <div className="space-y-3">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="btn btn-outline btn-primary w-full"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Retour
//               </button>
              
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="btn btn-primary w-full"
//               >
//                 Aller au Tableau de Bord
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Unauthorized;





// src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Home, AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card bg-base-200 shadow-2xl">
          <div className="card-body p-8">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-error/20 p-4 rounded-full mb-4">
                <Shield className="h-16 w-16 text-error" />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-6 w-6 text-error" />
                <h1 className="text-2xl font-bold text-base-content">
                  Accès Refusé
                </h1>
              </div>
              
              {/* <div className="badge badge-error badge-lg mb-4">
                Code d'erreur: 403
              </div> */}
            </div>

            {/* Message d'erreur */}
            <div className="space-y-4 mb-8">
              <div className="alert alert-error">
                <AlertTriangle className="h-5 w-5" />
                <div className="flex-1">
                  <span className="font-semibold">Accès non autorisé</span>
                  <div className="text-sm opacity-90 mt-1">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
                  </div>
                </div>
              </div>
              
              <div className="text-base-content/70 text-sm bg-base-300 rounded-lg p-4">
                <p className="mb-2">
                  Votre rôle utilisateur ne dispose pas des privilèges requis pour 
                  accéder à cette fonctionnalité.
                </p>
                <p>
                  Si vous pensez qu'il s'agit d'une erreur, veuillez contacter 
                  votre administrateur système.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-outline btn-primary w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour Retour au Tableau de Bord
              </button>
              
              {/* <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary w-full gap-2"
              >
                <Home className="h-4 w-4" />
                Retour au Tableau de Bord
              </button>
               */}
              {/* <div className="divider my-4">OU</div> */}
              
              {/* <button
                onClick={() => navigate('/')}
                className="btn btn-ghost w-full"
              >
                Retour à la page d'accueil
              </button> */}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-base-300">
              <div className="text-center text-sm text-base-content/50">
                <p className="mb-1">Système de Gestion DREN AA</p>
                <p>Version 1.0 • © 2024 Ministère de l'Éducation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 text-center">
          <div className="stats stats-horizontal shadow bg-base-300">
            <div className="stat">
              <div className="stat-title">Code erreur</div>
              <div className="stat-value text-error">403</div>
              <div className="stat-desc">Forbidden</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Type d'erreur</div>
              <div className="stat-value text-warning">Permission</div>
              <div className="stat-desc">Accès refusé</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-base-300 rounded-lg p-4">
          <h3 className="font-semibold text-base-content mb-2">🔐 Que faire ?</h3>
          <ul className="text-sm text-base-content/70 space-y-2">
            <li className="flex items-start gap-2">
              <div className="badge badge-info badge-xs mt-1">1</div>
              <span>Vérifiez que vous êtes connecté avec le bon compte</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="badge badge-info badge-xs mt-1">2</div>
              <span>Contactez votre administrateur pour obtenir les droits nécessaires</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="badge badge-info badge-xs mt-1">3</div>
              <span>Utilisez les boutons ci-dessus pour naviguer vers une page autorisée</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;