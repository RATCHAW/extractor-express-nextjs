import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { isAuthenticated } from "@/common/middlewares/is-authenticated";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { validateRequest } from "@/common/utils/request-input-validation";
import { FilesToDataSchema } from "./ai.modal";
import { aiController } from "./ai.controller";

export const extractData: Router = express.Router();
export const aiRegistry = new OpenAPIRegistry();

aiRegistry.registerPath({
  method: "post",
  path: "/ai/extract",
  tags: ["Extract"],
  summary: "Extract data from files",
  responses: createApiResponse(z.null(), "Success"),
});

extractData.post("/extract", validateRequest(FilesToDataSchema), aiController.filesToData);
