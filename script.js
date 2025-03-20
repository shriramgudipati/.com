document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("#sidebar a").forEach(link => {
        link.addEventListener("click", function () {
            var title = this.getAttribute("data-title");
            document.querySelector(".menu-cont h1").textContent = title;
        });
    });
});

function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("overlay").style.display = "block";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("overlay").style.display = "none";
}
