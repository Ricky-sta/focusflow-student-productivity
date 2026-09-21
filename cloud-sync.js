// =========================================================
// FOCUSFLOW CLOUD SYNC
// Supabase database connection + cloud data synchronization
// =========================================================

(function () {

    "use strict";

    if (typeof supabaseClient === "undefined") {

        console.error(
            "FocusFlow Cloud Sync: Supabase client is not available."
        );

        return;
    }


    // =====================================================
    // CURRENT USER
    // =====================================================

    async function getCurrentUser() {

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error) {

            console.error(
                "FocusFlow Cloud Sync: Could not get current user.",
                error
            );

            return null;
        }

        return data.user;
    }


    // =====================================================
    // PROFILE
    // =====================================================

    async function ensureProfile(user) {

        if (!user) {
            return null;
        }

        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .upsert(
                {
                    id: user.id,
                    display_name:
                        user.user_metadata?.display_name ||
                        user.email?.split("@")[0] ||
                        "FocusFlow User"
                },
                {
                    onConflict: "id"
                }
            )
            .select()
            .single();

        if (error) {

            console.error(
                "FocusFlow Cloud Sync: Profile error.",
                error
            );

            return null;
        }

        console.log(
            "FocusFlow Cloud Sync: Profile ready.",
            data
        );

        return data;
    }


    // =====================================================
    // DATABASE CONNECTION TEST
    // =====================================================

    async function testDatabaseConnection() {

        const user = await getCurrentUser();

        if (!user) {

            console.log(
                "FocusFlow Cloud Sync: No logged-in user."
            );

            return false;
        }

        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .select("id, display_name, created_at")
            .eq("id", user.id)
            .maybeSingle();

        if (error) {

            console.error(
                "FocusFlow Cloud Sync: Database connection failed.",
                error
            );

            return false;
        }

        console.log(
            "FocusFlow Cloud Sync: Database connection successful.",
            data
        );

        return true;
    }


    // =====================================================
    // CREATE GOAL IN SUPABASE
    // =====================================================

    async function createCloudGoal(goal) {

        const user = await getCurrentUser();

        if (!user) {

            console.error(
                "FocusFlow Cloud Sync: Cannot create goal without a logged-in user."
            );

            return null;
        }

        const cloudGoal = {

            user_id: user.id,

            name: goal.name,

            description: goal.description || null,

            category: goal.category || null,

            deadline: goal.deadline || null,

            available_time: goal.availableTime || null,

            current_level: goal.currentLevel || null,

            preferred_days: Array.isArray(goal.preferredDays)
                ? goal.preferredDays
                : []

        };


        const {
            data,
            error
        } = await supabaseClient
            .from("goals")
            .insert(cloudGoal)
            .select()
            .single();


        if (error) {

            console.error(
                "FocusFlow Cloud Sync: Goal creation failed.",
                error
            );

            return null;
        }


        console.log(
            "FocusFlow Cloud Sync: Goal created in Supabase.",
            data
        );


        return data;
    }


    // =====================================================
    // LOAD USER GOALS FROM SUPABASE
    // =====================================================

     // =========
// INITIALIZE
// ===========
    // =====================================================
    // CONVERT SUPABASE GOAL TO FOCUSFLOW GOAL
    // =====================================================

    function convertCloudGoalToLocalGoal(cloudGoal) {

        return {

            id:
                cloudGoal.id,

            name:
                cloudGoal.name,

            description:
                cloudGoal.description || "",

            category:
                cloudGoal.category || "Study",

            deadline:
                cloudGoal.deadline || "",

            availableTime:
                cloudGoal.available_time || "1 hour",

            level:
                cloudGoal.current_level || "Beginner",

            preferredDays:
                Array.isArray(cloudGoal.preferred_days)
                    ? cloudGoal.preferred_days
                    : [],

            createdAt:
                cloudGoal.created_at

        };
    }


    // =====================================================
    // LOAD CLOUD GOALS INTO FOCUSFLOW
    // =====================================================

    async function syncGoalsFromCloud() {

        const cloudGoals =
            await loadCloudGoals();


        const localGoals =
            cloudGoals.map(
                convertCloudGoalToLocalGoal
            );


        console.log(
            "FocusFlow Cloud Sync: Converted cloud goals.",
            localGoals
        );

        return localGoals;
    }
    async function loadCloudGoals() {

        const user = await getCurrentUser();

        if (!user) {

            console.log(
                "FocusFlow Cloud Sync: Cannot load goals without login."
            );

            return [];
        }


        const {
            data,
            error
        } = await supabaseClient
            .from("goals")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", {
                ascending: true
            });


        if (error) {

            console.error(
                "FocusFlow Cloud Sync: Goal loading failed.",
                error
            );

            return [];
        }


        console.log(
            "FocusFlow Cloud Sync: Goals loaded from Supabase.",
            data
        );


        return data || [];
    }


    // =====================================================
    // INITIALIZE
    // =====================================================

    async function initializeCloudSync() {

        console.log(
            "FocusFlow Cloud Sync: Initializing..."
        );


        const user = await getCurrentUser();


        if (!user) {

            console.log(
                "FocusFlow Cloud Sync: Waiting for login."
            );

            return;
        }


        console.log(
            "FocusFlow Cloud Sync: Logged in as",
            user.email
        );


        await ensureProfile(user);

        await testDatabaseConnection();


        console.log(
            "FocusFlow Cloud Sync: Initialization complete."
        );
    }


    // =====================================================
    // AUTH STATE LISTENER
    // =====================================================

    supabaseClient.auth.onAuthStateChange(
        async function (event, session) {

            console.log(
                "FocusFlow Cloud Sync: Auth event:",
                event
            );


            if (session) {

                await initializeCloudSync();

            }

        }
    );


    // =====================================================
    // PUBLIC API
    // =====================================================

    window.FocusFlowCloud = {

    getCurrentUser,

    ensureProfile,

    testDatabaseConnection,

    createCloudGoal,

    loadCloudGoals,

    syncGoalsFromCloud,

    initializeCloudSync

};

    // Start immediately

    initializeCloudSync();


})();