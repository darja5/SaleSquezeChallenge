
import { Cart } from "./cart";
import productsCatalog from './catalog.json';
import { Product } from "./product";

//ADDING AND REMOVING PRODUCTS
describe('Adding and removing products', () => {
    let cart: Cart;
    beforeEach(() => {
        cart = new Cart([], 0, [], productsCatalog);
    });

    test('should add a product and update total price and tax values', () => {
        const product = new Product("DL002", "Desk Lamp", 100, 22, 2, {});
    
        // Add the product to the cart
        cart.addProduct('DL002', 2);
        expect(cart.getProducts).toEqual([product]);
        expect(cart.getTotalPrice).toBe(200);
        //expect(cart.getTaxValues).toBe([{"22": 44}]);
    });

    test('adding a product with non existing key should throw error', () => {
        const product = new Product("DL002", "Desk Lamp", 100, 22, 2, {});
    
        expect(() => cart.addProduct('D100', 2)).toThrow("Error adding a product: Product key not found in catalog.");
    });

    test('should remove a product and update total price and tax values', () => {
        const product1 = new Product("DL002", "Desk Lamp", 100, 22, 2, {});
        const product2 = new Product("SP003", "Smartphone", 800, 15, 1, {});
        
        cart.addProduct("DL002", 2);
        cart.addProduct("SP003", 1);
        
        expect(cart.getTotalPrice).toBe(1000);
        //expect(cart.getTax()).toBe(15);
        cart.removeProduct(0);
        expect(cart.getTotalPrice).toBe(800);
        //expect(cart.getTax()).toBe(5);
    });

    test('should add a product twice, remove it once and apply price and tax changes', () => {
        const product1 = new Product("DL002", "Desk Lamp", 100, 22, 2, {});
        cart.addProduct("DL002", 2);
        cart.addProduct("DL002", 1);
        
        expect(cart.getTotalPrice).toBe(300);
        //expect(cart.getTax()).toBe(15);
        cart.removeProduct(1);
        expect(cart.getTotalPrice).toBe(200);
        //expect(cart.getTax()).toBe(5);
    });

    test('should log a warning when trying to remove a non-existent product', () => {
        const product1 = new Product("DL002", "Desk Lamp", 100, 22, 2, {});
        
        cart.addProduct("DL002", 2);
        cart.addProduct("DL002", 1);
        
        expect(cart.getTotalPrice).toBe(300);
        //expect(cart.getTax()).toBe(15);
        const logSpy = jest.spyOn(global.console, 'log');
        cart.removeProduct(999);
        expect(logSpy).toHaveBeenCalledWith("Error, please check that the product index is correct.");
        expect(cart.getTotalPrice).toBe(300);
    });
}); 

//UPDATING ATTRIBUTE VALUES
describe('Updating attribute values', () => {
    let cart: Cart;
  
    beforeEach(() => {
      cart = new Cart([], 0, [], productsCatalog);
    });

    test('should update product attributes correctly if attribute a string', () => {
        const product1 = new Product("SP003", "Smartphone", 800, 15, 1, {"color":"black"});
        
        cart.addProduct("SP003", 1);

        expect(cart.getTotalPrice).toBe(800);
        //tax
        cart.setAttributeValue(0, "color", "black");
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(800);
        //tax
    });

    test('should update product attributes correctly if attribute a number', () => {
        const product1 = new Product("DL002", "Desk Lamp", 100, 22, 2, {"battery_capacity":30});
        
        cart.addProduct("DL002", 2);

        expect(cart.getTotalPrice).toBe(200);
        //tax
        cart.setAttributeValue(0, "battery_capacity", 30);
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(200);
        //tax
    });

    test('should update product attributes correctly if attribute an array', () => {
        const product1 = new Product("DL002", "Desk Lamp", 100, 22, 3, {"smart_features":["voice_control", "dimmable"]});
        
        cart.addProduct("DL002", 3);

        expect(cart.getTotalPrice).toBe(300);
        //tax
        cart.setAttributeValue(0, "smart_features", ["voice_control", "dimmable"]);
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(300);
        //tax
    });

    test('should throw error if there is no product on cartIndex', () => {
        const product1 = new Product("DL002", "Desk Lamp", 100, 22, 3, {"smart_features":["voice_control", "dimmable"]});
        
        cart.addProduct("DL002", 3);

        expect(() => cart.setAttributeValue(-13, "smart_features", ["voice_control", "dimmable"])).toThrow("Error, please check that the product index is correct.");
    });

    test('should throw error if attribute does not belong to the product on cartIndex', () => {
        const product1 = new Product("DL002", "Desk Lamp", 100, 22, 3, {"smart_features":["voice_control", "dimmable"]});
        
        cart.addProduct("DL002", 3);

        expect(() => cart.setAttributeValue(0, "color", ["voice_control", "dimmable"])).toThrow("Error, attribut cannot be set to this product.");
    });

    test('should throw error if attribute value is incorrect', () => {
        const product1 = new Product("DL002", "Desk Lamp", 100, 22, 3, {"smart_features":["voice_control", "dimmable"]});
        
        cart.addProduct("DL002", 3);

        expect(() => cart.setAttributeValue(0, "smart_features", "darja")).toThrow("Error, attribute value is not valid for this attribute.");
    });
});

//UPDATING RULES AND VALIDATING OUTCOMES
describe('Updating rules and validating outcomes', () => {
    let cart: Cart;
  
    beforeEach(() => {
      cart = new Cart([], 0, [], productsCatalog);
    });

    test('should apply rules and validate outcomes after adding an attribute to a product', () => {
        const product1 = new Product("SP003", "Smartphone", 900, 15, 1, {"color":"white"});
        
        cart.addProduct("SP003", 1);
        expect(cart.getTotalPrice).toBe(800);
        cart.setAttributeValue(0, "color", "white");
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(900);
    });

    test('should apply rules and validate outcomes after adding an attribute to a product', () => {
        const product1 = new Product("DL002", "Desk Lamp", 110, 22, 2, {"brightness":60, "battery_capacity":120, "smart_features":null});
        
        cart.addProduct("DL002", 2);
        expect(cart.getTotalPrice).toBe(200);
        cart.setAttributeValue(0, "brightness", 60);
        expect(cart.getProducts).toEqual([product1]);
        expect(cart.getTotalPrice).toBe(220);
    });
});

/* //CALCULATING TOTAL PRICE TAX VALUES
describe('Updating attribute values', () => {

}); */