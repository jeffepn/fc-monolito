import InvoiceFacadeInterface from "../facade/facade.interface";
import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepostiory from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate.usecase";

export default class InvoiceFacadeFactory {
    static create(): InvoiceFacadeInterface {
        const repository = new InvoiceRepostiory();
        const facade = new InvoiceFacade({
            find: new FindInvoiceUseCase(repository),
            generate: new GenerateInvoiceUseCase(repository),
        });
        return facade;
    }
}