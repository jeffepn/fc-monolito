import { Sequelize } from "sequelize-typescript";
import InvoiceRepostiory from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find.usecase";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceFacade from "./invoice.facade";
import GenerateInvoiceUseCase from "../usecase/generate.usecase";

const createInvoice = () => {
  InvoiceModel.create(
    {
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
    }
  );
};

describe("InvoiceFacade test", () => {
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

  it("should find a invoice with facade", async () => {
    const repository = new InvoiceRepostiory();
    const usecaseFind = new FindInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      find: usecaseFind,
      generate: undefined,
    });
    createInvoice();

    // const facade = PaymentFacadeFactory.create();

    const input = { id: "1" };

    const output = await facade.find(input);

    expect(output.id).toBe("1");
    expect(output.name).toBe('Invoice 1');
    expect(output.document).toBe('123.456.789-99');
    expect(output.total).toBe(180.80);
    expect(output.address.street).toBe('Street any');
    expect(output.address.number).toBe('123');
    expect(output.address.complement).toBe('apt 2');
    expect(output.address.city).toBe('São Paulo');
    expect(output.address.state).toBe('SP');
    expect(output.address.zipCode).toBe('11909-789');
    expect(output.items[0].id).toBeDefined();
    expect(output.items[0].name).toBe("Item 1");
    expect(output.items[0].price).toBe(60.50);
    expect(output.items[1].id).toBeDefined();
    expect(output.items[1].name).toBe("Item 2");
    expect(output.items[1].price).toBe(120.30);
    expect(output.createdAt).toBeDefined();
  });

  it("should create a invoice with facade", async () => {
    const repository = new InvoiceRepostiory();
    const usecaseGenerate = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      find: undefined,
      generate: usecaseGenerate,
    });

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

    const output = await facade.generate(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe('Invoice 1');
    expect(output.document).toBe('123.456.789-99');
    expect(output.total).toBe(180.80);
    expect(output.street).toBe('Street any');
    expect(output.number).toBe('123');
    expect(output.complement).toBe('apt 2');
    expect(output.city).toBe('São Paulo');
    expect(output.state).toBe('SP');
    expect(output.zipCode).toBe('11909-789');
    expect(output.items[0].id).toBeDefined();
    expect(output.items[0].name).toBe("Item 1");
    expect(output.items[0].price).toBe(60.50);
    expect(output.items[1].id).toBeDefined();
    expect(output.items[1].name).toBe("Item 2");
    expect(output.items[1].price).toBe(120.30);
  });
});
