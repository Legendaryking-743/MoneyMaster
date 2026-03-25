// ===== Sélecteurs =====
const inputBox        = document.getElementById("inputBox");
const listContainer   = document.getElementById("list-container");
const checkedContainer= document.getElementById("checked-container");
const prixInput       = document.getElementById("prix");
const budgetInput     = document.getElementById("budgetInput");
const totalSpan       = document.getElementById("totalSpan");
const resteSpan       = document.getElementById("resteSpan");
const resteCard       = document.getElementById("resteCard");
const labelActif      = document.getElementById("labelActif");
const labelCoche      = document.getElementById("labelCoche");

// ===== Ajouter une dépense =====
function Addtask() {
    const nom  = inputBox.value.trim();
    const prix = parseFloat(prixInput.value);

    if (nom === '') {
        secourir(inputBox, "Écris une description !");
        return;
    }
    if (isNaN(prix) || prix < 0) {
        secourir(prixInput, "Entre un prix valide !");
        return;
    }

    const li = creerItem(nom, prix);
    listContainer.appendChild(li);

    inputBox.value = "";
    prixInput.value = "";
    inputBox.focus();

    majAffichage();
}

// ===== Créer un élément <li> =====
function creerItem(nom, prix) {
    const li = document.createElement("li");

    // Stocke le prix dans un attribut data pour le calcul
    li.dataset.prix = prix;

    const spanNom = document.createElement("span");
    spanNom.className = "li-nom";
    spanNom.textContent = nom;

    const spanPrix = document.createElement("span");
    spanPrix.className = "li-prix";
    spanPrix.textContent = formatPrix(prix);

    const btnSuppr = document.createElement("button");
    btnSuppr.className = "delete-btn";
    btnSuppr.innerHTML = "&times;";
    btnSuppr.title = "Supprimer";

    li.appendChild(spanNom);
    li.appendChild(spanPrix);
    li.appendChild(btnSuppr);

    return li;
}

// ===== Formater un prix =====
function formatPrix(v) {
    return Number(v).toLocaleString('fr-FR') + " Ar";
}

// ===== Clic sur liste active =====
listContainer.addEventListener("click", function(e) {
    const li = e.target.closest("li");
    if (!li) return;

    // Supprimer
    if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")) {
        li.remove();
        majAffichage();
        return;
    }

    // Cocher → déplacer vers "effectuées"
    li.classList.add("checked");
    checkedContainer.appendChild(li);
    majAffichage();
});

// ===== Clic sur liste cochée =====
checkedContainer.addEventListener("click", function(e) {
    const li = e.target.closest("li");
    if (!li) return;

    // Supprimer
    if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")) {
        li.remove();
        majAffichage();
        return;
    }

    // Décocher → remettre dans "en cours"
    li.classList.remove("checked");
    listContainer.appendChild(li);
    majAffichage();
});

// ===== Recalcul du total =====
function calculerTotal() {
    let total = 0;

    // Tous les li des DEUX conteneurs
    const tousLesItems = document.querySelectorAll("#list-container li, #checked-container li");

    tousLesItems.forEach(function(li) {
        const val = parseFloat(li.dataset.prix);
        if (!isNaN(val)) total += val;
    });

    return total;
}

// ===== Mise à jour de l'affichage total + reste =====
function majAffichage() {
    const total  = calculerTotal();
    const budget = parseFloat(budgetInput.value);

    totalSpan.textContent = formatPrix(total);

    if (!isNaN(budget) && budget > 0) {
        const reste = budget - total;
        resteSpan.textContent = formatPrix(reste);
        resteCard.classList.toggle("danger", reste < 0);
    } else {
        resteSpan.textContent = "— Ar";
        resteCard.classList.remove("danger");
    }

    // Afficher / masquer les labels de section
    labelActif.style.display = listContainer.children.length > 0 ? "block" : "none";
    labelCoche.style.display = checkedContainer.children.length > 0 ? "block" : "none";
}

// ===== Mise à jour quand le budget change =====
budgetInput.addEventListener("input", majAffichage);

// ===== Ajouter avec la touche Entrée =====
inputBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter") Addtask();
});
prixInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") Addtask();
});

// ===== Animation secousse pour erreur =====
function secourir(el, msg) {
    el.style.outline = "2px solid #ef4444";
    el.placeholder = msg;
    el.classList.add("shake");
    setTimeout(() => {
        el.style.outline = "";
        el.placeholder = el === inputBox ? "Description de la dépense…" : "Prix";
        el.classList.remove("shake");
    }, 1500);
}
