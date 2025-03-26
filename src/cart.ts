import { Product } from './product';

interface TaxValues {
    [taxRate: number]: number;
}

export class Cart {
    constructor(
        private products: Product[],
        private totalPrice: number,
        private taxValues: TaxValues,
        private catalog: any[],
    ){}

    //Adds a product to the cart by its catalog key
    addProduct(productKey: string, quantity: number): void {
        let productExistsInCatalog = false;
        if(this.catalog.length > 0){
            this.catalog.map(productCatalog => {
                if (productCatalog.key === productKey) {
                    productExistsInCatalog = true;
                    let newProduct = new Product(productKey, productCatalog.title, productCatalog.price, productCatalog.tax, quantity, {});
                    this.products.push(newProduct);
                    this.totalPrice = this.totalPrice + productCatalog.price * quantity;
                    let calculatedTax = (productCatalog.tax * productCatalog.price * quantity / 100);
                    this.setNewTaxValues();
                }
            });
        }
        if (!productExistsInCatalog) throw new Error("Error adding a product: Product key not found in catalog.");
    }

    //Removes a product from the cart by its line item index.
    removeProduct(cartIndex: number): void {
        if(cartIndex > -1 && cartIndex < this.products.length){
            const productToBeRemoved : Product = this.products[cartIndex];

            this.totalPrice -= productToBeRemoved.getProductPrice * productToBeRemoved.getProductQuantity;
            this.products.splice(cartIndex, 1);

            this.setNewTaxValues();
        }
        else{
            console.log("Error, please check that the product index is correct.");
        }
    }

    calculateConditions (condition: any, index: number): boolean {
        if(condition.type  === "and"){
            //console.log(condition.conditions[0]);
            return this.calculateConditions(condition.conditions[0], index) && this.calculateConditions(condition.conditions[1], index);
        }
        if(condition.type === "or"){
            return this.calculateConditions(condition.conditions[0], index) ||  this.calculateConditions(condition.conditions[1], index);
        }
        else{
            return this.calculateCondition(condition, index);
        }
    }

    calculateCondition (condition: any, index: number): boolean {
        if (condition.type == "attribute") {
            let attributeKey = condition.key;
            let conditionAttributeValue = this.products[index].getProductAttributes[condition.key];
            switch (condition.operator) {
                case "gte": {
                    if(conditionAttributeValue != undefined && conditionAttributeValue >= condition.compareValue){
                        return true;
                    }
                    return false;
                }
                case "eq": {
                    if(conditionAttributeValue != undefined && conditionAttributeValue === condition.compareValue){
                        return true;
                    }
                    return false;
                }
                case "includes": {
                    if(conditionAttributeValue != undefined && conditionAttributeValue.includes(condition.compareValue)){
                        return true;
                    }
                    return false;
                }
            }
        }
        return false;
    }

    setNewTaxValues() : void {
        let newTaxValues : TaxValues= {};
        this.products.map(product => {
            let newTaxValue = product.getProductPrice * product.getProductQuantity * product.getProductTax /100;
            let newTax = product.getProductTax;
            
            newTaxValues = {...newTaxValues,[newTax]: (newTaxValues[newTax] || 0) + newTaxValue};    

        });
        this.taxValues = newTaxValues;
    }

    applyOutComes(outcomes: any[], index:number): void {
        let product = this.products[index];
        outcomes.map(outcome => {
            switch(outcome.type) {
                case "attribute": {
                    //loh je tudi false?
                    if (outcome.disabled != undefined &&  outcome.disabled){
                        this.products[index].setProductAttributes = {...this.products[index].getProductAttributes, [outcome.key]:null};
                    }
                    
                    if (outcome.required != undefined &&  outcome.required){
                        let attributeKeyAlreadyExists = "";
                        let attributeValueAlreadyExists = undefined;

                        //mogoče je to rešitev za tist moj problem od tax values :)))
                        for (let item in product.getProductAttributes) {
                            if(item === outcome.key){
                                attributeKeyAlreadyExists = item;
                                attributeValueAlreadyExists = product.getProductAttributes[item];
                            }
                        }

                        if(attributeKeyAlreadyExists != "" && attributeValueAlreadyExists[outcome.key] != null && attributeValueAlreadyExists[outcome.key] != undefined) {
                            let targetCatalogProduct = this.catalog.find(element => 
                                element.key === this.products[index].getProductKey);
                            let targetAttribute = targetCatalogProduct.attributes.find((att:any) => att.key === outcome.key);
                            let wantedValue: any;
                            if(targetAttribute?.type != undefined){

                                // pri vsaki preveri, če obstaja default. če ja dodaj njega. čene prvega
                                switch (targetAttribute.type){
                                    case "number":{
                                        wantedValue = Math.floor(Math.random() * 1000);
                                        break;
                                    }
                                    case "single-select": {
                                        if(targetAttribute.default != undefined){
                                            wantedValue = targetAttribute.default;
                                        }
                                        else {
                                            //choose the first value
                                            wantedValue = targetAttribute.values[0];
                                        }
                                        break;
                                    }
                                    case "multi-select": {
                                        if(targetAttribute.default != undefined){
                                            wantedValue = targetAttribute.default;
                                        }
                                        else{
                                            //choose the first value
                                            wantedValue = [targetAttribute.values[0]];
                                        }
                                        
                                        break;
                                    }
                                }
                            }
                            this.products[index].setProductAttributes = {...this.products[index].getProductAttributes, [outcome.key]:wantedValue};
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
        })
    }

    //Updates an attribute value for a specific product in the cart based on its line item index. 
    //This should validate rules and update the cart accordingly (e.g., disable attributes, apply price changes).
    setAttributeValue(cartIndex: number, attributeKey: string, value: any): void {
        if(cartIndex < -1 || cartIndex > this.products.length){
            throw new Error("Error, please check that the product index is correct.");
        }
        //add cartIndex checking
        const targetCartProduct : Product = this.products[cartIndex];

        //check if value and atributeKey are valid parameters
        let targetCatalogProduct = this.catalog.find(element => 
            element.key === targetCartProduct.getProductKey);
        
        let productAttributeWithValue = targetCatalogProduct.attributes.find((attribute : any) => attribute.key === attributeKey);

        //check for validity of attribute types and if all checks out, add the attribute(s) to the product in the cart
        if(productAttributeWithValue == undefined){
            throw new Error("Error, attribut cannot be set to this product.");
        }
        switch(productAttributeWithValue.type){
            case "number": {
                if(!(typeof value === "number")){
                    throw new Error("Error, attribute value is not valid for this attribute.");
                }
                else {
                    targetCartProduct.setProductAttributes = {...targetCartProduct.getProductAttributes, [attributeKey]: value};
                }
                break;
            }
            case "single-select": {
                if(!(typeof value === "string")){
                    throw new Error("Error, attribute value is not valid for this attribute.");
                }
                else {
                    if (productAttributeWithValue?.values?.includes(value) || productAttributeWithValue?.values?.includes(value) === undefined){
                        targetCartProduct.setProductAttributes = {...targetCartProduct.getProductAttributes, [attributeKey]: value};
                    }
                    else {
                        throw new Error("Error, attribute value is not valid for this attribute.");
                    }
                }
                break;
            }
            case "multi-select": {
                let checkSubset = (parentArray:any[], subsetArray:any[]) => {
                    return subsetArray.every((el: number|string) => {
                        return parentArray.includes(el)
                    })
                }
                if(Array.isArray(value) && checkSubset(productAttributeWithValue.values, value)){
                    targetCartProduct.setProductAttributes = {...targetCartProduct.getProductAttributes, [attributeKey]: value};
                }
                else{
                    throw new Error("Error, attribute value is not valid for this attribute.");
                }
                break;
            }
        }

        //check if there are attributes that are dependant on this added attribute and add them to product in the cart
        //if all dependant values are added
        let dependantAttributes:any = [];
        targetCatalogProduct.attributes.map((att : any) => {
            if(att.key != attributeKey && att.dependsOn?.includes(attributeKey)) {
                dependantAttributes = [...dependantAttributes, att];
            }
        });

        dependantAttributes && dependantAttributes.map((attr: any)=>{
            let script = attr.script;

            attr.dependsOn.map((attName: string) => {
                let prodAttValue = targetCartProduct.getProductAttributes[attName];
                script = script.replace(attName, prodAttValue);
            })
            let newValueCalculated = eval(script);

            if(isNaN(newValueCalculated)) {
            throw new Error("Error calculating the script, possibly missing attribute value.");
            }
            this.setAttributeValue(cartIndex, attr.key, newValueCalculated);
        })

        //recursivly check if conditions apply => if yes apply outcomes
        if(targetCatalogProduct.rules){
            targetCatalogProduct.rules.map((rule: any) => {
                if (this.calculateConditions(rule.condition, cartIndex)){
                    this.applyOutComes(rule.outcomes, cartIndex);
                }
            })
        }
    }


    toJson(): string {
        const currentCart = new Cart(this.products, this.totalPrice, this.taxValues, this.catalog);
        currentCart.catalog = [];

        return JSON.stringify(currentCart, null, 2);
    }

    get getProducts(): Product[]{
        return this.products;
    }

    get getTotalPrice(): number {
        return this.totalPrice;
    }

    get getTaxValues(): { [taxRate: number]: number } {
        return this.taxValues;
    }

}