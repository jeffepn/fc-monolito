import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate.usecase.dto";



export default class GenerateInvoiceUseCase implements UseCaseInterface {
    constructor(private invoiceRepository: InvoiceGateway) { }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: new Address(
                input.street,
                input.number,
                input.complement,
                input.city,
                input.state,
                input.zipCode,
            ),
            items: input.items.map((item) => {
                return new InvoiceItem({
                    id: item.id ? new Id(item.id) : new Id(),
                    name: item.name,
                    price: item.price,
                });
            })
        });

        await this.invoiceRepository.save(invoice);

        return {
            id: invoice.id.id,
            name: input.name,
            document: input.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => {
                return {
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                };
            }),
            total: invoice.total(),
        };
    }
}