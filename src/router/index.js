import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from "@/views/UserView";
import RegisterView from "@/views/RegisterView"
import LoginView from "@/views/LoginView";
import NotFound from "@/views/NotFound";
import CreateUser from "@/views/CreateUser";
import AfterCreate from "@/views/AfterCreate";
import CreateMedicalTeam from "@/views/CreateMedicalTeam";
import DeleteMedicalTeam from "@/views/DeleteMedicalTeam";


const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '/user',
        name: 'user',
        component: UserView
    },
    {
        path: '/register/:doctorId',
        name: 'register',
        component: RegisterView,
        props: true
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
        path: '/createUser',
        name: 'createUser',
        component: CreateUser,
    },
    {
        path: '/createMedicalTeam',
        name: 'createMedicalTeam',
        component: CreateMedicalTeam,
    },
    {
        path: '/deleteMedicalTeam',
        name: 'deleteMedicalTeam',
        component: DeleteMedicalTeam,
    },
    {
        path: '/afterCreate',
        name: 'afterCreate',
        component: AfterCreate,
    },
    // catch all 404
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: NotFound
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
