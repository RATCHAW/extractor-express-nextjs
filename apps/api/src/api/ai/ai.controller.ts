import { type RequestHandler, type Response, type Request } from "express";
import { aiService } from "./ai.service";
import { type AiExtractorSchemaType } from "@repo/schemas";

export class AiController {
  public filesToData: RequestHandler = async (req: Request<{}, {}, AiExtractorSchemaType>, res: Response) => {
    const body = req.body;

    const serviceResponse = await aiService.filesToData(
      {
        files: body.files,
        fields: body.fields,
      },
      req.user.user.id,
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const aiController = new AiController();
