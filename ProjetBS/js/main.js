$(function () {
    // Header
    $("header").load("/App/header.html");
    $("header").addClass("row");
    // let tmp = $("header img")
    // for (let index = 0; index < tmp.length; index++) {
    //     const element = tmp[index];
    //     if (document.URL.indexOf("index.html") == -1) {
    //         if (document.URL.startsWith("file:///U:/Partage/dwwm/projet%20ecommerce/Projet%20BS/")) {
    //             element.src = "file:///U:/Partage/dwwm/projet%20ecommerce/Projet%20BS/" + element.src.substr(55)
    //         } else {
    //             element.src = "../" + element.src
    //         }
    //     }
    // }
    // Megamenu
    //$("#megamenu").load("App/megamenu.html");
    // index
    $("#blocmvpn").tabs();

    // Footer
    $("footer").load("/App/footer.html");
    $("footer").addClass("container-fluid");
    // tmp = $("footer img")
    // for (let index = 0; index < tmp.length; index++) {
    //     const element = tmp[index];
    //     if (document.URL.indexOf("index.html") == -1) {
    //         if (document.URL.startsWith("file:///U:/Partage/dwwm/projet%20ecommerce/Projet%20BS/")) {
    //             element.src = "file:///U:/Partage/dwwm/projet%20ecommerce/Projet%20BS/" + element.src.substr(55)
    //         } else {
    //             element.src = "../" + element.src
    //         }
    //     }
    // }
});


const sourceDB = "https://my-json-server.typicode.com/DragoonWise/AFPA_Project_Ecommerce/"

