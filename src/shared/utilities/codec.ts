export const codec = <Decoded, Encoded>(
  { decode, encode }: {
    decode: (value: Encoded) => Decoded;
    encode: (value: Decoded) => Encoded;
  }
) => ({ decode, encode });
export type Codec<Decoded, Encoded> = ReturnType<typeof codec<Decoded, Encoded>>;
