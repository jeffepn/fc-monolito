import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import FindInvoiceUseCase from "./find.usecase";

const invoiceItem1 = new InvoiceItem({
    name: "Item 1",
    price: 60.50    
});

const invoiceItem2 = new InvoiceItem({
    name: "Item 2",
    price: 120.30    
});


const invoice = new Invoice({
    id: new Id('1'),
    name: 'Invoice 1',
    document: '123.456.789-99',
    address: new Address(
        'Street any',
        '123',
        'apt 2',
        'São Paulo',
        'SP',
        '11909-789'
    ),
    items: [invoiceItem1, invoiceItem2]
});


const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        save: jest.fn(),
    };
};

describe("Find invoice usecase unit test", () => {
    it("Find a invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);
        const input = {
            id: "1",
        };

        const result = await usecase.execute(input);

        expect(result.id).toBe(invoice.id.id);
        expect(invoiceRepository.find).toHaveBeenCalled();
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.total).toBe(invoice.total());
        expect(result.address.street).toBe(invoice.address.street);
        expect(result.address.number).toBe(invoice.address.number);
        expect(result.address.complement).toBe(invoice.address.complement);
        expect(result.address.city).toBe(invoice.address.city);
        expect(result.address.state).toBe(invoice.address.state);
        expect(result.address.zipCode).toBe(invoice.address.zipCode);
        expect(result.items[0].id).toBeDefined();
        expect(result.items[0].name).toBe(invoiceItem1.name);
        expect(result.items[0].price).toBe(invoiceItem1.price);
        expect(result.items[1].id).toBeDefined();
        expect(result.items[1].name).toBe(invoiceItem2.name);
        expect(result.items[1].price).toBe(invoiceItem2.price);
        expect(result.createdAt).toBe(invoice.createdAt);
    });
});