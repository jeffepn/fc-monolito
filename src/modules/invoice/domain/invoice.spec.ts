import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "./invoice";
import InvoiceItem from "./invoice-item";

const addres = new Address(
    'Street any',
    '123',
    'apt 2',
    'São Paulo',
    'SP',
    '11909-789'
);

describe("Invoice entity test", () => {
    it("Total of invoice", async () => {
        let invoice = new Invoice({
            id: new Id('1'),
            name: 'Invoice 1',
            document: '123.456.789-99',
            address: addres,
            items: [
                new InvoiceItem({ name: "Item 1", price: 60.50 }),
                new InvoiceItem({ name: "Item 2", price: 120.30 }),
            ]
        });

        expect(invoice.total()).toBe(180.8);
        
        invoice = new Invoice({
            id: new Id('1'),
            name: 'Invoice 1',
            document: '123.456.789-99',
            address: addres,
            items: [
                new InvoiceItem({ name: "Item 1", price: 49.99 }),
                new InvoiceItem({ name: "Item 2", price: 13.57 }),
                new InvoiceItem({ name: "Item 3", price: 29.22 }),
            ]
        });

        expect(invoice.total()).toBe(92.78);
        
        invoice = new Invoice({
            id: new Id('1'),
            name: 'Invoice 1',
            document: '123.456.789-99',
            address: addres,
            items: [
                new InvoiceItem({ name: "Item 1", price: 36.59 }),
            ]
        });
        
        expect(invoice.total()).toBe(36.59);
    });
});