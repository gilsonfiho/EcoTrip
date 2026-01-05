// Gerenciamento da interface do usuário

export class UIManager {
    constructor(calculator) {
        this.calculator = calculator;
    }

    // Exibe resultados do cálculo
    displayResults(tripData, emissions, impactLevel, recommendations) {
        const resultsSection = document.getElementById('results');

        // Preenche os dados
        document.getElementById('routeDisplay').textContent =
            `${tripData.origin} → ${tripData.destination}`;

        document.getElementById('transportDisplay').textContent =
            this.calculator.getTransportName(tripData.transport);

        document.getElementById('distanceDisplay').textContent =
            `${tripData.distance} km`;

        document.getElementById('co2Display').textContent =
            this.calculator.formatCO2(emissions.total);

        document.getElementById('co2PerPerson').textContent =
            this.calculator.formatCO2(emissions.perPerson);

        // Nível de impacto
        const impactBadge = document.getElementById('impactLevel');
        impactBadge.textContent = impactLevel.label;
        impactBadge.className = `badge ${impactLevel.level}`;

        // Recomendações
        const recList = document.getElementById('recommendationsList');
        recList.innerHTML = recommendations
            .map(rec => `<li>${rec}</li>`)
            .join('');

        // Mostra a seção de resultados
        resultsSection.classList.remove('hidden');

        // Scroll suave até os resultados
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Adiciona item ao histórico
    addToHistory(trip) {
        const historyContainer = document.getElementById('history');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        const date = new Date().toLocaleString('pt-BR');
        const transportName = this.calculator.getTransportName(trip.transport);
        const co2Formatted = this.calculator.formatCO2(trip.co2Total);

        historyItem.innerHTML = `
            <p><strong>🕒 ${date}</strong></p>
            <p>📍 ${trip.origin} → ${trip.destination}</p>
            <p>🚗 ${transportName} | 📏 ${trip.distance} km</p>
            <p>🌱 Emissões: ${co2Formatted} (${this.calculator.formatCO2(trip.co2PerPerson)}/pessoa)</p>
        `;

        historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    }

    // Atualiza exibição do histórico completo
    updateHistoryDisplay(trips) {
        const historyContainer = document.getElementById('history');
        historyContainer.innerHTML = '';

        if (trips.length === 0) {
            historyContainer.innerHTML = '<p style="text-align: center; color: #999;">Nenhuma viagem registrada ainda.</p>';
            return;
        }

        trips.reverse().forEach(trip => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const date = new Date(trip.timestamp).toLocaleString('pt-BR');
            const transportName = this.calculator.getTransportName(trip.transport);
            const co2Formatted = this.calculator.formatCO2(trip.co2Total);

            historyItem.innerHTML = `
                <p><strong>🕒 ${date}</strong></p>
                <p>📍 ${trip.origin} → ${trip.destination}</p>
                <p>🚗 ${transportName} | 📏 ${trip.distance} km | 👥 ${trip.passengers} passageiro(s)</p>
                <p>🌱 Emissões: ${co2Formatted} (${this.calculator.formatCO2(trip.co2PerPerson)}/pessoa)</p>
            `;

            historyContainer.appendChild(historyItem);
        });
    }

    // Mostra mensagem de erro
    showError(message) {
        alert(`❌ Erro: ${message}`);
    }

    // Mostra mensagem de sucesso
    showSuccess(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = `✓ ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Reseta o formulário
    resetForm() {
        document.getElementById('tripForm').reset();
        document.getElementById('results').classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Atualiza botão de limpar histórico
    updateClearButton(hasHistory) {
        const clearButton = document.getElementById('clearHistory');
        if (clearButton) {
            clearButton.style.display = hasHistory ? 'block' : 'none';
        }
    }
}

// Adiciona animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);