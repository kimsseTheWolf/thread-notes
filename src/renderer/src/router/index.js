import { createMemoryHistory, createRouter } from "vue-router";

import MainView from "../views/MainView.vue";

const routes = [
    {
        path: "/",
        name: "MainView",
        component: MainView,
        children: [
            {
                path: "note/:uuid/:status",
                component: () => import("../views/NoteEditor.vue"),
            }
        ]
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;