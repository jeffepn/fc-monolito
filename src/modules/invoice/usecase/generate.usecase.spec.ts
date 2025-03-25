import GenerateInvoiceUseCase from "./generate.usecase";

const MockRepository = () => {
    return {
        find: jest.fn(),
        save: jest.fn(),
    };
};

describe("Generate invoice usecase unit test", () => {
    it("Generate a new invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(invoiceRepository);
        const input = {
            name: 'Invoice 1',
            document: '123.456.789-99',
            street: 'Street any',
            number: '123',
            complement: 'apt 2',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '11909-789',
            items: [
                {
                    id: '1',
                    name: "Item 1",
                    price: 60.50
                },
                {
                    id: '2',
                    name: "Item 2",
                    price: 120.30
                }
            ]

        };

        const result = await usecase.execute(input);

        expect(result.id).toBeDefined();
        expect(invoiceRepository.save).toHaveBeenCalled();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.total).toBe(180.80);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items[0].id).toBe(input.items[0].id);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].id).toBe(input.items[1].id);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
    });
});