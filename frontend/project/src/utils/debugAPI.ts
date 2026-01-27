// utils/debugAPI.ts
export const debugReparationAPI = {
  // Test GET pour voir si les réparations ont technicien_responsable
  testGetReparations: async () => {
    try {
      const response = await fetch('https://gestion-ressource-informatique.onrender.com/api/reparations/', {
        headers: {
          'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
      });
      const data = await response.json();
      
      console.log('🔍 DEBUG - Données réparations reçues du backend:');
      console.log('📊 Nombre total:', data.length || (data.results ? data.results.length : 0));
      
      const reparations = Array.isArray(data) ? data : (data.results || []);
      
      // Vérifier chaque réparation
      reparations.forEach((rep: any, index: number) => {
        console.log(`\n--- Réparation ${index + 1} (ID: ${rep.id}) ---`);
        console.log('✅ technicien_responsable:', rep.technicien_responsable);
        console.log('📋 Tous les champs:', Object.keys(rep));
        console.log('📦 Valeurs:', rep);
      });
      
      // Statistiques
      const withTechnician = reparations.filter((r: any) => r.technicien_responsable);
      console.log(`\n📊 STATISTIQUES:`);
      console.log(`✅ Avec technicien: ${withTechnician.length}/${reparations.length}`);
      console.log(`❌ Sans technicien: ${reparations.length - withTechnician.length}/${reparations.length}`);
      
      return reparations;
    } catch (error) {
      console.error('❌ DEBUG - Erreur:', error);
    }
  },
  
  // Test POST pour voir ce qui est envoyé
  testCreateReparation: async (testData: any) => {
    try {
      console.log('🧪 TEST CREATE - Données à envoyer:', testData);
      
      const response = await fetch('https://gestion-ressource-informatique.onrender.com/api/reparations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + localStorage.getItem('auth_token')
        },
        body: JSON.stringify(testData)
      });
      
      console.log('📤 TEST CREATE - Statut:', response.status);
      const text = await response.text();
      
      try {
        const json = JSON.parse(text);
        console.log('✅ TEST CREATE - Réponse JSON:', json);
      } catch {
        console.log('⚠️ TEST CREATE - Réponse non-JSON:', text.substring(0, 500));
      }
      
      return response;
    } catch (error) {
      console.error('❌ TEST CREATE - Erreur:', error);
    }
  }
};