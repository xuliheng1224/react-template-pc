export default () => {
    return [
        {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
                {
                    path: '/',
                    name: '基础页面',
                    icon: 'smile',
                    component: './BasicPage',
                }
            ]
        },

        {
            component: './404',
        }
    ]
}
