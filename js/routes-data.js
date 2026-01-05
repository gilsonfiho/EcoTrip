// Dados de rotas populares no Brasil (em km)

export const popularRoutes = {
    // São Paulo
    'sao paulo-rio de janeiro': 430,
    'sao paulo-belo horizonte': 586,
    'sao paulo-curitiba': 408,
    'sao paulo-brasilia': 1015,
    'sao paulo-salvador': 1962,
    'sao paulo-fortaleza': 3025,
    'sao paulo-porto alegre': 1109,
    
    // Rio de Janeiro
    'rio de janeiro-belo horizonte': 434,
    'rio de janeiro-brasilia': 1148,
    'rio de janeiro-salvador': 1649,
    'rio de janeiro-curitiba': 852,
    
    // Belo Horizonte
    'belo horizonte-brasilia': 716,
    'belo horizonte-salvador': 1372,
    'belo horizonte-curitiba': 1004,
    
    // Outras rotas importantes
    'brasilia-goiania': 209,
    'brasilia-salvador': 1446,
    'brasilia-fortaleza': 2200,
    'salvador-fortaleza': 1389,
    'salvador-recife': 839,
    'fortaleza-recife': 800,
    'curitiba-florianopolis': 300,
    'curitiba-porto alegre': 711,
    'porto alegre-florianopolis': 476
};

// Função para buscar distância de rota
export function getRouteDistance(origin, destination) {
    const key1 = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
    const key2 = `${destination.toLowerCase()}-${origin.toLowerCase()}`;
    
    return popularRoutes[key1] || popularRoutes[key2] || null;
}

// Função para normalizar nomes de cidades
export function normalizeCityName(city) {
    return city
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .trim();
}

// Sugestões de rotas
export function suggestRoutes(city) {
    const normalized = normalizeCityName(city);
    const suggestions = [];
    
    for (const route in popularRoutes) {
        if (route.includes(normalized)) {
            const cities = route.split('-');
            const otherCity = cities.find(c => c !== normalized);
            if (otherCity) {
                suggestions.push({
                    destination: otherCity,
                    distance: popularRoutes[route]
                });
            }
        }
    }
    
    return suggestions;
}