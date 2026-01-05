import { config } from './config.js';

// Classe principal do calculador
export class EcoCalculator {
    constructor() {
        this.config = config;
    }

    // Calcula emissões totais de CO2
    calculateCO2(distance, transport, passengers = 1) {
        const emissionFactor = this.config.emissionFactors[transport];

        if (emissionFactor === undefined) {
            throw new Error('Meio de transporte inválido');
        }

        const totalEmissions = distance * emissionFactor;
        const emissionsPerPerson = totalEmissions / passengers;

        return {
            total: totalEmissions,
            perPerson: emissionsPerPerson,
            transport: transport,
            distance: distance,
            passengers: passengers
        };
    }

    // Determina o nível de impacto ambiental
    getImpactLevel(emissionsPerPerson) {
        const { impactLevels } = this.config;

        if (emissionsPerPerson <= impactLevels.low.max) {
            return { level: 'low', label: impactLevels.low.label };
        } else if (emissionsPerPerson <= impactLevels.medium.max) {
            return { level: 'medium', label: impactLevels.medium.label };
        } else {
            return { level: 'high', label: impactLevels.high.label };
        }
    }

    // Gera recomendações baseadas no transporte
    getRecommendations(transport) {
        return this.config.recommendations[transport] || [];
    }

    // Obtém nome do transporte em português
    getTransportName(transport) {
        return this.config.transportNames[transport] || transport;
    }

    // Calcula equivalências interessantes
    getComparisons(co2Amount) {
        const { comparisons } = this.config;

        return {
            treesNeeded: Math.ceil(co2Amount * comparisons.treesNeeded),
            kmCarEquivalent: Math.round(co2Amount * comparisons.kmCar)
        };
    }

    // Compara diferentes meios de transporte para a mesma viagem
    compareTransports(distance, passengers = 1) {
        const results = {};

        for (const transport in this.config.emissionFactors) {
            const emissions = this.calculateCO2(distance, transport, passengers);
            results[transport] = {
                name: this.getTransportName(transport),
                total: emissions.total,
                perPerson: emissions.perPerson,
                impact: this.getImpactLevel(emissions.perPerson)
            };
        }

        return results;
    }

    // Calcula estatísticas gerais
    calculateStatistics(trips) {
        if (!trips || trips.length === 0) {
            return null;
        }

        const totalCO2 = trips.reduce((sum, trip) => sum + trip.co2Total, 0);
        const avgCO2 = totalCO2 / trips.length;
        const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);

        const transportCount = {};
        trips.forEach(trip => {
            transportCount[trip.transport] = (transportCount[trip.transport] || 0) + 1;
        });

        const mostUsed = Object.entries(transportCount)
            .sort((a, b) => b[1] - a[1])[0];

        return {
            totalTrips: trips.length,
            totalCO2: totalCO2,
            averageCO2: avgCO2,
            totalDistance: totalDistance,
            mostUsedTransport: mostUsed ? this.getTransportName(mostUsed[0]) : 'N/A',
            comparisons: this.getComparisons(totalCO2)
        };
    }

    // Formata valores de CO2 para exibição
    formatCO2(value) {
        if (value < 1) {
            return `${(value * 1000).toFixed(0)} g`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(2)} toneladas`;
        } else {
            return `${value.toFixed(2)} kg`;
        }
    }
}