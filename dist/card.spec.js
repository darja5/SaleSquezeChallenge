"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_1 = require("./cart");
const catalog_json_1 = __importDefault(require("./catalog.json"));
const product_1 = require("./product");
//ADDING AND REMOVING PRODUCTS
describe("Adding and removing products", () => {
    let cart;
    beforeEach(() => {
        cart = new cart_1.Cart([], 0, [], catalog_json_1.default);
    });
    test("should add a product and update total price and tax values", () => {
        const product = new product_1.Product("DL002", "Desk Lamp", 100, 22, 2, {});
        cart.addProduct("DL002", 2);
        expect(cart.getProducts).toEqual([product]);
        expect(cart.getTotalPrice).toBe(200);
        expect(cart.getTaxValues).toEqual({ "22": 44 });
    });
    test("should throw error if removing a product from an empty cart", () => {
        const logSpy = jest.spyOn(global.console, "log");
        cart.removeProduct(0);
        expect(logSpy).toHaveBeenCalledWith("Error, you are trying to remove a product from an empty cart.");
    });
    test("adding less than 0 procucts should throw error", () => {
        expect(() => cart.addProduct("DL002", -1)).toThrow("Error, the number of products you are trying to add is not valid.");
    });
    test("adding less than 0 procucts should throw error", () => {
        expect(() => cart.addProduct("DL002", 11)).toThrow("Error, the number of products you are trying to add is too big");
    });
    test("adding a product with non existing key should throw error", () => {
        expect(() => cart.addProduct("D100", 2)).toThrow("Error adding a product: Product key not found in catalog.");
    });
    test("check if cart is empty after removing the last item", () => {
        const product = new product_1.Product("DL002", "Desk Lamp", 100, 22, 2, {});
        const newCart = new cart_1.Cart([], 0, [], catalog_json_1.default);
        cart.addProduct("DL002", 2);
        expect(cart.getProducts).toEqual([product]);
        expect(cart.getTotalPrice).toBe(200);
        expect(cart.getTaxValues).toEqual({ "22": 44 });
        cart.removeProduct(0);
        expect(cart).toEqual(newCart);
    });
    test("should remove a product and update total price and tax values", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 100, 22, 2, {});
        const product2 = new product_1.Product("SP003", "Smartphone", 800, 15, 1, {});
        cart.addProduct("DL002", 2);
        cart.addProduct("SP003", 1);
        expect(cart.getProducts).toEqual([product1, product2]);
        expect(cart.getTotalPrice).toBe(1000);
        expect(cart.getTaxValues).toEqual({ "22": 44, "15": 120 });
        cart.removeProduct(0);
        expect(cart.getTotalPrice).toBe(800);
        expect(cart.getTaxValues).toEqual({ "15": 120 });
    });
    test("should add a product twice, remove it once and apply price and tax changes", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 100, 22, 2, {});
        cart.addProduct("DL002", 2);
        cart.addProduct("DL002", 1);
        expect(cart.getTotalPrice).toBe(300);
        expect(cart.getTaxValues).toEqual({ "22": 66 });
        cart.removeProduct(1);
        expect(cart.getTotalPrice).toBe(200);
        expect(cart.getTaxValues).toEqual({ "22": 44 });
        expect(cart.getProducts).toEqual([product1]);
    });
    test("should log a warning when trying to remove a non-existent product", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 100, 22, 2, {});
        const product2 = new product_1.Product("DL002", "Desk Lamp", 100, 22, 1, {});
        cart.addProduct("DL002", 2);
        cart.addProduct("DL002", 1);
        expect(cart.getTotalPrice).toBe(300);
        expect(cart.getTaxValues).toEqual({ "22": 66 });
        const logSpy = jest.spyOn(global.console, "log");
        cart.removeProduct(999);
        expect(logSpy).toHaveBeenCalledWith("Error, please check that the product index is correct.");
        expect(cart.getTotalPrice).toBe(300);
        expect(cart.getTaxValues).toEqual({ "22": 66 });
        expect(cart.getProducts).toEqual([product1, product2]);
    });
});
//UPDATING ATTRIBUTE VALUES
describe("Updating attribute values", () => {
    let cart;
    beforeEach(() => {
        cart = new cart_1.Cart([], 0, [], catalog_json_1.default);
    });
    test("should update product attributes correctly", () => {
        const product1 = new product_1.Product("SP003", "Smartphone", 800, 15, 1, {
            color: "black",
        });
        cart.addProduct("SP003", 1);
        expect(cart.getTotalPrice).toBe(800);
        expect(cart.getTaxValues).toEqual({ "15": 120 });
        cart.setAttributeValue(0, "color", "black");
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(800);
        expect(cart.getTaxValues).toEqual({ "15": 120 });
    });
    test("should throw error if there is no product on cartIndex", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 100, 22, 3, {});
        cart.addProduct("DL002", 3);
        expect(cart.getTaxValues).toEqual({ "22": 66 });
        expect(cart.getProducts).toEqual([product1]);
        expect(() => cart.setAttributeValue(-13, "smart_features", [
            "voice_control",
            "dimmable",
        ])).toThrow("Error, please check that the product index is correct.");
    });
    test("should throw error if attribute does not belong to the product on cartIndex", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 100, 22, 3, {});
        cart.addProduct("DL002", 3);
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTaxValues).toEqual({ "22": 66 });
        expect(() => cart.setAttributeValue(0, "color", ["voice_control", "dimmable"])).toThrow("Error, attribut cannot be set to this product.");
    });
    test("should throw error if attribute value is incorrect", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 100, 22, 3, {});
        cart.addProduct("DL002", 3);
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTaxValues).toEqual({ "22": 66 });
        expect(() => cart.setAttributeValue(0, "smart_features", "music")).toThrow("Error, attribute value is not valid for this attribute.");
    });
});
//UPDATING RULES AND VALIDATING OUTCOMES
describe("Updating rules and validating outcomes", () => {
    let cart;
    beforeEach(() => {
        cart = new cart_1.Cart([], 0, [], catalog_json_1.default);
    });
    test("should apply rules and validate outcomes after adding an attribute to Smartphone", () => {
        const product1 = new product_1.Product("SP003", "Smartphone", 900, 15, 1, {
            color: "white",
        });
        cart.addProduct("SP003", 1);
        expect(cart.getTotalPrice).toBe(800);
        cart.setAttributeValue(0, "color", "white");
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(900);
    });
    test("should apply rules and validate outcomes after adding an attribute to Desk Lamp", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 110, 22, 2, {
            brightness: 60,
            battery_capacity: 120,
            smart_features: null,
        });
        cart.addProduct("DL002", 2);
        expect(cart.getTotalPrice).toBe(200);
        cart.setAttributeValue(0, "brightness", 60);
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(220);
    });
    test("should apply default value to smart_feature attribute after adding batery_capacity 40 to Desk Lamp", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 180, 22, 2, {
            brightness: 20,
            battery_capacity: 40,
            smart_features: ["voice_control"],
        });
        cart.addProduct("DL002", 2);
        expect(cart.getTotalPrice).toBe(200);
        expect(cart.getTaxValues).toEqual({ "22": 44 });
        cart.setAttributeValue(0, "brightness", 20);
        expect(cart.getTotalPrice).toBe(360);
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTaxValues).toEqual({ "22": 79.2 });
    });
    test("should apply rules and validate outcomes after adding an attribute to Electric Bike", () => {
        const product1 = new product_1.Product("EB001", "Electric Bike", 2500, 30, 1, {
            battery_capacity: 300,
            frame_material: "steel",
        });
        cart.addProduct("EB001", 1);
        expect(cart.getTotalPrice).toBe(2500);
        expect(cart.getTaxValues).toEqual({ "22": 550 });
        cart.setAttributeValue(0, "battery_capacity", 300);
        cart.setAttributeValue(0, "frame_material", "steel");
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(2500);
        expect(cart.getTaxValues).toEqual({ "30": 750 });
    });
});
//CALCULATING TOTAL PRICE AND TAX VALUES
describe("Calculating total price and tax values", () => {
    let cart;
    beforeEach(() => {
        cart = new cart_1.Cart([], 0, [], catalog_json_1.default);
    });
    test("should add Desk Lamp and Electric Bike and calculate total price and tax values", () => {
        const product1 = new product_1.Product("DL002", "Desk Lamp", 110, 22, 1, {
            brightness: 250,
            battery_capacity: 500,
            smart_features: null,
        });
        const product2 = new product_1.Product("EB001", "Electric Bike", 2800, 30, 1, {
            battery_capacity: 600,
            frame_material: "carbon",
            extra_features: ["GPS", "suspension"],
        });
        cart.addProduct("DL002", 1);
        cart.addProduct("EB001", 1);
        expect(cart.getTotalPrice).toBe(2600);
        expect(cart.getTaxValues).toEqual({ "22": 572 });
        cart.setAttributeValue(0, "brightness", 250);
        cart.setAttributeValue(1, "battery_capacity", 600);
        cart.setAttributeValue(1, "frame_material", "carbon");
        cart.setAttributeValue(1, "extra_features", ["GPS", "suspension"]);
        expect(cart.getProducts).toEqual([product1, product2]);
        expect(cart.getTotalPrice).toBe(2910);
        expect(cart.getTaxValues).toEqual({ "22": 24.2, "30": 840 });
    });
    test("should calculate total price and tax values on a bigger cart", () => {
        cart.addProduct("DL002", 1);
        cart.addProduct("EB001", 1);
        cart.addProduct("DL002", 1);
        cart.addProduct("EB001", 1);
        cart.addProduct("SP003", 1);
        cart.addProduct("SP003", 1);
        expect(cart.getTotalPrice).toBe(6800);
        expect(cart.getTaxValues).toEqual({
            "15": 240,
            "22": 1144,
        });
        cart.setAttributeValue(0, "brightness", 20);
        cart.setAttributeValue(1, "battery_capacity", 600);
        cart.setAttributeValue(1, "frame_material", "carbon");
        cart.setAttributeValue(2, "brightness", 30);
        cart.setAttributeValue(3, "frame_material", "steel");
        cart.setAttributeValue(4, "color", "white");
        cart.setAttributeValue(5, "color", "silver");
        expect(cart.getTotalPrice).toBe(7290);
        expect(cart.getTaxValues).toEqual({ "22": 63.8, "30": 1590, "15": 255 });
    });
});
//# sourceMappingURL=card.spec.js.map