import { type RequestHandler, type Response, type Request } from "express";
import { aiService } from "./ai.service";
import { type FilesToDataSchemaType } from "./ai.modal";

export class AiController {
  public filesToData: RequestHandler = async (req: Request, res: Response) => {
    const body = req.body as FilesToDataSchemaType["body"];
    const serviceResponse = await aiService.filesToData(body.files, body.jsonSchema);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}
