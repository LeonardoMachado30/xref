import { z } from "zod";

export const produtoSchema = z.object({
  CodProd: z.number("'CodProd' do produto obrigatorio"),
  DescrProd: z
    .string("'DescrProd' do produto obrigatorio")
    .max(80, "DescrProd deve ter no máximo 80 caracteres."),
});
