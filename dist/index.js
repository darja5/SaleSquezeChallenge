"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_1 = require("./cart");
const catalog_json_1 = __importDefault(require("./catalog.json"));
//addProduct
/* const cart1 = new Cart([], 0, [], productsCatalog);
cart1.printCatalog();
cart1.addProduct('DL002', 2);
cart1.addProduct('SP003', 3);
cart1.addProduct('DL002', 3);
console.log(cart1.totalPrice); */
//ponovno dodam isti produkt, da vidim kako se to v košraici pokaže :)
//cart.addProduct('DL002', 2);
//mogoče je kul, da te teste pišem kr v testni scenarije in za vsako metodo to spišem in naredim 
//in imam potem na koncu koncu toliko manj dela? :) jst mislem da je to ful logično, pa da vse pokrijem in že zdj dam to vn
//test1: dodam produkt, ki ga ni v katalogu
//test2: dodam produkt ni važn katerga, preverim da prav sesteje ceno
//test3: dodam drug produkt, preverim ceno
//test4 dodam ponovno prvi prdukt z novo količno - to morem kasneje prevert kako bi blo z atributi.
//removeProduct
/* const cart2 = new Cart([], 0, [], productsCatalog);
cart2.printCatalog();
cart2.addProduct('DL002', 2);
cart2.addProduct('SP003', 3);
cart2.addProduct('DL002', 3);
console.log(cart2.totalPrice);

cart2.removeProduct(0); */
//cart2.setAttributeValue(0, )
//setAttribute
const cart3 = new cart_1.Cart([], 0, [], catalog_json_1.default);
//cart3.printCatalog();
/* cart3.addProduct('DL002', 2);
cart3.addProduct('SP003', 1);
cart3.setAttributeValue(0, "brightness", 250);
cart3.setAttributeValue(1, "color", "white");
cart3.removeProduct(1); */
/* cart3.addProduct('SP003', 1);
cart3.setAttributeValue(0, "color", "white");
cart3.addProduct('SP003', 1);
cart3.setAttributeValue(1, "color", "black"); */
cart3.addProduct('EB001', 1);
cart3.setAttributeValue(0, "battery_capacity", 600);
cart3.setAttributeValue(0, "frame_material", "carbon");
//cart3.addProduct('SP003', 1);
//console.log ali piši v nek fajl?
console.log(cart3.toJson());
console.log("");
//# sourceMappingURL=index.js.map