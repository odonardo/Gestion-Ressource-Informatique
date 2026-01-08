// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.tsx";

// interface FormProps {
//   route: string;
//   method: "login" | "register";
// }

// function Form({ route, method }: FormProps) {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [role, setRole] = useState("user");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
  
//   const navigate = useNavigate();
//   const { login, register, isLoading } = useAuth();

//   const formName = method === "login" ? "Connexion" : "Inscription";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Validation pour register
//     if (method === "register") {
//       if (password !== passwordConfirm) {
//         setError("Les mots de passe ne correspondent pas");
//         setLoading(false);
//         return;
//       }

//       if (password.length < 6) {
//         setError("Le mot de passe doit contenir au moins 6 caractères");
//         setLoading(false);
//         return;
//       }
//     }

//     try {
//       if (method === "login") {
//         // Tentative de connexion
//         await login(username, password);
        
//         // Si on arrive ici, la connexion a réussi
//         setError("");
//         navigate("/dashboard", { 
//           replace: true,
//           state: { from: 'login' }
//         });
        
//       } else {
//         // Tentative d'inscription
//         const result = await register({
//           username,
//           email,
//           password,
//           name,
//           role,
//           password_confirm: passwordConfirm
//         });
        
//         if (result.success) {
//           setError("");
//           alert(result.message);
//           // Rediriger vers la page de connexion après inscription
//           navigate("/login", { 
//             replace: true,
//             state: { message: result.message }
//           });
//         } else {
//           setError(result.message || "Erreur lors de l'inscription");
//         }
//       }
//     } catch (error) {
//       console.error("Error during form submission:", error);
//       // Gestion spécifique des erreurs de connexion
//       if (method === "login") {
//         setError("Nom d'utilisateur ou mot de passe incorrect");
//       } else {
//         setError(error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6 text-center">{formName}</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {method === "register" && (
//           <>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Nom complet *
//               </label>
//               <input
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Votre nom complet"
//                 required
//               />
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Email *
//               </label>
//               <input
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="votre@email.com"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Rôle *
//               </label>
//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//               >
//                 <option value="user">Utilisateur</option>
//                 <option value="technician">Technicien</option>
//                 <option value="admin">Administrateur</option>
//               </select>
//             </div>
//           </>
//         )}

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Nom d'utilisateur *
//           </label>
//           <input
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Votre nom d'utilisateur"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Mot de passe *
//           </label>
//           <input
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Votre mot de passe"
//             required
//             minLength={6}
//           />
//           {method === "register" && (
//             <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
//           )}
//         </div>

//         {method === "register" && (
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Confirmation du mot de passe *
//             </label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               type="password"
//               value={passwordConfirm}
//               onChange={(e) => setPasswordConfirm(e.target.value)}
//               placeholder="Confirmez votre mot de passe"
//               required
//             />
//           </div>
//         )}

//         <button
//           className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
//           type="submit"
//           disabled={loading || isLoading}
//         >
//           {loading ? "Chargement..." : formName}
//         </button>
//       </form>

//       <div className="mt-4 text-center">
//         {method === "login" ? (
//           <p>
//             Pas de compte ?{" "}
//             <a href="/register" className="text-blue-500 hover:text-blue-700">
//               S'inscrire
//             </a>
//           </p>
//         ) : (
//           <p>
//             Déjà un compte ?{" "}
//             <a href="/login" className="text-blue-500 hover:text-blue-700">
//               Se connecter
//             </a>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Form;

