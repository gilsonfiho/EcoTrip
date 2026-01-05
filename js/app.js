import { EcoCalculator } from './calculator.js';
import { UIManager } from './ui.js';
import { getRouteDistance } from './routes-data.js';

// Inicialização da aplicação
class EcoTripApp {
    constructor() {
        this.calculator = new EcoCalculator();
        this.ui = new UIManager(this.calculator);
        this.trips = this.loadTrips();
        this.init();
    }

    init() {
        // Event listeners
        document.getElementById('tripForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Carrega histórico ao iniciar
        this.ui.updateHistoryDisplay(this.trips);
        this.ui.updateClearButton(this.trips.length > 0);

        // Torna funções globais para os botões inline do HTML
        window.resetCalculator = () => this.resetCalculator();
        window.clearHistory = () => this.clearHistory();
    }

    handleFormSubmit() {
        try {
            // Coleta dados do formulário
            const origin = document.getElementById('origin').value.trim();
            const destination = document.getElementById('destination').value.trim();
            let distance = parseFloat(document.getElementById('distance').value);
            const transport = document.getElementById('transport').value;
            const passengers = parseInt(document.getElementById('passengers').value);

            // Validações
            if (!origin || !destination) {
                this.ui.showError('Por favor, preencha origem e destino');
                return;
            }

            if (!transport) {
                this.ui.showError('Por favor, selecione um meio de transporte');
                return;
            }

            if (distance <= 0 || isNaN(distance)) {
                this.ui.showError('A distância deve ser maior que zero');
                return;
            }

            if (passengers <= 0 || isNaN(passengers)) {
                this.ui.showError('O número de passageiros deve ser maior que zero');
                return;
            }

            // Sugestão de distância baseada em rotas conhecidas
            const suggestedDistance = getRouteDistance(origin, destination);
            if (suggestedDistance && Math.abs(distance - suggestedDistance) > 100) {
                const useSupersested = confirm(
                    `A distância típica entre ${origin} e ${destination} é de aproximadamente ${suggestedDistance} km. Deseja usar este valor?`
                );
                if (useSupersested) {
                    distance = suggestedDistance;
                    document.getElementById('distance').value = distance;
                }
            }

            // Calcula emissões
            const emissions = this.calculator.calculateCO2(distance, transport, passengers);
            const impactLevel = this.calculator.getImpactLevel(emissions.perPerson);
            const recommendations = this.calculator.getRecommendations(transport);

            // Dados da viagem
            const tripData = {
                origin,
                destination,
                distance,
                transport,
                passengers,
                co2Total: emissions.total,
                co2PerPerson: emissions.perPerson,
                impactLevel: impactLevel.level,
                timestamp: new Date().toISOString()
            };

            // Salva no histórico
            this.saveTrip(tripData);

            // Exibe resultados
            this.ui.displayResults(tripData, emissions, impactLevel, recommendations);
            this.ui.addToHistory(tripData);
            this.ui.updateClearButton(true);
            this.ui.showSuccess('Cálculo realizado com sucesso!');

        } catch (error) {
            console.error('Erro ao processar formulário:', error);
            this.ui.showError(error.message || 'Erro ao calcular impacto ambiental');
        }
    }

    saveTrip(trip) {
        this.trips.push(trip);
        // Mantém apenas as últimas 50 viagens
        if (this.trips.length > 50) {
            this.trips = this.trips.slice(-50);
        }
        localStorage.setItem('ecotrip_history', JSON.stringify(this.trips));
    }

    loadTrips() {
        try {
            const stored = localStorage.getItem('ecotrip_history');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            return [];
        }
    }

    clearHistory() {
        if (this.trips.length === 0) {
            this.ui.showError('Não há histórico para limpar');
            return;
        }

        if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
            this.trips = [];
            localStorage.removeItem('ecotrip_history');
            this.ui.updateHistoryDisplay(this.trips);
            this.ui.updateClearButton(false);
            this.ui.showSuccess('Histórico limpo com sucesso!');
        }
    }

    resetCalculator() {
        this.ui.resetForm();
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new EcoTripApp();
    });
} else {
    new EcoTripApp();
}