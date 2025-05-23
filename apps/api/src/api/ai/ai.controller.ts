import { type RequestHandler, type Response, type Request } from "express";
import { aiService } from "./ai.service";
import { type FilesToDataSchemaType } from "./ai.modal";
import { logger } from "@/server";

export class AiController {
  public filesToData: RequestHandler = async (req: Request, res: Response) => {
    const body = req.body as FilesToDataSchemaType["body"];

    const serviceResponse = await aiService.filesToData(body.files, body.fields);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const aiController = new AiController();
