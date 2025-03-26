import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/invoice";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item";
import InvoiceRepostiory from "./invoice.repository";
import InvoiceItemModel from "./invoice-item.model";

const createInvoice = () => {
    InvoiceModel.create({
        id: "1",
        name: 'Invoice 1',
        document: '123.456.789-99',
        street: 'Street any',
        number: '123',
        complement: 'apt 2',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '11909-789',
        createdAt: new Date(),
        updatedAt: new Date(),
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
    },
        {
            include: [{ model: InvoiceItemModel }],
        });;
};

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should get a invoice", async () => {
        createInvoice();
        const repository = new InvoiceRepostiory();
        const result = await repository.find('1');

        expect(result.id.id).toBe('1');
        expect(result.total()).toBe(180.80);
        expect(result.name).toBe('Invoice 1');
        expect(result.document).toBe('123.456.789-99');
        expect(result.address.street).toBe('Street any');
        expect(result.address.number).toBe('123');
        expect(result.address.complement).toBe('apt 2');
        expect(result.address.city).toBe('São Paulo');
        expect(result.address.state).toBe('SP');
        expect(result.address.zipCode).toBe('11909-789');
        expect(result.items[0].id).toBeDefined();
        expect(result.items[0].name).toBe('Item 1');
        expect(result.items[0].price).toBe(60.50);
        expect(result.items[1].id).toBeDefined();
        expect(result.items[1].name).toBe('Item 2');
        expect(result.items[1].price).toBe(120.30);
        expect(result.createdAt).toBeDefined();

    });

    it("should save a invoice", async () => {
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

        const repository = new InvoiceRepostiory();
        const result = await repository.save(invoice);
        const customerModel = await InvoiceModel.findOne({
            where: { id: '1' },
            rejectOnEmpty: true,
        });
        const items = await InvoiceItemModel.findAll({
            where: {
                invoice_id: customerModel.id
            }
        });
        
        // Check Invoice result
        expect(result.id.id).toBe(invoice.id.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.total()).toBe(invoice.total());
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
        // Check in database
        expect(customerModel.id).toBe(invoice.id.id);
        expect(customerModel.name).toBe(invoice.name);
        expect(customerModel.document).toBe(invoice.document);
        expect(customerModel.street).toBe(invoice.address.street);
        expect(customerModel.number).toBe(invoice.address.number);
        expect(customerModel.complement).toBe(invoice.address.complement);
        expect(customerModel.city).toBe(invoice.address.city);
        expect(customerModel.state).toBe(invoice.address.state);
        expect(customerModel.zipcode).toBe(invoice.address.zipCode);
        expect(customerModel.createdAt).toEqual(invoice.createdAt);
        expect(items[0].id).toBeDefined();
        expect(items[0].name).toBe(invoiceItem1.name);
        expect(items[0].price).toBe(invoiceItem1.price);
        expect(items[1].id).toBeDefined();
        expect(items[1].name).toBe(invoiceItem2.name);
        expect(items[1].price).toBe(invoiceItem2.price);
    });
});
