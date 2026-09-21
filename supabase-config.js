const SUPABASE_URL = "https://nbfqkjfjasctqujvyanm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_zNv_gI0k2diIXQDvh1qlKw_Atpo-MP4";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);