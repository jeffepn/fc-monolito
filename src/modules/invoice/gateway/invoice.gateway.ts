import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
  save(input: Invoice): Promise<Invoice>;
  find(id: string): Promise<Invoice>;
}
