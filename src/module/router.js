import NoSidebarStage from '../layout/NoSidebarStage';
export default [
    {
        path: '/game/home',
        component: NoSidebarStage,
        children: 'home'
    },
    {
        path: '/game/room',
        component: NoSidebarStage,
        children: 'room'
    },
    {
        path: '/game/test',
        component: NoSidebarStage,
        children: 'test'
    }
];