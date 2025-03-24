export class Product {
    constructor(
        private key: string,
        private title: string,
        private price: number,
        private tax: number,
        private quantity: number,
        private attributes: Map<string, any>,  //not required for now
        private rules?: any[],
    ){}
    
    //mislem da se contructorje setta ko ustvariš ta class, ko ga spreminjaš rabiš pa za vsak construktor svoj setter, 
    // pomoje getterjev ne rabim
    get getProductKey(): string {
        return this.key;
    }

    get getProductQuantity(): number {
        return this.quantity;
    }

    get getProductPrice(): number {
        return this.price;
    }
    get getProductTitle(): string {
        return this.title;
    }
    get getProductTax(): number {
        return this.tax;
    }

    //[key: string]: any
    get getProductAttributes(): Map<string, any>{
        return this.attributes;
    }

    set setProductKey(key: string) {
        this.key = key;
    }
    set setProductTitle(title: string) {
        this.key = title;
    }
    set setProductQuantity(quantity: number){
        this.quantity = quantity;
    }

    set setProductAttributes(attributes: Map<string, any>) {
        this.attributes = attributes;
    }
}