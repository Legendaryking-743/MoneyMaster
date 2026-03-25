(function () {
    // Éléments de l'interface
    const soldeSpan        = document.getElementById('soldeDisplay');
    const depenseMontantSpan = document.getElementById('depenseMontant');
    const epargneSpan      = document.getElementById('epargneMontant');
    const revenuInfoDiv    = document.getElementById('revenuInfo');
    const statutMsg        = document.getElementById('statutMessage');
    const nameDisplay      = document.querySelector('.user_name');
    const welcomeName      = document.querySelector('.highlight');

    function refreshHome() {
        // 1. SYNCHRONISATION DU PROFIL
        const savedName = localStorage.getItem('mm_user_name') || 'Utilisateur';
        if (nameDisplay) nameDisplay.innerText = savedName;
        if (welcomeName) welcomeName.innerText = savedName;

        // 2. CALCUL DES FINANCES
        const entries = JSON.parse(localStorage.getItem('gp_entries') || '[]');

        const totalGains = entries.filter(e => e.type === 'gain').reduce((s, e) => s + e.amount, 0);
        const totalLoss  = entries.filter(e => e.type === 'loss').reduce((s, e) => s + e.amount, 0);
        const net        = totalGains - totalLoss;

        if (soldeSpan)
            soldeSpan.innerHTML = `${totalGains.toLocaleString(undefined, {minimumFractionDigits: 2})} <span class="currency">Ar</span>`;
        if (depenseMontantSpan)
            depenseMontantSpan.innerHTML = `${totalLoss.toLocaleString(undefined, {minimumFractionDigits: 2})} <span class="currency">Ar</span>`;
        if (epargneSpan)
            epargneSpan.innerHTML = `${net.toLocaleString(undefined, {minimumFractionDigits: 2})} <span class="currency">Ar</span>`;

        // 3. STATUT
        if (statutMsg) {
            if (net < 0) {
                statutMsg.innerHTML   = '⚠ Attention : Déficit détecté';
                statutMsg.style.color = '#ff4d6d';
            } else if (net > 0) {
                statutMsg.innerHTML   = '😎 Situation stable';
                statutMsg.style.color = '#00ffaa';
            } else {
                statutMsg.innerHTML = '';
            }
        }

        // 4. DÉTAILS DES REVENUS
        if (revenuInfoDiv) {
            const categories = {};
            entries.filter(e => e.type === 'gain').forEach(e => {
                categories[e.label] = (categories[e.label] || 0) + e.amount;
            });

            const keys = Object.keys(categories);
            if (keys.length === 0) {
                revenuInfoDiv.innerHTML = '<div class="empty-placeholder">Aucune donnée de revenu</div>';
            } else {
                revenuInfoDiv.innerHTML = '';
                keys.forEach(label => {
                    const val = categories[label];
                    const pct = totalGains > 0 ? (val / totalGains) * 100 : 0;
                    const bloc = document.createElement('div');
                    bloc.className = 'source';
                    bloc.innerHTML = `
                        <div class="source-header">
                            <p>${label}</p>
                            <p class="after">${pct.toFixed(0)}%</p>
                        </div>
                        <p style="font-size:0.9rem;font-weight:600;margin-bottom:5px;">${val.toLocaleString()} Ar</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${pct}%"></div>
                        </div>
                    `;
                    revenuInfoDiv.appendChild(bloc);
                });
            }
        }
    }

    // Exécuter au chargement
    refreshHome();

    // Écouter les changements depuis d'autres onglets ou pages
    window.addEventListener('storage', refreshHome);
    window.addEventListener('focus',   refreshHome);
})();
