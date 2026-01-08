// // pages/Login.tsx
// import React, { useState } from 'react';
// import { authAPI } from '../services/api';

// const Login: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     try {
//       console.log('🔐 Connexion en cours...');
//       await authAPI.login({ username, password });
//       console.log('✅ Connexion réussie, redirection...');
//       window.location.href = '/profils-utilisateurs';
//     } catch (err: any) {
//       console.error('❌ Erreur connexion:', err);
//       setError(err.response?.data?.error || 'Erreur de connexion');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
//       <div className="card bg-base-200 shadow-xl w-full max-w-md">
//         <div className="card-body">
//           <h2 className="card-title text-2xl font-bold mb-6">🔐 Connexion</h2>
          
//           <form onSubmit={handleSubmit}>
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">Nom d'utilisateur</span>
//               </label>
//               <input
//                 type="text"
//                 className="input input-bordered"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//                 disabled={loading}
//               />
//             </div>
            
//             <div className="form-control mb-6">
//               <label className="label">
//                 <span className="label-text">Mot de passe</span>
//               </label>
//               <input
//                 type="password"
//                 className="input input-bordered"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 disabled={loading}
//               />
//             </div>
            
//             {error && (
//               <div className="alert alert-error mb-4">
//                 <span>{error}</span>
//               </div>
//             )}
            
//             <div className="form-control">
//               <button
//                 type="submit"
//                 className={`btn btn-primary ${loading ? 'loading' : ''}`}
//                 disabled={loading}
//               >
//                 {loading ? 'Connexion...' : 'Se connecter'}
//               </button>
//             </div>
//           </form>
          
//           <div className="divider my-6">OR</div>
          
//           <div className="text-center">
//             <p className="text-sm opacity-70 mb-2">
//               Pour tester, utilisez :
//             </p>
//             <div className="bg-base-300 rounded-lg p-3 text-left">
//               <p className="font-mono text-sm">
//                 <span className="font-bold">Admin:</span> admin / admin123
//               </p>
//               <p className="font-mono text-sm mt-1">
//                 <span className="font-bold">Utilisateur:</span> user / user123
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;