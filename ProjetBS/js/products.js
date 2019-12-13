let form,dialog
let start = document.URL.substring(0, document.URL.indexOf("ProjetBS") + 9)
let categorySubCategory = []
let subCategoryProduct = []
let products
let categories
let subCategories
let listProductsName = []
//sessionStorage.removeItem("category")
$.ajax({
    method: "GET",
    async: "false",
    url: sourceDB + "subcategories"
}).done(function (msg) {
    subCategories = msg;

    $.ajax({
        method: "GET",
        url: sourceDB + "categories"
    }).done(function (msg) {
        categories = msg;

        $.getJSON(sourceDB + "products", { format: "json" }).done(function (msg) {
            products = msg;
            products.forEach(element => {
                listProductsName.push(element.name);
                if (categorySubCategory[element.idCategory] == undefined) {
                    categorySubCategory[element.idCategory] = [element.idSubCategory];
                }
                if (!categorySubCategory[element.idCategory].includes(element.idSubCategory)) {
                    categorySubCategory[element.idCategory].push(element.idSubCategory);
                }
                if (subCategoryProduct[element.idSubCategory] == undefined) {
                    subCategoryProduct[element.idSubCategory] = [element.id]
                }
                if (!subCategoryProduct[element.idSubCategory].includes(element.id)) {
                    subCategoryProduct[element.idSubCategory].push(element.id);
                }
            })

            $('#search').autocomplete({
                source: listProductsName
            });

            $("#megamenu").append(getMegamenu());
            let tmp = $(".mmSurvol")
            for (let index = 0; index < tmp.length; index++) {
                const element = tmp[index];
                element.addEventListener("mouseover", onSurvol)
            }

            // JS Megamenu
            "use strict";

            $('.menu > ul > li:has( > ul)').addClass('menu-dropdown-icon');
            //Checks if li has sub (ul) and adds class for toggle icon - just an UI


            $('.menu > ul > li > ul:not(:has(ul))').addClass('normal-sub');
            //Checks if drodown menu's li elements have anothere level (ul), if not the dropdown is shown as regular dropdown, not a mega menu (thanks Luka Kladaric)

            $(".menu > ul").before("<a href=\"#\" class=\"menu-mobile\">Navigation</a>");

            //Adds menu-mobile class (for mobile toggle menu) before the normal menu
            //Mobile menu is hidden if width is more then 959px, but normal menu is displayed
            //Normal menu is hidden if width is below 959px, and jquery adds mobile menu
            //Done this way so it can be used with wordpress without any trouble

            $(".menu > ul > li").hover(
                function (e) {
                    if ($(window).width() > 943) {
                        $(this).children("ul").fadeIn(150);
                        e.preventDefault();
                    }
                }, function (e) {
                    if ($(window).width() > 943) {
                        $(this).children("ul").fadeOut(150);
                        e.preventDefault();
                    }
                }
            );
            //If width is more than 943px dropdowns are displayed on hover


            //the following hides the menu when a click is registered outside
            $(document).on('click', function (e) {
                if ($(e.target).parents('.menu').length === 0)
                    $(".menu > ul").removeClass('show-on-mobile');
            });

            $(".menu > ul > li").click(function () {
                //no more overlapping menus
                //hides other children menus when a list item with children menus is clicked
                var thisMenu = $(this).children("ul");
                var prevState = thisMenu.css('display');
                $(".menu > ul > li > ul").fadeOut();
                if ($(window).width() < 943) {
                    if (prevState !== 'block')
                        thisMenu.fadeIn(150);
                }
            });
            //If width is less or equal to 943px dropdowns are displayed on click (thanks Aman Jain from stackoverflow)

            $(".menu-mobile").click(function (e) {
                $(".menu > ul").toggleClass('show-on-mobile');
                e.preventDefault();
            });
            //when clicked on mobile-menu, normal menu is shown as a list, classic rwd menu story (thanks mwl from stackoverflow)

            // A partir d'ici tout est chargé
            // Cas Index
            if (document.URL.endsWith("index.html")) {
                $.getJSON(sourceDB + "mv", { format: "json" }).done(function (msg) {
                    // Alimente #mv
                    msg.forEach(function (value) {
                        $('#mv div')[0].innerHTML += cardProductById(value)

                    })
                    corrigeLinkTypeImg();
                    corrigeLinkTypeA();
                    $('#mv .addproduct').on("click", function (e) {
                        e.preventDefault();
                        basketAddTo(e.currentTarget.attributes[2].value, 1);
                    });
                });
                $.getJSON(sourceDB + "news", { format: "json" }).done(function (msg) {
                    // Alimente #news
                    msg.forEach(function (value) {
                        $('#news div')[0].innerHTML += cardProductById(value)

                    })
                    corrigeLinkTypeImg();
                    corrigeLinkTypeA();
                    $('#news .addproduct').on("click", function (e) {
                        e.preventDefault();
                        basketAddTo(e.currentTarget.attributes[2].value, 1);
                    });
                });
                // Alimente #promo avec les articles avec remise
                for (let index = 0; index < products.length; index++) {
                    const element = products[index];
                    if (element.hasOwnProperty("discount")) {
                        $('#promo div')[0].innerHTML += cardProduct(element)
                    }

                }
                $('#promo .addproduct').on("click", function (e) {
                    e.preventDefault();
                    basketAddTo(e.currentTarget.attributes[2].value, 1);
                });

            }
            // Cas Category
            if (document.URL.indexOf("category.html") != -1) {
                let idxCategory = document.URL.indexOf("idCategory=")
                let idxSubCategory = document.URL.indexOf("idSubCategory=")
                let idCategory = -1
                let idSubCategory = -1
                if (idxCategory != -1) {
                    if (idxSubCategory != -1) {
                        idSubCategory = document.URL.substr(idxSubCategory + 14)
                        idCategory = document.URL.substr(idxCategory + 11, idxSubCategory - idxCategory - 12)
                    } else {
                        idCategory = document.URL.substr(idxCategory + 11)
                    }
                } else { idCategory = 1 }

                let active = ""
                if (idSubCategory == -1) {
                    active = " active"
                }
                $('.breadcrumb')[0].innerHTML += '<li class="breadcrumb-item' + active + '" aria-current="page"><a href="/App/category.html?idCategory=' + idCategory + '">' + getCategoryById(idCategory).name + '</a></li>'
                if (idSubCategory != -1) {
                    $('.breadcrumb')[0].innerHTML += '<li class="breadcrumb-item active" aria-current="page"><a href="/App/category.html?idCategory=' + idCategory + '&idSubCategory=' + idSubCategory + '">' + getSubCategoryById(idSubCategory).name + '</a></li>'
                }
                // Charge liste produits lié à la catégorie
                let productslist = $('#productslist')[0]
                let filter_color = []
                let filter_style = []
                products.forEach(function (value) {
                    if (value.idCategory == idCategory) {
                        if ((idSubCategory == -1) || (value.idSubCategory == idSubCategory)) {
                            productslist.innerHTML += cardProduct(value)
                            value.tags.split(" ").forEach(function (tag) {
                                if (tag.startsWith("color-") && filter_color.indexOf(tag) == -1) {
                                    filter_color.push(tag);
                                    $("#filter-color")[0].innerHTML += '<div class="form-check"><input id="' + tag + '" class="form-check-input" type="checkbox" name="" value="true"><label for="' + tag + '" class="form-check-label">' + getLabelByFilterTag(tag) + '</label></div>'
                                }
                                if (tag.startsWith("style-") && filter_style.indexOf(tag) == -1) {
                                    filter_style.push(tag);
                                    $("#filter-style")[0].innerHTML += '<div class="form-check"><input id="' + tag + '" class="form-check-input" type="checkbox" name="" value="true"><label for="' + tag + '" class="form-check-label">' + getLabelByFilterTag(tag) + '</label></div>'
                                }
                            })
                        }
                    }
                });
                $('.addproduct').on("click", function (e) {
                    e.preventDefault();
                    basketAddTo(e.currentTarget.attributes[2].value, 1);
                });
                $('fieldset :checkbox').on("change", function () {
                    let checkedCount = $("fieldset :checkbox:checked").length
                    if (checkedCount == 0) { $('#productslist .card').show() } else {
                        $('#productslist .card').hide()
                        let checked = $("#filter-color :checkbox:checked")
                        if (checked.length > 0) {
                            for (let index = 0; index < checked.length; index++) {
                                const element = checked[index];
                                $("#productslist ." + element.id).show();
                            }
                        } else { $('#productslist .card').show() }
                        checked = $("#filter-style :checkbox:checked")
                        let productsVisible = $('#productslist .card:visible')
                        if (checked.length > 0) {
                            for (let index = 0; index < productsVisible.length; index++) {
                                const product = productsVisible[index];
                                let affiche = false
                                for (let index = 0; index < checked.length; index++) {
                                    const filter = checked[index];
                                    if (product.className.indexOf(filter.id + " ") != -1) { affiche = true }
                                }
                                if (!affiche) { $(product).hide() }
                            }
                        }
                    }
                })

            }
            // Cas Product
            if (document.URL.indexOf("product.html") != -1) {
                let idxProduct = document.URL.indexOf("idProduct=")
                let idProduct = -1
                if (idxProduct != -1) {
                    idProduct = document.URL.substr(idxProduct + 10)
                } else { idProduct = 1 }
                let product = productById(idProduct);
                $("h2")[0].innerText = product.name;
                $("#price")[0].innerText = product.price + " €";
                $("#descshort")[0].innerText = product.desc_short;
                $("#desclong")[0].innerHTML = "<br><h3>Description Détaillée</h3><br>" + product.desc_long;
                $("#desclong").hide();
                $("#moredetail").on("click", function (e) {
                    e.preventDefault();
                    $("#desclong").toggle();
                    if ($("#moredetail")[0].innerText == "plus de détails") { $("#moredetail")[0].innerText = "moins de détails" } else { $("#moredetail")[0].innerText = "plus de détails" }
                })
                $(".mainpage img")[0].src = getImageProduct(product);
                for (let index = 0; index < product.nbImages; index++) {
                    $("#imgmini")[0].innerHTML += '<img src="' + getImageProduct(product, index + 1) + '" alt="" class="img-fluid imgmini">'

                }
                $("#imgmini .imgmini").on("mouseover", function (e) {
                    $(".mainpage img")[0].src = e.currentTarget.src;
                })
                let spinner = $("#qty").spinner();
                spinner.spinner("value", 1);
                $('.addproduct').attr('idProduct', idProduct)
                $('.addproduct').on("click", function (e) {
                    e.preventDefault();
                    basketAddTo(e.currentTarget.attributes[2].value, spinner.spinner("value"));
                });

            }
            // Cas Cart
            if (document.URL.indexOf("cart.html") != -1) {
                let cart = $('#cart tbody')[0]
                let total = 0
                for (let index = 0; index < basket.length; index++) {
                    const value = basket[index];
                    if (value != undefined) {
                        let product = productById(index);
                        cart.innerHTML += "<tr><td><img src='" + getImageProduct(product) + "' class='img-fluid imgmini'>" + product.name + "</td><td>" + product.price + "</td><td><input class='spinner' name='value' id='spinner-" + product.id + "' value='" + value + "'></td><td>" + product.price * value + "</td><td><input type='button' class='form-control' value='X' id='delete-product-" + product.id + "'></td></tr>"
                        total += product.price * value
                    }
                }
                cart.innerHTML += "<tr><th colspan='3' class='text-center'>Total</th><td>" + total + "</td></tr>"
                $('.spinner').spinner();
                $('#cart tbody input.form-control').on("click", function (value) {
                    basketSetTo(this.id.substring(this.id.lastIndexOf("-") + 1), 0);
                    open(document.URL, "_self")
                })
                $(".validCommande").on("click", function () { 
                    open(getCorrectURL("/App/delivery.html"), "_self") 
                })
                $('.spinner').on("change", function () {
                    let id = this.id.substring(this.id.lastIndexOf("-") + 1)
                    basketSetTo(id, this.value)
                    open(document.URL, "_self")
                })
            }
            // Cas order-detail
            if (document.URL.indexOf("order-detail.html") != -1) {
                let cart = $('#cart tbody')[0]
                let total = 0
                for (let index = 0; index < basket.length; index++) {
                    const value = basket[index];
                    if (value != undefined) {
                        let product = productById(index);
                        cart.innerHTML += "<tr><td><img src='" + getImageProduct(product) + "' class='img-fluid imgmini'>" + product.name + "</td><td>" + product.price + "</td><td>" + value + "</td><td>" + product.price * value + "</td></tr>"
                        total += product.price * value
                    }
                }
                cart.innerHTML += "<tr><th colspan='3' class='text-center'>Total</th><td>" + total + "</td></tr>"
            }
            // Cas Contact
            if (document.URL.indexOf("contact.html") != -1) {
                $("#my-email").on('change', function (e) {
                    if (!validateEmail(e.currentTarget.value)) {
                        if (!$("#my-email").hasClass("invalid")) { $("#my-email").addClass("invalid") }
                    } else {
                        $("#my-email").removeClass("invalid")
                    }
                })
                $('#Validate').on("click", function (e) {
                    let my_email = $("#my-email")[0];
                    if (!validateEmail(my_email.value)) {
                        e.preventDefault();
                        my_email.focus();

                    }
                });
            }
            // Cas Delivery
            if (document.URL.indexOf("delivery.html") != -1) {
                $(".mainpage button").on("click", function () { open(getCorrectURL("/App/payment.html"), "_self") })
            }
            // Cas customer-Infos/customer-address/customer-orders
            if (document.URL.indexOf("customer-") != -1) {
                $(".mainpage > div > div > div > button").on("click", function () {
                    switch ($(this)[0].innerText) {
                        case "Mes infos":
                            open(getCorrectURL("/App/customer-infos.html"), "_self")
                            break;

                        case "Mes adresses":
                            open(getCorrectURL("/App/customer-address.html"), "_self")
                            break;
                        default:
                            open(getCorrectURL("/App/customer-orders.html"), "_self")
                            break;
                    }
                });
                if (document.URL.indexOf("customer-infos.html") != -1) {
                    $("#my-lastname").val("Lef")
                    $("#my-firstname").val("Br")
                    $("#my-email").val("tesbien@curieux.com")
                    $("#my-ddn")[0].value = "1979-12-05"
                }
                if (document.URL.indexOf("customer-address.html") != -1) {
                    function validAddress(e) {
                        var valid = true;
                        allFields.removeClass( "ui-state-error" );
                   
                        valid = valid && checkLength( name, "username", 3, 16 );
                        valid = valid && checkLength( email, "email", 6, 80 );
                        valid = valid && checkLength( password, "password", 5, 16 );
                   
                        valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
                        valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
                        valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
                   
                        if ( valid ) {
                          $( "#users tbody" ).append( "<tr>" +
                            "<td>" + name.val() + "</td>" +
                            "<td>" + email.val() + "</td>" +
                            "<td>" + password.val() + "</td>" +
                          "</tr>" );
                          dialog.dialog( "close" );
                        }
                        return valid;
                      }

                    dialog = $("#dialog-form").dialog({
                        autoOpen: false,
                        height: 400,
                        width: 350,
                        modal: true,
                        buttons: {
                            "Mettre à jour": validAddress,
                            Fermer: function () {
                                dialog.dialog("close");
                            }
                        },
                        close: function () {
                            form[0].reset();
                            allFields.removeClass("ui-state-error");
                        }
                    });

                    form = dialog.find("form").on("submit", function (event) {
                        event.preventDefault();
                        validAddress();
                    });

                    $(".modify-address").button().on("click", function () {
                        dialog.dialog("open");
                        $(".ui-dialog-titlebar-close").hide()
                    });
                }
                $(".datepicker").datepicker({
                    dateFormat: "dd/mm/yy",
                    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                    dayNamesMin: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
                });

                $("#accordion").accordion();
                // $(".mainpage button").on("click", function () { open(getCorrectURL("/App/payment.html"),"_self")})
            }
            corrigeLinkTypeA();

            corrigeLinkTypeImg();

            corrigeLinkTypeLi();
        })
    })
})

function corrigeLinkTypeA() {
    if (!document.URL.startsWith("http")) {
        $("a").each(function () {
            let link = getCorrectURL($(this)[0].href)
            // link = link.replace(document.URL.substr(0,11), start)
            // link = link.replace("file:///U:/Partage/dwwm/projet%20ecommerce/Projet%20BS/Partage/dwwm/projet%20ecommerce/Projet%20BS/", start)
            $(this)[0].href = link
        });
    }
}

function corrigeLinkTypeImg() {
    if (!document.URL.startsWith("http")) {
        $("img").each(function () {
            let link = getCorrectURL($(this)[0].src)
            // link = link.replace(document.URL.substr(0,11), start)
            // link = link.replace("file:///U:/Partage/dwwm/projet%20ecommerce/Projet%20BS/Partage/dwwm/projet%20ecommerce/Projet%20BS/", start)
            $(this)[0].src = link
        });
    }
}

function corrigeLinkTypeLi() {
    if (!document.URL.startsWith("http")) {
        $("li[src]").each(function () {
            let link = getCorrectURL($(this).attr("src"))
            // link = link.replace(document.URL.substr(0,11), start)
            // link = link.replace("/Images", start+"/Images")
            // link = link.replace("file:///U:/Partage/dwwm/projet%20ecommerce/Projet%20BS/Partage/dwwm/projet%20ecommerce/Projet%20BS/", start)
            $(this).attr("src", link)
        });
    }
}

function getCorrectURL(url) {
    if (!document.URL.startsWith("http")) {
        if (url.indexOf("ProjetBS") == -1) { // pas de Projet BS dans le lien donc surement incorrect
            if (url.startsWith("file://")) { return start + url.substr(10) } else return start + url
        }
        return url
    }
}

function getImageProduct(product, indice) {
    if (indice == undefined) { indice = 1 }
    return "/Images/imgcat/" + getCategoryById(product.idCategory).imgPrefix + "/" + getSubCategoryById(product.idSubCategory).imgPrefix + "/" + product.id + "-" + indice + ".jpg";
}

function productById(idProduct) {
    let retour
    products.forEach(element => {
        if (element.id == idProduct) {
            retour = element;
        }
    });
    return retour;
}

function cardProductById(idProduct) {
    return cardProduct(productById(idProduct));
}

function cardProduct(product) {
    return "<a href='/App/product.html?idProduct=" + product.id + "' class=\"card w-25 " + product.tags + " \"><div class=\"card-body\"><img src=\"" + getImageProduct(product) + "\" alt=\"\" class=\"img-fluid\"><h5 class=\"card-title\">" + product.name + "</h5><p class=\"card-text\">Prix : " + product.price + " €</p><button class=\"btn btn-primary addproduct\" type=\"button\" idProduct=\"" + product.id + "\">Ajouter au Panier</button></div></a>"
}

function getCategoryById(idCategory) {
    for (const element of categories) {
        if (element.id == idCategory) {
            return element;
        }
    }
}

function getSubCategoryById(idSubCategory) {
    for (const element of subCategories) {
        if (element.id == idSubCategory) {
            return element;
        }
    }
}

function getMegamenu() {
    let megamenuhtml = "<div class=\"menu text-center row\"><ul class=\"row\">"
    for (const key in categorySubCategory) {
        if (categorySubCategory.hasOwnProperty(key)) {
            const elementSubCategoryList = categorySubCategory[key];
            const elementCategory = getCategoryById(key);
            megamenuhtml += "<li class=\"col bg-dark text-white border\"><a href='/App/category.html?idCategory=" + key + "'>" + elementCategory.name + "</a>"
            megamenuhtml += "<ul class=\"bg-dark\">"
            megamenuhtml += "<li class='w-50'>Vêtements"
            megamenuhtml += "<ul>"
            elementSubCategoryList.forEach(element => {
                const elementSubCategory = getSubCategoryById(element);
                megamenuhtml += "<li idSubCategory=\"" + element + "\" src=\"" + "/Images/imgcat/" + elementCategory.imgPrefix + "/" + elementSubCategory.imgPrefix + "/default.jpg\" class='mmSurvol' imglink=\"imgsurvol" + elementCategory.imgPrefix + "\"><a href='/App/category.html?idCategory=" + key + "&idSubCategory=" + elementSubCategory.id + "'>" + elementSubCategory.name + "</a></li>"
            });
            megamenuhtml += "</ul>"
            megamenuhtml += "</li>"
            megamenuhtml += "<li class='w-50'><img src=\"" + "/Images/imgcat/" + elementCategory.imgPrefix + "/default.jpg\" alt=\"\" class=\"img-fluid mmSurvolImg\" id=\"imgsurvol" + elementCategory.imgPrefix + "\"></li>"
        }
        megamenuhtml += "</ul>"
        megamenuhtml += "</li>"
    }
    megamenuhtml += "</ul>"
    megamenuhtml += "</div>"
    return megamenuhtml;
};

function onSurvol() {
    let src = $(this)
    let tmp = $("#" + src.attr('imglink'))[0]
    tmp.src = src.attr('src')
}

let basket = []
if (sessionStorage.getItem("basket") != undefined) // on a un panier défini en session
{
    basket = JSON.parse(sessionStorage.getItem("basket"));
}

function basketGetQuantityItems() {
    let total = 0
    basket.forEach(function (value) { total += value['quantity'] })
    return total;
}

function basketAddTo(idProduct, quantity) {
    if (basket[idProduct] == undefined) { basket[idProduct] = quantity } else { basket[idProduct] += quantity }
    let s = ""
    if (quantity > 1) { s = "s" }
    alert(quantity + " Produit " + productById(idProduct).name + " ajouté" + s + " au panier.")
    sessionStorage.setItem("basket", JSON.stringify(basket))
}

function basketSetTo(idProduct, quantity) {
    basket[idProduct] = quantity;
    if (quantity == 0) { basket[idProduct] = undefined; alert("Produit " + productById(idProduct).name + " supprimé du panier.") }
    sessionStorage.setItem("basket", JSON.stringify(basket))
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function getLabelByFilterTag(tag) {
    switch (tag) {
        case "color-bleu":
            return "Bleu"
            break;
        case "color-beige":
            return "Beige"
            break;
        case "color-noir":
            return "Noir"
            break;
        case "color-aqua":
            return "Aqua"
            break;
        case "color-rouge":
            return "Rouge"
            break;
        case "color-bleu-marine":
            return "Bleu Marine"
            break;
        case "color-blanc":
            return "Blanc"
            break;
        case "color-gris":
            return "Gris"
            break;
        case "style-uni":
            return "Uni"
            break;
        case "style-raye":
            return "Rayé"
            break;
        case "style-motif":
            return "Avec motif"
            break;
        case "style-image":
            return "Avec image"
            break;
        case "style-ecriture":
            return "Avec écriture"
            break;
        default:
            return tag;
            break;
    }
}