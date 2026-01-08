// import { Navigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import api from "./api/index";
// import { REFRESH_TOKEN, ACCESS_TOKEN } from "./constants/index";
// import { useState, useEffect, ReactNode } from "react";

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// interface DecodedToken {
//   exp?: number;
// }

// function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const refreshToken = async (): Promise<boolean> => {
//     if (isRefreshing) {
//       return false;
//     }

//     setIsRefreshing(true);
//     const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    
//     if (!refreshToken) {
//       setIsAuthorized(false);
//       setIsRefreshing(false);
//       return false;
//     }

//     try {
//       const res = await api.post("/api/token/refresh/", {
//         refresh: refreshToken,
//       });
      
//       if (res.status === 200) {
//         localStorage.setItem(ACCESS_TOKEN, res.data.access);
//         setIsAuthorized(true);
//         setIsRefreshing(false);
//         return true;
//       } else {
//         setIsAuthorized(false);
//         setIsRefreshing(false);
//         return false;
//       }
//     } catch (error) {
//       console.error("Refresh token failed:", error);
//       localStorage.removeItem(ACCESS_TOKEN);
//       localStorage.removeItem(REFRESH_TOKEN);
//       setIsAuthorized(false);
//       setIsRefreshing(false);
//       return false;
//     }
//   };

//   const auth = async () => {
//     const token = localStorage.getItem(ACCESS_TOKEN);
    
//     if (!token) {
//       setIsAuthorized(false);
//       return;
//     }
    
//     try {
//       const decoded: DecodedToken = jwtDecode(token);
//       const tokenExpiration = decoded.exp;
//       const now = Date.now() / 1000;

//       if (typeof tokenExpiration === "number" && tokenExpiration < now + 30) {
//         await refreshToken();
//       } else if (typeof tokenExpiration === "number") {
//         setIsAuthorized(true);
//       } else {
//         console.warn("Token missing expiration claim");
//         setIsAuthorized(false);
//       }
//     } catch (error) {
//       console.error("Token decode failed:", error);
//       await refreshToken();
//     }
//   };

//   useEffect(() => {
//     auth();
//   }, []);

//   if (isAuthorized === null || isRefreshing) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//           <div>Chargement...</div>
//         </div>
//       </div>
//     );
//   }

//   return isAuthorized ? <>{children}</> : <Navigate to="/login" replace />;
// }

// export default ProtectedRoute;