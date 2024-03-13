import { Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "./database";
import format from "pg-format";

const create = async (req: Request, res: Response): Promise<Response> => {
  const queryFormat: string = format(
    'INSERT INTO "movies" (%I) VALUES (%L) RETURNING *;',
    Object.keys(req.body),
    Object.values(req.body)
  );

  const queryResult: QueryResult = await client.query(queryFormat);

  return res.status(201).json(queryResult.rows[0]);
};

const read = async (req: Request, res: Response): Promise<Response> => {
  const queryCategory: string = `
  SELECT * FROM movies
  WHERE category = $1`;

  const queryResultCategory: QueryResult = await client.query(queryCategory, [req.query.category]);

  if (queryResultCategory.rowCount > 0) {
    return res.status(200).json(queryResultCategory.rows);
  }

  const queryReadAll: string = 'SELECT * FROM "movies"';
  const queryResultAll: QueryResult = await client.query(queryReadAll);

  return res.status(200).json(queryResultAll.rows);
};

const retrieve = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json(res.locals.foundMovie);
};

const partialUpdate = async (req: Request, res: Response): Promise<Response> => {
  const queryFormat: string = format(
    'UPDATE "movies" SET(%I) = ROW(%L) WHERE "id" = $1 RETURNING *;',
    Object.keys(req.body),
    Object.values(req.body),
  );

  const queryResult: QueryResult = await client.query(queryFormat, [req.params.id]);

  return res.status(200).json(queryResult.rows[0]);
};

const destroy = async (req: Request, res: Response): Promise<Response> => {
  await client.query('DELETE FROM "movies" WHERE "id" = $1', [req.params.id]);

  return res.status(204).json();
};

export default { create, read, retrieve, partialUpdate, destroy };
