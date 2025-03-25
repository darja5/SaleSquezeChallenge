"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const product_1 = require("./product");
class Cart {
    //a more bit tle private
    //private catalog: any[] = productsCatalog;
    //kakšnga tipa je carttextvalues
    constructor(products, totalPrice, taxValues, catalog) {
        this.products = products;
        this.totalPrice = totalPrice;
        this.taxValues = taxValues;
        this.catalog = catalog;
    }
    printCatalog() {
        console.log(this.catalog);
    }
    /* createCatalogWithAdditionalFields(catalog : any[]) : void {
        let cat =  catalog.map((item: any) => {
            item["atributes"].map((att : Map<string, any>)=> {
                att.set("required", false);
                att.set("disabled", false);
            });
        });
        this.catalog = cat;
    } */
    //Adds a product to the cart by its catalog key
    addProduct(productKey, quantity) {
        // dodam total price in tax v tax.
        //test: če je prazen katalog
        //if catalog has any products and the product was not privously added to the cart
        //ali bi mogu imet ta product v mapu Product type?
        //mogoče bi tu nastavila v katalogu od tega produkta
        let productExistsInCatalog = false;
        if (this.catalog.length > 0) {
            this.catalog.map(productCatalog => {
                if (productCatalog.key === productKey) {
                    productExistsInCatalog = true;
                    /*let existingProductInCart = this.products.find((productCart: Product)=>
                        productCart.getProductKey === productKey);
                    
                     if(existingProductInCart){
                        
                        //if product already exists in cart then adjust the quantity and price
                        existingProductInCart.setProductQuantity = existingProductInCart.getProductQuantity + quantity;
                        this.totalPrice += existingProductInCart.getProductPrice * quantity;
                    }
                    //add new product to the cart
                    else { */
                    let newProduct = new product_1.Product(productKey, productCatalog.title, productCatalog.price, productCatalog.tax, quantity, {});
                    this.products.push(newProduct);
                    this.totalPrice = this.totalPrice + productCatalog.price * quantity;
                    let calculatedTax = (productCatalog.tax * productCatalog.price * quantity / 100);
                    //this.taxValues = {...this.taxValues, [productCatalog.tax]: calculatedTax};
                    this.setNewTaxValues();
                    //}
                }
            });
        }
        if (!productExistsInCatalog)
            console.log("Error adding a product: Product key not found in catalog.");
    }
    //Removes a product from the cart by its line item index.
    removeProduct(cartIndex) {
        //je mišljeno sploh tko kot si jst predstavljam, da se ti seštevajo kr v cartu isti produkti, al bolj ne?
        const productToBeRemoved = this.products[cartIndex];
        console.log(productToBeRemoved.getProductTitle);
        this.totalPrice -= productToBeRemoved.getProductPrice * productToBeRemoved.getProductQuantity;
        this.products.splice(cartIndex, 1);
        this.setNewTaxValues();
    }
    //ta bo rekurzivna
    calculateCondition(condition, index) {
        console.log("rekurzija");
        console.log(condition.type, condition.key, condition.compareValue, condition.operator);
        if (condition.type == "attribute") {
            //console.log(this.toJson());
            let attributeKey = condition.key;
            let conditionAttributeValue = this.products[index].getProductAttributes[condition.key];
            switch (condition.operator) {
                case "gte": {
                    if (conditionAttributeValue >= condition.compareValue) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                case "eq": {
                    if (conditionAttributeValue === condition.compareValue) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                case "includes": {
                    if (conditionAttributeValue.includes(condition.compareValue)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        return false;
    }
    setNewTaxValues() {
        //ni idealno, mogl bi se grupirat po tax ratu - je  okej ker tak način dodajanja taxov prepiše tax z istim keyem
        let newTaxValues = [];
        this.products.map(product => {
            let newTaxValue = product.getProductPrice * product.getProductQuantity * product.getProductTax / 100;
            let newTax = product.getProductTax;
            /* if(Object.keys(this.taxValues).includes(newTax.toString())){
                let existingValueOfTax = this.taxValues[newTax];
                newTaxValue += existingValueOfTax;
            } */
            newTaxValues.push({ [newTax]: newTaxValue });
        });
        /*  for (let i = 0; i<newTaxValues.length ;i++) {
             let deleted = false;
             for (let j = i+1; j<newTaxValues.length ;j++) {
                 if(Object.keys(newTaxValues)[i] === Object.keys(newTaxValues)[j]) {
                     deleted = true;
                     let key = Object.keys(newTaxValues)[i];
                     newTaxValues[i][key] += Object.values(Object.values(newTaxValues)[i])[0];
                     newTaxValues.splice(j);
                     j--;
                 }
             }
             if(deleted) i--;
         } */
        //this.taxValues = Object.assign({}, ...newTaxValues);
        this.taxValues = newTaxValues;
    }
    applyOutComes(outcomes, index) {
        console.log("outcomes", outcomes);
        let product = this.products[index];
        outcomes.map(outcome => {
            switch (outcome.type) {
                case "attribute": {
                    //loh je tudi false?
                    if (outcome.disabled != undefined && outcome.disabled) {
                        //let exists = false;
                        this.products[index].setProductAttributes = Object.assign(Object.assign({}, this.products[index].getProductAttributes), { [outcome.key]: null });
                    }
                    else if (outcome.required != undefined && outcome.required) {
                        //gre iskat default value in ga da v attributes
                        let defaultValue;
                        this.products[index].setProductAttributes = Object.assign(Object.assign({}, this.products[index].getProductAttributes), { [outcome.key]: null });
                    }
                    break;
                    /* let newProductAttributes = product.getProductAttributes.map((att :any) => {
                        if (outcome.key === att.key) return {[att]:null};
                        else
                    }) */
                    //key, disabled, required
                    //če disabled
                    //če obstaja ga popravi, če ne ga dopiši atributom
                }
                case "price": {
                    //value
                    let oldPrice = product.getProductPrice * product.getProductQuantity;
                    product.setProductPrice = outcome.value;
                    this.totalPrice = this.totalPrice - oldPrice + outcome.value * product.getProductQuantity;
                    this.setNewTaxValues();
                    break;
                }
                case "tax": {
                    product.setProductTax = outcome.value;
                    this.setNewTaxValues();
                    break;
                }
            }
        });
    }
    //Updates an attribute value for a specific product in the cart based on its line item index. 
    //This should validate rules and update the cart accordingly (e.g., disable attributes, apply price changes).
    setAttributeValue(cartIndex, attributeKey, value) {
        var _a, _b;
        const targetCartProduct = this.products[cartIndex];
        //check if value and atributeKey are valid parameters
        let targetCatalogProduct = this.catalog.find(element => element.key === targetCartProduct.getProductKey);
        let productAttributeWithValue = targetCatalogProduct.attributes.find((attribute) => attribute.key === attributeKey);
        if (((_a = productAttributeWithValue === null || productAttributeWithValue === void 0 ? void 0 : productAttributeWithValue.values) === null || _a === void 0 ? void 0 : _a.includes(value)) || ((_b = productAttributeWithValue === null || productAttributeWithValue === void 0 ? void 0 : productAttributeWithValue.values) === null || _b === void 0 ? void 0 : _b.includes(value)) === undefined) {
            targetCartProduct.setProductAttributes = Object.assign(Object.assign({}, targetCartProduct.getProductAttributes), { [attributeKey]: value });
        }
        else {
            console.log("Error in setAttributeValue, given attribute or attribute value are not valid.");
        }
        //check if there are attributes that are dependant on this added attribute and add them (if all dependant values are added)
        let dependantAttributes = [];
        targetCatalogProduct.attributes.map((att) => {
            var _a;
            if (att.key != attributeKey && ((_a = att.dependsOn) === null || _a === void 0 ? void 0 : _a.includes(attributeKey))) {
                dependantAttributes = [...dependantAttributes, att];
            }
        });
        dependantAttributes && dependantAttributes.map((attr) => {
            let script = attr.script;
            attr.dependsOn.map((attName) => {
                let prodAttValue = targetCartProduct.getProductAttributes[attName];
                script = script.replace(attName, prodAttValue);
            });
            let newValueCalculated = eval(script);
            isNaN(newValueCalculated) ?
                console.log("Error calculating the script, possibly missing attribute value.") :
                this.setAttributeValue(cartIndex, attr.key, newValueCalculated);
        });
        //gre v rules od tega produkta, jih prebere in applya
        //naredimo deconstruct za conditions and rules. nadaljujemo rekurzivno, če je condition
        if (targetCatalogProduct.rules) {
            targetCatalogProduct.rules.map((rule) => {
                if (this.calculateCondition(rule.condition, cartIndex)) {
                    this.applyOutComes(rule.outcomes, cartIndex);
                }
            });
        }
        //preveri če rules sploh obstajajo
        /* if(productWithRules?.hasOwnProperty("rules")){
            let [productConditions, productOutcomes] = productWithRules.rules;
            //console.log(productConditions, productOutcomes);
            console.log("too dela! ;)");
        } */
        //if (condition.length = 2) recurzivna funkcija   
        //mislem da že tu pride recurzivna funkcija
        //let [type, script, dependsOn, ] = condition;
        //outcomes imajo tri možnosti, na katere vplivajo aatributes, price in tax torej to direkt vpliva na cart
        //ne vem edino kaj nj naredim z  disable ali required - pomoje najbolš da ko preberem catalog, da vsakemu
        //še dodam disabled in required ki bosta po defaultu false. potem pa se lahko jst prehajam čez vse te attibute od določenega
        //izdelka in pogledam in preverim.. ter to sporočim uporabniku z obvestilom.**
        // required in disabled se bo spreminjal glede na rules, ki bojo apllyani
        //mogoče da gre na koncu čez attribute od tega izdelka in ga opozori, da more dodat ta in ta attribute..?
        //attributes imajo  "key": "battery_capacity",
        /* "type": "number",
        "script": "brightness * 2",
        "dependsOn": ["brightness"] */
        //in če im
    }
    toJson() {
        //ne dela dobro ima not catalog - ne vem kako ga nj dam vn? :) gremo dalje
        //sem pa vsaj popravla da objekte lepo prikazuje :)
        const currentCart = new Cart(this.products, this.totalPrice, this.taxValues, this.catalog);
        currentCart.catalog = [];
        return JSON.stringify(currentCart, null, 2);
    }
    get getTotalPrice() {
        return this.totalPrice;
    }
    get getTaxValues() {
        return this.taxValues;
    }
}
exports.Cart = Cart;
//# sourceMappingURL=cart.js.map