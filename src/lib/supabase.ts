import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kkfcgwnrdpmdkjbiixno.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_63e4WGR1IRsl5Ugy3MKwnA_iT5cETPb";

// Deteksi apakah key valid (Supabase Anon Key selalu diawali dengan eyJ)
const isInvalidKey = !SUPABASE_ANON_KEY.startsWith("eyJ");

const createMockChain = () => {
  const chain: any = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    eq: () => chain,
    order: () => chain,
    single: () => chain,
    then: (resolve: any) => Promise.resolve({ data: null, error: { message: "Load failed" } }).then(resolve)
  };
  return chain;
};

const mockStorage = {
  from: () => ({
    upload: () => Promise.resolve({ data: null, error: { message: "Load failed" } }),
    getPublicUrl: () => ({ data: { publicUrl: null } })
  })
};

const mockAuth = {
  getUser: () => Promise.resolve({ data: { user: null }, error: null })
};

// Jika key tidak valid, kita gunakan MOCK client untuk mencegah browser
// melakukan fetch asli yang akan memicu pesan error merah "CORS/Load Failed" di Console.
export const supabase = isInvalidKey
  ? ({
      from: () => createMockChain(),
      storage: mockStorage,
      auth: mockAuth
    } as any)
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
