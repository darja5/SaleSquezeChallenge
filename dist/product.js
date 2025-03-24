"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(key, title, price, tax, quantity, attributes, //not required for now
    rules) {
        this.key = key;
        this.title = title;
        this.price = price;
        this.tax = tax;
        this.quantity = quantity;
        this.attributes = attributes;
        this.rules = rules;
    }
    //mislem da se contructorje setta ko ustvariš ta class, ko ga spreminjaš rabiš pa za vsak construktor svoj setter, 
    // pomoje getterjev ne rabim
    get getProductKey() {
        return this.key;
    }
    get getProductQuantity() {
        return this.quantity;
    }
    get getProductPrice() {
        return this.price;
    }
    get getProductTitle() {
        return this.title;
    }
    get getProductTax() {
        return this.tax;
    }
    //[key: string]: any
    get getProductAttributes() {
        return this.attributes;
    }
    set setProductKey(key) {
        this.key = key;
    }
    set setProductTitle(title) {
        this.key = title;
    }
    set setProductQuantity(quantity) {
        this.quantity = quantity;
    }
    set setProductAttributes(attributes) {
        this.attributes = attributes;
    }
}
exports.Product = Product;
//# sourceMappingURL=product.js.map