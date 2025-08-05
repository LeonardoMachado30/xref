import express, { Request, Response } from "express";
import { sql, poolPromise } from "../db";
import { produtoSchema } from "../schemas/produtoSchema";

const router = express.Router();

/**
 * GET /produto/:id
 * Consulta um produto por ID
 * Procedure: SpSe1Produto @CodProd
 */
router.get("/produto/:id", async (req: Request, res: Response) => {
  try {
    const CodProd = parseInt(req.params.id, 10);
    if (isNaN(CodProd)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CodProd", sql.Int, CodProd)
      .execute("SpSe1Produto");

    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error("Erro ao consultar produto:", err);
    res.status(500).send("Erro ao executar procedure.");
  }
});

/**
 * GET /produto?search=nome
 * Lista produtos filtrando pela descrição
 * Procedure: SpSeProduto @DescrProd
 */
router.get("/produto", async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString() || "";

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("DescrProd", sql.VarChar(80), search)
      .execute("SpSeProduto");

    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    res.status(500).send("Erro ao executar procedure.");
  }
});

/**
 * POST /produto
 * Cria ou atualiza um produto
 * Procedure: SpGrProduto @CodProd, @DescrProd
 */
router.post("/produto", async (req: Request, res: Response) => {
  try {
    const parseResult = produtoSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.format();
      return res
        .status(400)
        .json({ error: "Dados inválidos", details: errors });
    }
    const { CodProd, DescrProd } = parseResult.data;

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CodProd", sql.Int, CodProd)
      .input("DescrProd", sql.VarChar(80), DescrProd)
      .execute("SpGrProduto");

    res.status(200).json({
      message: "Produto salvo com sucesso.",
      result: result.recordset || [],
    });
  } catch (err) {
    console.error("Erro ao salvar produto:", err);
    res.status(500).json({ error: "Erro ao executar procedure." });
  }
});

/**
 * DELETE /produto/:id
 * Remove um produto por ID
 * Procedure: SpExProduto @CodProd
 */
router.delete("/produto/:id", async (req: Request, res: Response) => {
  try {
    const CodProd = parseInt(req.params.id, 10);
    if (isNaN(CodProd)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CodProd", sql.Int, CodProd)
      .execute("SpExProduto");

    res.status(200).json({
      message: "Produto excluído com sucesso.",
      result: result.recordset || [],
    });
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    res.status(500).json({ error: "Erro ao executar procedure." });
  }
});

export default router;
