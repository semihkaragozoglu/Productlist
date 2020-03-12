const productHelper = (function () {
    var $categories = document.getElementById('js-categories');
    var $products = document.getElementById('js-products');
    var categories = [];
    var products = [];
    var categoryId;
    var page;

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }

    const readFromUrl = (
        function () {
            // read from url
            categoryId = getUrlParameter("categoryId") ? parseInt(getUrlParameter("categoryId"))  : 1;
            page = getUrlParameter("page") ? parseInt(getUrlParameter("page")) : 1;
            getProducts();
        }
    )();

    const getCategories = (function () {
        fetch('assets/custom/js/data/categories.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                categories = data;
                renderCategories();
            });
    })();

    function getProducts() {
        fetch('assets/custom/js/data/products.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // kategoriye göre filtrele
                // ilgili sayfayı getir
                products = data.filter(x=> x.categoryId === categoryId).slice(0, 16);
                renderProducts();
                console.log(data);
            });
    }

    function createCategoryItem(item) {
        var link = document.createElement('a');
        link.classList.add("category-item");
        link.href="?categoryId=" + item.id;
        if (categoryId === item.id) {
            link.classList.add("active");
        }
        link.onclick = function () {
            test();
        }
        link.innerText = item.name;
        if (item.count && item.count > 0) {
            var count = document.createElement('span');
            count.innerText = "(" + item.count + ")";
            link.append(count);
        }
        return link;
    }

    function renderCategories() {
        $categories.innerHTML = "";
        categories.map(function (item, i) {
            $categories.append(createCategoryItem(item));
        });
    }

    function createProductLoadingItem() {
        var listitem = document.createElement('div');
        listitem.classList.add("list-item");
        var content = document.createElement('div');
        content.classList.add('list-item-content');
        content.classList.add("skeleton-box");
        listitem.append(content);
        return listitem;
    }

    const renderProductsLoading = (function () {
        $products.innerHTML = "";
        for (i = 0; i < 16; i++) {
            $products.append(createProductLoadingItem());
        }
    })();

    function createProduct(product) {
        var listitem = document.createElement('div');
        listitem.classList.add("list-item");
        var content = document.createElement('div');
        content.classList.add('list-item-content');

        var itemImgWrapper = document.createElement('div');
        itemImgWrapper.classList.add('item-img-wrapper');
        var img = document.createElement('img');
        img.alt = product.imgDesc;
        // img.src = product.img;
        img.src = '../assets/img/'+ product.img;
        itemImgWrapper.append(img);
        content.append(itemImgWrapper);

        var itemDescription = document.createElement('div');
        itemDescription.classList.add("item-description");
        var mainDesc = document.createElement('div');
        mainDesc.innerText = product.name;
        mainDesc.classList.add("main-desc");
        itemDescription.append(mainDesc);

        var priceWrapper = document.createElement('div');
        priceWrapper.classList.add("price-wrapper"); 

        var priceBase = document.createElement('div');
        priceBase.classList.add("price-base");
        var discount = document.createElement('div');
        discount.classList.add("discount");
        discount.innerText = "%" + (product.discountPercentage * 100);
        priceBase.append(discount);
        var price = document.createElement('div');
        price.classList.add("price");
        var priceRaw = document.createElement('div');
        priceRaw.classList.add("price-raw");
        priceRaw.innerText = product.basePrice + " " +product.currency;
        price.append(priceRaw);
        var priceCalculated = document.createElement('div');
        priceCalculated.classList.add("price-calculated");
        priceCalculated.innerText = (product.basePrice * (1 - product.discountPercentage)).toString().replace(".",",") + " " +product.currency;
        if(product.discountPercentage2 !== 0)
        {
            priceCalculated.classList.add("multiple-discount")
        }
        price.append(priceCalculated);
        priceBase.append(price); 
        priceWrapper.append(priceBase);  
        if(product.discountPercentage2 !== 0){
            var specialDiscount = document.createElement('div');
            specialDiscount.classList.add("special-discount");
            var specialDiscountDesc = document.createElement('div');
            specialDiscountDesc.classList.add("discount-desc");
            specialDiscountDesc.innerHTML = "Sepette %<b>"+  (product.discountPercentage2 * 100) +"</b> indirimli fiyat";
            specialDiscount.append(specialDiscountDesc);
            var priceFinal = document.createElement('div');
            priceFinal.classList.add("price-final");
            priceFinal.innerText = (product.basePrice * (1 - product.discountPercentage) * (1 - product.discountPercentage2)).toString().replace(".",",");
            var priceFinalCurrency = document.createElement('span');
            priceFinalCurrency.classList.add('currency');
            priceFinalCurrency.innerText = product.currency;
            priceFinal.append(priceFinalCurrency);
            specialDiscount.append(priceFinal);
            priceWrapper.append(specialDiscount);
        }   

        if(product.misc){
            var misc = document.createElement('div');
            misc.classList.add("misc");
            misc.innerText = product.misc;
            priceWrapper.append(misc);
        }
    
        itemDescription.append(priceWrapper);
        content.append(itemDescription);
        listitem.append(content);
        return listitem;
    }

    function renderProducts() {
        // loading ekranı belirmesi amacıyla yavaşlatma eklenildi
        setTimeout(() => {
            $products.innerHTML = ""; 
            products.map(function (item, i) {
                $products.append(createProduct(item));
            });    
        }, 2000);
    }

    function toggleType(type) {
        if(type === 1)
        {
            $("#js-products").addClass("type-fourway");
            $("#js-products").removeClass("type-threeway");
            $(".type-fourway").addClass("active");
            $(".type-threeway").removeClass("active");
        }
        else{
            $("#js-products").removeClass("type-fourway");
            $("#js-products").addClass("type-threeway");
            $(".type-fourway").removeClass("active");
            $(".type-threeway").addClass("active");
        }
    }
 
    return {
        toggleType 
    }
})()