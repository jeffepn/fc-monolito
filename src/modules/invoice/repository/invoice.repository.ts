import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepostiory implements InvoiceGateway {
    async save(input: Invoice): Promise<Invoice> {
        await InvoiceModel.create({
            id: input.id.id,
            name: input.name,
            document: input.document,
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement,
            city: input.address.city,
            state: input.address.state,
            zipcode: input.address.zipCode,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            items: input.items.map((item) => {
                return {
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                };
            })
        },{
            include: [{model: InvoiceItemModel}]
        });
        return new Invoice({
            id: input.id,
            name: input.name,
            document: input.document,
            address: new Address(
                input.address.street,
                input.address.number,
                input.address.complement,
                input.address.city,
                input.address.state,
                input.address.zipCode,
            ),
            items: input.items,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        });
    }

    async find(id: string): Promise<Invoice> {
        let customerModel;
        let items;
        try {
            customerModel = await InvoiceModel.findOne({
                where: {
                    id,
                },
                rejectOnEmpty: true,
            });
            items = await InvoiceItemModel.findAll({
                where: {
                    invoice_id: customerModel.id
                }
            });
        } catch (error) {
            throw new Error("Invoice not found");
        }

        const invoice = new Invoice({
            id: new Id(customerModel.id),
            name: customerModel.name,
            document: customerModel.document,
            address: new Address(
                customerModel.street,
                customerModel.number,
                customerModel.complement,
                customerModel.city,
                customerModel.state,
                customerModel.zipcode,
            ),
            items: items.map((item) => {
                return new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price,
                });
            }),
            createdAt: new Date(customerModel.createdAt),
        });

        return invoice;
    }

}