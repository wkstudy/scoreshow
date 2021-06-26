import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/2019', component: '@/pages/index2' },
    { path: '/2018', component: '@/pages/index3' },
  ],
  fastRefresh: {},
});
