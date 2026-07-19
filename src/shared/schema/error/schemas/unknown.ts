import z from "zod";
import { transformError } from "../transformers";

export const errorSchema = z.unknown().transform(transformError);
