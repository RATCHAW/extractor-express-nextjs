import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { isAuthenticated } from "@/common/middlewares/is-authenticated";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { filesTodataController } from "../controllers/files-to-data.controller";
import { validateRequest } from "@/common/utils/request-input-validation";
import { FilesToDataSchema } from "./ai.modal";

export const extractData: Router = express.Router();
export const aiRegistry = new OpenAPIRegistry();

aiRegistry.registerPath({
  method: "get",
  path: "/ai/extract",
  tags: ["Extract"],
  summary: "Extract data from files",
  responses: createApiResponse(z.null(), "Success"),
});

extractData.get("/extract", validateRequest(FilesToDataSchema), isAuthenticated, filesTodataController);
