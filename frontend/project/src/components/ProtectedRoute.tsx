
// import { Navigate, useLocation } from "react-router-dom"
// import { jwtDecode } from "jwt-decode"
// // @ts-ignore: no declaration file for '../api'
// import api from "../api"
// // @ts-ignore: no declaration file for '../constants'
// import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
// import { useState, useEffect, ReactNode } from "react"


// interface ProtectedRouteProps {
//   children: ReactNode
//   fallback?: ReactNode
// }

// function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
//   const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const location = useLocation()

//   const refreshToken = async (): Promise<boolean> => {
//     if (isRefreshing) return false

//     setIsRefreshing(true)
//     const refreshToken = localStorage.getItem(REFRESH_TOKEN)
    
//     if (!refreshToken) {
//       setIsAuthorized(false)
//       setIsRefreshing(false)
//       return false
//     }

//     try {
//       const res = await api.post("/api/token/refresh/", {
//         refresh: refreshToken,
//       })
      
//       if (res.status === 200) {
//         localStorage.setItem(ACCESS_TOKEN, res.data.access)
//         setIsAuthorized(true)
//         return true
//       } else {
//         throw new Error(`Refresh failed with status: ${res.status}`)
//       }
//     } catch (error) {
//       console.error("Refresh token failed:", error)
//       localStorage.removeItem(ACCESS_TOKEN)
//       localStorage.removeItem(REFRESH_TOKEN)
//       setIsAuthorized(false)
//       return false
//     } finally {
//       setIsRefreshing(false)
//     }
//   }

//   const auth = async () => {
//     const token = localStorage.getItem(ACCESS_TOKEN)
    
//     if (!token) {
//       setIsAuthorized(false)
//       return
//     }
    
//     try {
//       const decoded = jwtDecode(token)
//       const tokenExpiration = decoded.exp
//       const now = Date.now() / 1000

//       if (!tokenExpiration) {
//         console.warn("Token missing expiration claim")
//         setIsAuthorized(false)
//         return
//       }

//       // Rafraîchir si le token expire dans moins de 5 minutes
//       if (tokenExpiration < now + 300) {
//         await refreshToken()
//       } else {
//         setIsAuthorized(true)
//       }
//     } catch (error) {
//       console.error("Token validation failed:", error)
//       await refreshToken()
//     }
//   }

//   useEffect(() => {
//     auth()
//   }, [location.pathname]) // Re-valider sur changement de route

//   if (isAuthorized === null || isRefreshing) {
//     return fallback || (
//       <div className="flex justify-center items-center h-screen">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//           <div>Vérification de l'authentification...</div>
//         </div>
//       </div>
//     )
//   }

//   return isAuthorized ? children : <Navigate to="/login" state={{ from: location }} replace />
// }

// export default ProtectedRoute






























// // components/ProtectedRoute.tsx
// import React, { useEffect, useState } from 'react';
// import { authAPI } from '../services/api';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     checkAuthentication();
//   }, []);

//   const checkAuthentication = async () => {
//     try {
//       await authAPI.checkAuth();
//       setAuthenticated(true);
//     } catch (error) {
//       console.error('❌ Non authentifié, redirection vers login');
//       window.location.href = '/login';
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-base-content">Vérification de l'authentification...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!authenticated) {
//     return null; // La redirection est déjà gérée
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;



