import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
    FindInvoiceFacadeInputDTO,
    FindInvoiceFacadeOutputDTO,
    GenerateInvoiceFacadeInputDto,
    GenerateInvoiceFacadeOutputDto,
} from "./facade.interface";

type PropsCaseUse = {
    find: UseCaseInterface
    generate: UseCaseInterface
};

export default class InvoiceFacade implements InvoiceFacadeInterface {
    constructor(private caseUses: PropsCaseUse) { }

    find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return this.caseUses.find.execute(input);
    }
    generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return this.caseUses.generate.execute(input);
    }

}
