import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "./database";

const idExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const QueryResult: QueryResult = await client.query('SELECT * FROM "movies" WHERE id = $1', [
    req.params.id,
  ]);

  if (!QueryResult.rowCount) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  res.locals = { ...res.locals, foundMovie: QueryResult.rows[0] };

  return next();
};

const nameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const nameMovie = req.body.name;
  if (!nameMovie) return next();

  const QueryResult: QueryResult = await client.query('SELECT * FROM "movies" WHERE name = $1', [
    nameMovie
  ]);

  if (QueryResult.rows[0]) {
    return res.status(409).json({ message: "Name already exists!" });
  }

  // res.locals = { ...res.locals, foundMovie: QueryResult.rows[0] };

  return next();
};

export default { idExists, nameExists };
