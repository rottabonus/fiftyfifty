import { z } from "zod";
import { v4 as uid } from "uuid";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

type Literal = z.infer<typeof literalSchema>;

type Json = Literal | { [key: string]: Json } | Json[];

const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const nullabelStringToJSON = z
  .nullable(z.string())
  .transform((str, ctx): z.infer<ReturnType<typeof json>> => {
    const isStr = Boolean(str);
    if (isStr) {
      try {
        return JSON.parse(str as string);
      } catch (e) {
        ctx.addIssue({ code: "custom", message: "Invalid JSON" });
        return z.NEVER;
      }
    }

    return {};
  });

export const json = () => jsonSchema;

export const newUid = () => uid();
