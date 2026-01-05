// Configurações do EcoTrip Calculator

export const config = {
    // Fatores de emissão de CO2 em kg por km
    emissionFactors: {
        car: 0.192,      // Carro a gasolina
        bus: 0.089,      // Ônibus convencional
        train: 0.041,    // Trem elétrico
        plane: 0.255,    // Avião comercial
        bike: 0          // Bicicleta (zero emissões)
    },

    // Nomes dos transportes em português
    transportNames: {
        car: 'Carro',
        bus: 'Ônibus',
        train: 'Trem',
        plane: 'Avião',
        bike: 'Bicicleta'
    },

    // Níveis de impacto baseados em emissões por pessoa
    impactLevels: {
        low: { max: 10, label: 'Baixo' },
        medium: { max: 50, label: 'Médio' },
        high: { max: Infinity, label: 'Alto' }
    },

    // Recomendações por tipo de transporte
    recommendations: {
        car: [
            'Considere fazer carona solidária para dividir as emissões',
            'Verifique a manutenção do veículo para melhor eficiência',
            'Planeje rotas mais eficientes para reduzir o consumo',
            'Considere um veículo elétrico ou híbrido para viagens futuras'
        ],
        bus: [
            'Ótima escolha! O ônibus é mais eficiente que carros individuais',
            'Prefira empresas com frotas mais modernas e eficientes',
            'Combine com outros meios de transporte sustentável'
        ],
        train: [
            'Excelente escolha! O trem é um dos meios mais sustentáveis',
            'Trens elétricos têm menor impacto ambiental',
            'Continue optando por transporte ferroviário quando possível'
        ],
        plane: [
            'Considere alternativas terrestres para distâncias menores',
            'Voos diretos emitem menos CO2 que voos com escalas',
            'Compense suas emissões através de projetos ambientais',
            'Agrupe suas viagens aéreas quando possível'
        ],
        bike: [
            'Parabéns! Você escolheu o meio de transporte mais sustentável',
            'Continue promovendo a mobilidade ativa e saudável',
            'Inspire outros a adotar a bicicleta como meio de transporte'
        ]
    },

    // Comparações interessantes
    comparisons: {
        treesNeeded: 0.021, // Árvores necessárias para compensar 1kg CO2/ano
        kmCar: 5.2          // Km equivalente em carro médio por kg CO2
    }
};