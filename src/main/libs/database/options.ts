import z from "zod";
import { setupBasicNeDb } from "../nedb";

export const optionsDbSchema = z.object({

});
type Options = {
  group: string;
  name: string;
  value: unknown;
  updated: number;
};

export const optionsDb = setupBasicNeDb<Options>('options');
