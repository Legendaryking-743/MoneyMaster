// Dropdown animation
document.querySelectorAll(".item-header").forEach(header => {
    header.addEventListener("click", function() {
        this.parentElement.classList.toggle("active");
    });
});

// Delete confirmation
document.querySelector(".delete").addEventListener("click", function() {
    if(confirm("Are you sure you want to permanently delete your account?")) {
        alert("Deletion request sent securely.");
    }
});

// Ripple effect
document.querySelectorAll(".ripple").forEach(button => {
    button.addEventListener("click", function(e) {
        let circle = document.createElement("span");
        circle.style.position = "absolute";
        circle.style.background = "rgba(255,255,255,0.5)";
        circle.style.borderRadius = "50%";
        circle.style.width = circle.style.height = "100px";
        circle.style.left = e.offsetX - 50 + "px";
        circle.style.top = e.offsetY - 50 + "px";
        circle.style.animation = "ripple 0.6s linear";
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    });
});