import type { Express } from 'express';

import express from "express";
import pokemonRoutes from "./routes/pokemon.routes.js";

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/pokemon", pokemonRoutes);
