import productsCatalog from './catalog.json';
import { Product } from './product';

export class Cart {
    //a more bit tle private al bi blo okej če bi bil let? loh je let pomoje
    private catalog: any[] = productsCatalog;

    //kakšnga tipa je carttextvalues
    constructor(
        private productsInCart: Product[],
        private totalCartPrice: number,
        private cartTaxValues: {[taxRate: number]: number},
    ){}
    
    printCatalog(): void {
        console.log(this.catalog);
    }

   /*  createCatalogWithAdditionalFields(catalog : any[]) : any[] {
        let cat =  catalog.map((item: any) => {
            item["atributes"].map((att : Map<string, any>)=> {
                att.set("required", false);
                att.set("disabled", false);
            });
            console.log(item["attributes"]);
        });
        return cat;
    } */

    //Adds a product to the cart by its catalog key
    addProduct(productKey: string, quantity: number): void {
        // dodam total price in tax v tax.
        //test: če je prazen katalog

        //if catalog has any products and the product was not privously added to the cart
        //ali bi mogu imet ta product v mapu Product type?
        let productExistsInCatalog = false;
        if(this.catalog.length > 0){
            this.catalog.map(productCatalog => {
                if (productCatalog.key === productKey) {
                    productExistsInCatalog = true;

                    let existingProductInCart = this.productsInCart.find((productCart: Product)=> 
                        productCart.getProductKey === productKey);
                    
                    if(existingProductInCart){
                        
                        //if product already exists in cart then adjust the quantity and price
                        existingProductInCart.setProductQuantity = existingProductInCart.getProductQuantity + quantity;
                        this.totalCartPrice += existingProductInCart.getProductPrice * quantity;
                    }
                    //add new product to the cart
                    else {
                        let newProduct = new Product(productKey, productCatalog.title, productCatalog.price, productCatalog.tax, quantity, new Map<string, any>);
                        this.productsInCart.push(newProduct);
                        this.totalCartPrice = this.totalCartPrice + productCatalog.price * quantity;
                        let calculatedTax = (productCatalog.tax * productCatalog.price * quantity / 100);

                        //ali ali oboje dela prav
                        //this.cartTaxValues = Object.assign(this.cartTaxValues, {[String(productCatalog.tax)]: calculatedTax});
                        this.cartTaxValues[productCatalog.tax] = calculatedTax;
                    }
                }
            });
        }
        if (!productExistsInCatalog) console.log("Error adding a product: Product key not found in catalog.");

        console.log("productsInCart: ", this.productsInCart);
        console.log("this.totalCartPrice", this.totalCartPrice);
        console.log("this.cartTaxValues", this.cartTaxValues);
    }

    //Removes a product from the cart by its line item index.
    removeProduct(cartIndex: number): void {
        //je mišljeno sploh tko kot si jst predstavljam, da se ti seštevajo kr v cartu isti produkti, al bolj ne?
        //todo pravilo poravnaj total price
        const productToBeRemoved : Product = this.productsInCart[cartIndex];
        console.log(productToBeRemoved.getProductTitle);

        this.totalCartPrice -= productToBeRemoved.getProductPrice * productToBeRemoved.getProductQuantity;
        this.productsInCart.splice(cartIndex, 1);

        /* console.log("productsInCart: ", this.productsInCart);
        console.log("this.totalCartPrice", this.totalCartPrice); */
    }

    //Updates an attribute value for a specific product in the cart based on its line item index. 
    //This should validate rules and update the cart accordingly (e.g., disable attributes, apply price changes).
    setAttributeValue(cartIndex: number, attributeKey: string, value: any): void {
        const producttoAddAttribute : Product = this.productsInCart[cartIndex];
        //let prAttObject: { [key: string]: any } = producttoAddAttribute.getProductAttributes;
        //console.log(prAttObject);

        //če je disable, napiši da ga ne more nastavljat

        //če je required še neki naredi*

        //prAttObject[attributeKey] = value; 
        //prAttObject = Object.assign(prAttObject, {[String(attributeKey)]: value});
        //prAttObject[attributeKey] = value;

        //okej to zdj dela :)) lahko pustim v map, loh bi se pa z objekti hecala, tko kot pri taxes?
        let mapatt = producttoAddAttribute.getProductAttributes.set(attributeKey, value);

        producttoAddAttribute.setProductAttributes = mapatt;

        //producttoAddAttribute.setProductAttributes({attributeKey, value});

        //gre v rules od tega produkta, jih prebere in applya
        //naredimo deconstruct za conditions and rules. nadaljujemo rekurzivno, če je condition
        let productWithRules = this.catalog.find(element => 
            element.key === producttoAddAttribute.getProductKey);


        //prveri če rules sploh obstajajo
        /* if(productWithRules?.hasOwnProperty("rules")){
            let [productConditions, productOutcomes] = productWithRules.rules;
            console.log(productConditions, productOutcomes);
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


    

        //console.log("productsInCart: ", this.productsInCart);
        //console.log("this.totalCartPrice", this.totalCartPrice);
    }


    toJson(): any {
        //output type instead of any -> SampleOutputInterface
        //todo
        const currentCart = new Cart(this.productsInCart, this.totalCartPrice , this.cartTaxValues);

        return JSON.stringify(currentCart);
    }

    get totalPrice(): number {
        return this.totalCartPrice;
    }

    get taxValues(): { [taxRate: number]: number } {
        //return {15:120, 30: 55};
        return this.cartTaxValues;
    }

}