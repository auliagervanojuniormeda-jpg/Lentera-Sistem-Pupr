import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qiyvsuatacvfnzxntdrf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fCEitlkk_loi_-jyLCzz5g_ogi_TMl_";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
