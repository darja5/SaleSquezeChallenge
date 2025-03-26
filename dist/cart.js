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
    //Adds a product to the cart by its catalog key
    addProduct(productKey, quantity) {
        // dodam total price in tax v tax.
        //test: če je prazen katalog
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
        const productToBeRemoved = this.products[cartIndex];
        //console.log(productToBeRemoved.getProductTitle);
        this.totalPrice -= productToBeRemoved.getProductPrice * productToBeRemoved.getProductQuantity;
        this.products.splice(cartIndex, 1);
        this.setNewTaxValues();
    }
    calculateConditions(condition, index) {
        if (condition.type === "and") {
            //console.log(condition.conditions[0]);
            return this.calculateConditions(condition.conditions[0], index) && this.calculateConditions(condition.conditions[1], index);
        }
        if (condition.type === "or") {
            return this.calculateConditions(condition.conditions[0], index) || this.calculateConditions(condition.conditions[1], index);
        }
        else {
            return this.calculateCondition(condition, index);
        }
    }
    calculateCondition(condition, index) {
        if (condition.type == "attribute") {
            let attributeKey = condition.key;
            let conditionAttributeValue = this.products[index].getProductAttributes[condition.key];
            switch (condition.operator) {
                case "gte": {
                    if (conditionAttributeValue != undefined && conditionAttributeValue >= condition.compareValue) {
                        return true;
                    }
                    return false;
                }
                case "eq": {
                    if (conditionAttributeValue != undefined && conditionAttributeValue === condition.compareValue) {
                        return true;
                    }
                    return false;
                }
                case "includes": {
                    if (conditionAttributeValue != undefined && conditionAttributeValue.includes(condition.compareValue)) {
                        return true;
                    }
                    return false;
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
    /* productHasAttribute(attributeKey: string, index: number): boolean {
        let product = this.products[index];

        return false;
    } */
    applyOutComes(outcomes, index) {
        //console.log("outcomes", outcomes);
        let product = this.products[index];
        outcomes.map(outcome => {
            switch (outcome.type) {
                case "attribute": {
                    //loh je tudi false?
                    if (outcome.disabled != undefined && outcome.disabled) {
                        this.products[index].setProductAttributes = Object.assign(Object.assign({}, this.products[index].getProductAttributes), { [outcome.key]: null });
                    }
                    if (outcome.required != undefined && outcome.required) {
                        //todo: najprej preveri, če ta attribut že obstaja in ni null. čega nima, ga lahko prepišeš
                        /* let attributeAlreadyExists = product.getProductAttributes.find((att: any) => {
                            att.key === outcome.key
                        }) */
                        let attributeKeyAlreadyExists = "";
                        let attributeValueAlreadyExists = undefined;
                        //mogoče je to rešitev za tist moj problem od tax values :)))
                        for (let item in product.getProductAttributes) {
                            if (item === outcome.key) {
                                attributeKeyAlreadyExists = item;
                                attributeValueAlreadyExists = product.getProductAttributes[item];
                            }
                        }
                        //console.log("obstaja: key in value", attributeKeyAlreadyExists, attributeValueAlreadyExists);
                        if (attributeKeyAlreadyExists != "" && attributeValueAlreadyExists[outcome.key] != null && attributeValueAlreadyExists[outcome.key] != undefined) {
                            let targetCatalogProduct = this.catalog.find(element => element.key === this.products[index].getProductKey);
                            let targetAttribute = targetCatalogProduct.attributes.find((att) => att.key === outcome.key);
                            let wantedValue;
                            if ((targetAttribute === null || targetAttribute === void 0 ? void 0 : targetAttribute.type) != undefined) {
                                switch (targetAttribute.type) {
                                    case "number": {
                                        wantedValue = Math.floor(Math.random() * 1000);
                                        break;
                                    }
                                    case "single-select": {
                                        let i = Math.floor(Math.random() * targetAttribute.values.length);
                                        wantedValue = targetAttribute.values[i];
                                        break;
                                    }
                                    case "multi-select": {
                                        wantedValue = targetAttribute.values;
                                        let i = Math.floor(Math.random() * targetAttribute.values.length);
                                        wantedValue = wantedValue.splice(i);
                                        break;
                                    }
                                }
                            }
                            this.products[index].setProductAttributes = Object.assign(Object.assign({}, this.products[index].getProductAttributes), { [outcome.key]: wantedValue });
                        }
                    }
                    break;
                }
                case "price": {
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
        //check for validity of attribute types and if all checks out add the attribute(s) to the product in the cart
        switch (productAttributeWithValue.type) {
            case "number": {
                if (!(typeof value === "number")) {
                    console.log("Error, attribute value should be a number");
                }
                else {
                    targetCartProduct.setProductAttributes = Object.assign(Object.assign({}, targetCartProduct.getProductAttributes), { [attributeKey]: value });
                }
                break;
            }
            case "single-select": {
                if (!(typeof value === "string")) {
                    console.log("Error, attribute value should be a string");
                }
                else {
                    if (((_a = productAttributeWithValue === null || productAttributeWithValue === void 0 ? void 0 : productAttributeWithValue.values) === null || _a === void 0 ? void 0 : _a.includes(value)) || ((_b = productAttributeWithValue === null || productAttributeWithValue === void 0 ? void 0 : productAttributeWithValue.values) === null || _b === void 0 ? void 0 : _b.includes(value)) === undefined) {
                        targetCartProduct.setProductAttributes = Object.assign(Object.assign({}, targetCartProduct.getProductAttributes), { [attributeKey]: value });
                    }
                    else {
                        console.log("Error in setAttributeValue, given attribute or attribute value are not valid.");
                    }
                }
                break;
            }
            case "multi-select": {
                let checkSubset = (parentArray, subsetArray) => {
                    return subsetArray.every((el) => {
                        return parentArray.includes(el);
                    });
                };
                if (Array.isArray(value) && checkSubset(productAttributeWithValue.values, value)) {
                    targetCartProduct.setProductAttributes = Object.assign(Object.assign({}, targetCartProduct.getProductAttributes), { [attributeKey]: value });
                }
                else {
                    console.log("Error in setAttributeValue, given attribute or attribute value are not valid.");
                }
                break;
            }
        }
        //check if there are attributes that are dependant on this added attribute and add them to product in the cart
        // (if all dependant values are added)
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
        //recursivly check if conditions apply apply changes if neccessary
        if (targetCatalogProduct.rules) {
            targetCatalogProduct.rules.map((rule) => {
                if (this.calculateConditions(rule.condition, cartIndex)) {
                    this.applyOutComes(rule.outcomes, cartIndex);
                }
            });
        }
    }
    toJson() {
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